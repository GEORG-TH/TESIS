package com.inventario.backend_inventario.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import com.inventario.backend_inventario.Security.JwtAuthenticationFilter;
import com.inventario.backend_inventario.Repository.UsuarioRepository;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ADMIN = "Administrador";
    private static final String JEFE_INV = "Jefe de Inventario";

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/auth/login", 
                "/api/auth/forgot-password", 
                "/api/auth/reset-password",
                "/api/auth/mfa/login-verify",
                "/ws/**"
            ).permitAll()
            // --- Autorización por rol (el frontend solo oculta; esto es lo que protege) ---
            .requestMatchers("/api/chat-gerente/**").hasAnyRole(ADMIN, JEFE_INV)
            .requestMatchers("/api/roles/**").hasRole(ADMIN)
            .requestMatchers("/api/usuarios/conectados", "/api/historial/accesos").hasRole(ADMIN)
            .requestMatchers(HttpMethod.POST, "/api/usuarios").hasRole(ADMIN)
            .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole(ADMIN)
            .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/activar", "/api/usuarios/*/desactivar").hasRole(ADMIN)
            .requestMatchers(HttpMethod.PUT, "/api/conteo/*/aprobar", "/api/conteo/*/rechazar",
                "/api/merma/*/aprobar", "/api/merma/*/rechazar",
                "/api/devolucion/*/aprobar", "/api/devolucion/*/rechazar",
                "/api/transferencia/*/aprobar", "/api/transferencia/*/rechazar").hasAnyRole(ADMIN, JEFE_INV)
            .requestMatchers(HttpMethod.POST, "/api/inventario/ventas/importar").hasAnyRole(ADMIN, JEFE_INV)
            // Datos maestros: lectura para cualquier autenticado, escritura solo Admin / Jefe de Inventario
            .requestMatchers(HttpMethod.POST, "/api/areas/**", "/api/categorias/**", "/api/subcategorias/**",
                "/api/proveedores/**", "/api/sedes/**", "/api/productos/**", "/api/campanias/**").hasAnyRole(ADMIN, JEFE_INV)
            .requestMatchers(HttpMethod.PUT, "/api/areas/**", "/api/categorias/**", "/api/subcategorias/**",
                "/api/proveedores/**", "/api/sedes/**", "/api/productos/**", "/api/campanias/**").hasAnyRole(ADMIN, JEFE_INV)
            .requestMatchers(HttpMethod.PATCH, "/api/productos/**").hasAnyRole(ADMIN, JEFE_INV)
            .requestMatchers(HttpMethod.DELETE, "/api/areas/**", "/api/categorias/**", "/api/subcategorias/**",
                "/api/proveedores/**", "/api/sedes/**", "/api/productos/**", "/api/campanias/**").hasAnyRole(ADMIN, JEFE_INV)
            .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepo) {
        return username -> {
            return usuarioRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        };
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(encoder);
        return p;
    }
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",  // Para tus pruebas en local
            "https://swci.vercel.app", // <--- ¡IMPORTANTE! Reemplaza esto con TU URL REAL de Vercel
            "https://swci-frontend.vercel.app" // Agrega otras variantes si tienes dudas
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setAllowCredentials(true); // Permitir cookies/tokens

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
