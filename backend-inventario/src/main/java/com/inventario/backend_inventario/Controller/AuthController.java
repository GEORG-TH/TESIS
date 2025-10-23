package com.inventario.backend_inventario.Controller;

import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Repository.UsuarioRepository;
import com.inventario.backend_inventario.Security.JwtUtil;
import com.inventario.backend_inventario.Service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @Autowired
    private EmailService emailService;

    public AuthController(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest datos) {
        var usuarioOpt = usuarioRepo.findByEmail(datos.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getEstado_u() != null && usuario.getEstado_u() == 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Cuenta desactivada"));
        }

        boolean passOk = false;
        if (usuario.getPass() != null) {
            try {
                passOk = passwordEncoder.matches(datos.getPass(), usuario.getPass());
            } catch (Exception ignored) {}
            if (!passOk) passOk = datos.getPass().equals(usuario.getPass());
        }

        if (!passOk) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Credenciales inválidas"));
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().getNombreRol(),"Sesion");

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("token", token);
        resp.put("usuario", new LoginResponse(
                usuario.getId_u(),
                usuario.getDni(),
                usuario.getNombre_u(),
                usuario.getApellido_pat(),
                usuario.getApellido_mat(),
                usuario.getEmail(),
                usuario.getEstado_u(),
                usuario.getRol().getNombreRol()
        ));
        return ResponseEntity.ok(resp);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepo.findByEmail(request.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            String resetToken = jwtUtil.generateToken(usuario.getEmail(), "", "Temporal");
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken; 

            try {
                emailService.sendPasswordResetEmail(usuario.getEmail(), resetLink);
            } catch (Exception e) {
                System.err.println("Error al enviar email: " + e.getMessage());
            }
        }   
        return ResponseEntity.ok("Si existe una cuenta asociada a este correo, se ha enviado un enlace de restablecimiento.");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        try {
            if (jwtUtil.validateToken(token) == null) {
                return ResponseEntity.badRequest().body("Token inválido o expirado.");
            }

            String email = jwtUtil.getEmailFromToken(token);
            Usuario usuario = usuarioRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email del token"));

            String encodedPassword = passwordEncoder.encode(newPassword);
            usuario.setPass(encodedPassword);
            usuarioRepo.save(usuario);

            return ResponseEntity.ok("Contraseña actualizada exitosamente.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al restablecer la contraseña: " + e.getMessage());
        }
    }

    public record LoginResponse(
        Integer id_u,
        String dni,
        String nombre_u,
        String apellido_pat,
        String apellido_mat,
        String email,
        Integer estado_u,
        String rol
    ) {}
}
