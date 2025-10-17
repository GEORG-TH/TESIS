import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { getAreas, deleteArea, updateArea } from "../../api/areaApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";

const MySwal = withReactContent(Swal);

const AreaList = () => {
  const navigate = useNavigate();
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

  const cargarAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAreas();
      setAreas(response.data || []);
    } catch (err) {
      console.error("Error al cargar áreas:", err);
      setError("No se pudieron cargar las áreas. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAreas();
  }, []);

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

    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((area) => area.id_area !== id));
      MySwal.fire("Eliminado", "El área fue eliminada correctamente", "success");
    } catch (err) {
        let errorMessage = "No se pudo eliminar el área.";

        if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        }
        console.error("Error al eliminar área:", err);
        MySwal.fire("Error", errorMessage, "error");
    }
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

    try {
      await updateArea(area.id_area, { nombreArea: nombreActualizado });
      setAreas((prev) =>
        prev.map((item) =>
          item.id_area === area.id_area ? { ...item, nombreArea: nombreActualizado } : item
        )
      );
      MySwal.fire("Actualizado", "El área se actualizó correctamente", "success");
    } catch (err) {
      console.error("Error al actualizar área:", err);
      const mensaje = err.response?.data?.message || "No se pudo actualizar el área";
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
              onClick={cargarAreas}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
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
              {loading ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    Cargando áreas...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    {error}
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