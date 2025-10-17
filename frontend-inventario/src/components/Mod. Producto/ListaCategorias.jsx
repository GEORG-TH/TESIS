import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
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
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }, 
    }),
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriasRes, areasRes] = await Promise.all([
        getCategorias(),
        getAreas(),
      ]);

      const areasMap = new Map(
        (areasRes.data || []).map((area) => [area.id_area, area.nombreArea])
      );

      const categoriasEnriquecidas = (categoriasRes.data || []).map((categoria) => ({
        ...categoria,
        nombreArea: areasMap.get(categoria.area?.id_area) || "Sin área",
      }));

      setCategorias(categoriasEnriquecidas);
      setAreas(areasRes.data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError("No se pudieron cargar las categorías. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

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

    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((categoria) => categoria.id_cat !== id));
      MySwal.fire("Eliminado", "La categoría fue eliminada correctamente", "success");
    } catch (err) {
      let errorMessage = "No se pudo eliminar la categoría.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      console.error("Error al eliminar categoría:", err);
      MySwal.fire("Error", errorMessage, "error");
    }
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

    try {
      await updateCategoria(categoria.id_cat, datosActualizados);
      setCategorias((prev) =>
        prev.map((item) =>
          item.id_cat === categoria.id_cat
            ? {
                ...item,
                nombreCat: datosActualizados.nombreCat,
                nombreArea:
                  areas.find((area) => area.id_area === datosActualizados.area.id_area)?.nombreArea ||
                  item.nombreArea,
                area: { id_area: datosActualizados.area.id_area },
              }
            : item
        )
      );
      MySwal.fire("Actualizado", "La categoría se actualizó correctamente", "success");
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      const mensaje = err.response?.data?.message || "No se pudo actualizar la categoría";
      MySwal.fire("Error", mensaje, "error");
    }
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
              onClick={cargarDatos}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
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
              {loading ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    Cargando categorías...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    {error}
                  </td>
                </tr>
              ) : categorias.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={4}>
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categorias.map((categoria, i) => (
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
                          onClick={() => handleDelete(categoria.id_categoria)}
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
