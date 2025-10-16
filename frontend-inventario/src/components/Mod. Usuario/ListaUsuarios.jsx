import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getUsuarios,
  deleteUsuario,
  desactivarUsuarioApi,
  activarUsuarioApi,
  updateUsuario,
} from "../../api/usuarioApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import { useNavigate } from "react-router-dom";

const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
const MySwal = withReactContent(Swal);

function ListaUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles] = useState([
    { id_rol: 1, nombreRol: "Administrador" },
    { id_rol: 2, nombreRol: "Jefe de Inventario" },
    { id_rol: 3, nombreRol: "Operador de Recepción de Mercadería" },
    { id_rol: 4, nombreRol: "Auditor de Inventarios" },
    { id_rol: 5, nombreRol: "Operador de Tienda" }
  ]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getUsuarios(token);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
      });
    }
  };

  const handleEliminar = async (id) => {
    if (usuarioLogueado?.id_u === id) {
      return MySwal.fire(
        "Error",
        "No puedes eliminar tu propia cuenta mientras estás logueado",
        "warning"
      );
    }
    const result = await MySwal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await deleteUsuario(id, token);
        MySwal.fire("Eliminado", "El usuario fue eliminado.", "success");
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        MySwal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleDesactivar = async (id) => {
    if (usuarioLogueado?.id_u === id) {
      return MySwal.fire(
        "Error",
        "No puedes desactivar tu propia cuenta mientras estás logueado",
        "warning"
      );
    }
    const result = await MySwal.fire({
      title: "¿Desactivar usuario?",
      text: "El usuario no podrá iniciar sesión mientras esté desactivado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await desactivarUsuarioApi(id, token);
        MySwal.fire("Desactivado", "El usuario fue desactivado.", "success");
        cargarUsuarios();
      } catch (error) {
        console.error("Error al desactivar usuario:", error);
        MySwal.fire("Error", "No se pudo desactivar el usuario", "error");
      }
    }
  };

  const handleActivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Activar usuario?",
      text: "El usuario podrá iniciar sesión después de activar la cuenta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await activarUsuarioApi(id, token);
        MySwal.fire("Activado", "El usuario fue activado.", "success");
        cargarUsuarios();
      } catch (error) {
        console.error("Error al activar usuario:", error);
        MySwal.fire("Error", "No se pudo activar el usuario", "error");
      }
    }
  };
  const handleEditar = async (usuario) => {
  const { value: formValues } = await MySwal.fire({
    title: "Editar Usuario",
    html:
      `<div class="swal-form">
        <label>Nombre:</label>
        <input id="swal-nombre" class="swal-input" value="${usuario.nombre_u}">
        
        <label>Email:</label>
        <input id="swal-email" class="swal-input" value="${usuario.email}">
        
        <label>Rol:</label>
        <select id="swal-rol" class="swal-input">
          ${roles.map(r => `<option value="${r.id_rol}" ${usuario.rol?.id_rol===r.id_rol ? "selected":""}>${r.nombreRol}</option>`).join("")}
        </select>
      </div>`,
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById("swal-nombre").value.trim();
      const email = document.getElementById("swal-email").value.trim();
      const rolId = parseInt(document.getElementById("swal-rol").value);

      if (!nombre || !email || !rolId) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      return {
        nombre_u: nombre,
        email: email,
        rol: { id_rol: rolId },
      };
    },
  });

  if (formValues) {
    try {
      await updateUsuario(usuario.id_u, formValues);
      if (usuarioLogueado && usuarioLogueado.id_u === usuario.id_u) {
        MySwal.fire("Actualizado", "Tu cuenta ha sido actualizada, para que se reflejen los cambios, por favor cierra sesión y vuelve a iniciar sesión.", "success");
      } else {
        MySwal.fire("Actualizado", `Usuario [${usuario.nombre_u}] actualizado correctamente`, "success");
      }
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      const mensaje =
        error.response?.data?.message || "No se pudo actualizar el usuario";

      MySwal.fire("Error", mensaje, "error");
    }
  }
};

  const getEstadoTexto = (estado) => (estado === 1 ? "Activo" : "Inactivo");

  return (
    <LayoutDashboard>
      <div className="lista-panel-container">
        <div className="lista-panel-header">
          <h2 className="lista-panel-title">Lista de Usuarios</h2>
          <div className="lista-panel-actions">
            <button
              type="button"
              className="lista-panel-back"
              onClick={() => navigate("/dashboard-usuarios")}
            >
              Volver
            </button>
            <button type="button" className="lista-panel-refresh" onClick={cargarUsuarios}>
              Actualizar
            </button>
            <button
              type="button"
              className="lista-panel-nuevo"
              onClick={() => navigate("/usuarios/nuevo")}
            >
              Ingresar Usuario
            </button>
          </div>
        </div>
        <div className="panel-table-wrapper">
          <table className="panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td className="sin-datos" colSpan={7}>
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id_u}>
                    <td>{u.id_u}</td>
                    <td>{u.dni}</td>
                    <td>
                      {u.nombre_u} {u.apellido_pat} {u.apellido_mat}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.rol?.nombreRol}</td>
                    <td>
                      <span className={`estado-chip ${u.estado_u === 1 ? "activo" : "inactivo"}`}>
                        {getEstadoTexto(u.estado_u)}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-columna">
                        <button
                          type="button"
                          className="btn-accion editar"
                          onClick={() => handleEditar(u)}
                        >
                          Editar
                        </button>
                        {u.estado_u === 1 ? (
                          <button
                            type="button"
                            className="btn-accion desactivar"
                            onClick={() => handleDesactivar(u.id_u)}
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-accion activar"
                            onClick={() => handleActivar(u.id_u)}
                          >
                            Activar
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-accion eliminar"
                          onClick={() => handleEliminar(u.id_u)}
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
}

export default ListaUsuarios;
