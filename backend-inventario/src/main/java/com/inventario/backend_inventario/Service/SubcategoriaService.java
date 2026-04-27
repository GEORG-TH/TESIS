package com.inventario.backend_inventario.Service;

import java.util.List;
import java.util.Optional;

import com.inventario.backend_inventario.Model.Subcategoria;

public interface SubcategoriaService {
    List<Subcategoria> listarSubcategorias();
    Optional<Subcategoria> obtenerPorId(Integer id);
    Subcategoria registrarSubcategoria(Subcategoria subcategoria);
    Subcategoria actualizarSubcategoria(Integer id, Subcategoria subcategoria);
    void eliminarSubcategoria(Integer id);
}