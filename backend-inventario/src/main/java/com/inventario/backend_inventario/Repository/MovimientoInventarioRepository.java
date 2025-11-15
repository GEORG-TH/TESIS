
package com.inventario.backend_inventario.Repository;

import com.inventario.backend_inventario.Model.MovimientoInventario;
import com.inventario.backend_inventario.Model.Producto;
import com.inventario.backend_inventario.Model.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    // Este es tu KARDEX
    List<MovimientoInventario> findByProductoAndSedeOrderByFechaHoraAsc(Producto producto, Sede sede);

    List<MovimientoInventario> findByProductoOrderByFechaHoraAsc(Producto producto);
}