import { useNavigate } from "react-router-dom";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/dashboardProductos.css";

const DashboardSedes = () => {
	const navigate = useNavigate();

	const opciones = [
		{
			id: "lista-sedes",
			titulo: "Gestión de Sedes",
			descripcion: "Consulta y administra la información de las sedes.",
			ruta: "/lista-sedes",
		},
	];

	const manejarClick = (ruta) => {
		navigate(ruta);
	};

	return (
		<LayoutDashboard>
			<section className="dashboard-productos">
				<h2>Dashboard de Sedes</h2>
				<ul className="dashboard-productos__lista">
					{opciones.map((opcion) => (
						<li key={opcion.id}>
							<div
								className="dashboard-productos__card"
								role="button"
								tabIndex={0}
								onClick={() => manejarClick(opcion.ruta)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
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

export default DashboardSedes;
