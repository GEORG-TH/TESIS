SISTEMA WEB DE CONTROL DE INVENTARIOS DESARROLLADO EN \*SPRING BOOT / REACT\*



Roles:

**- Administrador**

**- Jefe de Inventario**

**- Operador de Recepción de mercadería**

**- Auditor de Inventarios**

**- Operador de Tienda**

Módulos del sistema:



***-Mod. Usuario:***

* Login / Register
* Gestión de Usuarios

1. &nbsp;	Interface de Perfil de Usuario
2. &nbsp;	CRUD Usuario



***-Mod. Producto:***

* Gestión de Productos

1. &nbsp;	CRUD de Productos

* Gestión de Área y Categorización

1. &nbsp;	(Listar, Insertar y Bloquear) de Área
2. &nbsp;	(Listar, Insertar y Bloquear) de Categoría
3. &nbsp;	Modificar las Categorías relacionadas a cada Área

* Gestión de Proveedores

1. &nbsp;	CRUD de proveedores



***-Mod. Sedes:***

* Gestión de Sedes:

1. &nbsp;	CRUD de Sedes
2. &nbsp;	Asociar inventarios por sede



***-Mod. Inventario:***

* Pedir mercadería a Proveedor
* Generar Conteo de Inventario (Programado o Sorpresivo)
* Gestión de Conteo

1. &nbsp;	Lista de Productos escaneados en el Conteo
2. &nbsp;	Aprobar/Rechazar Conteos de Inventario
3. &nbsp;	Modificar Conteo

* Movimientos de Inventario

1. &nbsp;	Importar Venta (CSV)
2. &nbsp;	Transferencia de mercadería a otra sede
3. &nbsp;	Merma de productos
4. &nbsp;	Recepción de mercadería
5. &nbsp;	Devolución de mercadería
6. &nbsp;	Envió a Soporte Técnico (Funcionalidad no Priorizada)

* Reportes de Inventario

1. &nbsp;	Reporte de Conteos de Inventario	(con Exportar a CSV o Gráfico en JPG)

&nbsp;		- Lista de diferencias de stock (Sistema vs Físico)	

1. &nbsp;	Consulta de Stock de Productos		(con Exportar a CSV o Gráfico en JPG)
2. &nbsp;	Consulta de Stock por Sede		(con Exportar a CSV o Gráfico en JPG)
3. &nbsp;	Reporte de Movimientos de Inventario	(con Exportar a CSV o Gráfico en JPG)
4. &nbsp;	Reporte de Quiebres de Stock		(con Exportar a CSV o Gráfico en JPG)





Funciones x Rol:



\-**Admin**

1. Control total del Sistema (Todas las Funcionalidades xd)
2. Priorización en Gestión de Usuarios (Asignación de roles), Áreas, Categoría, Producto, Proveedores
3. Autorización de Conteos de Inventario (Aprueba/Desaprueba) 



**-Jefe de Inventario**

1. Modulo de Productos (Todas las funcionalidades)
2. Modulo de Sedes (Todas las funcionalidades)
3. Genera conteos programados
4. Gestión de Conteo
5. Transferencia de mercadería a otra sede
6. Importar Venta
7. Acceso a Reportes



\-**Operador de Recepción de mercadería**

1. Merma de productos
2. Recepción de mercadería
3. Devolución de mercadería
4. Gestión de Proveedores (sin eliminar)
5. Transferencia de mercadería a otra sede
6. Generar Conteo de Inventario
7. Lista de Productos escaneados en el Conteo
8. Acceso a Reportes



\-**Auditor de Inventarios**

1. Acceso a Reportes



\-**Operador de Tienda**

1. Pedir mercadería a Proveedor
2. Generar Conteo de Inventario
3. Lista de Productos escaneados en el Conteo
4. Acceso a Reportes
5. (En caso sea un Operador del Área Electro) Envió de Soporte Técnico (Funcionalidad no Priorizada)



