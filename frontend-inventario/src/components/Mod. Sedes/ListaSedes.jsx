import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import { getSedes, deleteSede, updateSede } from "../../api/sedeApi";

const MySwal = withReactContent(Swal);

const ListaSedes = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const rowVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.05, duration: 0.3 }, 
		}),
	};

	const {
		data: sedesData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["sedes"],
		queryFn: getSedes,
	});
	const sedes = sedesData || [];
	const deleteSedeMutation = useMutation({
		mutationFn: deleteSede,
		onSuccess: () => {
			queryClient.invalidateQueries(["sedes"]);
			MySwal.fire("Eliminado", "La sede fue eliminada correctamente", "success");
		},
		onError: (err) => {
			console.error("Error al eliminar sede:", err);
			const mensaje = err.response?.data?.message || "No se pudo eliminar la sede";
			MySwal.fire("Error", mensaje, "error");
		},
	});
	const updateSedeMutation = useMutation({
		mutationFn: (variables) => updateSede(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["sedes"]);
			MySwal.fire(
				"Actualizado",
				"La sede se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar sede:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar la sede";
			MySwal.fire("Error", mensaje, "error");
		},
	});
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
		deleteSedeMutation.mutate(id);
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
		updateSedeMutation.mutate({ id: sede.idSede, data: datosActualizados });
	};

	return (
		<LayoutDashboard>
			<motion.div
				initial={{ opacity: 0, y: 20 }}     
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
			>
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
							onClick={refetch()}
							disabled={isLoading}
						>
							{isLoading ? "Actualizando..." : "Actualizar"}
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
							<AnimatePresence>
							{isLoading ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										Cargando sedes...
									</td>
								</tr>
							) : isError ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										{error.message || "No se pudieron cargar las sedes."}
									</td>
								</tr>
							) : sedes.length === 0 ? (
								<tr>
									<td className="sin-datos" colSpan={5}>
										No hay sedes registradas.
									</td>
								</tr>
							) : (
								sedes.map((sede, i) => (
									<motion.tr
										key={sede.idSede}
										custom={i}
										initial="hidden"
										animate="visible"
										variants={rowVariants}
										className="fila-sede"
									>
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
									</motion.tr>
								))
							)}
							</AnimatePresence>
						</tbody>
					</table>
				</div>
			</div>
			</motion.div>
		</LayoutDashboard>
	);
};

export default ListaSedes;
