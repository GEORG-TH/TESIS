package com.inventario.backend_inventario.Service;

import java.util.List;
import java.util.Optional;

import com.inventario.backend_inventario.Model.Sede;

public interface SedeService {
    List<Sede> obtenerTodasLasSedes();
    Optional<Sede> obtenerSedePorId(Long id);
    Sede guardarSede(Sede sede);
    Sede actualizarSede(Long id, Sede sedeDetalles);
    void eliminarSede(Long id);
}
