package net.miarma.backend.huertosdecine.config;

import net.miarma.backend.huertosdecine.model.UserMetadata;
import net.miarma.backend.huertosdecine.service.UserMetadataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class JitAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String GLOBAL_ADMIN_GROUP = "lldap_admin";

    private final UserMetadataService metadataService;
    private final String userInfoUri;
    private final String adminsGroup;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JitAuthenticationConverter(
            UserMetadataService metadataService,
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuer,
            @Value("${cine.admins-group}") String adminsGroup
    ) {
        this.metadataService = metadataService;
        this.userInfoUri = issuer + "/api/oidc/userinfo";
        this.adminsGroup = adminsGroup;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String sub = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        List<String> groups = jwt.hasClaim("groups") ? jwt.getClaimAsStringList("groups") : null;

        if (username == null || email == null || groups == null) {
            JsonNode userInfo = fetchUserInfo(jwt.getTokenValue());
            username = text(userInfo, "preferred_username", username != null ? username : sub);
            email = text(userInfo, "email", email);
            name = text(userInfo, "name", name);
            groups = new ArrayList<>();
            if (userInfo.has("groups") && userInfo.get("groups").isArray()) {
                for (JsonNode group : userInfo.get("groups")) {
                    groups.add(group.asString());
                }
            }
        }

        if (email == null) {
            throw new BadCredentialsException("El usuario no tiene email en Authelia");
        }
        if (name == null) name = username;

        UserMetadata metadata = metadataService.syncUserJIT(
            sub, username, email, name,
            jwt.getClaimAsString("given_name"),
            jwt.getClaimAsString("family_name"),
            jwt.getClaimAsString("picture"),
            groups.contains(GLOBAL_ADMIN_GROUP),
            groups.contains(adminsGroup)
        );

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + metadata.getRole().name()));
        return new JwtAuthenticationToken(jwt, authorities, sub);
    }

    private JsonNode fetchUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            ResponseEntity<String> response = restTemplate.exchange(
                userInfoUri, HttpMethod.GET, new HttpEntity<>(headers), String.class);
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            throw new BadCredentialsException("No se han podido leer los datos del usuario en Authelia", e);
        }
    }

    private static String text(JsonNode node, String field, String fallback) {
        return node.has(field) ? node.get(field).asString() : fallback;
    }
}
