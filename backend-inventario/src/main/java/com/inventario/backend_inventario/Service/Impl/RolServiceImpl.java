package com.inventario.backend_inventario.Service.Impl;
import com.inventario.backend_inventario.Model.Rol;
import com.inventario.backend_inventario.Repository.RolRepository;
import com.inventario.backend_inventario.Service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImpl implements RolService {

    @Autowired
    private RolRepository rolRepository;

    @Override
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    @Override
    public Optional<Rol> obtenerRolPorId(Integer id) {
        return rolRepository.findById(id);
    }

    @Override
    public Rol crearRol(Rol rol) {
        return rolRepository.save(rol);
    }

    @Override
    public Rol actualizarRol(Integer id, Rol rolActualizado) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
        rol.setNombreRol(rolActualizado.getNombreRol());
        return rolRepository.save(rol);
    }

    @Override
    public void eliminarRol(Integer id) {
        rolRepository.deleteById(id);
    }
}