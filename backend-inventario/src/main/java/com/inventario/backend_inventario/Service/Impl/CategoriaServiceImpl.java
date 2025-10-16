package com.inventario.backend_inventario.Service.Impl;

import com.inventario.backend_inventario.Dto.AreaDto;
import com.inventario.backend_inventario.Dto.CategoriaDto;
import com.inventario.backend_inventario.Exception.ResourceConflictException;
import com.inventario.backend_inventario.Model.Categoria;
import com.inventario.backend_inventario.Repository.CategoriaRepository;
import com.inventario.backend_inventario.Repository.AreaRepository;
import com.inventario.backend_inventario.Service.CategoriaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    @Override
    public Categoria registrarCategoria(Categoria categoria) {
        if (categoriaRepository.existsByNombreCat(categoria.getNombreCat())) {
            throw new IllegalArgumentException("La categoría ya está registrada");
        }
        areaRepository.findById(categoria.getArea().getId_area())
                .orElseThrow(() -> new EntityNotFoundException("Área asociada no encontrada"));
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria actualizarCategoria(Long id, Categoria categoria) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        existente.setNombreCat(categoria.getNombreCat());
        existente.setArea(categoria.getArea());
        return categoriaRepository.save(existente);
    }

    @Override
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con el ID: " + id));

        if (categoria.getProductos() != null && !categoria.getProductos().isEmpty()) {
            throw new ResourceConflictException("No se puede eliminar la categoría porque tiene productos asociados.");
        }
        categoriaRepository.delete(categoria);
    }
    public List<CategoriaDto> convertirEntidadesADto(List<Categoria> categorias) {
        return categorias.stream()
                .map(this::convertirEntidadADto)
                .collect(Collectors.toList());
    }
    private CategoriaDto convertirEntidadADto(Categoria categoria) {
        CategoriaDto categoriaDto = new CategoriaDto();
        categoriaDto.setId_cat(categoria.getId_cat());
        categoriaDto.setNombreCat(categoria.getNombreCat());

        if (categoria.getArea() != null) {

            AreaDto areaDto = new AreaDto();
            areaDto.setId_area(categoria.getArea().getId_area());
            areaDto.setNombreArea(categoria.getArea().getNombreArea());
            
            categoriaDto.setArea(areaDto);
        }

        return categoriaDto;
    }
}
