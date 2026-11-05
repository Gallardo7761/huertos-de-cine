package net.miarma.backend.huertosdecine.service;

import net.miarma.backend.huertosdecine.client.LldapClient;
import net.miarma.backend.huertosdecine.dto.CineAccessDto;
import net.miarma.backlib.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CineAccessService {

    private static final Logger log = LoggerFactory.getLogger(CineAccessService.class);
    private static final Pattern USERNAME = Pattern.compile("^[a-z0-9][a-z0-9._-]{2,31}$");
    private static final Pattern EMAIL = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final LldapClient lldap;
    private final RestClient authelia;
    private final String usersGroup;
    private final String membersGroup;

    public CineAccessService(
            LldapClient lldap,
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuer,
            @Value("${cine.users-group}") String usersGroup,
            @Value("${cine.members-group}") String membersGroup
    ) {
        this.lldap = lldap;
        this.authelia = RestClient.builder().baseUrl(issuer).build();
        this.usersGroup = usersGroup;
        this.membersGroup = membersGroup;
    }

    public List<CineAccessDto.User> getUsers() {
        return sorted(lldap.usersInGroup(usersGroup));
    }

    public List<CineAccessDto.User> getCandidates() {
        Set<String> current = lldap.usersInGroup(usersGroup).stream()
                .map(LldapClient.LldapUser::id).collect(Collectors.toSet());
        return sorted(lldap.usersInGroup(membersGroup).stream()
                .filter(u -> !current.contains(u.id())).toList());
    }

    public void grant(String username) {
        lldap.addToGroup(username, usersGroup);
    }

    public void revoke(String username) {
        lldap.removeFromGroup(username, usersGroup);
    }

    public CineAccessDto.ExternalResponse createExternal(CineAccessDto.ExternalRequest req) {
        String username = req.username() == null ? "" : req.username().trim().toLowerCase();
        String email = req.email() == null ? "" : req.email().trim();
        String displayName = req.displayName() == null ? "" : req.displayName().trim();

        if (!USERNAME.matcher(username).matches()) {
            throw new ValidationException("username", "Entre 3 y 32 caracteres: minúsculas, números, punto, guion o guion bajo");
        }
        if (!EMAIL.matcher(email).matches()) {
            throw new ValidationException("email", "El formato del email no es válido");
        }
        if (displayName.isEmpty()) {
            throw new ValidationException("displayName", "El nombre es obligatorio");
        }

        lldap.createUser(username, email, displayName);
        lldap.addToGroup(username, usersGroup);

        return new CineAccessDto.ExternalResponse(
                new CineAccessDto.User(username, displayName, email),
                sendPasswordEmail(username)
        );
    }

    private boolean sendPasswordEmail(String username) {
        try {
            authelia.post().uri("/api/reset-password/identity/start")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("username", username))
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (Exception e) {
            log.warn("No se ha podido pedir a Authelia el correo de contraseña para {}", username, e);
            return false;
        }
    }

    private static List<CineAccessDto.User> sorted(List<LldapClient.LldapUser> users) {
        return users.stream()
                .map(u -> new CineAccessDto.User(u.id(), u.displayName(), u.email()))
                .sorted(Comparator.comparing(CineAccessDto.User::displayName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }
}
