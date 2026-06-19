package net.miarma.backend.huertosdecine.repository;

import net.miarma.backend.huertosdecine.model.Movie;
import net.miarma.backend.huertosdecine.model.Vote;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MovieRepository extends JpaRepository<Movie, UUID> {}
