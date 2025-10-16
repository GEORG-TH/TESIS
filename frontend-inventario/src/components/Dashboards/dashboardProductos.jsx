import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/dashboardProductos.css";

const DashboardProductos = () => {
    const navigate = useNavigate();

    const opciones = [
        {
            id: "gestion-areas",
            titulo: "Gestión de Áreas",
            descripcion: "Administra áreas del negocio.",
            ruta: "/lista-areas",
        },
        {
            id: "gestion-categorias",
            titulo: "Gestión de Categorías",
            descripcion: "Administra categorías de productos.",
            ruta: "/lista-categorias",
        },
        {
            id: "gestion-productos",
            titulo: "Gestión de Productos",
            descripcion: "Administra productos en el sistema.",
            ruta: "/lista-productos",
        }
    ];

    const manejarClick = (ruta) => {
        navigate(ruta);
    };

    return (
        <LayoutDashboard>
            <section className="dashboard-productos">
                <h2>Dashboard de Productos</h2>
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

export default DashboardProductos;