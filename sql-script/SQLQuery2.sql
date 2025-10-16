USE CONTROL_INVENTARIO_BD;
GO

-- Insertar 5 registros en la tabla AREA, representando grandes departamentos
INSERT INTO AREA (nombre_area) VALUES
('Bazar'),                     -- Para categor�as como: Jugueter�a, Electrodom�sticos, Menaje, Librer�a
('Textil'),                    -- Para categor�as como: Ropa de Damas, Ropa de Caballeros, Calzado, Infantil
('Alimentos Perecibles'),      -- Para categor�as como: Frutas y Verduras, Carnes, L�cteos, Panader�a
('Alimentos no Perecibles'),   -- Para categor�as como: Abarrotes, Conservas, Bebidas, Golosinas
('Cuidado Personal y Limpieza'); -- Para categor�as como: Perfumer�a, Farmacia, Limpieza del Hogar
GO

INSERT INTO CATEGORIA (nombre_cat, id_area) VALUES
-- Categor�as para el �rea de Bazar (ID = 1)
('Jugueter�a', 1),
('Electrodom�sticos', 1),
('Librer�a', 1),
('Menaje de Cocina', 1),

-- Categor�as para el �rea de Textil (ID = 2)
('Ropa de Damas', 2),
('Ropa de Caballeros', 2),
('Calzado', 2),

-- Categor�as para el �rea de Alimentos Perecibles (ID = 3)
('Frutas y Verduras', 3),
('Carnes y Aves', 3),
('L�cteos y Huevos', 3),
('Panader�a', 3),

-- Categor�as para el �rea de Alimentos no Perecibles (ID = 4)
('Menestras y Legumbres', 4),
('Bebidas y Licores', 4),
('Golosinas y Snacks', 4),

-- Categor�as para el �rea de Cuidado Personal y Limpieza (ID = 5)
('Perfumer�a y Cosm�ticos', 5),
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