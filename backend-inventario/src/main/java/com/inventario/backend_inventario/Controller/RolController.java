package com.inventario.backend_inventario.Controller;

import com.inventario.backend_inventario.Model.Rol;
import com.inventario.backend_inventario.Service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:3000")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }

    @GetMapping("/{id}")
    public Optional<Rol> obtenerRolPorId(@PathVariable Long id) {
        return rolService.obtenerRolPorId(id);
    }

    @PostMapping
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.crearRol(rol);
    }

    @PutMapping("/{id}")
    public Rol actualizarRol(@PathVariable Long id, @RequestBody Rol rol) {
        return rolService.actualizarRol(id, rol);
    }

    @DeleteMapping("/{id}")
    public void eliminarRol(@PathVariable Long id) {
        rolService.eliminarRol(id);
    }
}
