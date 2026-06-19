package net.miarma.backend.huertosdecine.dto;

import lombok.Data;
import net.miarma.backend.huertosdecine.enumerate.CineRoleType;
import java.time.Instant;

public class UserMetadataDto {
    @Data
    public static class Request {
        private String userId;
        private CineRoleType role;
    }

    @Data
    public static class Response {
        private String userId;
        private CineRoleType role;
        private Instant createdAt;
        private Instant deactivatedAt;
    }
}