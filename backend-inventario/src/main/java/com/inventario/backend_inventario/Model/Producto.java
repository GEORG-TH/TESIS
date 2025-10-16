package com.inventario.backend_inventario.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "PRODUCTO")
public class Producto implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_producto;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "El SKU es obligatorio")
    private String sku;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "El código EAN es obligatorio")
    private String codEan;

    @Column(nullable = false)
    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "La unidad de medida es obligatoria")
    private String uni_medida;

    @PositiveOrZero(message = "El precio de venta no puede ser negativo")
    private Double precio_venta;

    @PositiveOrZero(message = "El precio de compra no puede ser negativo")
    private Double precio_compra;

    @Column(nullable = false, columnDefinition = "BIT DEFAULT 1")
    private Boolean estado = true;

    @ManyToOne
    @JoinColumn(name = "id_cat", nullable = false)
    @JsonBackReference("categoria-producto")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    @JsonBackReference("proveedor-producto")
    private Proveedor proveedor;
}