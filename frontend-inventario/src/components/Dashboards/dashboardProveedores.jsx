import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/dashboardProductos.css";

const DashboardProveedores = () => {
  const navigate = useNavigate();

  const opciones = [
    {
      id: "lista-proveedores",
      titulo: "Gestión de Proveedores",
      descripcion: "Administra datos de proveedores y sus contactos.",
      ruta: "/lista-proveedores",
    },
    {
      id: "Pedido_mercaderia",
      titulo: "Pedido de Mercadería",
      descripcion: "Realiza un pedido de mercadería a los proveedores.",
      ruta: "/proveedores/pedido",
    },
  ];

  const manejarClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <LayoutDashboard>
      <section className="dashboard-productos">
        <h2>Dashboard de Proveedores</h2>
        <ul className="dashboard-productos__lista">
          {opciones.map((opcion) => (
            <li key={opcion.id}>
              <div
                className="dashboard-productos__card"
                role="button"
                tabIndex={0}
                onClick={() => manejarClick(opcion.ruta)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    manejarClick(opcion.ruta);
                  }
                }}
              >
                <div className="dashboard-productos__card-header">
                  <span className="dashboard-productos__card-title">
                    {opcion.titulo}
                  </span>
                  <span className="dashboard-productos__card-icon">→</span>
                </div>
                {opcion.descripcion && (
                  <p className="dashboard-productos__card-description">
                    {opcion.descripcion}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </LayoutDashboard>
  );
};

export default DashboardProveedores;
