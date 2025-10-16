import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const respuesta = await getProveedores();
      setProveedores(respuesta.data || []);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      MySwal.fire("Error", "No se pudieron cargar los proveedores", "error");
    }
  };

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

    try {
      await deleteProveedor(id);
      setProveedores((prev) => prev.filter((prov) => prov.id_proveedor !== id));
      MySwal.fire("Eliminado", "El proveedor fue eliminado.", "success");
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      const mensaje = error.response?.data?.message || "No se pudo eliminar el proveedor";
      MySwal.fire("Error", mensaje, "error");
    }
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

    try {
      await desactivarProveedor(id);
      MySwal.fire("Desactivado", "El proveedor fue desactivado.", "success");
      cargarProveedores();
    } catch (error) {
      console.error("Error al desactivar proveedor:", error);
      MySwal.fire("Error", "No se pudo desactivar el proveedor", "error");
    }
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

    try {
      await activarProveedor(id);
      MySwal.fire("Activado", "El proveedor fue activado.", "success");
      cargarProveedores();
    } catch (error) {
      console.error("Error al activar proveedor:", error);
      MySwal.fire("Error", "No se pudo activar el proveedor", "error");
    }
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

    try {
      await updateProveedor(proveedor.id_proveedor, formValues);
      MySwal.fire("Actualizado", "Proveedor actualizado correctamente", "success");
      cargarProveedores();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      const mensaje = error.response?.data?.message || "No se pudo actualizar el proveedor";
      MySwal.fire("Error", mensaje, "error");
    }
  };

  return (
    <LayoutDashboard>
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
              onClick={cargarProveedores}
            >
              Actualizar
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
              {proveedores.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={7}>
                    No hay proveedores registrados.
                  </td>
                </tr>
              ) : (
                proveedores.map((proveedor) => (
                  <tr key={proveedor.id_proveedor}>
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

export default ListaProveedores;
