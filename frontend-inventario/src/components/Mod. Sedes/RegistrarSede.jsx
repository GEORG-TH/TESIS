import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createSede } from "../../api/sedeApi";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";

const MySwal = withReactContent(Swal);

const RegistrarSede = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombreSede: "",
		direccion: "",
		anexo: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.nombreSede || !formData.direccion || !formData.anexo) {
			MySwal.fire("Error", "Completa todos los campos obligatorios", "warning");
			return;
		}

		try {
			const payload = {
				nombreSede: formData.nombreSede,
				direccion: formData.direccion,
				anexo: formData.anexo,
			};

			await createSede(payload);

			MySwal.fire("Éxito", "Sede registrada correctamente", "success");
			setFormData({ nombreSede: "", direccion: "", anexo: "" });
		} catch (error) {
			console.error("Error al registrar la sede:", error);

			if (error.response?.data?.errors) {
				const errores = error.response.data.errors;
				const mensajes = Object.entries(errores)
					.map(([campo, mensaje]) => `${campo.toUpperCase()}: ${mensaje}`)
					.join("<br>");

				MySwal.fire({
					icon: "error",
					title: "Errores de validación",
					html: mensajes,
				});
			} else {
				const mensaje = error.response?.data?.message || "No se pudo registrar la sede";
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
					onClick={() => navigate("/lista-sedes")}
				>
					Volver
				</button>
				<h2>Registrar Nueva Sede</h2>
				<form className="form-panel" onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nombre de la Sede:</label>
						<input
							type="text"
							name="nombreSede"
							value={formData.nombreSede}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Dirección:</label>
						<input
							type="text"
							name="direccion"
							value={formData.direccion}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Anexo:</label>
						<input
							type="text"
							name="anexo"
							value={formData.anexo}
							onChange={handleChange}
							required
						/>
					</div>

					<button type="submit" className="form-panel-submit">
						Registrar Sede
					</button>
				</form>
			</div>
		</LayoutDashboard>
	);
};

export default RegistrarSede;
