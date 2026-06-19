package net.miarma.backend.huertosdecine.dto;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

public class VoteDto {
    @Data
    public static class Request {
        private String userId;
        private UUID movieId;
        private Short vote;
    }

    @Data
    public static class Response {
        private String userId;
        private UUID movieId;
        private Short vote;
        private Instant createdAt;
    }
}