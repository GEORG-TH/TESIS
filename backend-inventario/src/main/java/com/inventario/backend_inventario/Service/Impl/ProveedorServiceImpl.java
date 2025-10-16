package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Exception.ResourceConflictException;
import com.inventario.backend_inventario.Model.Proveedor;
import com.inventario.backend_inventario.Repository.ProveedorRepository;
import com.inventario.backend_inventario.Service.ProveedorService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProveedorServiceImpl implements ProveedorService{
    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<Proveedor> listarProveedores() {
        return proveedorRepository.findAll();
    }

    @Override
    public Optional<Proveedor> obtenerPorId(Long id) {
        return proveedorRepository.findById(id);
    }

    @Override
    public Proveedor registrarProveedor(Proveedor proveedor) {
        proveedorRepository.findByRuc(proveedor.getRuc()).ifPresent(p -> {
            throw new ResourceConflictException("El RUC '" + proveedor.getRuc() + "' ya está registrado.");
        });
        proveedorRepository.findByEmail(proveedor.getEmail()).ifPresent(p -> {
            throw new ResourceConflictException("El email '" + proveedor.getEmail() + "' ya está registrado.");
        });
        return proveedorRepository.save(proveedor);
    }

    @Override
    public Proveedor actualizarProveedor(Long id, Proveedor proveedor) {
        Proveedor existente = proveedorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con el ID: " + id));

        proveedorRepository.findByRuc(proveedor.getRuc()).ifPresent(p -> {
            if (!p.getId_proveedor().equals(id)) {
                throw new ResourceConflictException("El RUC '" + proveedor.getRuc() + "' ya pertenece a otro proveedor.");
            }
        });
        proveedorRepository.findByEmail(proveedor.getEmail()).ifPresent(p -> {
            if (!p.getId_proveedor().equals(id)) {
                throw new ResourceConflictException("El email '" + proveedor.getEmail() + "' ya pertenece a otro proveedor.");
            }
        });

        existente.setNombre_proveedor(proveedor.getNombre_proveedor());
        existente.setRuc(proveedor.getRuc());
        existente.setEmail(proveedor.getEmail());
        existente.setTelefono(proveedor.getTelefono());
        existente.setDireccion(proveedor.getDireccion());

        return proveedorRepository.save(existente);
    }

    @Override
    public void eliminarProveedor(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new EntityNotFoundException("Proveedor no encontrado con el ID: " + id);
        }
        
        proveedorRepository.deleteById(id);
    }
}
