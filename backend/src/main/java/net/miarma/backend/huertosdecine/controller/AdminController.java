package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.AdminDashboardDto;
import net.miarma.backend.huertosdecine.service.MovieService;
import net.miarma.backend.huertosdecine.service.ViewerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ViewerService viewerService;
    private final MovieService movieService;

    public AdminController(ViewerService viewerService, MovieService movieService) {
        this.viewerService = viewerService;
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardDto> getDashboardData(@AuthenticationPrincipal Jwt jwt) {
        var viewers = viewerService.getAll();
        var movies = movieService.getAllWithVotes(jwt.getSubject());

        return ResponseEntity.ok(new AdminDashboardDto(viewers, movies));
    }
}