package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.MovieDto;
import net.miarma.backend.huertosdecine.dto.VoteDto;
import net.miarma.backend.huertosdecine.mapper.MovieMapper;
import net.miarma.backend.huertosdecine.mapper.VoteMapper;
import net.miarma.backend.huertosdecine.model.Movie;
import net.miarma.backend.huertosdecine.model.Vote;
import net.miarma.backend.huertosdecine.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/movies")
public class MovieController {
    private final MovieService service;

    public MovieController(MovieService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieDto.Response> create(@RequestBody MovieDto.Request request) {
        Movie entity = MovieMapper.toEntity(request);
        return ResponseEntity.ok(MovieMapper.toResponse(service.create(entity)));
    }

    @GetMapping
    public ResponseEntity<List<MovieDto.Response>> getAll(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getAllWithVotes(jwt.getSubject()));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieDto.Response> getById(@PathVariable("movieId") UUID movieId, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getMovieWithVotes(movieId, jwt.getSubject()));
    }

    @PostMapping("/{movieId}/upvote")
    public ResponseEntity<VoteDto.Response> upvote(@PathVariable("movieId") UUID movieId, @AuthenticationPrincipal Jwt jwt) {
        VoteDto.Request req = new VoteDto.Request();
        req.setUserId(jwt.getSubject());
        req.setMovieId(movieId);
        req.setVote((short) 1);
        Vote vote = service.vote(VoteMapper.toEntity(req));
        return ResponseEntity.ok(VoteMapper.toResponse(vote));
    }

    @PostMapping("/{movieId}/downvote")
    public ResponseEntity<VoteDto.Response> downvote(@PathVariable("movieId") UUID movieId, @AuthenticationPrincipal Jwt jwt) {
        VoteDto.Request req = new VoteDto.Request();
        req.setUserId(jwt.getSubject());
        req.setMovieId(movieId);
        req.setVote((short) -1);
        Vote vote = service.vote(VoteMapper.toEntity(req));
        return ResponseEntity.ok(VoteMapper.toResponse(vote));
    }

    @PutMapping("/{movieId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieDto.Response> update(@PathVariable("movieId") UUID movieId, @RequestBody MovieDto.Request changes) {
        Movie entityChanges = MovieMapper.toEntity(changes);
        return ResponseEntity.ok(MovieMapper.toResponse(service.update(movieId, entityChanges)));
    }

    @DeleteMapping("/{movieId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String,String>> delete(@PathVariable("movieId") UUID movieId) {
        service.delete(movieId);
        return ResponseEntity.ok(Map.of("message", "Se ha eliminado la película con id: " + movieId));
    }
}