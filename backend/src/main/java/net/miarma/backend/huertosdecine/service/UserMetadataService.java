package net.miarma.backend.huertosdecine.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import net.miarma.backend.huertosdecine.dto.ViewerDto;
import net.miarma.backend.huertosdecine.enumerate.CineRoleType;
import net.miarma.backend.huertosdecine.enumerate.RoleType;
import net.miarma.backend.huertosdecine.enumerate.StatusType;
import net.miarma.backend.huertosdecine.model.User;
import net.miarma.backend.huertosdecine.model.UserMetadata;
import net.miarma.backend.huertosdecine.repository.UserMetadataRepository;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class UserMetadataService {
    private final UserMetadataRepository repository;
    private final EntityManager entityManager;

    public UserMetadataService(UserMetadataRepository repository, EntityManager entityManager) {
        this.repository = repository;
        this.entityManager = entityManager;
    }

    @Cacheable("viewers")
    public List<ViewerDto> getAllDetails() {
        return repository.findAllViewers();
    }

    public ViewerDto getDetailsById(String userId) {
        return repository.findViewerById(userId)
                .orElseThrow(() -> new NotFoundException("Espectador no encontrado"));
    }

    @CacheEvict(value = "viewers", allEntries = true)
    public UserMetadata create(UserMetadata metadata) {
        return repository.save(metadata);
    }

    @CacheEvict(value = "viewers", allEntries = true)
    public void updateRole(String userId, CineRoleType role) {
        UserMetadata metadata = repository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Metadatos no encontrados"));
        metadata.setRole(role);
        repository.save(metadata);
    }

    @CacheEvict(value = "viewers", allEntries = true)
    public void deactivateUser(String userId) {
        UserMetadata metadata = repository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Metadatos no encontrados"));
        metadata.setDeactivatedAt(Instant.now());
        repository.save(metadata);
    }

    @CacheEvict(value = "viewers", allEntries = true)
    public UserMetadata createOrGetExisting(String userId) {
        return repository.findById(userId)
            .orElseGet(() -> {
                UserMetadata newMeta = new UserMetadata();
                newMeta.setUserId(userId);
                newMeta.setRole(CineRoleType.USER);
                newMeta.setCreatedAt(Instant.now());
                return repository.save(newMeta);
            });
    }

    @Transactional
    @CacheEvict(value = "viewers", allEntries = true)
    public UserMetadata syncUserJIT(String sub, String username, String email, String name, String givenName, String familyName, String picture, boolean isGlobalAdmin, boolean isLocalAdmin) {
        Instant now = Instant.now();
        RoleType globalRole = isGlobalAdmin ? RoleType.ADMIN : RoleType.USER;
        CineRoleType localRole = isLocalAdmin ? CineRoleType.ADMIN : CineRoleType.USER;

        User user = entityManager.find(User.class, sub);
        if (user == null) {
            user = new User(sub, name, givenName, familyName, username, picture, email,
                true, globalRole, StatusType.ACTIVE, now, now);
            entityManager.persist(user);
        } else {
            user.setName(name);
            user.setPreferredUsername(username);
            user.setEmail(email);
            user.setUpdatedAt(now);
            user.setGlobalRole(globalRole);
            entityManager.merge(user);
        }

        return repository.findById(sub)
                .map(existingMeta -> {
                    existingMeta.setRole(localRole);
                    return repository.save(existingMeta);
                })
                .orElseGet(() -> {
                    UserMetadata newMeta = new UserMetadata();
                    newMeta.setUserId(sub);
                    newMeta.setRole(localRole);
                    newMeta.setCreatedAt(now);
                    return repository.save(newMeta);
                });
    }
}