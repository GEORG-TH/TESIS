import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/dashboardProductos.css";

const DashboardUsuarios = () => {
    const navigate = useNavigate();

    const opciones = [
        {
            id: "lista-usuarios",
            titulo: "Gestión de Usuarios",
            descripcion: "Administra cuentas, roles y estados del personal.",
            ruta: "/lista-usuarios",
        },
        {
            id: "lista-roles",
            titulo: "Gestión de Roles",
            descripcion: "Administra roles y permisos de los usuarios.",
            ruta: "/roles",
        }
    ];

    const manejarClick = (ruta) => {
        navigate(ruta);
    };

    return (
        <LayoutDashboard>
            <section className="dashboard-productos">
                <h2>Dashboard de Usuarios</h2>
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

export default DashboardUsuarios;
