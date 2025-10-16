import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleRegistrar.css";
import { createProducto } from "../../api/productoApi";
import { getCategorias } from "../../api/categoriaApi";
import { getProveedores } from "../../api/proveedorApi";
import { getAreas } from "../../api/areaApi";

const MySwal = withReactContent(Swal);

const IngresarProducto = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		sku: "",
		ean: "",
		nombre_producto: "",
		marca: "",
		uni_medida: "",
		precio_venta: "",
		precio_compra: "",
		id_area: "",
		id_cat: "",
		id_proveedor: "",
	});
	const [categorias, setCategorias] = useState([]);
	const [areas, setAreas] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [cargandoTablas, setCargandoTablas] = useState(true);

	useEffect(() => {
		const cargarListas = async () => {
			try {
				const [areasRes, categoriasRes, proveedoresRes] = await Promise.all([
					getAreas(),
					getCategorias(),
					getProveedores(),
				]);

				setAreas(areasRes.data || []);
				setCategorias(categoriasRes.data || []);
				setProveedores(proveedoresRes.data || []);
			} catch (error) {
				console.error("Error al cargar datos auxiliares:", error);
				MySwal.fire(
					"Error",
					"No se pudieron cargar categorías y proveedores. Intenta nuevamente.",
					"error"
				);
			} finally {
				setCargandoTablas(false);
			}
		};

		cargarListas();
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const camposRequeridos = [
			formData.sku,
			formData.ean,
			formData.nombre_producto,
			formData.marca,
			formData.uni_medida,
			formData.precio_venta,
			formData.precio_compra,
			formData.id_area,
			formData.id_cat,
			formData.id_proveedor,
		];

		if (camposRequeridos.some((campo) => !campo)) {
			MySwal.fire("Error", "Completa todos los campos obligatorios", "warning");
			return;
		}

		const precioVenta = parseFloat(formData.precio_venta);
		const precioCompra = parseFloat(formData.precio_compra);

		if (Number.isNaN(precioVenta) || Number.isNaN(precioCompra)) {
			MySwal.fire("Error", "Los precios deben ser números válidos", "warning");
			return;
		}

		const payload = {
			sku: formData.sku,
			ean: formData.ean,
			codEan: formData.ean,
			nombre_producto: formData.nombre_producto,
			nombre: formData.nombre_producto,
			marca: formData.marca,
			uni_medida: formData.uni_medida,
			precio_venta: precioVenta,
			precio_compra: precioCompra,
			estado: true,
			categoria: { id_cat: parseInt(formData.id_cat, 10) },
			proveedor: { id_proveedor: parseInt(formData.id_proveedor, 10) },
		};

		try {
			await createProducto(payload);
			MySwal.fire("Éxito", "Producto registrado correctamente", "success");
			setFormData({
				sku: "",
				ean: "",
				nombre_producto: "",
				marca: "",
				uni_medida: "",
				precio_venta: "",
				precio_compra: "",
				id_area: "",
				id_cat: "",
				id_proveedor: "",
			});
		} catch (error) {
			console.error("Error al registrar producto:", error);
			if (error.response?.data?.errors) {
				const mensajes = Object.entries(error.response.data.errors)
					.map(([campo, mensaje]) => `${campo.toUpperCase()}: ${mensaje}`)
					.join("<br>");

				MySwal.fire({
					icon: "error",
					title: "Errores de validación",
					html: mensajes,
				});
			} else {
				const mensaje =
					error.response?.data?.message || "No se pudo registrar el producto";
				MySwal.fire("Error", mensaje, "error");
			}
		}
	};

	const categoriasFiltradas = () => {
		if (!formData.id_area) {
			return [];
		}
		const areaId = parseInt(formData.id_area, 10);
		return categorias.filter((categoria) => {
			const categoriaAreaRaw =
				categoria.area?.id_area ??
				categoria.id_area ??
				categoria.area_id ??
				categoria.areaId ??
				categoria.area;
			const categoriaAreaId = Number(categoriaAreaRaw);
			return !Number.isNaN(categoriaAreaId) && categoriaAreaId === areaId;
		});
	};

	const categoriasDisponibles = categoriasFiltradas();

	return (
		<LayoutDashboard>
			<div className="form-panel-container">
				<button
					type="button"
					className="form-panel-back"
					onClick={() => navigate("/lista-productos")}
				>
					Volver
				</button>
				<h2>Registrar Nuevo Producto</h2>
				<form className="form-panel" onSubmit={handleSubmit}>
					<div className="form-group">
						<label>SKU:</label>
						<input
							type="text"
							name="sku"
							value={formData.sku}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>EAN:</label>
						<input
							type="text"
							name="ean"
							value={formData.ean}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Nombre:</label>
						<input
							type="text"
							name="nombre_producto"
							value={formData.nombre_producto}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Marca:</label>
						<input
							type="text"
							name="marca"
							value={formData.marca}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Unidad de Medida:</label>
						<input
							type="text"
							name="uni_medida"
							value={formData.uni_medida}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Precio Venta:</label>
						<input
							type="number"
							min="0"
							step="0.01"
							name="precio_venta"
							value={formData.precio_venta}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Precio Compra:</label>
						<input
							type="number"
							min="0"
							step="0.01"
							name="precio_compra"
							value={formData.precio_compra}
							onChange={handleChange}
							required
						/>
					</div>

                    <div className="form-group">
						<label>Área:</label>
						<select
							name="id_area"
							value={formData.id_area}
							onChange={(event) => {
								const { value } = event.target;
								setFormData((prev) => ({ ...prev, id_area: value, id_cat: "" }));
							}}
							disabled={cargandoTablas || areas.length === 0}
							required
						>
							<option value="">Seleccione un área</option>
							{areas.map((area) => (
								<option key={area.id_area} value={area.id_area}>
									{area.nombreArea}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Categoría:</label>
						<select
							name="id_cat"
							value={formData.id_cat}
							onChange={handleChange}
							disabled={
								cargandoTablas || !formData.id_area || categoriasDisponibles.length === 0
							}
							required
						>
							<option value="">
								{!formData.id_area
									? "Seleccione un área primero"
									: categoriasDisponibles.length === 0
									? "Sin categorías disponibles"
									: "Seleccione una categoría"}
							</option>
							{categoriasDisponibles.map((categoria) => (
								<option key={categoria.id_cat || categoria.id_categoria} value={categoria.id_cat || categoria.id_categoria}>
									{categoria.nombreCat || categoria.nombre_categoria}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label>Proveedor:</label>
						<select
							name="id_proveedor"
							value={formData.id_proveedor}
							onChange={handleChange}
							disabled={cargandoTablas || proveedores.length === 0}
							required
						>
							<option value="">Seleccione un proveedor</option>
							{proveedores.map((proveedor) => (
								<option key={proveedor.id_proveedor || proveedor.id} value={proveedor.id_proveedor || proveedor.id}>
									{proveedor.nombre_proveedor || proveedor.nombre}
								</option>
							))}
						</select>
					</div>

					<button type="submit" className="form-panel-submit" disabled={cargandoTablas}>
						Registrar Producto
					</button>
				</form>
			</div>
		</LayoutDashboard>
	);
};

export default IngresarProducto;
