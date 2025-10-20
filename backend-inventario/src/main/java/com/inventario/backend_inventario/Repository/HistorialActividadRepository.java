package com.inventario.backend_inventario.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inventario.backend_inventario.Model.HistorialActividad;

@Repository
public interface HistorialActividadRepository extends JpaRepository<HistorialActividad, Long> {
    List<HistorialActividad> findTop10ByOrderByFechaHoraDesc();
}
