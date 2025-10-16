import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import { getSedes, deleteSede, updateSede } from "../../api/sedeApi";

const MySwal = withReactContent(Swal);

const ListaSedes = () => {
	const navigate = useNavigate();
	const [sedes, setSedes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		cargarSedes();
	}, []);

	const cargarSedes = async () => {
		try {
			setLoading(true);
			setError(null);
			const respuesta = await getSedes();
			setSedes(respuesta.data || []);
		} catch (err) {
			console.error("Error al cargar sedes:", err);
			setError("No se pudieron cargar las sedes. Intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleEliminar = async (id) => {
		const resultado = await MySwal.fire({
			title: "¿Eliminar sede?",
			text: "Esta acción eliminará la sede seleccionada.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
			reverseButtons: true,
		});

		if (!resultado.isConfirmed) {
			return;
		}

		try {
			await deleteSede(id);
			setSedes((prev) => prev.filter((sede) => sede.idSede !== id));
			MySwal.fire("Eliminado", "La sede fue eliminada correctamente", "success");
		} catch (err) {
			console.error("Error al eliminar sede:", err);
			const mensaje = err.response?.data?.message || "No se pudo eliminar la sede";
			MySwal.fire("Error", mensaje, "error");
		}
	};

	const handleEditar = async (sede) => {
		const { value: datosActualizados } = await MySwal.fire({
			title: "Editar Sede",
			html: `
				<div class="swal-form">
					<label>Nombre de la Sede:</label>
					<input id="swal-nombre-sede" class="swal-input" value="${sede.nombreSede ?? ""}">

					<label>Dirección:</label>
					<input id="swal-direccion" class="swal-input" value="${sede.direccion ?? ""}">

					<label>Anexo:</label>
					<input id="swal-anexo" class="swal-input" value="${sede.anexo ?? ""}">
				</div>
			`,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: "Guardar",
			cancelButtonText: "Cancelar",
			preConfirm: () => {
				const nombre = document.getElementById("swal-nombre-sede").value.trim();
				const direccion = document.getElementById("swal-direccion").value.trim();
				const anexo = document.getElementById("swal-anexo").value.trim();

				if (!nombre || !direccion || !anexo) {
					Swal.showValidationMessage("Todos los campos son obligatorios");
					return false;
				}

				return {
					nombreSede: nombre,
					direccion,
					anexo,
				};
			},
		});

		if (!datosActualizados) {
			return;
		}

		try {
			await updateSede(sede.idSede, datosActualizados);
			setSedes((prev) =>
				prev.map((item) =>
					item.idSede === sede.idSede
						? { ...item, ...datosActualizados }
						: item
				)
			);
			MySwal.fire("Actualizado", "La sede se actualizó correctamente", "success");
		} catch (err) {
			console.error("Error al actualizar sede:", err);
			const mensaje = err.response?.data?.message || "No se pudo actualizar la sede";
			MySwal.fire("Error", mensaje, "error");
		}
	};

	return (
		<LayoutDashboard>
			<div className="lista-panel-container">
				<div className="lista-panel-header">
					<h2 className="lista-panel-title">Lista de Sedes</h2>
					<div className="lista-panel-actions">
						<button
							type="button"
							className="lista-panel-back"
							onClick={() => navigate("/dashboard-sedes")}
						>
							Volver
						</button>
						<button
							type="button"
							className="lista-panel-refresh"
							onClick={cargarSedes}
							disabled={loading}
						>
							{loading ? "Actualizando..." : "Actualizar"}
						</button>
						<button
							type="button"
							className="lista-panel-nuevo"
							onClick={() => navigate("/sedes/nuevo")}
						>
							Nueva Sede
						</button>
					</div>
				</div>

				<div className="panel-table-wrapper">
					<table className="panel-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Sede</th>
								<th>Dirección</th>
								<th>Anexo</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										Cargando sedes...
									</td>
								</tr>
							) : error ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										{error}
									</td>
								</tr>
							) : sedes.length === 0 ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										No hay sedes registradas.
									</td>
								</tr>
							) : (
								sedes.map((sede) => (
									<tr key={sede.idSede}>
										<td>{sede.idSede}</td>
										<td>{sede.nombreSede}</td>
										<td>{sede.direccion}</td>
										<td>{sede.anexo}</td>
										<td>
											<div className="acciones-columna">
												<button
													type="button"
													className="btn-accion editar"
													onClick={() => handleEditar(sede)}
												>
													Editar
												</button>
												<button
													type="button"
													className="btn-accion eliminar"
													onClick={() => handleEliminar(sede.idSede)}
												>
													Eliminar
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</LayoutDashboard>
	);
};

export default ListaSedes;
