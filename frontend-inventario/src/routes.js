import React from "react";
import { Route } from "react-router-dom";
import Login from "./components/Login";
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

const AppRoutes = [
  <Route key="login" path="/" element={<Login />} />,

  <Route
    key="admin"
    path="/dashboard-administrador"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <DashboardAdmin />
      </ProtectedRoute>
    }
  />,
  <Route
    key="jefe"
    path="/dashboard-jefe-inventario"
    element={
      <ProtectedRoute roles={["Jefe de Inventario"]}>
        <DashboardJefeInventario />
      </ProtectedRoute>
    }
  />,
  <Route
    key="recepcion"
    path="/dashboard-operador-recepcion"
    element={
      <ProtectedRoute roles={["Operador de Recepción de Mercadería"]}>
        <DashboardOperadorRecepcion />
      </ProtectedRoute>
    }
  />,
  <Route
    key="auditor"
    path="/dashboard-auditor-inventarios"
    element={
      <ProtectedRoute roles={["Auditor de Inventarios"]}>
        <DashboardAuditor />
      </ProtectedRoute>
    }
  />,
  <Route
    key="tienda"
    path="/dashboard-operador-tienda"
    element={
      <ProtectedRoute roles={["Operador de Tienda"]}>
        <DashboardOperadorTienda />
      </ProtectedRoute>
    }
  />,
  <Route
    key="perfil"
    path="/perfil"
    element={
      <ProtectedRoute
        roles={[
          "Administrador",
          "Jefe de Inventario",
          "Operador de Recepción de Mercadería",
          "Auditor de Inventarios",
          "Operador de Tienda",
        ]}
      >
        <PerfilUsuario />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ListaUsuarios"
    path="/lista-usuarios"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <ListaUsuarios />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboardUsuarios"
    path="/dashboard-usuarios"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <DashboardUsuarios />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaRoles"
    path="/roles"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <ListaRoles />
      </ProtectedRoute>
    }
  />,
  <Route
    key="loading"
    path="/loading_login"
    element={
      <ProtectedRoute
        roles={[
          "Administrador",
          "Jefe de Inventario",
          "Operador de Recepción de Mercadería",
          "Auditor de Inventarios",
          "Operador de Tienda",
        ]}
      >
        <LoadingScreen />
      </ProtectedRoute>
    }
  />,
  <Route
    key="crearUsuario"
    path="/usuarios/nuevo"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <CrearUsuario />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboardProductos"
    path="/dashboard-productos"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <DashboardProductos />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboardProveedores"
    path="/dashboard-proveedores"
    element={
      <ProtectedRoute
        roles={[
          "Administrador",
          "Operador de Recepción de Mercadería",
          "Operador de Tienda",
        ]}
      >
        <DashboardProveedores />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboardSedes"
    path="/dashboard-sedes"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <DashboardSedes />
      </ProtectedRoute>
    }
  />,
  <Route
    key="settings"
    path="/settings"
    element={
      <ProtectedRoute
        roles={[
          "Administrador",
          "Jefe de Inventario",
          "Operador de Recepción de Mercadería",
          "Auditor de Inventarios",
          "Operador de Tienda",
        ]}
      >
        <Settings />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaProveedores"
    path="/lista-proveedores"
    element={
      <ProtectedRoute
        roles={[
          "Administrador",
          "Operador de Recepción de Mercadería",
          "Operador de Tienda",
        ]}
      >
        <ListaProveedores />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaProductos"
    path="/lista-productos"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <ListaProductos />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaAreas"
    path="/lista-areas"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <ListaAreas />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaCategorias"
    path="/lista-categorias"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <ListaCategorias />
      </ProtectedRoute>
    }
  />,
  <Route
    key="listaSedes"
    path="/lista-sedes"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <ListaSedes />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ingresarProducto"
    path="/productos/nuevo"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <IngresarProducto />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ingresarArea"
    path="/areas/nuevo"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <IngresarArea />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ingresarCategoria"
    path="/categorias/nuevo"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <IngresarCategoria />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ingresarProveedor"
    path="/proveedores/nuevo"
    element={
      <ProtectedRoute
        roles={["Administrador", "Operador de Recepción de Mercadería"]}
      >
        <IngresarProveedor />
      </ProtectedRoute>
    }
  />,
  <Route
    key="ingresarRol"
    path="/roles/nuevo"
    element={
      <ProtectedRoute roles={["Administrador"]}>
        <IngresarRol />
      </ProtectedRoute>
    }
  />,
  <Route
    key="registrarSedes"
    path="/sedes/nuevo"
    element={
      <ProtectedRoute roles={["Administrador", "Jefe de Inventario"]}>
        <RegistrarSede />
      </ProtectedRoute>
    }
  />,
];

export default AppRoutes;
