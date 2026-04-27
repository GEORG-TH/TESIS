package com.inventario.backend_inventario.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inventario.backend_inventario.Model.Subcategoria;

@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Integer> {
	boolean existsByNombreSubcat(String nombreSubcat);
}