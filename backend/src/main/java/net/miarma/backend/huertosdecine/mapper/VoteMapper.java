package net.miarma.backend.huertosdecine.mapper;

import net.miarma.backend.huertosdecine.dto.VoteDto;
import net.miarma.backend.huertosdecine.model.Vote;

public class VoteMapper {
    public static Vote toEntity(VoteDto.Request dto) {
        if (dto == null) return null;
        Vote entity = new Vote();
        entity.setUserId(dto.getUserId());
        entity.setMovieId(dto.getMovieId());
        entity.setVote(dto.getVote());
        return entity;
    }

    public static VoteDto.Response toResponse(Vote entity) {
        if (entity == null) return null;
        VoteDto.Response dto = new VoteDto.Response();
        dto.setUserId(entity.getUserId());
        dto.setMovieId(entity.getMovieId());
        dto.setVote(entity.getVote());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}