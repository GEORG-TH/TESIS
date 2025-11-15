use CONTROL_INVENTARIO_BD
INSERT INTO ROL (nombre_rol)
VALUES 
('Administrador'),
('Jefe de Inventario'),
('Operador de Recepción de Mercadería'),
('Auditor de Inventarios'),
('Operador de Tienda');
INSERT INTO USUARIO (dni, nombre_u, apellido_pat, apellido_mat, telefono, email, pass, estado_u, mfa_enabled, id_rol)
VALUES
('74167113', 'Victor', 'Sánchez', 'Laureano', '904013164', 'admin@gmail.com', 'admin123', 1, 0, 1), -- Administrador
('74859632', 'Laura', 'Gonzales', 'Rivas', '159357456','jefe@gmail.com', 'jefe123', 1, 0, 2),     -- Jefe de Inventario
('71456987', 'Carlos', 'Perez', 'Huamán', '521463789','recepcion@gmail.com', 'recep123', 1, 0, 3), -- Operador de Recepción
('75236489', 'Lucia', 'Torres', 'Ramirez', '925412365','auditor@gmail.com', 'audit123', 1, 0, 4), -- Auditor de Inventarios
('79852413', 'Jose', 'Flores', 'Mendoza', '123456789','tienda@gmail.com', 'tienda123', 1, 0, 5);  -- Operador de Tienda