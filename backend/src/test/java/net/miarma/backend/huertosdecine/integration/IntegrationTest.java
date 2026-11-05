package net.miarma.backend.huertosdecine.integration;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@SpringBootTest
@EnabledIf("servicesAvailable")
public abstract class IntegrationTest {

    private static final String EXTERNAL_DB = System.getenv("IT_DATASOURCE_URL");
    private static final String EXTERNAL_LLDAP = System.getenv("IT_LLDAP_URL");
    static final String LLDAP_ADMIN_PASSWORD = "admin-password-for-tests";

    private static final boolean DOCKER = dockerAvailable();
    private static final PostgreSQLContainer POSTGRES = EXTERNAL_DB == null && DOCKER ? startPostgres() : null;
    private static final GenericContainer<?> LLDAP = EXTERNAL_LLDAP == null && DOCKER ? startLldap() : null;

    static final String ISSUER = "https://id.huertos.test";
    static final String AUDIENCE = "https://cine.huertos.test";
    static final String CLIENT_ID = "cine-web";
    private static final KeyPair KEYS = generateKeys();
    private static final RSAKey JWK = new RSAKey.Builder((RSAPublicKey) KEYS.getPublic())
            .privateKey(KEYS.getPrivate()).keyID("test").build();
    private static final String JWKS_URI = serveJwks();

    static boolean servicesAvailable() {
        return (EXTERNAL_DB != null || POSTGRES != null) && (EXTERNAL_LLDAP != null || LLDAP != null);
    }

    private static boolean dockerAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (RuntimeException e) {
            return false;
        }
    }

    private static PostgreSQLContainer startPostgres() {
        PostgreSQLContainer container = new PostgreSQLContainer("postgres:18");
        container.start();
        return container;
    }

    private static GenericContainer<?> startLldap() {
        GenericContainer<?> container = new GenericContainer<>("lldap/lldap:stable")
                .withEnv("LLDAP_JWT_SECRET", "jwt-secret-for-tests-jwt-secret")
                .withEnv("LLDAP_KEY_SEED", "key-seed-for-tests-key-seed")
                .withEnv("LLDAP_LDAP_USER_PASS", LLDAP_ADMIN_PASSWORD)
                .withEnv("LLDAP_LDAP_BASE_DN", "dc=huertos,dc=test")
                .withExposedPorts(17170)
                .waitingFor(Wait.forHttp("/health").forPort(17170));
        container.start();
        return container;
    }

    static String lldapUrl() {
        return EXTERNAL_LLDAP != null ? EXTERNAL_LLDAP : "http://" + LLDAP.getHost() + ":" + LLDAP.getMappedPort(17170);
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> EXTERNAL_DB != null ? EXTERNAL_DB : POSTGRES.getJdbcUrl());
        registry.add("spring.datasource.username", () -> EXTERNAL_DB != null ? System.getenv("IT_DATASOURCE_USERNAME") : POSTGRES.getUsername());
        registry.add("spring.datasource.password", () -> EXTERNAL_DB != null ? System.getenv("IT_DATASOURCE_PASSWORD") : POSTGRES.getPassword());
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri", () -> ISSUER);
        registry.add("spring.security.oauth2.resourceserver.jwt.audiences", () -> AUDIENCE);
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri", () -> JWKS_URI);
        registry.add("lldap.url", IntegrationTest::lldapUrl);
        registry.add("lldap.username", () -> "admin");
        registry.add("lldap.password", () -> LLDAP_ADMIN_PASSWORD);
    }

    private static KeyPair generateKeys() {
        try {
            KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048);
            return gen.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private static String serveJwks() {
        try {
            byte[] body = new JWKSet(JWK.toPublicJWK()).toString().getBytes(StandardCharsets.UTF_8);
            HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/jwks.json", exchange -> {
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, body.length);
                exchange.getResponseBody().write(body);
                exchange.close();
            });
            server.start();
            return "http://127.0.0.1:" + server.getAddress().getPort() + "/jwks.json";
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    static String token(String username, String... groups) {
        return token(username, AUDIENCE, List.of(groups));
    }

    static String token(String username, String audience, List<String> groups) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .audience(List.of(audience))
                .subject("sub-" + username)
                .claim("client_id", CLIENT_ID)
                .claim("preferred_username", username)
                .claim("email", username + "@correo.es")
                .claim("name", "Usuario " + username)
                .claim("groups", groups)
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(1)))
                .build();
        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).type("at+jwt").build();
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(JWK)))
                .encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
