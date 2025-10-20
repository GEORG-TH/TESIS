package com.inventario.backend_inventario.Service;

import java.util.List;

import com.inventario.backend_inventario.Dto.HistorialActividadDto;
import com.inventario.backend_inventario.Model.Usuario;

public interface HistorialActividadService {
    void registrarActividad(Usuario usuario, String tipoAccion, String descripcion);
    List<HistorialActividadDto> getRecentActivitiesDto();
}
