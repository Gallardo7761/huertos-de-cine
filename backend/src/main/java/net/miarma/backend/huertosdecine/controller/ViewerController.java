package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.StatusDto;
import net.miarma.backend.huertosdecine.dto.ViewerDto;
import net.miarma.backend.huertosdecine.service.ViewerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/viewers")
public class ViewerController {

    private final ViewerService service;

    public ViewerController(ViewerService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<List<ViewerDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<ViewerDto> getById(@PathVariable("userId") UUID userId) {
        ViewerDto viewer = service.getById(userId);
        return ResponseEntity.ok(viewer);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<ViewerDto> update(
            @PathVariable("userId") UUID userId,
            @RequestBody ViewerDto changes
    ) {
        ViewerDto updated = service.update(userId, changes);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<StatusDto> updateStatus(
            @PathVariable("userId") UUID userId,
            @RequestBody StatusDto status
    ) {
        StatusDto updated = service.updateStatus(userId, status);
        return ResponseEntity.ok(updated);
    }
}