package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.UsuarioRepository;
import com.inventario.backend_inventario.Service.UsuarioService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repo;

    @Override
    public List<Usuario> listarUsuarios() { return repo.findAll(); }

    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Integer id) { return repo.findById(id); }

    @Override
    public Usuario crearUsuario(Usuario u) { return repo.save(u); }

    @Override
    public Usuario actualizarUsuario(Usuario u) { return repo.save(u); }

    @Override
    public void eliminarUsuario(Integer id) { repo.deleteById(id); }

    @Override
    public Optional<Usuario> desactivarUsuario(Integer id) {
        return repo.findById(id).map(usuario -> {
            usuario.setEstado_u(0);
            return repo.save(usuario);
        });
    }

    @Override
    public Optional<Usuario> activarUsuario(Integer id) {
        return repo.findById(id).map(usuario -> {
            usuario.setEstado_u(1);
            return repo.save(usuario);
        });
    }

    @Override
    public boolean existeEmail(String email) {
        return repo.findByEmail(email).isPresent();
    }

    @Override
    public boolean existeEmailEnOtroUsuario(String email, Integer id) {
        return repo.findByEmail(email)
                .map(u -> !u.getId_u().equals(id))
                .orElse(false);
    }
    @Override
    public boolean existeDni(String dni) {
        return repo.findByDni(dni).isPresent();
    }
}
