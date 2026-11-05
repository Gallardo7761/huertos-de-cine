package net.miarma.backend.huertosdecine.dto;

public class CineAccessDto {

    public record User(String username, String displayName, String email) {}

    public record ExternalRequest(String username, String displayName, String email) {}

    public record ExternalResponse(User user, boolean resetEmailSent) {}
}
