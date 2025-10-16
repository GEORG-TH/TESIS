package com.inventario.backend_inventario.Service;

import java.util.List;
import java.util.Optional;

import com.inventario.backend_inventario.Model.Proveedor;

public interface ProveedorService {
    List<Proveedor> listarProveedores();
    Optional<Proveedor> obtenerPorId(Long id);
    Proveedor registrarProveedor(Proveedor proveedor);
    Proveedor actualizarProveedor(Long id, Proveedor proveedor);
    void eliminarProveedor(Long id);
}
