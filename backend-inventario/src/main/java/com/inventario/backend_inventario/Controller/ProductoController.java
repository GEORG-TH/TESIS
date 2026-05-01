package com.inventario.backend_inventario.Controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.inventario.backend_inventario.Dto.ProductoDto;
import com.inventario.backend_inventario.Dto.SugerenciaCompraDto;
import com.inventario.backend_inventario.Model.Producto;
import com.inventario.backend_inventario.Service.ProductoService;
import com.inventario.backend_inventario.Service.Impl.ProductoServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    @Autowired
    private ProductoServiceImpl productoServiceImpl;

    @GetMapping
    public ResponseEntity<List<ProductoDto>> listarProductos() {
        List<Producto> productos = productoService.listarProductos();
        return ResponseEntity.ok(productoServiceImpl.convertirEntidadesADto(productos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/registrar", consumes = "application/json")
    public ResponseEntity<Producto> registrarProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.registrarProducto(producto));
    }

    @PostMapping(value = "/registrar", consumes = "multipart/form-data")
    public ResponseEntity<?> registrarProductoConImagen(@RequestPart("producto") @Valid Producto producto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Producto productoGuardado = productoService.registrarProducto(producto, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al subir la imagen: " + e.getMessage()));
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }

    @PostMapping(value = "/{id}/imagen", consumes = "multipart/form-data")
    public ResponseEntity<?> subirImagenProducto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Producto productoActualizado = productoService.actualizarImagen(id, file);
            return ResponseEntity.ok(Map.of(
                    "message", "Imagen actualizada con éxito",
                    "imagenUrl", productoActualizado.getImagenUrl()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al subir la imagen: " + e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Producto> activarProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.activarProducto(id));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivarProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.desactivarProducto(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarProductosInteligente(@RequestParam("query") String query) {
        List<Producto> resultados = productoService.buscarSugerencias(query);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/sugerencias/reabastecer")
    public ResponseEntity<List<SugerenciaCompraDto>> sugerirCompra(@RequestParam Integer idSede) {
        return ResponseEntity.ok(productoService.obtenerSugerenciasReabastecimiento(idSede));
    }
}
