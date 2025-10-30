import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, deleteArea, updateArea } from "../../api/areaApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";

const MySwal = withReactContent(Swal);

const AreaList = () => {
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
		data: areasData,
		isLoading,
		isError,
		error,
		refetch, 
	} = useQuery({
		queryKey: ["areas"],
		queryFn: getAreas,
	});
  const areas = areasData || [];
  const deleteAreaMutation = useMutation({
		mutationFn: deleteArea,
		onSuccess: () => {
			queryClient.invalidateQueries(["areas"]);
			MySwal.fire("Eliminado", "El área fue eliminada correctamente", "success");
		},
		onError: (err) => {
			let errorMessage = "No se pudo eliminar el área.";
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			}
			console.error("Error al eliminar área:", err);
			MySwal.fire("Error", errorMessage, "error");
		},
	});
  const updateAreaMutation = useMutation({
		mutationFn: (variables) => updateArea(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["areas"]);
			MySwal.fire(
				"Actualizado",
				"El área se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar área:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar el área";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar área?",
      text: "Esta acción eliminará el área seleccionada de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    deleteAreaMutation.mutate(id);
  };
  const handleEdit = async (area) => {
    const { value: nombreActualizado, isConfirmed } = await MySwal.fire({
      title: "Editar Área",
      html: `<div class="swal-form">
                <label>Nombre del Área:</label>
                <input id="swal-nombre-area" class="swal-input" value="${area.nombreArea ?? ""}">
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre-area").value.trim();
        if (!nombre) {
          Swal.showValidationMessage("El nombre del área es obligatorio");
          return false;
        }
        return nombre;
      },
    });

    if (!isConfirmed || !nombreActualizado) {
      return;
    }

    updateAreaMutation.mutate({
			id: area.id_area,
			data: { nombreArea: nombreActualizado },
		});
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
          <h2 className="lista-panel-title">Lista de Áreas</h2>
          <div className="lista-panel-actions">
            <button
              type="button"
              className="lista-panel-back"
              onClick={() => navigate("/dashboard-productos")}
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
              onClick={() => navigate("/areas/nuevo")}
            >
              Nueva Área
            </button>
          </div>
        </div>

        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Área</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {isLoading ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    Cargando áreas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    {isError}
                  </td>
                </tr>
              ) : areas.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    No hay áreas registradas.
                  </td>
                </tr>
              ) : (
                areas.map((area, i) => (
                  <motion.tr
                      key={area.id_area}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="fila-areas"
                    >
                    <td>{area.id_area}</td>
                    <td>{area.nombreArea}</td>
                    <td>
                      <div className="acciones-columna">
                        <button
                          type="button"
                          className="btn-accion editar"
                          onClick={() => handleEdit(area)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          onClick={() => handleDelete(area.id_area)}
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

export default AreaList;