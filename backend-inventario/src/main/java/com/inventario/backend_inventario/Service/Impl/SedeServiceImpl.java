package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Model.Sede;
import com.inventario.backend_inventario.Repository.SedeRepository;
import com.inventario.backend_inventario.Service.SedeService;

@Service
public class SedeServiceImpl implements SedeService {
    @Autowired
    private SedeRepository sedeRepository;

    @Override
    public List<Sede> obtenerTodasLasSedes() {
        return sedeRepository.findAll();
    }

    @Override
    public Optional<Sede> obtenerSedePorId(Integer id) {
        return sedeRepository.findById(id);
    }

    @Override
    public Sede guardarSede(Sede sede) {
        return sedeRepository.save(sede);
    }

    @Override
    public Sede actualizarSede(Integer id, Sede sedeDetalles) {
        Sede sedeExistente = sedeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada con el ID: " + id));
        sedeExistente.setNombreSede(sedeDetalles.getNombreSede());
        sedeExistente.setDireccion(sedeDetalles.getDireccion());
        sedeExistente.setAnexo(sedeDetalles.getAnexo());
        return sedeRepository.save(sedeExistente);
    }

    @Override
    public void eliminarSede(Integer id) {
        if (!sedeRepository.existsById(id)) {
            throw new RuntimeException("Sede no encontrada con el ID: " + id);
        }
        sedeRepository.deleteById(id);
    }
}
