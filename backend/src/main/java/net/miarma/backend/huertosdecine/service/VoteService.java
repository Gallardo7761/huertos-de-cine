package net.miarma.backend.huertosdecine.service;

import net.miarma.backend.huertosdecine.model.Vote;
import net.miarma.backend.huertosdecine.model.VoteId;
import net.miarma.backend.huertosdecine.repository.VoteRepository;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class VoteService {
    private final VoteRepository repository;

    public VoteService(VoteRepository repository) { this.repository = repository; }

    public Vote create(Vote entity) {
        VoteId id = new VoteId(entity.getUserId(), entity.getMovieId());
        return repository.findById(id)
                .map(existingVote -> {
                    if (existingVote.getVote().equals(entity.getVote())) {
                        repository.delete(existingVote);
                        Vote neutral = new Vote();
                        neutral.setVote((short) 0);
                        return neutral;
                    } else {
                        existingVote.setVote(entity.getVote());
                        return repository.save(existingVote);
                    }
                })
                .orElseGet(() -> repository.save(entity));
    }

    public List<Vote> getByMovieId(UUID movieId) { return repository.findByMovieId(movieId); }

    public Vote getSpecific(String userId, UUID movieId) {
        return repository.findById(new VoteId(userId, movieId))
                .orElseThrow(() -> new NotFoundException("Voto no encontrado"));
    }
}