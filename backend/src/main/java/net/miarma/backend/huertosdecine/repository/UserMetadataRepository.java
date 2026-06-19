package net.miarma.backend.huertosdecine.repository;

import net.miarma.backend.huertosdecine.dto.ViewerDto;
import net.miarma.backend.huertosdecine.model.UserMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserMetadataRepository extends JpaRepository<UserMetadata, String> {
    @Query("""
        SELECT new net.miarma.backend.huertosdecine.dto.ViewerDto(
            m.userId, u.name, u.preferredUsername, u.email, u.picture, m.role, m.createdAt, m.deactivatedAt
        )
        FROM UserMetadata m
        JOIN User u ON m.userId = u.sub
    """)
    List<ViewerDto> findAllViewers();

    @Query("""
        SELECT new net.miarma.backend.huertosdecine.dto.ViewerDto(
            m.userId, u.name, u.preferredUsername, u.email, u.picture, m.role, m.createdAt, m.deactivatedAt
        )
        FROM UserMetadata m
        JOIN User u ON m.userId = u.sub
        WHERE m.userId = :userId
    """)
    Optional<ViewerDto> findViewerById(@Param("userId") String userId);
}