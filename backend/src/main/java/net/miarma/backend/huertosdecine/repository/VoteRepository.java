package net.miarma.backend.huertosdecine.repository;

import net.miarma.backend.huertosdecine.model.Vote;
import net.miarma.backend.huertosdecine.model.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, VoteId> {
    List<Vote> findByMovieId(UUID movieId);
}
