package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Dto.CategoriaDto;
import com.inventario.backend_inventario.Dto.ProductoDto;
import com.inventario.backend_inventario.Dto.ProveedorDto;
import com.inventario.backend_inventario.Model.Producto;
import com.inventario.backend_inventario.Repository.CategoriaRepository;
import com.inventario.backend_inventario.Repository.ProductoRepository;
import com.inventario.backend_inventario.Repository.ProveedorRepository;
import com.inventario.backend_inventario.Service.ProductoService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto registrarProducto(Producto producto) {
        if (productoRepository.existsBySku(producto.getSku())) {
            throw new IllegalArgumentException("El SKU ya está registrado");
        }
        if (productoRepository.existsByCodEan(producto.getCodEan())) {
            throw new IllegalArgumentException("El código EAN ya está registrado");
        }
        categoriaRepository.findById(producto.getCategoria().getId_cat())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));
        proveedorRepository.findById(producto.getProveedor().getId_proveedor())
                .orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado"));

        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizarProducto(Long id, Producto producto) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        existente.setSku(producto.getSku());
        existente.setCodEan(producto.getCodEan());
        existente.setNombre(producto.getNombre());
        existente.setMarca(producto.getMarca());
        existente.setUni_medida(producto.getUni_medida());
        existente.setPrecio_venta(producto.getPrecio_venta());
        existente.setPrecio_compra(producto.getPrecio_compra());
        existente.setCategoria(producto.getCategoria());
        existente.setProveedor(producto.getProveedor());

        return productoRepository.save(existente);
    }

    @Override
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
    
    @Override
    public Producto activarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        producto.setEstado(true);
        return productoRepository.save(producto);
    }

    @Override
    public Producto desactivarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        producto.setEstado(false);
        return productoRepository.save(producto);
    }

    public List<ProductoDto> convertirEntidadesADto(List<Producto> productos) {
        return productos.stream()
                .map(this::convertirEntidadADto)
                .collect(Collectors.toList());
    }

    private ProductoDto convertirEntidadADto(Producto producto) {
        ProductoDto dto = new ProductoDto();
        dto.setId_producto(producto.getId_producto());
        dto.setSku(producto.getSku());
        dto.setCodEan(producto.getCodEan());
        dto.setNombre(producto.getNombre());
        dto.setMarca(producto.getMarca());
        dto.setUni_medida(producto.getUni_medida());
        dto.setPrecio_venta(producto.getPrecio_venta());
        dto.setPrecio_compra(producto.getPrecio_compra());
        dto.setEstado(producto.getEstado());

        if (producto.getCategoria() != null) {
            CategoriaDto catDto = new CategoriaDto();
            catDto.setId_cat(producto.getCategoria().getId_cat());
            catDto.setNombreCat(producto.getCategoria().getNombreCat());
            dto.setCategoria(catDto);
        }

        if (producto.getProveedor() != null) {
            ProveedorDto provDto = new ProveedorDto();
            provDto.setId_proveedor(producto.getProveedor().getId_proveedor());
            provDto.setNombre_proveedor(producto.getProveedor().getNombre_proveedor());
            dto.setProveedor(provDto);
        }
        return dto;
    }
}
