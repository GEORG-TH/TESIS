package com.inventario.backend_inventario;

import com.inventario.backend_inventario.Repository.UsuarioRepository;
import com.inventario.backend_inventario.Security.JwtUtil;
import com.inventario.backend_inventario.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;

/**
 * Prueba la matriz de autorización por rol de SecurityConfig sin tocar la base de datos:
 * un controller "sonda" responde 200 a todo, así que cualquier 403 viene de Spring Security.
 */
@WebMvcTest(controllers = SecurityRolesTest.Sonda.class)
@Import({SecurityConfig.class, SecurityRolesTest.Sonda.class})
class SecurityRolesTest {

    @RestController
    static class Sonda {
        @RequestMapping("/api/**")
        public String ok() { return "ok"; }
    }

    @MockBean JwtUtil jwtUtil;
    @MockBean UsuarioRepository usuarioRepository;
    @Autowired MockMvc mvc;

    static final String ADMIN = "Administrador";
    static final String JEFE_ALM = "Jefe de Almacén";
    static final String JEFE_INV = "Jefe de Inventario";
    static final String OP_REC = "Operador de Recepción de Mercadería";
    static final String AUDITOR = "Auditor de Inventarios";
    static final String OP_TIENDA = "Operador de Tienda";
    static final List<String> TODOS = List.of(ADMIN, JEFE_ALM, JEFE_INV, OP_REC, AUDITOR, OP_TIENDA);

    private static void regla(Stream.Builder<Arguments> b, HttpMethod m, String path, List<String> permitidos) {
        for (String rol : TODOS) {
            b.add(Arguments.of(m, path, rol, permitidos.contains(rol)));
        }
    }

    static Stream<Arguments> matriz() {
        Stream.Builder<Arguments> b = Stream.builder();
        List<String> soloAdmin = List.of(ADMIN);
        List<String> adminJefe = List.of(ADMIN, JEFE_INV);

        regla(b, HttpMethod.POST, "/api/chat-gerente", adminJefe);
        regla(b, HttpMethod.GET, "/api/roles", soloAdmin);
        regla(b, HttpMethod.POST, "/api/roles", soloAdmin);
        regla(b, HttpMethod.GET, "/api/usuarios/conectados", soloAdmin);
        regla(b, HttpMethod.GET, "/api/historial/accesos", soloAdmin);
        regla(b, HttpMethod.POST, "/api/usuarios", soloAdmin);
        regla(b, HttpMethod.DELETE, "/api/usuarios/5", soloAdmin);
        regla(b, HttpMethod.PATCH, "/api/usuarios/5/desactivar", soloAdmin);
        regla(b, HttpMethod.PATCH, "/api/usuarios/5/activar", soloAdmin);

        for (String a : List.of("conteo", "merma", "devolucion", "transferencia")) {
            regla(b, HttpMethod.PUT, "/api/" + a + "/7/aprobar", adminJefe);
            regla(b, HttpMethod.PUT, "/api/" + a + "/7/rechazar", adminJefe);
        }
        regla(b, HttpMethod.POST, "/api/inventario/ventas/importar", adminJefe);

        for (String r : List.of("areas", "categorias", "subcategorias", "proveedores", "sedes", "productos", "campanias")) {
            regla(b, HttpMethod.POST, "/api/" + r + "/registrar", adminJefe);
            regla(b, HttpMethod.PUT, "/api/" + r + "/actualizar/3", adminJefe);
            regla(b, HttpMethod.DELETE, "/api/" + r + "/eliminar/3", adminJefe);
            // Lectura: cualquier usuario autenticado
            regla(b, HttpMethod.GET, "/api/" + r, TODOS);
        }
        regla(b, HttpMethod.PATCH, "/api/productos/3/activar", adminJefe);

        // Operaciones del día a día: abiertas a todos los autenticados
        regla(b, HttpMethod.POST, "/api/merma/solicitar", TODOS);
        regla(b, HttpMethod.POST, "/api/transferencia/solicitar", TODOS);
        regla(b, HttpMethod.POST, "/api/devolucion/solicitar", TODOS);
        regla(b, HttpMethod.POST, "/api/inventario/recepcion", TODOS);
        regla(b, HttpMethod.GET, "/api/inventario/stock", TODOS);
        regla(b, HttpMethod.GET, "/api/reportes/valorizado", TODOS);
        regla(b, HttpMethod.GET, "/api/compras", TODOS);
        regla(b, HttpMethod.GET, "/api/hu/disponibles", TODOS);
        regla(b, HttpMethod.GET, "/api/usuarios", TODOS);
        regla(b, HttpMethod.GET, "/api/historial/recientes", TODOS);
        return b.build();
    }

    @ParameterizedTest(name = "{0} {1} como [{2}] -> permitido={3}")
    @MethodSource("matriz")
    @DisplayName("Autorización por rol")
    void autorizacionPorRol(HttpMethod metodo, String path, String rol, boolean permitido) throws Exception {
        RequestPostProcessor u = user("test@test.com").roles(rol);
        int status = mvc.perform(request(metodo, path).with(u)).andReturn().getResponse().getStatus();
        if (permitido) {
            assertEquals(200, status, rol + " debería poder " + metodo + " " + path);
        } else {
            assertEquals(403, status, rol + " NO debería poder " + metodo + " " + path);
        }
    }

    static Stream<Arguments> anonimas() {
        return Stream.of(
            Arguments.of(HttpMethod.GET, "/api/productos"),
            Arguments.of(HttpMethod.POST, "/api/chat-gerente"),
            Arguments.of(HttpMethod.GET, "/api/roles"),
            Arguments.of(HttpMethod.PUT, "/api/merma/1/aprobar"));
    }

    @ParameterizedTest(name = "sin login {0} {1} -> bloqueado")
    @MethodSource("anonimas")
    void sinLoginEstaBloqueado(HttpMethod metodo, String path) throws Exception {
        int status = mvc.perform(request(metodo, path)).andReturn().getResponse().getStatus();
        assertEquals(true, status == 401 || status == 403, "Sin login debe bloquearse, fue " + status);
    }

    @ParameterizedTest(name = "público {0}")
    @MethodSource("publicas")
    void rutasPublicas(String path) throws Exception {
        int status = mvc.perform(request(HttpMethod.POST, path)).andReturn().getResponse().getStatus();
        assertEquals(200, status, path + " debe ser público");
    }

    static Stream<String> publicas() {
        return Stream.of("/api/auth/login", "/api/auth/forgot-password", "/api/auth/reset-password",
                "/api/auth/mfa/login-verify");
    }
}
