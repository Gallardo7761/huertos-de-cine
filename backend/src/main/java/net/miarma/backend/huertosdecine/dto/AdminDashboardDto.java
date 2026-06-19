package net.miarma.backend.huertosdecine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private List<ViewerDto> viewers;
    private List<MovieDto.Response> movies;
}