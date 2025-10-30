import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import {
  getCategorias,
  deleteCategoria,
  updateCategoria,
} from "../../api/categoriaApi";
import { getAreas } from "../../api/areaApi";

const MySwal = withReactContent(Swal);

const ListaCategorias = () => {
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
		data: categoriasData,
		isLoading: isLoadingCategorias,
		isError: isErrorCategorias,
		error: errorCategorias,
		refetch: refetchCategorias,
	} = useQuery({
		queryKey: ["categorias"],
		queryFn: getCategorias,
	});
	const {
		data: areasData,
		isLoading: isLoadingAreas,
		isError: isErrorAreas,
		error: errorAreas,
		refetch: refetchAreas,
	} = useQuery({
		queryKey: ["areas"],
		queryFn: getAreas,
    initialData: [],
	});
  const isLoading = isLoadingCategorias || isLoadingAreas;
  const isError = isErrorCategorias || isErrorAreas;
  const error = errorCategorias || errorAreas;
  const areas = areasData;
  const categoriasEnriquecidas = useMemo(() => {
    const areasMap = new Map(
      areas.map((area) => [area.id_area, area.nombreArea])
    );

    return (categoriasData || []).map((categoria) => ({
      ...categoria,
      nombreArea: areasMap.get(categoria.area?.id_area) || "Sin área",
    }));
  }, [categoriasData, areas]);
  const deleteCategoriaMutation = useMutation({
		mutationFn: deleteCategoria,
		onSuccess: () => {
			queryClient.invalidateQueries(["categorias"]);
			MySwal.fire(
				"Eliminado",
				"La categoría fue eliminada correctamente",
				"success"
			);
		},
		onError: (err) => {
			let errorMessage = "No se pudo eliminar la categoría.";
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			}
			console.error("Error al eliminar categoría:", err);
			MySwal.fire("Error", errorMessage, "error");
		},
	});
  const updateCategoriaMutation = useMutation({
		mutationFn: (variables) => updateCategoria(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["categorias"]);
      queryClient.invalidateQueries(["areas"]);
			MySwal.fire(
				"Actualizado",
				"La categoría se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar categoría:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar la categoría";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción eliminará la categoría de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteCategoriaMutation.mutate(id);
  };
  const handleEdit = async (categoria) => {
    const { value: datosActualizados, isConfirmed } = await MySwal.fire({
      title: "Editar Categoría",
      html: `<div class="swal-form">
                <label>Nombre de la Categoría:</label>
                <input id="swal-nombre-categoria" class="swal-input" value="${categoria.nombreCat ?? ""}">
                <label>Área:</label>
                <select id="swal-area" class="swal-input">
                  ${areas
                    .map(
                      (area) =>
                        `<option value="${area.id_area}" ${
                          area.id_area === categoria.area?.id_area ? "selected" : ""
                        }>${area.nombreArea}</option>`
                    )
                    .join("")}
                </select>
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre-categoria").value.trim();
        const areaId = document.getElementById("swal-area").value;

        if (!nombre) {
          Swal.showValidationMessage("El nombre de la categoría es obligatorio");
          return false;
        }
        if (!areaId) {
          Swal.showValidationMessage("Selecciona un área");
          return false;
        }

        return {
          nombreCat: nombre,
          area: { id_area: parseInt(areaId, 10) },
        };
      },
    });

    if (!isConfirmed || !datosActualizados) {
      return;
    }

    updateCategoriaMutation.mutate({
			id: categoria.id_cat,
			data: datosActualizados,
		});
  };
  const handleRefresh = () => {
    refetchCategorias();
    refetchAreas();
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
          <h2 className="lista-panel-title">Lista de Categorías</h2>
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
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              className="lista-panel-nuevo"
              onClick={() => navigate("/categorias/nuevo")}
            >
              Nueva Categoría
            </button>
          </div>
        </div>

        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Categoría</th>
                <th>Área</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {isLoading ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    Cargando categorías...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    {error.message || "No se pudieron cargar los datos."}
                  </td>
                </tr>
              ) : categoriasEnriquecidas.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categoriasEnriquecidas.map((categoria, i) => (
                  <motion.tr
                      key={categoria.id_cat}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="fila-categoria"
                    >
                    <td>{categoria.id_cat}</td>
                    <td>{categoria.nombreCat}</td>
                    <td>{categoria.nombreArea}</td>
                    <td>
                      <div className="acciones-columna">
                        <button
                          type="button"
                          className="btn-accion editar"
                          onClick={() => handleEdit(categoria)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          onClick={() => handleDelete(categoria.id_cat)}
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

export default ListaCategorias;
