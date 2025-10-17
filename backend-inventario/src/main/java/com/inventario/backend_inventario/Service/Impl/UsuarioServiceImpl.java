package com.inventario.backend_inventario.Service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.inventario.backend_inventario.Dto.UsuarioUpdateDto;
import com.inventario.backend_inventario.Exception.ResourceConflictException;
import com.inventario.backend_inventario.Model.Rol;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.RolRepository;
import com.inventario.backend_inventario.Repository.UsuarioRepository;
import com.inventario.backend_inventario.Service.UsuarioService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repo;
    private final RolRepository rolRepository;

    @Override
    public List<Usuario> listarUsuarios() { return repo.findAll(); }

    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Integer id) { return repo.findById(id); }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        if (existeEmail(usuario.getEmail())) {
            throw new ResourceConflictException("El email ya está en uso");
        }
        if (existeDni(usuario.getDni())) {
            throw new ResourceConflictException("El DNI ya está registrado");
        }
        return repo.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Integer id, UsuarioUpdateDto usuarioUpdateDto) {
        return repo.findById(id).map(uDB -> {
            if (usuarioUpdateDto.getEmail() != null && existeEmailEnOtroUsuario(usuarioUpdateDto.getEmail(), id)) {
                throw new ResourceConflictException("El email ya está en uso");
            }
            uDB.setNombre_u(usuarioUpdateDto.getNombre_u());
            uDB.setEmail(usuarioUpdateDto.getEmail());

            Rol rol = rolRepository.findById(usuarioUpdateDto.getRol().getId_rol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            uDB.setRol(rol);

            return repo.save(uDB);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

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
