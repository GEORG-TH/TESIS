package com.inventario.backend_inventario.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inventario.backend_inventario.Model.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    Rol findByNombreRol(String nombreRol);
}
