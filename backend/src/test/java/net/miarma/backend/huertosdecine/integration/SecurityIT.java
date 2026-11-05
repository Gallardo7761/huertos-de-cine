package net.miarma.backend.huertosdecine.integration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SecurityIT extends IntegrationTest {

    @Autowired WebApplicationContext context;
    @Autowired JdbcTemplate jdbc;

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void aViewerIsCreatedTheFirstTimeTheyComeIn() throws Exception {
        mvc.perform(get("/movies").header("Authorization", "Bearer " + token("vecina1", "cine_users")))
                .andExpect(status().isOk());

        String role = jdbc.queryForObject(
                "SELECT role::text FROM huertos_de_cine.cine_user_metadata WHERE user_id = 'sub-vecina1'", String.class);
        assertThat(role).isEqualTo("USER");
    }

    @Test
    void onlyCineAdminsSeeTheViewers() throws Exception {
        mvc.perform(get("/viewers").header("Authorization", "Bearer " + token("vecina2", "cine_users")))
                .andExpect(status().isForbidden());
        mvc.perform(get("/viewers").header("Authorization", "Bearer " + token("junta1", "cine_users", "cine_admins")))
                .andExpect(status().isOk());
    }

    @Test
    void tokensForAnotherApiOrWithoutTokenAreRejected() throws Exception {
        mvc.perform(get("/movies")).andExpect(status().isUnauthorized());
        mvc.perform(get("/movies").header("Authorization",
                        "Bearer " + token("vecina3", "https://api.huertos.test", List.of("cine_users"))))
                .andExpect(status().isUnauthorized());
    }
}
