import React from "react";
import { Route } from "react-router-dom";

// --- Componentes ---
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MfaVerify from "./components/MfaVerify";
import DashboardAdmin from "./components/Dashboards/dashboardAdmin";
import DashboardJefeInventario from "./components/Dashboards/dashboardJInventario";
import DashboardOperadorRecepcion from "./components/Dashboards/dashboardORecepcion";
import DashboardAuditor from "./components/Dashboards/dashboardAuditor";
import DashboardOperadorTienda from "./components/Dashboards/dashboardOTienda";
import ProtectedRoute from "./components/Dashboards/ProtectedRoute";
import PerfilUsuario from "./components/Dashboards/PerfilUsuario";
import ListaUsuarios from "./components/Mod. Usuario/ListaUsuarios";
import CrearUsuario from "./components/Mod. Usuario/RegistrarUsuario";
import LoadingScreen from "./components/LoadingScreen_login";
import DashboardProductos from "./components/Dashboards/dashboardProductos";
import ListaAreas from "./components/Mod. Producto/ListaAreas";
import ListaProductos from "./components/Mod. Producto/ListaProductos";
import IngresarProducto from "./components/Mod. Producto/IngresarProducto";
import DashboardUsuarios from "./components/Dashboards/dashboardUsuarios";
import IngresarArea from "./components/Mod. Producto/IngresarArea";
import ListaRoles from "./components/Mod. Usuario/ListaRoles";
import IngresarRol from "./components/Mod. Usuario/IngresarRol";
import ListaCategorias from "./components/Mod. Producto/ListaCategorias";
import IngresarCategoria from "./components/Mod. Producto/IngresarCategoria";
import DashboardProveedores from "./components/Dashboards/dashboardProveedores";
import ListaProveedores from "./components/Mod. Proveedor/ListaProveedores";
import IngresarProveedor from "./components/Mod. Proveedor/IngresarProveedor";
import DashboardSedes from "./components/Dashboards/dashboardSedes";
import ListaSedes from "./components/Mod. Sedes/ListaSedes";
import RegistrarSede from "./components/Mod. Sedes/RegistrarSede";
import Settings from "./components/Mod. Configuracion/Settings";

// --- Roles ---
const ROLES = {
  ADMIN: "Administrador",
  JEFE_INV: "Jefe de Inventario",
  OP_RECEPCION: "Operador de Recepción de Mercadería",
  AUDITOR: "Auditor de Inventarios",
  OP_TIENDA: "Operador de Tienda",
};

// Grupos de roles comunes
const ALL_ROLES = [
  ROLES.ADMIN,
  ROLES.JEFE_INV,
  ROLES.OP_RECEPCION,
  ROLES.AUDITOR,
  ROLES.OP_TIENDA,
];
const ADMIN_ONLY = [ROLES.ADMIN];
const ADMIN_JEFE = [ROLES.ADMIN, ROLES.JEFE_INV];
const ADMIN_OP_RECEPCION = [ROLES.ADMIN, ROLES.OP_RECEPCION];
const ADMIN_OP_RECEPCION_TIENDA = [
  ROLES.ADMIN,
  ROLES.OP_RECEPCION,
  ROLES.OP_TIENDA,
];
//------ Función Auxiliar para Rutas Protegidas ------
const RutaProtegida = (key, path, roles, Component) => (
  <Route
    key={key}
    path={path}
    element={
      <ProtectedRoute roles={roles}>
        <Component />
      </ProtectedRoute>
    }
  />
);

// Rutas públicas de autenticación (SIN TOKEN)
const RutasAutenticacion = [
  <Route key="login" path="/" element={<Login />} />,
  <Route
    key="forgotPassword"
    path="/forgot-password"
    element={<ForgotPassword />}
  />,
  <Route
    key="resetPassword"
    path="/reset-password"
    element={<ResetPassword />}
  />,
  <Route key="mfaVerify" path="/verify-2fa" element={<MfaVerify />} />,
];

