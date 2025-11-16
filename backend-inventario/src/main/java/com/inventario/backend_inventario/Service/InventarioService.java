// Ubicación: src/main/java/com/inventario/backend_inventario/Service/InventarioService.java

package com.inventario.backend_inventario.Service;

import com.inventario.backend_inventario.Dto.MovimientoDto; // El DTO que creamos antes
import com.inventario.backend_inventario.Dto.MovimientoInventarioDto;

import java.util.List;

public interface InventarioService {


    void registrarRecepcion(MovimientoDto movimientoDto);

    List<MovimientoInventarioDto> listarMovimientos();
}