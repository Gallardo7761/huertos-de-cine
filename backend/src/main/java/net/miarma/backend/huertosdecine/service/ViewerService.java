package net.miarma.backend.huertosdecine.service;

import jakarta.transaction.Transactional;
import net.miarma.backend.huertosdecine.dto.UserMetadataDto;
import net.miarma.backend.huertosdecine.dto.ViewerDto;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ViewerService {
    private final UserMetadataService metadataService;

    public ViewerService(UserMetadataService metadataService) {
        this.metadataService = metadataService;
    }

    public List<ViewerDto> getAll() {
        return metadataService.getAllDetails();
    }

    public ViewerDto getById(String userId) {
        return metadataService.getDetailsById(userId);
    }

    public void update(String userId, UserMetadataDto.Request changes) {
        metadataService.updateRole(userId, changes.getRole());
    }

    public void deactivate(String userId) {
        metadataService.deactivateUser(userId);
    }
}