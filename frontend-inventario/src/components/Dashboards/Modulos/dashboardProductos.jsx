import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import "../../styles/dashboardProductos.css";

const DashboardProductos = () => {
    const navigate = useNavigate();

    const OpcionesGestion = [
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
    const OpcionesOperacion = [
        {
            id: "generador-codigos",
            titulo: "Generación de Códigos de Barras y QR",
            descripcion: "Genera códigos de barras y códigos QR para productos, listos para colocar en las góndolas.",
            ruta: "/productos/etiquetas",
        },
        {
            id: "campañas-promocionales",
            titulo: "Campañas Promocionales",
            descripcion: "Verifica que campañas se acercan para promocionar productos.",
            ruta: "/....",
        },
        {
            id: "sugerencia-productos",
            titulo: "Sugerencia Inteligente de Productos",
            descripcion: "Abastecete de productos (antiguos o novedades) para la campaña que viene (*Impulsado por IA*)",
            ruta: "/....",
        },
    ];

    const manejarClick = (ruta) => {
        navigate(ruta);
    };

    return (
        <LayoutDashboard>
            <section className="dashboard-productos">
                <h2>Gestión y Control</h2>
                <ul className="dashboard-productos__lista">
                    {OpcionesGestion.map((opcion) => (
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
                <h2>Operaciones</h2>
                <ul className="dashboard-productos__lista">
                    {OpcionesOperacion.map((opcion) => (
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