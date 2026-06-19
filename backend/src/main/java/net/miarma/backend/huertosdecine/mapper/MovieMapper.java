package net.miarma.backend.huertosdecine.mapper;

import net.miarma.backend.huertosdecine.dto.MovieDto;
import net.miarma.backend.huertosdecine.model.Movie;

public class MovieMapper {
    public static MovieDto.Response toResponse(Movie entity) {
        if (entity == null) return null;
        MovieDto.Response dto = new MovieDto.Response();
        dto.setMovieId(entity.getMovieId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCover(entity.getCover());
        dto.setUpvotes(0);
        dto.setDownvotes(0);
        dto.setUserVote((short) 0);
        return dto;
    }

    public static Movie toEntity(MovieDto.Request dto) {
        if (dto == null) return null;
        Movie entity = new Movie();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCover(dto.getCover());
        return entity;
    }
}