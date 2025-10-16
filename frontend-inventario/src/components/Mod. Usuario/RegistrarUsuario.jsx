import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createUsuario } from "../../api/usuarioApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";

const MySwal = withReactContent(Swal);

function RegistrarUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: "",
    nombre_u: "",
    apellido_pat: "",
    apellido_mat: "",
    email: "",
    pass: "",
    id_rol: "",
  });

  const roles = [
    { id_rol: 1, nombreRol: "Administrador" },
    { id_rol: 2, nombreRol: "Jefe de Inventario" },
    { id_rol: 3, nombreRol: "Operador de Recepción de Mercadería" },
    { id_rol: 4, nombreRol: "Auditor de Inventarios" },
    { id_rol: 5, nombreRol: "Operador de Tienda" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dni || !formData.nombre_u || !formData.email || !formData.pass || !formData.id_rol) {
      return MySwal.fire("Error", "Completa todos los campos obligatorios", "warning");
    }

    try {
      const payload = {
        dni: formData.dni,
        nombre_u: formData.nombre_u,
        apellido_pat: formData.apellido_pat,
        apellido_mat: formData.apellido_mat,
        email: formData.email,
        pass: formData.pass,
        estado_u: 1,
        rol: { id_rol: parseInt(formData.id_rol) },
      };

      await createUsuario(payload);

      MySwal.fire("Éxito", "Usuario registrado correctamente", "success");
      setFormData({
        dni: "",
        nombre_u: "",
        apellido_pat: "",
        apellido_mat: "",
        email: "",
        pass: "",
        id_rol: "",
      });
    } catch (error) {
      console.error(error);
        if (error.response?.data?.errors) {
            const errores = error.response.data.errors;
            const mensajes = Object.entries(errores)
            .map(([campo, msg]) => `${campo.toUpperCase()}: ${msg}`)
            .join("<br>");

            MySwal.fire({
            icon: "error",
            title: "Errores de validación",
            html: mensajes, 
            });
        } else {
            const msg = error.response?.data?.message || "No se pudo registrar el usuario";
            MySwal.fire("Error", msg, "error");
        }
    }
  };

  return (
    <LayoutDashboard>
      <div className="form-panel-container">
        <button
          type="button"
          className="form-panel-back"
          onClick={() => navigate("/lista-usuarios")}
        >
          Volver
        </button>
        <h2>Registrar Nuevo Usuario</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>DNI:</label>
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre_u" value={formData.nombre_u} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido Paterno:</label>
            <input type="text" name="apellido_pat" value={formData.apellido_pat} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Apellido Materno:</label>
            <input type="text" name="apellido_mat" value={formData.apellido_mat} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="pass" value={formData.pass} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select name="id_rol" value={formData.id_rol} onChange={handleChange} required>
              <option value="">Seleccione un rol</option>
              {roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombreRol}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-panel-submit">Registrar Usuario</button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default RegistrarUsuario;
