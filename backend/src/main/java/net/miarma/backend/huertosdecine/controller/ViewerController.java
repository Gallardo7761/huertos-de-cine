package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.CineAccessDto;
import net.miarma.backend.huertosdecine.dto.UserMetadataDto;
import net.miarma.backend.huertosdecine.dto.ViewerDto;
import net.miarma.backend.huertosdecine.service.CineAccessService;
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
    private final CineAccessService accessService;

    public ViewerController(ViewerService service, CineAccessService accessService) {
        this.service = service;
        this.accessService = accessService;
    }

    @GetMapping("/access")
    public ResponseEntity<List<CineAccessDto.User>> getAccess() {
        return ResponseEntity.ok(accessService.getUsers());
    }

    @GetMapping("/access/candidates")
    public ResponseEntity<List<CineAccessDto.User>> getCandidates() {
        return ResponseEntity.ok(accessService.getCandidates());
    }

    @PutMapping("/access/{username}")
    public ResponseEntity<Void> grant(@PathVariable("username") String username) {
        accessService.grant(username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/access/{username}")
    public ResponseEntity<Void> revoke(@PathVariable("username") String username) {
        accessService.revoke(username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/access/external")
    public ResponseEntity<CineAccessDto.ExternalResponse> createExternal(@RequestBody CineAccessDto.ExternalRequest request) {
        return ResponseEntity.ok(accessService.createExternal(request));
    }

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