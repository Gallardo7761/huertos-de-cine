package net.miarma.backend.huertosdecine.integration;

import net.miarma.backend.huertosdecine.client.LldapClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.JsonNode;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CineAccessIT extends IntegrationTest {

    @Autowired WebApplicationContext context;
    @Autowired LldapClient lldap;

    private MockMvc mvc;
    private String admin;
    private String socio;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        admin = "Bearer " + token("junta", "cine_users", "cine_admins");
        createGroupIfMissing("cine_users");
        createGroupIfMissing("huertos_users");

        socio = "socio" + UUID.randomUUID().toString().substring(0, 8);
        lldap.createUser(socio, socio + "@correo.es", "Socio " + socio);
        lldap.addToGroup(socio, "huertos_users");
    }

    @Test
    void theAdminGivesAccessToAnExistingMember() throws Exception {
        mvc.perform(get("/viewers/access/candidates").header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.username == '%s')]".formatted(socio)).exists());

        mvc.perform(put("/viewers/access/" + socio).header("Authorization", admin))
                .andExpect(status().isNoContent());

        mvc.perform(get("/viewers/access").header("Authorization", admin))
                .andExpect(jsonPath("$[?(@.username == '%s')]".formatted(socio)).exists());
        mvc.perform(get("/viewers/access/candidates").header("Authorization", admin))
                .andExpect(jsonPath("$[?(@.username == '%s')]".formatted(socio)).doesNotExist());

        mvc.perform(delete("/viewers/access/" + socio).header("Authorization", admin))
                .andExpect(status().isNoContent());
        mvc.perform(get("/viewers/access").header("Authorization", admin))
                .andExpect(jsonPath("$[?(@.username == '%s')]".formatted(socio)).doesNotExist());
    }

    @Test
    void theAdminCreatesAnExternalViewer() throws Exception {
        String username = "vecino" + UUID.randomUUID().toString().substring(0, 8);

        mvc.perform(post("/viewers/access/external").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"username":"%s","displayName":"Vecino de Fuera","email":"%s@correo.es"}
                            """.formatted(username, username)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value(username))
                .andExpect(jsonPath("$.resetEmailSent").value(false));

        assertThat(lldap.usersInGroup("cine_users")).anyMatch(u -> u.id().equals(username));
        assertThat(lldap.usersInGroup("huertos_users")).noneMatch(u -> u.id().equals(username));

        mvc.perform(post("/viewers/access/external").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"username":"%s","displayName":"Otra vez","email":"otro-%s@correo.es"}
                            """.formatted(username, username)))
                .andExpect(status().isConflict());
    }

    @Test
    void externalViewersNeedAValidUsernameAndEmail() throws Exception {
        mvc.perform(post("/viewers/access/external").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"Con Espacios\",\"displayName\":\"X\",\"email\":\"x@correo.es\"}"))
                .andExpect(status().is4xxClientError());
        mvc.perform(post("/viewers/access/external").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"valido\",\"displayName\":\"X\",\"email\":\"no-es-un-email\"}"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void onlyCineAdminsManageAccess() throws Exception {
        mvc.perform(put("/viewers/access/" + socio)
                        .header("Authorization", "Bearer " + token("vecina", "cine_users")))
                .andExpect(status().isForbidden());
        assertThat(lldap.usersInGroup("cine_users")).noneMatch(u -> u.id().equals(socio));
    }

    private static void createGroupIfMissing(String name) {
        RestClient http = RestClient.builder().baseUrl(lldapUrl()).build();
        String token = http.post().uri("/auth/simple/login").contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("username", "admin", "password", LLDAP_ADMIN_PASSWORD))
                .retrieve().body(JsonNode.class).get("token").asString();
        JsonNode groups = http.post().uri("/api/graphql").contentType(MediaType.APPLICATION_JSON)
                .headers(h -> h.setBearerAuth(token))
                .body(Map.of("query", "{ groups { displayName } }"))
                .retrieve().body(JsonNode.class).get("data").get("groups");
        for (JsonNode g : groups) {
            if (name.equals(g.get("displayName").asString())) return;
        }
        http.post().uri("/api/graphql").contentType(MediaType.APPLICATION_JSON)
                .headers(h -> h.setBearerAuth(token))
                .body(Map.of("query", "mutation($n: String!) { createGroup(name: $n) { id } }", "variables", Map.of("n", name)))
                .retrieve().toBodilessEntity();
    }
}
