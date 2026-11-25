package com.inventario.backend_inventario;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.inventario.backend_inventario.Model.Rol;
import com.inventario.backend_inventario.Model.Sede;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Security.SedeAcceso;

class SedeAccesoTest {

    private final SedeAcceso acceso = new SedeAcceso();

    @AfterEach
    void limpiar() {
        SecurityContextHolder.clearContext();
    }

    private void login(String rol, Integer sedeId) {
        Usuario u = new Usuario();
        Rol r = new Rol();
        r.setNombreRol(rol);
        u.setRol(r);
        if (sedeId != null) {
            Sede s = new Sede();
            s.setIdSede(sedeId);
            u.setSede(s);
        }
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(u, null, u.getAuthorities()));
    }

    @Test
    void administradorEsMultisede() {
        login("Administrador", null);
        assertNull(acceso.alcanceIa());
        assertDoesNotThrow(() -> acceso.validar(1));
        assertDoesNotThrow(() -> acceso.validar(99));
        assertEquals(List.of(1, 2, 3), acceso.filtrar(List.of(1, 2, 3), i -> List.of(i)));
    }

    @Test
    void usuarioDeSedeSoloVeLaSuya() {
        login("Jefe de Inventario", 2);
        assertEquals(2, acceso.alcanceIa());
        assertDoesNotThrow(() -> acceso.validar(2));
        assertThrows(AccessDeniedException.class, () -> acceso.validar(1));
        assertThrows(AccessDeniedException.class, () -> acceso.validar(null));
        assertEquals(List.of(2), acceso.filtrar(List.of(1, 2, 3), i -> List.of(i)));
        assertDoesNotThrow(() -> acceso.validarAlgunaDe(1, 2));
        assertThrows(AccessDeniedException.class, () -> acceso.validarAlgunaDe(1, 3));
    }

    @Test
    void usuarioSinSedeNoPuedeOperar() {
        login("Operador de Tienda", null);
        assertThrows(AccessDeniedException.class, () -> acceso.alcanceIa());
        assertThrows(AccessDeniedException.class, () -> acceso.validar(1));
    }

    @Test
    void iaFallaCerradoSinUsuario() {
        assertThrows(AccessDeniedException.class, () -> acceso.alcanceIa());
    }
}
