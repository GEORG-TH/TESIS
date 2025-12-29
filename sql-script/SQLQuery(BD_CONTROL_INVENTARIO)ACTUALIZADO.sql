CREATE DATABASE CONTROL_INVENTARIO_BD;
GO
USE CONTROL_INVENTARIO_BD;
GO
/*TABLA USUARIO*/
CREATE TABLE USUARIO (
	id_u INT IDENTITY(1,1) PRIMARY KEY,
	dni VARCHAR(8) NOT NULL UNIQUE,
	nombre_u VARCHAR(50) NOT NULL,
	apellido_pat VARCHAR(50) NOT NULL,
	apellido_mat VARCHAR(50),
    telefono VARCHAR(20) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	pass VARCHAR(255) NOT NULL,
	estado_u BIT NOT NULL DEFAULT 1,
    mfa_enabled BIT NOT NULL DEFAULT 0,
    mfa_secret NVARCHAR(255) NULL,
	id_rol INT NOT NULL
);
CREATE TABLE ROL (
	id_rol INT IDENTITY(1,1) PRIMARY KEY,
	nombre_rol VARCHAR(50) NOT NULL UNIQUE
);
/*TABLAS NEGOCIO*/
CREATE TABLE SEDE (
	id_sede INT IDENTITY(1,1) PRIMARY KEY,
	nombre_sede VARCHAR(50) NOT NULL,
	direccion_se VARCHAR(100) NOT NULL,
	anexo_se VARCHAR(7) NOT NULL
);
CREATE TABLE AREA (
	id_area INT IDENTITY(1,1) PRIMARY KEY,
	nombre_area VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE CATEGORIA (
	id_cat INT IDENTITY(1,1) PRIMARY KEY,
	nombre_cat VARCHAR(50) NOT NULL UNIQUE,
	id_area INT NOT NULL
);
CREATE TABLE PRODUCTO (
    id_producto BIGINT PRIMARY KEY IDENTITY(1,1),
    sku VARCHAR(10) UNIQUE NOT NULL,
	cod_ean VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(50),
	uni_medida VARCHAR(50) NOT NULL,
	precio_venta DECIMAL(10,2) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    estado BIT NOT NULL DEFAULT 1,
    id_cat INT NOT NULL,
	id_proveedor INT NOT NULL
);
CREATE TABLE PROVEEDOR (
    id_proveedor INT IDENTITY(1,1) PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    nombre_proveedor VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(200)
);
/*TABLAS PROCESO DE INVENTARIO*/
CREATE TABLE INVENTARIO_ACTUAL (
    id_ivn BIGINT PRIMARY KEY IDENTITY(1,1),
    id_producto BIGINT NOT NULL,
    id_sede INT NOT NULL,
    stock_actual INT NOT NULL,
    ultima_actualizacion DATETIME DEFAULT GETDATE()
);
CREATE TABLE CONTEO_INVENTARIO (
    id_conteo BIGINT PRIMARY KEY IDENTITY(1,1),
	id_usuario INT NOT NULL,
    id_sede INT NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    estado VARCHAR(20) CHECK (estado IN ('Pendiente','Aprobado','Rechazado')) DEFAULT 'Pendiente',
    observaciones VARCHAR(255),
	
);
CREATE TABLE DETALLE_CONTEO_INVENTARIO (
    id_detalle BIGINT PRIMARY KEY IDENTITY(1,1),
    id_conteo BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    diferencia AS (stock_nuevo - stock_anterior) PERSISTED
);
CREATE TABLE TIPO_MOVIMIENTO (
    id_tipo_mov BIGINT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);
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

/*RELACIONES DE TABLAS*/
ALTER TABLE USUARIO
ADD CONSTRAINT FK_Usuario_Rol FOREIGN KEY (id_rol)
REFERENCES ROL(id_rol);

ALTER TABLE INVENTARIO_ACTUAL
ADD CONSTRAINT FK_Inventario_Sede
FOREIGN KEY (id_sede) REFERENCES SEDE(id_sede);

ALTER TABLE CONTEO_INVENTARIO
ADD CONSTRAINT FK_Conteo_Sede
FOREIGN KEY (id_sede) REFERENCES SEDE(id_sede);

ALTER TABLE CATEGORIA
ADD CONSTRAINT FK_Categoria_Area
FOREIGN KEY (id_area) REFERENCES AREA(id_area);

ALTER TABLE PRODUCTO
ADD CONSTRAINT FK_Producto_Categoria
FOREIGN KEY (id_cat) REFERENCES CATEGORIA(id_cat);

ALTER TABLE PRODUCTO
ADD CONSTRAINT FK_Producto_Proveedor
FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor);

ALTER TABLE INVENTARIO_ACTUAL
ADD CONSTRAINT FK_InventarioActual_Producto FOREIGN KEY (id_producto)
REFERENCES PRODUCTO(id_producto);

