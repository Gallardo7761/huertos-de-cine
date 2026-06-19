package net.miarma.backend.huertosdecine.config;

import jakarta.servlet.http.HttpServletRequest;
import net.miarma.backend.huertosdecine.model.UserMetadata;
import net.miarma.backend.huertosdecine.service.UserMetadataService;
import org.jspecify.annotations.NonNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class JitAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final UserMetadataService metadataService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JitAuthenticationConverter(UserMetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String sub  = jwt.getSubject();
        String tokenValue = jwt.getTokenValue();

        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");

        List<String> groups = new ArrayList<>();

        if (username == null || email == null || name == null) {
            try {
                HttpEntity<String> entity = buildHttpEntity(tokenValue);

                ResponseEntity<String> response = restTemplate.exchange(
                    "https://id.miarma.net/api/oidc/userinfo",
                    HttpMethod.GET,
                    entity,
                    String.class
                );

                JsonNode userInfo = objectMapper.readTree(response.getBody());

                username = userInfo.has("preferred_username") ? userInfo.get("preferred_username").asString() : sub;
                email = userInfo.has("email") ? userInfo.get("email").asString() : sub + "@miarma.net";
                name = userInfo.has("name") ? userInfo.get("name").asString() : username;

                if (userInfo.has("groups") && userInfo.get("groups").isArray()) {
                    for (JsonNode groupNode : userInfo.get("groups")) {
                        groups.add(groupNode.asString());
                    }
                }
            } catch (Exception e) {
                throw new BadCredentialsException("Error syncing user data from OIDC provider", e);
            }
        }

        boolean isGlobalAdmin = groups.contains("lldap_admin");
        boolean isLocalAdmin = groups.contains("hdc_admins");

        UserMetadata metadata = metadataService.syncUserJIT(
            sub, username, email, name,
            jwt.getClaimAsString("given_name"),
            jwt.getClaimAsString("family_name"),
            jwt.getClaimAsString("picture"),
            isGlobalAdmin,
            isLocalAdmin
        );

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + metadata.getRole().name()));

        return new JwtAuthenticationToken(jwt, authorities, sub);
    }

    private static @NonNull HttpEntity<String> buildHttpEntity(String tokenValue) {
        String accessToken = tokenValue;
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String customHeader = request.getHeader("X-Access-Token");
            if (customHeader != null && !customHeader.isBlank()) {
                accessToken = customHeader;
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);
        return entity;
    }
}
