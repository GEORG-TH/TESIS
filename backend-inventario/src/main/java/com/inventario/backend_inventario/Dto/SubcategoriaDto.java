package com.inventario.backend_inventario.Dto;

import lombok.Data;

@Data
public class SubcategoriaDto {
    private Integer id;
    private String nombreSubcat;
    private CategoriaDto categoria;
}