package net.miarma.backend.huertosdecine.client;

import net.miarma.backlib.exception.ConflictException;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class LldapClient {

    public record LldapUser(String id, String email, String displayName) {}

    private final RestClient http;
    private final String username;
    private final String password;
    private String token;

    public LldapClient(
            @Value("${lldap.url}") String url,
            @Value("${lldap.username}") String username,
            @Value("${lldap.password}") String password
    ) {
        this.http = RestClient.builder().baseUrl(url).build();
        this.username = username;
        this.password = password;
    }

    public List<LldapUser> usersInGroup(String group) {
        JsonNode groups = query("{ groups { displayName users { id email displayName } } }", Map.of()).get("groups");
        for (JsonNode g : groups) {
            if (group.equals(g.get("displayName").asString())) {
                List<LldapUser> users = new ArrayList<>();
                for (JsonNode u : g.get("users")) {
                    users.add(new LldapUser(u.get("id").asString(), u.get("email").asString(), u.get("displayName").asString()));
                }
                return users;
            }
        }
        throw new NotFoundException("No existe el grupo " + group + " en lldap");
    }

    public void createUser(String id, String email, String displayName) {
        query("mutation($u: CreateUserInput!) { createUser(user: $u) { id } }",
                Map.of("u", Map.of("id", id, "email", email, "displayName", displayName)));
    }

    public void addToGroup(String userId, String group) {
        query("mutation($u: String!, $g: Int!) { addUserToGroup(userId: $u, groupId: $g) { ok } }",
                Map.of("u", userId, "g", groupId(group)));
    }

    public void removeFromGroup(String userId, String group) {
        query("mutation($u: String!, $g: Int!) { removeUserFromGroup(userId: $u, groupId: $g) { ok } }",
                Map.of("u", userId, "g", groupId(group)));
    }

    public boolean userExists(String userId) {
        for (JsonNode u : query("{ users { id } }", Map.of()).get("users")) {
            if (userId.equals(u.get("id").asString())) return true;
        }
        return false;
    }

    private int groupId(String group) {
        for (JsonNode g : query("{ groups { id displayName } }", Map.of()).get("groups")) {
            if (group.equals(g.get("displayName").asString())) return g.get("id").asInt();
        }
        throw new NotFoundException("No existe el grupo " + group + " en lldap");
    }

    private JsonNode query(String query, Map<String, Object> variables) {
        try {
            return send(query, variables);
        } catch (HttpClientErrorException.Unauthorized e) {
            token = null;
            return send(query, variables);
        }
    }

    private synchronized String token() {
        if (token == null) {
            JsonNode login = http.post().uri("/auth/simple/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("username", username, "password", password))
                    .retrieve()
                    .body(JsonNode.class);
            token = login.get("token").asString();
        }
        return token;
    }

    private JsonNode send(String query, Map<String, Object> variables) {
        JsonNode response = http.post().uri("/api/graphql")
                .contentType(MediaType.APPLICATION_JSON)
                .headers(h -> h.setBearerAuth(token()))
                .body(Map.of("query", query, "variables", variables))
                .retrieve()
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new IllegalStateException("lldap ha devuelto " + res.getStatusCode());
                })
                .body(JsonNode.class);

        JsonNode errors = response.get("errors");
        if (errors != null && !errors.isEmpty()) {
            String message = errors.get(0).get("message").asString();
            if (message.contains("UNIQUE constraint")) throw new ConflictException("Ese usuario o email ya existe");
            if (message.contains("FOREIGN KEY constraint")) throw new NotFoundException("Ese usuario no existe");
            throw new IllegalStateException("Error de lldap: " + message);
        }
        return response.get("data");
    }
}
