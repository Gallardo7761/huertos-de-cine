package net.miarma.backend.huertosdecine.dto;

import lombok.Data;
import java.util.UUID;

public class MovieDto {
    @Data
    public static class Request {
        private String title;
        private String description;
        private String cover;
    }

    @Data
    public static class Response {
        private UUID movieId;
        private String title;
        private String description;
        private String cover;
        private long upvotes;
        private long downvotes;
        private Short userVote;
    }
}