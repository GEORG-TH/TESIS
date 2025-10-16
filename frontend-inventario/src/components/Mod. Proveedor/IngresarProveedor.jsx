import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";
import { createProveedor } from "../../api/proveedorApi";

const MySwal = withReactContent(Swal);

function IngresarProveedor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ruc: "",
    nombre_proveedor: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.ruc || !formData.nombre_proveedor || !formData.telefono || !formData.email || !formData.direccion) {
      return MySwal.fire("Error", "Completa todos los campos obligatorios", "warning");
    }

    try {
      const payload = {
        ruc: formData.ruc,
        nombre_proveedor: formData.nombre_proveedor,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        estado: 1,
      };

      await createProveedor(payload);

      MySwal.fire("Éxito", "Proveedor registrado correctamente", "success");
      setFormData({
        ruc: "",
        nombre_proveedor: "",
        telefono: "",
        email: "",
        direccion: "",
      });
    } catch (error) {
      console.error("Error al registrar proveedor:", error);
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
        const mensaje = error.response?.data?.message || "No se pudo registrar el proveedor";
        MySwal.fire("Error", mensaje, "error");
      }
    }
  };

  return (
    <LayoutDashboard>
      <div className="form-panel-container">
        <button
          type="button"
          className="form-panel-back"
          onClick={() => navigate("/lista-proveedores")}
        >
          Volver
        </button>
        <h2>Registrar Nuevo Proveedor</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RUC:</label>
            <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Razón Social:</label>
            <input
              type="text"
              name="nombre_proveedor"
              value={formData.nombre_proveedor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Dirección:</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>

          <button type="submit" className="form-panel-submit">Registrar Proveedor</button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default IngresarProveedor;
