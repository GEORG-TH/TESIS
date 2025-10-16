package com.inventario.backend_inventario.Dto;

import com.inventario.backend_inventario.Model.Rol;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UsuarioUpdateDto {
    private String nombre_u;
    private String email;
    private Rol rol;
}
