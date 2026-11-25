package com.inventario.backend_inventario.Security;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.inventario.backend_inventario.Model.Usuario;

/**
 * Regla de multisede: cada usuario pertenece a una sede y solo ve/opera sobre ella.
 * El rol Administrador es el único multisede (no tiene sede asignada y accede a todas).
 */
@Component
public class SedeAcceso {

    public static final String ROL_ADMIN = "Administrador";

    /** Usuario autenticado de la petición actual, o null si no hay (p. ej. tareas programadas). */
    public Usuario usuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Usuario u) {
            return u;
        }
        return null;
    }

    public boolean esAdmin() {
        Usuario u = usuarioActual();
        return u != null && u.getRol() != null && ROL_ADMIN.equals(u.getRol().getNombreRol());
    }

    /** true si hay un usuario autenticado de una sola sede (no admin) cuyos datos deben restringirse. */
    public boolean restringido() {
        return usuarioActual() != null && !esAdmin();
    }

    /** Id de la sede del usuario actual. Lanza 403 si es un usuario no admin sin sede asignada. */
    public Integer sedeDelUsuario() {
        Usuario u = usuarioActual();
        if (u == null || esAdmin()) {
            return null;
        }
        if (u.getSede() == null) {
            throw new AccessDeniedException("Tu usuario no tiene una sede asignada. Contacta al administrador.");
        }
        return u.getSede().getIdSede();
    }

    /**
     * Alcance de una consulta de la IA: null = todas las sedes (Administrador); un id = solo esa sede.
     * Falla cerrado: sin usuario autenticado en el hilo actual no se entrega ningun dato.
     */
    public Integer alcanceIa() {
        if (usuarioActual() == null) {
            throw new AccessDeniedException("No se pudo identificar al usuario para limitar la consulta a su sede.");
        }
        return sedeDelUsuario();
    }

    /** Lanza 403 si un usuario no admin intenta operar sobre una sede distinta a la suya. */
    public void validar(Integer sedeId) {
        if (!restringido()) {
            return;
        }
        Integer propia = sedeDelUsuario();
        if (sedeId == null || !propia.equals(sedeId)) {
            throw new AccessDeniedException("No tienes acceso a esa sede.");
        }
    }

    /** Lanza 403 si un usuario no admin no pertenece a ninguna de las sedes indicadas. */
    public void validarAlgunaDe(Integer... sedeIds) {
        if (!restringido()) {
            return;
        }
        Integer propia = sedeDelUsuario();
        for (Integer id : sedeIds) {
            if (propia.equals(id)) {
                return;
            }
        }
        throw new AccessDeniedException("No tienes acceso a esa operación: no involucra a tu sede.");
    }

    /**
     * Filtra una lista dejando solo los elementos de la sede del usuario (admin: sin filtrar).
     * {@code sedesDe} devuelve las sedes que "tocan" a cada elemento (p. ej. origen y destino).
     */
    public <T> List<T> filtrar(Collection<T> items, Function<T, List<Integer>> sedesDe) {
        if (!restringido()) {
            return List.copyOf(items);
        }
        Integer propia = sedeDelUsuario();
        return items.stream()
                .filter(i -> sedesDe.apply(i).contains(propia))
                .collect(Collectors.toList());
    }
}
