use CONTROL_INVENTARIO_BD

DROP TABLE IF EXISTS MOVIMIENTO_INVENTARIO;
DROP TABLE IF EXISTS TIPO_MOVIMIENTO;
GO
CREATE TABLE TIPO_MOVIMIENTO (
    id_tipo_mov BIGINT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);
GO
INSERT INTO TIPO_MOVIMIENTO (tipo, descripcion) VALUES
('Recepción', 'Entrada de mercadería por compra o recepción.'),
('Merma', 'Salida de producto por daño o vencimiento.'),
('Venta', 'Salida de producto por venta.'),
('Ajuste Conteo', 'Ajuste (+ o -) generado por un conteo de inventario.'),
('Transf-Salida', 'Salida de producto por transferencia a otra sede.'),
('Transf-Entrada', 'Entrada de producto por transferencia desde otra sede.'),
('Devolución', 'Entrada de producto por devolución de cliente.');
GO
CREATE TABLE MOVIMIENTO_INVENTARIO (
    id_movimiento BIGINT IDENTITY(1,1) PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    id_sede INT NOT NULL,
    id_usuario INT NOT NULL,
    id_tipo_mov BIGINT NOT NULL,
    fecha DATETIME NOT NULL,
    cantidad INT NOT NULL,
    observaciones VARCHAR(255),

    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_sede) REFERENCES SEDE(id_sede),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_u),
    FOREIGN KEY (id_tipo_mov) REFERENCES TIPO_MOVIMIENTO(id_tipo_mov)
);
go