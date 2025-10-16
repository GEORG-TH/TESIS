package com.inventario.backend_inventario.Service;

import java.util.List;
import java.util.Optional;

import com.inventario.backend_inventario.Model.Categoria;

public interface CategoriaService {
    List<Categoria> listarCategorias();
    Optional<Categoria> obtenerPorId(Long id);
    Categoria registrarCategoria(Categoria categoria);
    Categoria actualizarCategoria(Long id, Categoria categoria);
    void eliminarCategoria(Long id);
}
