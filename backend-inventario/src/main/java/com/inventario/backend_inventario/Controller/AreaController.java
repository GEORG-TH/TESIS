package com.inventario.backend_inventario.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inventario.backend_inventario.Dto.AreaDto;
import com.inventario.backend_inventario.Model.Area;
import com.inventario.backend_inventario.Service.AreaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*") 
public class AreaController {
    @Autowired
    private AreaService areaService;

    @GetMapping
    public ResponseEntity<List<AreaDto>> listarAreas() {
        List<AreaDto> areas = areaService.listarAreas().stream()
                .map(this::convertirAreaADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaDto> obtenerArea(@PathVariable Integer id) {
        return areaService.obtenerPorId(id)
                .map(this::convertirAreaADto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/registrar")
    public ResponseEntity<Area> registrar(@Valid @RequestBody Area area) {
        return ResponseEntity.ok(areaService.registrarArea(area));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Area> actualizar(@PathVariable Integer id, @Valid @RequestBody Area area) {
        return ResponseEntity.ok(areaService.actualizarArea(id, area));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        areaService.eliminarArea(id);
        return ResponseEntity.noContent().build();
    }

    private AreaDto convertirAreaADto(Area area) {
        AreaDto dto = new AreaDto();
        dto.setId_area(area.getId_area());
        dto.setNombreArea(area.getNombreArea());
        return dto;
    }
}
