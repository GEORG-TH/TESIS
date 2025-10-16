package com.inventario.backend_inventario.Service;

import com.inventario.backend_inventario.Model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> listarUsuarios();
    Optional<Usuario> obtenerUsuarioPorId(Integer id);
    Usuario crearUsuario(Usuario u);
    Usuario actualizarUsuario(Usuario u);
    void eliminarUsuario(Integer id);
    Optional<Usuario> desactivarUsuario(Integer id);
    Optional<Usuario> activarUsuario(Integer id);
    boolean existeEmail(String email);
    boolean existeEmailEnOtroUsuario(String email, Integer id);
    boolean existeDni(String dni);
}