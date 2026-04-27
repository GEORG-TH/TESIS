package com.inventario.backend_inventario.Dto;

import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

@Data
public class RecepcionMasivaDto {
    
    @NotNull(message = "El ID de la sede es obligatorio")
    private Integer sedeIdOrigen;
    
    private String descripcion;
    
    @NotEmpty(message = "La lista de productos no puede estar vacía")
    private List<DetalleItem> detalles;

    @Data
    public static class DetalleItem {
        @NotNull(message = "El ID del producto es obligatorio")
        private Long productoId;
        
        @NotNull(message = "La cantidad es obligatoria")
        private Integer cantidad;
    }
}