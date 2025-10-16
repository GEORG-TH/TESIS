use CONTROL_INVENTARIO_BD
INSERT INTO ROL (nombre_rol)
VALUES 
('Administrador'),
('Jefe de Inventario'),
('Operador de Recepción de Mercadería'),
('Auditor de Inventarios'),
('Operador de Tienda');
INSERT INTO USUARIO (dni, nombre_u, apellido_pat, apellido_mat, email, pass, estado_u, id_rol)
VALUES
('74167113', 'Victor', 'Sánchez', 'Laureano', 'admin@gmail.com', 'admin123', 1, 1), -- Administrador
('74859632', 'Laura', 'Gonzales', 'Rivas', 'jefe@gmail.com', 'jefe123', 1, 2),     -- Jefe de Inventario
('71456987', 'Carlos', 'Perez', 'Huamán', 'recepcion@gmail.com', 'recep123', 1, 3), -- Operador de Recepción
('75236489', 'Lucia', 'Torres', 'Ramirez', 'auditor@gmail.com', 'audit123', 1, 4), -- Auditor de Inventarios
('79852413', 'Jose', 'Flores', 'Mendoza', 'tienda@gmail.com', 'tienda123', 1, 5);  -- Operador de Tienda