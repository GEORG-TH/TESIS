package com.inventario.backend_inventario.Model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.*;

@Data
@Entity
@Table(name = "HISTORIAL_ACTIVIDAD")
public class HistorialActividad implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "tipo_accion", nullable = false, length = 50)
    private String tipoAccion;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false) 
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        this.fechaHora = LocalDateTime.now();
    }
    
}