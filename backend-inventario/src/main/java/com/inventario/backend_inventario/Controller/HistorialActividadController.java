package com.inventario.backend_inventario.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inventario.backend_inventario.Dto.HistorialActividadDto;
import com.inventario.backend_inventario.Service.HistorialActividadService;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "http://localhost:3000")
public class HistorialActividadController {
    @Autowired
    private HistorialActividadService historialActividadService;

    @GetMapping("/recientes")
    public ResponseEntity<List<HistorialActividadDto>> getActividadesRecientes() {
        
        List<HistorialActividadDto> actividadesDto = historialActividadService.getRecentActivitiesDto();
        return ResponseEntity.ok(actividadesDto);
    }
}
