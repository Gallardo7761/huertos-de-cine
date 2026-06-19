package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.UserMetadataDto;
import net.miarma.backend.huertosdecine.dto.ViewerDto;
import net.miarma.backend.huertosdecine.service.ViewerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/viewers")
@PreAuthorize("hasRole('ADMIN')")
public class ViewerController {

    private final ViewerService service;

    public ViewerController(ViewerService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<ViewerDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ViewerDto> getById(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(service.getById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> update(
            @PathVariable("userId") String userId,
            @RequestBody UserMetadataDto.Request changes
    ) {
        service.update(userId, changes);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<Map<String, String>> deactivate(@PathVariable("userId") String userId) {
        service.deactivate(userId);
        return ResponseEntity.ok(Map.of("message", "Usuario desactivado correctamente"));
    }
}