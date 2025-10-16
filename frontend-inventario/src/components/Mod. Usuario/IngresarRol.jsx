import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";
import { createRol } from "../../api/rolApi";

const MySwal = withReactContent(Swal);

function IngresarRol() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreRol: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombreRol.trim()) {
      return MySwal.fire("Error", "Completa el nombre del rol", "warning");
    }

    try {
      const payload = {
        nombreRol: formData.nombreRol.trim(),
      };

      await createRol(payload);
      MySwal.fire("Éxito", "Rol registrado correctamente", "success");
      setFormData({ nombreRol: "" });
    } catch (error) {
      console.error("Error al registrar rol:", error);

      if (error.response?.data?.errors) {
        const mensajes = Object.entries(error.response.data.errors)
          .map(([campo, msg]) => `${campo.toUpperCase()}: ${msg}`)
          .join("<br>");

        MySwal.fire({
          icon: "error",
          title: "Errores de validación",
          html: mensajes,
        });
      } else {
        const mensaje = error.response?.data?.message || "No se pudo registrar el rol";
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
          onClick={() => navigate("/roles")}
        >
          Volver
        </button>
        <h2>Registrar Nuevo Rol</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Rol:</label>
            <input
              type="text"
              name="nombreRol"
              value={formData.nombreRol}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-panel-submit">
            Registrar Rol
          </button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default IngresarRol;
