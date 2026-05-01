package com.inventario.backend_inventario.Service;

import java.util.List;
import java.util.Optional;

import com.inventario.backend_inventario.Dto.SugerenciaCompraDto;
import com.inventario.backend_inventario.Model.Producto;
import org.springframework.web.multipart.MultipartFile;

public interface ProductoService {
    List<Producto> listarProductos();
    Optional<Producto> obtenerPorId(Long id);
    Producto registrarProducto(Producto producto);
    Producto registrarProducto(Producto producto, MultipartFile archivo) throws java.io.IOException;
    Producto actualizarProducto(Long id, Producto producto);
    Producto actualizarImagen(Long id, MultipartFile archivo) throws java.io.IOException;
    void eliminarProducto(Long id);
    Producto activarProducto(Long id);
    Producto desactivarProducto(Long id);
    List<Producto> buscarSugerencias(String termino);
    List<SugerenciaCompraDto> obtenerSugerenciasReabastecimiento(Integer idSede);
    // Otros métodos relacionados con la gestión de productoss
}
