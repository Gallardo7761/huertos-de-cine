package net.miarma.backend.huertosdecine.controller;

import net.miarma.backend.huertosdecine.dto.RequestDto;
import net.miarma.backend.huertosdecine.mapper.RequestMapper;
import net.miarma.backend.huertosdecine.model.Request;
import net.miarma.backend.huertosdecine.service.RequestAcceptanceService;
import net.miarma.backend.huertosdecine.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/requests")
public class RequestController {
    private final RequestService service;
    private final RequestAcceptanceService acceptanceService;

    public RequestController(RequestService service, RequestAcceptanceService acceptanceService) {
        this.service = service;
        this.acceptanceService = acceptanceService;
    }

    @PostMapping
    public ResponseEntity<RequestDto.Response> create(@RequestBody RequestDto.Request requestDto) {
        Request entity = RequestMapper.toEntity(requestDto);
        return ResponseEntity.ok(RequestMapper.toResponse(service.create(entity)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<List<RequestDto.Response>> getAll() {
        return ResponseEntity.ok(service.getAll().stream()
                .map(RequestMapper::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{requestId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<RequestDto.Response> getById(
        @PathVariable("requestId") UUID requestId
    ) {
        return ResponseEntity.ok(RequestMapper.toResponse(service.getById(requestId)));
    }

    @PostMapping("/{requestId}/accept")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<RequestDto.Response> accept(@PathVariable("requestId") UUID requestId) {
        Request accepted = acceptanceService.acceptRequest(requestId);
        return ResponseEntity.ok(RequestMapper.toResponse(accepted));
    }

    @PostMapping("/{requestId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEV')")
    public ResponseEntity<RequestDto.Response> reject(@PathVariable("requestId") UUID requestId) {
        Request rejected = acceptanceService.rejectRequest(requestId);
        return ResponseEntity.ok(RequestMapper.toResponse(rejected));
    }
}