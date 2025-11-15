
package com.inventario.backend_inventario.Repository;

import com.inventario.backend_inventario.Model.Inventario;
import com.inventario.backend_inventario.Model.Producto;
import com.inventario.backend_inventario.Model.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {


    Optional<Inventario> findByProductoAndSede(Producto producto, Sede sede);

    List<Inventario> findBySede(Sede sede);

    List<Inventario> findByProducto(Producto producto);
}