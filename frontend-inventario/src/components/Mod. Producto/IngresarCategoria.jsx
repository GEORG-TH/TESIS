import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";
import { createCategoria } from "../../api/categoriaApi";
import { getAreas } from "../../api/areaApi";

const MySwal = withReactContent(Swal);

function IngresarCategoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCat: "",
    id_area: "",
  });
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        setLoadingAreas(true);
        const response = await getAreas();
        setAreas(response.data || []);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        MySwal.fire("Error", "No se pudieron cargar las áreas", "error");
      } finally {
        setLoadingAreas(false);
      }
    };

    cargarAreas();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombreCat.trim() || !formData.id_area) {
      return MySwal.fire("Error", "Completa el nombre y selecciona un área", "warning");
    }

    try {
      const payload = {
        nombreCat: formData.nombreCat.trim(),
        area: { id_area: parseInt(formData.id_area, 10) },
      };

      await createCategoria(payload);
      MySwal.fire("Éxito", "Categoría registrada correctamente", "success");
      setFormData({ nombreCat: "", id_area: "" });
    } catch (error) {
      console.error("Error al registrar categoría:", error);

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
        const mensaje = error.response?.data?.message || "No se pudo registrar la categoría";
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
          onClick={() => navigate("/lista-categorias")}
        >
          Volver
        </button>
        <h2>Registrar Nueva Categoría</h2>
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Categoría:</label>
            <input
              type="text"
              name="nombreCat"
              value={formData.nombreCat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Área:</label>
            <select
              name="id_area"
              value={formData.id_area}
              onChange={handleChange}
              required
              disabled={loadingAreas || areas.length === 0}
            >
              <option value="">{loadingAreas ? "Cargando áreas..." : "Seleccione un área"}</option>
              {areas.map((area) => (
                <option key={area.id_area} value={area.id_area}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-panel-submit">
            Registrar Categoría
          </button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default IngresarCategoria;
