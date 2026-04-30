package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.AdminDashboardDto;
import net.miarma.backend.huertosdecine.mapper.RequestMapper;
import net.miarma.backend.huertosdecine.security.CinePrincipal;
import net.miarma.backend.huertosdecine.service.MovieService;
import net.miarma.backend.huertosdecine.service.RequestService;
import net.miarma.backend.huertosdecine.service.ViewerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
public class AdminController {

    private final RequestService requestService;
    private final ViewerService viewerService;
    private final MovieService movieService;

    public AdminController(RequestService requestService, ViewerService viewerService, MovieService movieService) {
        this.requestService = requestService;
        this.viewerService = viewerService;
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardDto> getDashboardData() {
        CinePrincipal principal = (CinePrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var requests = requestService.getAll().stream()
                .map(RequestMapper::toResponse)
                .collect(Collectors.toList());

        var viewers = viewerService.getAll();
        var movies = movieService.getAllWithVotes(principal.getUserId());

        return ResponseEntity.ok(new AdminDashboardDto(requests, viewers, movies));
    }
}
