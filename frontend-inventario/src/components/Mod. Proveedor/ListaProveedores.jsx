import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import {
  getProveedores,
  deleteProveedor,
  updateProveedor,
  activarProveedor,
  desactivarProveedor,
} from "../../api/proveedorApi";

const MySwal = withReactContent(Swal);

const ListaProveedores = () => {
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
		data: proveedoresData,
		isLoading,
		isError,  
		error,
		refetch,   
	} = useQuery({
		queryKey: ["proveedores"],
		queryFn: getProveedores,
	});
  const proveedores = proveedoresData || [];
  const deleteProveedorMutation = useMutation({
		mutationFn: deleteProveedor,
		onSuccess: () => {
			queryClient.invalidateQueries(["proveedores"]);
			MySwal.fire("Eliminado", "El proveedor fue eliminado.", "success");
		},
		onError: (error) => {
			console.error("Error al eliminar proveedor:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo eliminar el proveedor";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const toggleEstadoMutation = useMutation({
		mutationFn: (variables) =>
			variables.activar
				? activarProveedor(variables.id)
				: desactivarProveedor(variables.id),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["proveedores"]);
			const accion = variables.activar ? "Activado" : "Desactivado";
			MySwal.fire(accion, `El proveedor fue ${accion.toLowerCase()}.`, "success");
		},
		onError: (error, variables) => {
			const accion = variables.activar ? "activar" : "desactivar";
			console.error(`Error al ${accion} proveedor:`, error);
			MySwal.fire("Error", `No se pudo ${accion} el proveedor`, "error");
		},
	});
  const updateProveedorMutation = useMutation({
		mutationFn: (variables) => updateProveedor(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["proveedores"]);
			MySwal.fire(
				"Actualizado",
				"Proveedor actualizado correctamente",
				"success"
			);
		},
		onError: (error) => {
			console.error("Error al actualizar proveedor:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo actualizar el proveedor";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleEliminar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar proveedor?",
      text: "Esta acción eliminará al proveedor permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    deleteProveedorMutation.mutate(id);
  };

  const handleDesactivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Desactivar proveedor?",
      text: "El proveedor no podrá interactuar mientras esté desactivado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    toggleEstadoMutation.mutate({ id, activar: false });
  };

  const handleActivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Activar proveedor?",
      text: "El proveedor podrá interactuar después de activar la cuenta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    toggleEstadoMutation.mutate({ id, activar: true });
  };

  const handleEditar = async (proveedor) => {
    const { value: formValues } = await MySwal.fire({
      title: "Editar Proveedor",
      html: `
        <div class="swal-form">
          <label>RUC:</label>
          <input id="swal-ruc" class="swal-input" value="${proveedor.ruc || ""}">

          <label>Razón Social:</label>
          <input id="swal-razon" class="swal-input" value="${proveedor.nombre_proveedor || ""}">

          <label>Teléfono:</label>
          <input id="swal-telefono" class="swal-input" value="${proveedor.telefono || ""}">

          <label>Email:</label>
          <input id="swal-email" class="swal-input" value="${proveedor.email || ""}">

          <label>Dirección:</label>
          <input id="swal-direccion" class="swal-input" value="${proveedor.direccion || ""}">
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const ruc = document.getElementById("swal-ruc").value.trim();
        const nombre_proveedor = document.getElementById("swal-razon").value.trim();
        const telefono = document.getElementById("swal-telefono").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const direccion = document.getElementById("swal-direccion").value.trim();

        if (!ruc || !nombre_proveedor || !telefono || !email || !direccion) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { ruc, nombre_proveedor, telefono, email, direccion };
      },
    });

    if (!formValues) {
      return;
    }
    updateProveedorMutation.mutate({
			id: proveedor.id_proveedor,
			data: formValues,
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
          <h2 className="lista-panel-title">Lista de Proveedores</h2>
          <div className="lista-panel-actions">
            <button
              type="button"
              className="lista-panel-back"
              onClick={() => navigate("/dashboard-proveedores")}
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
              onClick={() => navigate("/proveedores/nuevo")}
            >
              Ingresar Proveedor
            </button>
          </div>
        </div>

        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>RUC</th>
                <th>Razón Social</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {isLoading ? (
										<tr>
											<td className="sin-datos" colSpan={7}>
												Cargando proveedores...
											</td>
										</tr>
									) : isError ? (
										<tr>
											<td className="sin-datos" colSpan={7}>
												{error.message || "No se pudieron cargar los datos."}
											</td>
										</tr>
									) : proveedores.length === 0 ? (
                    <tr>
                      <td className="sin-datos" colSpan={7}>
                        No hay proveedores registrados.
                      </td>
                    </tr>
              ) : (
                proveedores.map((proveedor, i) => (
                  <motion.tr
                      key={proveedor.id_proveedor}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className="fila-proveedor"
                    >
                    <td>{proveedor.id_proveedor}</td>
                    <td>{proveedor.ruc}</td>
                    <td>{proveedor.nombre_proveedor}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.email}</td>
                    <td>{proveedor.direccion}</td>
                    <td>
                      <div className="acciones-columna">
                        <button
                          type="button"
                          className="btn-accion editar"
                          onClick={() => handleEditar(proveedor)}
                        >
                          Editar
                        </button>
                        {proveedor.estado === 1 ? (
                          <button
                            type="button"
                            className="btn-accion desactivar"
                            onClick={() => handleDesactivar(proveedor.id_proveedor)}
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-accion activar"
                            onClick={() => handleActivar(proveedor.id_proveedor)}
                          >
                            Activar
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          onClick={() => handleEliminar(proveedor.id_proveedor)}
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

export default ListaProveedores;
