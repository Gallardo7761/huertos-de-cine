package net.miarma.backend.huertosdecine.dto;

import net.miarma.backend.huertosdecine.enumerate.CineRoleType;
import java.time.Instant;

public record ViewerDto(
        String userId,
        String name,
        String preferredUsername,
        String email,
        String picture,
        CineRoleType role,
        Instant createdAt,
        Instant deactivatedAt
) {}