package com.inventario.backend_inventario.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HistorialActividadDto {
    private Long id;
    private String tipoAccion;
    private String descripcion;
    private LocalDateTime fechaHora;
    private String nombreUsuario;

    public HistorialActividadDto(Long id, String tipoAccion, String descripcion, LocalDateTime fechaHora, String nombreUsuario) {
        this.id = id;
        this.tipoAccion = tipoAccion;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.nombreUsuario = nombreUsuario;
    }
}