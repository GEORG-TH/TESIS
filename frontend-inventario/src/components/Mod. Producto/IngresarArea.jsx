import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createArea } from "../../api/areaApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";

const MySwal = withReactContent(Swal);

function IngresarArea() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombreArea: "",
	});

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.nombreArea.trim()) {
			return MySwal.fire("Error", "Completa el nombre del área", "warning");
		}

		try {
			const payload = {
				nombreArea: formData.nombreArea.trim(),
			};

			await createArea(payload);
			MySwal.fire("Éxito", "Área registrada correctamente", "success");
			setFormData({ nombreArea: "" });
		} catch (error) {
			console.error("Error al registrar área:", error);

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
				const mensaje = error.response?.data?.message || "No se pudo registrar el área";
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
					onClick={() => navigate("/lista-areas")}
				>
					Volver
				</button>
				<h2>Registrar Nueva Área</h2>
				<form className="form-panel" onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nombre del Área:</label>
						<input
							type="text"
							name="nombreArea"
							value={formData.nombreArea}
							onChange={handleChange}
							required
						/>
					</div>

					<button type="submit" className="form-panel-submit">
						Registrar Área
					</button>
				</form>
			</div>
		</LayoutDashboard>
	);
}

export default IngresarArea;
