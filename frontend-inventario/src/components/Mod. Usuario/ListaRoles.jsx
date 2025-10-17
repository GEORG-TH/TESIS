import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import { getRoles, deleteRol, updateRol } from "../../api/rolApi";

const MySwal = withReactContent(Swal);

function ListaRoles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }, 
    }),
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los roles.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción eliminará el rol permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteRol(id);
      setRoles((prev) => prev.filter((rol) => rol.id_rol !== id));
      MySwal.fire("Eliminado", "El rol fue eliminado correctamente.", "success");
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      const mensaje = error.response?.data?.message || "No se pudo eliminar el rol.";
      MySwal.fire("Error", mensaje, "error");
    }
  };

  const handleEditar = async (rol) => {
    const { value: formValues, isConfirmed } = await MySwal.fire({
      title: "Editar Rol",
      html: `<div class="swal-form">
                <label>Nombre del Rol:</label>
                <input id="swal-nombre" class="swal-input" value="${rol.nombreRol ?? ""}">
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value.trim();
        if (!nombre) {
          Swal.showValidationMessage("El nombre del rol es obligatorio");
          return false;
        }
        return { nombreRol: nombre };
      },
    });

    if (!isConfirmed || !formValues) {
      return;
    }

    try {
      await updateRol(rol.id_rol, formValues);
      setRoles((prev) =>
        prev.map((item) =>
          item.id_rol === rol.id_rol ? { ...item, ...formValues } : item
        )
      );
      MySwal.fire("Actualizado", "El rol fue actualizado correctamente.", "success");
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      const mensaje = error.response?.data?.message || "No se pudo actualizar el rol.";
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
          <h2 className="lista-panel-title">Lista de Roles</h2>
          <div className="lista-panel-actions">
            <button
              type="button"
              className="lista-panel-back"
              onClick={() => navigate("/dashboard-usuarios")}
            >
              Volver
            </button>
            <button
              type="button"
              className="lista-panel-refresh"
              onClick={cargarRoles}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              className="lista-panel-nuevo"
              onClick={() => navigate("/roles/nuevo")}
            >
              Nuevo Rol
            </button>
          </div>
        </div>

        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {roles.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={3}>
                    {loading ? "Cargando roles..." : "No hay roles registrados."}
                  </td>
                </tr>
              ) : (
                roles.map((rol, i) => (
                  <motion.tr
                      key={rol.id_rol}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="fila-rol"
                    >
                    <td>{rol.id_rol}</td>
                    <td>{rol.nombreRol}</td>
                    <td>
                      <div className="acciones-columna">
                        <button
                          type="button"
                          className="btn-accion editar"
                          onClick={() => handleEditar(rol)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          onClick={() => handleEliminar(rol.id_rol)}
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
}

export default ListaRoles;
