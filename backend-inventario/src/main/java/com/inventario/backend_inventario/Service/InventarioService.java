// Ubicación: src/main/java/com/inventario/backend_inventario/Service/InventarioService.java

package com.inventario.backend_inventario.Service;

import com.inventario.backend_inventario.Dto.MovimientoDto; // El DTO que creamos antes

public interface InventarioService {


    void registrarRecepcion(MovimientoDto movimientoDto);


}