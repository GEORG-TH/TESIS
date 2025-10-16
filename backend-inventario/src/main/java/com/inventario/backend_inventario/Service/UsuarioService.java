package com.inventario.backend_inventario.Service;

import com.inventario.backend_inventario.Model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> listarUsuarios();
    Optional<Usuario> obtenerUsuarioPorId(Long id);
    Usuario crearUsuario(Usuario u);
    Usuario actualizarUsuario(Usuario u);
    void eliminarUsuario(Long id);
    Optional<Usuario> desactivarUsuario(Long id);
    Optional<Usuario> activarUsuario(Long id);
    boolean existeEmail(String email);
    boolean existeEmailEnOtroUsuario(String email, Long id);
    boolean existeDni(String dni);
}