package com.inventario.backend_inventario.Service.Impl;
import com.inventario.backend_inventario.Model.Area;
import com.inventario.backend_inventario.Repository.AreaRepository;
import com.inventario.backend_inventario.Service.AreaService;
import com.inventario.backend_inventario.Exception.ResourceConflictException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AreaServiceImpl implements AreaService {

    @Autowired
    private AreaRepository areaRepository;

    @Override
    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }

    @Override
    public Optional<Area> obtenerPorId(Long id) {
        return areaRepository.findById(id);
    }

    @Override
    public Area registrarArea(Area area) {
        if (areaRepository.existsByNombreArea(area.getNombreArea())) {
            throw new IllegalArgumentException("El nombre del área ya está registrado");
        }
        return areaRepository.save(area);
    }

    @Override
    public Area actualizarArea(Long id, Area area) {
        Area existente = areaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área no encontrada"));
        existente.setNombreArea(area.getNombreArea());
        return areaRepository.save(existente);
    }

    @Override
    public void eliminarArea(Long id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área no encontrada con el ID: " + id));

        if (area.getCategorias() != null && !area.getCategorias().isEmpty()) {
            throw new ResourceConflictException("No se puede eliminar el área porque tiene categorías asociadas.");
        }

        areaRepository.delete(area);
    }
}
