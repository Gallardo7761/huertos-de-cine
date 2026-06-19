package net.miarma.backend.huertosdecine.service;

import jakarta.transaction.Transactional;
import net.miarma.backend.huertosdecine.dto.MovieDto;
import net.miarma.backend.huertosdecine.mapper.MovieMapper;
import net.miarma.backend.huertosdecine.model.Movie;
import net.miarma.backend.huertosdecine.model.Vote;
import net.miarma.backend.huertosdecine.repository.MovieRepository;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovieService {
    private final MovieRepository repository;
    private final VoteService voteService;

    public MovieService(MovieRepository repository, VoteService voteService) {
        this.repository = repository;
        this.voteService = voteService;
    }

    private MovieDto.Response calculateVotes(Movie movie, String userId) {
        List<Vote> votes = movie.getVotes();
        long ups = votes.stream().filter(v -> v.getVote() == 1).count();
        long downs = votes.stream().filter(v -> v.getVote() == -1).count();

        Short currentUserVote = (userId == null) ? (short)0 :
                votes.stream()
                  .filter(v -> v.getUserId() != null && v.getUserId().equals(userId))
                  .map(Vote::getVote)
                  .findFirst()
                  .orElse((short) 0);

        MovieDto.Response dto = MovieMapper.toResponse(movie);
        dto.setUpvotes(ups);
        dto.setDownvotes(downs);
        dto.setUserVote(currentUserVote);
        return dto;
    }

    public Movie create(Movie movie) {
        return repository.save(movie);
    }

    public List<MovieDto.Response> getAllWithVotes(String userId) {
        return repository.findAll().stream()
                .map(movie -> calculateVotes(movie, userId))
                .collect(Collectors.toList());
    }

    public MovieDto.Response getMovieWithVotes(UUID movieId, String userId) {
        return calculateVotes(getById(movieId), userId);
    }

    public Movie getById(UUID movieId) {
        return repository.findById(movieId)
                .orElseThrow(() -> new NotFoundException("Película no encontrada"));
    }

    public Vote vote(Vote vote) {
        return voteService.create(vote);
    }

    public Movie update(UUID movieId, Movie changes) {
        Movie existingMovie = getById(movieId);
        existingMovie.setTitle(changes.getTitle());
        existingMovie.setDescription(changes.getDescription());
        existingMovie.setCover(changes.getCover());
        return repository.save(existingMovie);
    }

    public void delete(UUID movieId) {
        repository.deleteById(movieId);
    }
}