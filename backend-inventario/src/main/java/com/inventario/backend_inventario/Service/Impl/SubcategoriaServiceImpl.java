package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Dto.CategoriaDto;
import com.inventario.backend_inventario.Dto.SubcategoriaDto;
import com.inventario.backend_inventario.Exception.ResourceConflictException;
import com.inventario.backend_inventario.Model.Subcategoria;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.CategoriaRepository;
import com.inventario.backend_inventario.Repository.SubcategoriaRepository;
import com.inventario.backend_inventario.Repository.UsuarioRepository;
import com.inventario.backend_inventario.Service.HistorialActividadService;
import com.inventario.backend_inventario.Service.SubcategoriaService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SubcategoriaServiceImpl implements SubcategoriaService {

    @Autowired
    private SubcategoriaRepository subcategoriaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private HistorialActividadService historialActividadService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Subcategoria> listarSubcategorias() {
        return subcategoriaRepository.findAll();
    }

    @Override
    public Optional<Subcategoria> obtenerPorId(Integer id) {
        return subcategoriaRepository.findById(id);
    }

    @Override
    public Subcategoria registrarSubcategoria(Subcategoria subcategoria) {
        if (subcategoriaRepository.existsByNombreSubcat(subcategoria.getNombreSubcat())) {
            throw new IllegalArgumentException("La subcategoría ya está registrada");
        }

        categoriaRepository.findById(subcategoria.getCategoria().getId_cat())
                .orElseThrow(() -> new EntityNotFoundException("Categoría asociada no encontrada"));

        Subcategoria guardada = subcategoriaRepository.save(subcategoria);

        try {
            String emailUsuario = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                    .getUsername();
            Optional<Usuario> usuarioActual = usuarioRepository.findByEmail(emailUsuario);

            String descripcion = "Creó la subcategoría '" + guardada.getNombreSubcat() + "' (ID: "
                    + guardada.getId() + ").";

            usuarioActual.ifPresent(u -> {
                historialActividadService.registrarActividad(u, "CREACIÓN", descripcion, "PRODUCTO", "Subcategoría",
                        Long.valueOf(guardada.getId()),
                        "Subcategoría creada con nombre: " + guardada.getNombreSubcat());
            });

        } catch (Exception e) {
            System.err.println("Error al registrar actividad: " + e.getMessage());
        }

        return guardada;
    }

    @Override
    public Subcategoria actualizarSubcategoria(Integer id, Subcategoria subcategoria) {
        Subcategoria existente = subcategoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoría no encontrada"));

        categoriaRepository.findById(subcategoria.getCategoria().getId_cat())
                .orElseThrow(() -> new EntityNotFoundException("Categoría asociada no encontrada"));

        existente.setNombreSubcat(subcategoria.getNombreSubcat());
        existente.setCategoria(subcategoria.getCategoria());

        Subcategoria guardada = subcategoriaRepository.save(existente);

        try {
            String emailUsuario = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                    .getUsername();
            Optional<Usuario> usuarioActual = usuarioRepository.findByEmail(emailUsuario);

            String descripcion = "Actualizó la subcategoría '" + guardada.getNombreSubcat() + "' (ID: "
                    + guardada.getId() + ").";

            usuarioActual.ifPresent(u -> {
                historialActividadService.registrarActividad(u, "ACTUALIZACIÓN", descripcion, "PRODUCTO",
                        "Subcategoría", Long.valueOf(guardada.getId()),
                        "Subcategoría actualizada con nombre: " + guardada.getNombreSubcat());
            });

        } catch (Exception e) {
            System.err.println("Error al registrar actividad: " + e.getMessage());
        }

        return guardada;
    }

    @Override
    public void eliminarSubcategoria(Integer id) {
        Subcategoria subcategoria = subcategoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoría no encontrada con el ID: " + id));

        if (subcategoria.getProductos() != null && !subcategoria.getProductos().isEmpty()) {
            throw new ResourceConflictException(
                    "No se puede eliminar la subcategoría porque tiene productos asociados.");
        }

        try {
            String emailUsuario = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                    .getUsername();
            Optional<Usuario> usuarioActual = usuarioRepository.findByEmail(emailUsuario);

            String descripcion = "Eliminó la subcategoría '" + subcategoria.getNombreSubcat() + "' (ID: "
                    + subcategoria.getId() + ").";

            usuarioActual.ifPresent(u -> {
                historialActividadService.registrarActividad(u, "ELIMINACIÓN", descripcion, "PRODUCTO", "Subcategoría",
                        Long.valueOf(subcategoria.getId()),
                        "Subcategoría eliminada con nombre: " + subcategoria.getNombreSubcat());
            });

        } catch (Exception e) {
            System.err.println("Error al registrar actividad: " + e.getMessage());
        }

        subcategoriaRepository.delete(subcategoria);
    }

    public List<SubcategoriaDto> convertirEntidadesADto(List<Subcategoria> subcategorias) {
        return subcategorias.stream()
                .map(this::convertirEntidadADto)
                .collect(Collectors.toList());
    }

    public SubcategoriaDto convertirEntidadADto(Subcategoria subcategoria) {
        SubcategoriaDto dto = new SubcategoriaDto();
        dto.setId(subcategoria.getId());
        dto.setNombreSubcat(subcategoria.getNombreSubcat());

        if (subcategoria.getCategoria() != null) {
            CategoriaDto categoriaDto = new CategoriaDto();
            categoriaDto.setId_cat(subcategoria.getCategoria().getId_cat());
            categoriaDto.setNombreCat(subcategoria.getCategoria().getNombreCat());
            dto.setCategoria(categoriaDto);
        }

        return dto;
    }
}