// Dashboards principales por rol
const RutasDashboard = [
  RutaProtegida(
    "admin",
    "/dashboard-administrador",
    ADMIN_ONLY,
    DashboardAdmin
  ),
  RutaProtegida(
    "jefe",
    "/dashboard-jefe-inventario",
    [ROLES.JEFE_INV],
    DashboardJefeInventario
  ),
  RutaProtegida(
    "recepcion",
    "/dashboard-operador-recepcion",
    [ROLES.OP_RECEPCION],
    DashboardOperadorRecepcion
  ),
  RutaProtegida(
    "auditor",
    "/dashboard-auditor-inventarios",
    [ROLES.AUDITOR],
    DashboardAuditor
  ),
  RutaProtegida(
    "tienda",
    "/dashboard-operador-tienda",
    [ROLES.OP_TIENDA],
    DashboardOperadorTienda
  ),
];

// Rutas compartidas por todos los usuarios autenticados
const RutasCompartidas = [
  RutaProtegida("perfil", "/perfil", ALL_ROLES, PerfilUsuario),
  RutaProtegida("loading", "/loading_login", ALL_ROLES, LoadingScreen),
  RutaProtegida("settings", "/settings", ALL_ROLES, Settings),
];

// Gestión de Usuarios y Roles (Admin)
const RutasUsuario = [
  RutaProtegida(
    "dashboardUsuarios",
    "/dashboard-usuarios",
    ADMIN_ONLY,
    DashboardUsuarios
  ),
  RutaProtegida(
    "ListaUsuarios",
    "/lista-usuarios",
    ADMIN_ONLY,
    ListaUsuarios
  ),
  RutaProtegida("crearUsuario", "/usuarios/nuevo", ADMIN_ONLY, CrearUsuario),
  RutaProtegida("listaRoles", "/roles", ADMIN_ONLY, ListaRoles),
  RutaProtegida("ingresarRol", "/roles/nuevo", ADMIN_ONLY, IngresarRol),
];

// Gestión de Productos (Admin & Jefe Inv.)
const RutasProductos = [
  RutaProtegida(
    "dashboardProductos",
    "/dashboard-productos",
    ADMIN_JEFE,
    DashboardProductos
  ),
  RutaProtegida(
    "listaProductos",
    "/lista-productos",
    ADMIN_JEFE,
    ListaProductos
  ),
  RutaProtegida(
    "ingresarProducto",
    "/productos/nuevo",
    ADMIN_JEFE,
    IngresarProducto
  ),
  RutaProtegida("listaAreas", "/lista-areas", ADMIN_JEFE, ListaAreas),
  RutaProtegida("ingresarArea", "/areas/nuevo", ADMIN_JEFE, IngresarArea),
  RutaProtegida(
    "listaCategorias",
    "/lista-categorias",
    ADMIN_JEFE,
    ListaCategorias
  ),
  RutaProtegida(
    "ingresarCategoria",
    "/categorias/nuevo",
    ADMIN_JEFE,
    IngresarCategoria
  ),
];

// Gestión de Proveedores
const RutasProveedores = [
  RutaProtegida(
    "dashboardProveedores",
    "/dashboard-proveedores",
    ADMIN_OP_RECEPCION_TIENDA,
    DashboardProveedores
  ),
  RutaProtegida(
    "listaProveedores",
    "/lista-proveedores",
    ADMIN_OP_RECEPCION_TIENDA,
    ListaProveedores
  ),
  RutaProtegida(
    "ingresarProveedor",
    "/proveedores/nuevo",
    ADMIN_OP_RECEPCION,
    IngresarProveedor
  ),
];

// Gestión de Sedes (Admin & Jefe Inv.)
const RutasSedes = [
  RutaProtegida(
    "dashboardSedes",
    "/dashboard-sedes",
    ADMIN_JEFE,
    DashboardSedes
  ),
  RutaProtegida("listaSedes", "/lista-sedes", ADMIN_JEFE, ListaSedes),
  RutaProtegida("registrarSedes", "/sedes/nuevo", ADMIN_JEFE, RegistrarSede),
];

// --- Exportación ---
const AppRoutes = [
  ...RutasAutenticacion,
  ...RutasDashboard,
  ...RutasCompartidas,
  ...RutasUsuario,
  ...RutasProductos,
  ...RutasProveedores,
  ...RutasSedes,
];

export default AppRoutes;
