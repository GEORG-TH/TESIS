package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Dto.HistorialActividadDto;
import com.inventario.backend_inventario.Model.HistorialActividad;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.HistorialActividadRepository;
import com.inventario.backend_inventario.Service.HistorialActividadService;

@Service
public class HistorialActividadServiceImpl implements HistorialActividadService {
    @Autowired
    private HistorialActividadRepository historialActividadRepository;

    @Override
    public void registrarActividad(Usuario usuario, String tipoAccion, String descripcion) {
        HistorialActividad actividad = new HistorialActividad();
        actividad.setUsuario(usuario);
        actividad.setTipoAccion(tipoAccion); 
        actividad.setDescripcion(descripcion);
        
        historialActividadRepository.save(actividad);
    }
    @Override
    public List<HistorialActividadDto> getRecentActivitiesDto() {
        List<HistorialActividad> actividades = historialActividadRepository.findTop10ByOrderByFechaHoraDesc();

        return actividades.stream().map(act -> {
        Usuario usuario = act.getUsuario();
        String nombreCompleto = (usuario.getNombre_u() != null ? usuario.getNombre_u() : "") +
                              (usuario.getApellido_pat() != null ? " " + usuario.getApellido_pat() : "") +
                              (usuario.getApellido_mat() != null ? " " + usuario.getApellido_mat() : "");

        return new HistorialActividadDto(
                act.getId(),
                act.getTipoAccion(),
                act.getDescripcion(),
                act.getFechaHora(),
                nombreCompleto.trim()
        );
    }).collect(Collectors.toList());
    }
}
