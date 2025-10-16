package com.inventario.backend_inventario.Dto;
import lombok.*;
@Data
public class CategoriaDto {
    private Long id_cat;
    private String nombreCat;
    private AreaDto area;
}
