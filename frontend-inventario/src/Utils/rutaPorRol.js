// Ruta de inicio (dashboard) según el rol del usuario.
export const rutaPorRol = (rol) => {
  switch (rol) {
    case "Administrador": return "/dashboard-administrador";
    case "Jefe de Inventario": return "/dashboard-jefe-inventario";
    case "Operador de Recepción de Mercadería": return "/dashboard-operador-recepcion";
    case "Auditor de Inventarios": return "/dashboard-auditor-inventarios";
    case "Operador de Tienda": return "/dashboard-operador-tienda";
    case "Jefe de Almacén": return "/dashboard-jefe-almacen";
    default: return "/";
  }
};
