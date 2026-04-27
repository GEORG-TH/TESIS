package com.inventario.backend_inventario.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventario.backend_inventario.Dto.SubcategoriaDto;
import com.inventario.backend_inventario.Model.Subcategoria;
import com.inventario.backend_inventario.Service.SubcategoriaService;
import com.inventario.backend_inventario.Service.Impl.SubcategoriaServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subcategorias")
@CrossOrigin(origins = "*")
public class SubcategoriaController {

    @Autowired
    private SubcategoriaService subcategoriaService;

    @Autowired
    private SubcategoriaServiceImpl subcategoriaServiceImpl;

    @GetMapping
    public ResponseEntity<List<SubcategoriaDto>> listarSubcategorias() {
        List<Subcategoria> subcategorias = subcategoriaService.listarSubcategorias();
        return ResponseEntity.ok(subcategoriaServiceImpl.convertirEntidadesADto(subcategorias));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubcategoriaDto> obtenerSubcategoriaPorId(@PathVariable Integer id) {
        return subcategoriaService.obtenerPorId(id)
                .map(subcategoriaServiceImpl::convertirEntidadADto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/registrar")
    public ResponseEntity<Subcategoria> registrarSubcategoria(@Valid @RequestBody Subcategoria subcategoria) {
        return ResponseEntity.ok(subcategoriaService.registrarSubcategoria(subcategoria));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Subcategoria> actualizarSubcategoria(@PathVariable Integer id,
            @Valid @RequestBody Subcategoria subcategoria) {
        return ResponseEntity.ok(subcategoriaService.actualizarSubcategoria(id, subcategoria));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarSubcategoria(@PathVariable Integer id) {
        subcategoriaService.eliminarSubcategoria(id);
        return ResponseEntity.noContent().build();
    }
}