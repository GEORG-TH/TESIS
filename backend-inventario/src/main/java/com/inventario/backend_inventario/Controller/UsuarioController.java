package com.inventario.backend_inventario.Controller;

import com.inventario.backend_inventario.Dto.UsuarioUpdateDto;
import com.inventario.backend_inventario.Model.Rol;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.RolRepository;
import com.inventario.backend_inventario.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
        if (result.hasErrors()) {
            String errores = result.getFieldErrors().stream()
                    .map(err -> err.getField() + ": " + err.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(Map.of("message", errores));
        }

        if (usuario.getEmail() != null && usuarioService.existeEmail(usuario.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "El email ya está en uso"));
        }

        if (usuario.getDni() != null && usuarioService.existeDni(usuario.getDni())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "El DNI ya está registrado"));
        }

        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateDto usuario) {
        return usuarioService.obtenerUsuarioPorId(id)
                .map(uDB -> {
                    if (usuario.getEmail() != null &&
                        usuarioService.existeEmailEnOtroUsuario(usuario.getEmail(), id)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("message", "El email ya está en uso"));
                    }
                    uDB.setNombre_u(usuario.getNombre_u());
                    uDB.setEmail(usuario.getEmail());

                    Rol rol = rolRepository.findById(usuario.getRol().getId_rol())
                            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                    uDB.setRol(rol);

                Usuario actualizado = usuarioService.actualizarUsuario(uDB);
                    return ResponseEntity.ok(actualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Usuario> desactivarUsuario(@PathVariable Long id) {
        return usuarioService.desactivarUsuario(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Usuario> activarUsuario(@PathVariable Long id) {
        return usuarioService.activarUsuario(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}