ALTER TABLE CONTEO_INVENTARIO
ADD CONSTRAINT FK_ConteoInventario_Usuario FOREIGN KEY (id_usuario)
REFERENCES USUARIO(id_u);

ALTER TABLE DETALLE_CONTEO_INVENTARIO
ADD CONSTRAINT FK_DetalleConteoInventario_Conteo FOREIGN KEY (id_conteo)
REFERENCES CONTEO_INVENTARIO(id_conteo);

ALTER TABLE DETALLE_CONTEO_INVENTARIO
ADD CONSTRAINT FK_DetalleConteoInventario_Producto FOREIGN KEY (id_producto)
REFERENCES PRODUCTO(id_producto);

/*Indices*/

CREATE INDEX idx_producto_nombre ON PRODUCTO(nombre);
CREATE INDEX idx_producto_categoria ON PRODUCTO(id_cat);
CREATE INDEX idx_producto_sku ON PRODUCTO(sku);
CREATE INDEX idx_movimiento_producto_fecha ON MOVIMIENTO_INVENTARIO(id_producto, fecha);
CREATE INDEX idx_movimiento_tipo ON MOVIMIENTO_INVENTARIO(id_tipo_mov);
CREATE INDEX idx_inventario_producto_sede ON INVENTARIO_ACTUAL(id_producto, id_sede);
CREATE INDEX idx_usuario_email_pass ON USUARIO(email, pass);
CREATE INDEX idx_usuario_dni ON USUARIO(dni);

/*Modificaciones adicionales*/

CREATE TABLE HISTORIAL_ACTIVIDAD (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    tipo_accion VARCHAR(50) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    id_usuario INT NOT NULL
);

ALTER TABLE HISTORIAL_ACTIVIDAD
ADD CONSTRAINT FK_HistorialActividad_Usuario FOREIGN KEY (id_usuario)
REFERENCES USUARIO(id_u);

ALTER TABLE HISTORIAL_ACTIVIDAD 
ADD modulo VARCHAR(50) NULL;

ALTER TABLE HISTORIAL_ACTIVIDAD 
ADD entidad_afectada VARCHAR(50) NULL;

ALTER TABLE HISTORIAL_ACTIVIDAD 
ADD id_entidad BIGINT NULL;

ALTER TABLE HISTORIAL_ACTIVIDAD 
ADD ip_direccion VARCHAR(45) NULL;

ALTER TABLE HISTORIAL_ACTIVIDAD 
ADD detalles_cambios VARCHAR(MAX) NULL;

/*INSERTAR DATOS*/
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

INSERT INTO AREA (nombre_area) VALUES
('Bazar'),                     -- Para categorías como: Juguetería, Electrodomésticos, Menaje, Librería
('Textil'),                    -- Para categorías como: Ropa de Damas, Ropa de Caballeros, Calzado, Infantil
('Alimentos Perecibles'),      -- Para categorías como: Frutas y Verduras, Carnes, Lácteos, Panadería
('Alimentos no Perecibles'),   -- Para categorías como: Abarrotes, Conservas, Bebidas, Golosinas
('Cuidado Personal y Limpieza'); -- Para categorías como: Perfumería, Farmacia, Limpieza del Hogar

INSERT INTO CATEGORIA (nombre_cat, id_area) VALUES
-- Categorías para el Área de Bazar (ID = 1)
('Juguetería', 1),
('Electrodomésticos', 1),
('Librería', 1),
('Menaje de Cocina', 1),

-- Categorías para el Área de Textil (ID = 2)
('Ropa de Damas', 2),
('Ropa de Caballeros', 2),
('Calzado', 2),

-- Categorías para el Área de Alimentos Perecibles (ID = 3)
('Frutas y Verduras', 3),
('Carnes y Aves', 3),
('Lácteos y Huevos', 3),
('Panadería', 3),

-- Categorías para el Área de Alimentos no Perecibles (ID = 4)
('Menestras y Legumbres', 4),
('Bebidas y Licores', 4),
('Golosinas y Snacks', 4),

-- Categorías para el Área de Cuidado Personal y Limpieza (ID = 5)
('Perfumería y Cosméticos', 5),
('Limpieza del Hogar', 5),
('Aseo Personal', 5);

INSERT INTO TIPO_MOVIMIENTO (tipo, descripcion) VALUES
('Recepción', 'Entrada de mercadería por compra o recepción.'),
('Merma', 'Salida de producto por daño o vencimiento.'),
('Venta', 'Salida de producto por venta.'),
('Ajuste Conteo', 'Ajuste (+ o -) generado por un conteo de inventario.'),
('Transf-Salida', 'Salida de producto por transferencia a otra sede.'),
('Transf-Entrada', 'Entrada de producto por transferencia desde otra sede.'),
('Devolución', 'Entrada de producto por devolución de cliente.');

