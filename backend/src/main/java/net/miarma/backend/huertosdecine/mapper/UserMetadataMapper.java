package net.miarma.backend.huertosdecine.mapper;

import net.miarma.backend.huertosdecine.dto.UserMetadataDto;
import net.miarma.backend.huertosdecine.model.UserMetadata;

public class UserMetadataMapper {
    public static UserMetadataDto.Response toResponse(UserMetadata entity) {
        if (entity == null) return null;
        UserMetadataDto.Response dto = new UserMetadataDto.Response();
        dto.setUserId(entity.getUserId());
        dto.setRole(entity.getRole());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setDeactivatedAt(entity.getDeactivatedAt());
        return dto;
    }

    public static UserMetadata toEntity(UserMetadataDto.Request dto) {
        if (dto == null) return null;
        UserMetadata entity = new UserMetadata();
        entity.setUserId(dto.getUserId());
        entity.setRole(dto.getRole());
        return entity;
    }
}