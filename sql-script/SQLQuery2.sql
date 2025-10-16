USE CONTROL_INVENTARIO_BD;
GO

-- Insertar 5 registros en la tabla AREA, representando grandes departamentos
INSERT INTO AREA (nombre_area) VALUES
('Bazar'),                     -- Para categorías como: Juguetería, Electrodomésticos, Menaje, Librería
('Textil'),                    -- Para categorías como: Ropa de Damas, Ropa de Caballeros, Calzado, Infantil
('Alimentos Perecibles'),      -- Para categorías como: Frutas y Verduras, Carnes, Lácteos, Panadería
('Alimentos no Perecibles'),   -- Para categorías como: Abarrotes, Conservas, Bebidas, Golosinas
('Cuidado Personal y Limpieza'); -- Para categorías como: Perfumería, Farmacia, Limpieza del Hogar
GO

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
GO
SELECT 
    c.id_cat,
    c.nombre_cat,
    a.nombre_area
FROM 
    CATEGORIA c
INNER JOIN 
    AREA a ON c.id_area = a.id_area
ORDER BY 
    a.nombre_area, c.nombre_cat;
GO