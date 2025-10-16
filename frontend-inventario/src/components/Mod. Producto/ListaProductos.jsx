import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import "../styles/listaProductos.css";
import {
	getProductos,
	deleteProducto,
	updateProducto,
	activarProducto,
	desactivarProducto,
} from "../../api/productoApi";
import { getCategorias } from "../../api/categoriaApi";
import { getProveedores } from "../../api/proveedorApi";

const MySwal = withReactContent(Swal);

const ListaProductos = () => {
	const navigate = useNavigate();
	const [productos, setProductos] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		cargarDatos();
	}, []);

	const cargarDatos = async () => {
		try {
			setLoading(true);
			setError(null);
			const [productosRes, categoriasRes, proveedoresRes] = await Promise.all([
				getProductos(),
				getCategorias(),
				getProveedores(),
			]);

			setProductos(productosRes.data || []);
			setCategorias(categoriasRes.data || []);
			setProveedores(proveedoresRes.data || []);
		} catch (err) {
			console.error("Error al cargar productos:", err);
			setError("No se pudieron cargar los productos. Intente más tarde.");
		} finally {
			setLoading(false);
		}
	};

	const obtenerNombreCategoria = (producto) => {
		if (producto.categoria?.nombreCat) {
			return producto.categoria.nombreCat;
		}
		const categoriaId =
			producto.categoria?.id_cat || producto.categoria?.id_categoria || producto.id_cat;
		const categoria = categorias.find(
			(cat) => cat.id_cat === categoriaId || cat.id_categoria === categoriaId
		);
		return categoria?.nombreCat || "Sin categoría";
	};

	const obtenerNombreProveedor = (producto) => {
		if (producto.proveedor?.nombre_proveedor) {
			return producto.proveedor.nombre_proveedor;
		}
		const proveedorId =
			producto.proveedor?.id_proveedor || producto.id_proveedor || producto.proveedorId;
		const proveedor = proveedores.find((prov) => prov.id_proveedor === proveedorId || prov.id === proveedorId);
		return proveedor?.nombre_proveedor || "Sin proveedor";
	};

	const resolveProductoId = (producto) => producto.id_producto;

	const handleEliminar = async (producto) => {
		const productoId = resolveProductoId(producto);
		if (!productoId) {
			MySwal.fire("Error", "No se pudo determinar el producto a eliminar", "error");
			return;
		}

		const result = await MySwal.fire({
			title: "¿Eliminar producto?",
			text: "Esta acción eliminará el producto permanentemente.",
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
			await deleteProducto(productoId);
			setProductos((prev) => prev.filter((item) => resolveProductoId(item) !== productoId));
			MySwal.fire("Eliminado", "El producto fue eliminado.", "success");
		} catch (err) {
			console.error("Error al eliminar producto:", err);
			const mensaje = err.response?.data?.message || "No se pudo eliminar el producto";
			MySwal.fire("Error", mensaje, "error");
		}
	};

	const handleDesactivar = async (producto) => {
		const productoId = resolveProductoId(producto);
		if (!productoId) {
			MySwal.fire("Error", "No se pudo determinar el producto a desactivar", "error");
			return;
		}

		const result = await MySwal.fire({
			title: "¿Desactivar producto?",
			text: "El producto no estará disponible mientras esté desactivado.",
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
			await desactivarProducto(productoId);
			MySwal.fire("Desactivado", "El producto fue desactivado.", "success");
			cargarDatos();
		} catch (err) {
			console.error("Error al desactivar producto:", err);
			MySwal.fire("Error", "No se pudo desactivar el producto", "error");
		}
	};

	const handleActivar = async (producto) => {
		const productoId = resolveProductoId(producto);
		if (!productoId) {
			MySwal.fire("Error", "No se pudo determinar el producto a activar", "error");
			return;
		}

		const result = await MySwal.fire({
			title: "¿Activar producto?",
			text: "El producto volverá a estar disponible tras la activación.",
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
			await activarProducto(productoId);
			MySwal.fire("Activado", "El producto fue activado.", "success");
			cargarDatos();
		} catch (err) {
			console.error("Error al activar producto:", err);
			MySwal.fire("Error", "No se pudo activar el producto", "error");
		}
	};

	const handleEditar = async (producto) => {
		const productoId = resolveProductoId(producto);
		if (!productoId) {
			MySwal.fire("Error", "No se pudo determinar el producto a editar", "error");
			return;
		}

		const categoriaActualId = producto.categoria?.id_cat || "";
		const proveedorActualId = producto.proveedor?.id_proveedor || "";

		const { value: formValues } = await MySwal.fire({
			title: "Editar Producto",
			html: `
				<div class="swal-form">
					<label>SKU:</label>
					<input id="swal-sku" class="swal-input" value="${producto.sku ?? ""}">

					<label>EAN:</label>
					<input id="swal-ean" class="swal-input" value="${producto.codEan ?? ""}">

					<label>Nombre:</label>
					<input id="swal-nombre" class="swal-input" value="${
						producto.nombre || ""
					}">

					<label>Marca:</label>
					<input id="swal-marca" class="swal-input" value="${producto.marca ?? ""}">

					<label>Unidad de Medida:</label>
					<input id="swal-uni-medida" class="swal-input" value="${
						producto.uni_medida || ""
					}">

					<label>Precio Venta:</label>
					<input id="swal-precio-venta" type="number" min="0" step="0.01" class="swal-input" value="${
						producto.precio_venta ?? ""
					}">

					<label>Precio Compra:</label>
					<input id="swal-precio-compra" type="number" min="0" step="0.01" class="swal-input" value="${
						producto.precio_compra ?? ""
					}">

					<label>Categoría:</label>
					<select id="swal-categoria" class="swal-input">
						${categorias
							.map(
								(cat) => `
									<option value="${cat.id_cat}" ${
									String(cat.id_cat) === String(categoriaActualId) ? "selected" : ""
								}>
										${cat.nombreCat || "Sin nombre"}
									</option>
								`
							)
							.join("")}
					</select>

					<label>Proveedor:</label>
					<select id="swal-proveedor" class="swal-input">
						${proveedores
							.map(
								(prov) => `
									<option value="${prov.id_proveedor}" ${
									String(prov.id_proveedor) === String(proveedorActualId) ? "selected" : ""
								}>
										${prov.nombre_proveedor || "Sin nombre"}
									</option>
								`
							)
							.join("")}
					</select>
				</div>
			`,
			focusConfirm: false,
			preConfirm: () => {
				const sku = document.getElementById("swal-sku").value.trim();
				const codEan = document.getElementById("swal-ean").value.trim();
				const nombre = document.getElementById("swal-nombre").value.trim();
				const marca = document.getElementById("swal-marca").value.trim();
				const uni_medida = document.getElementById("swal-uni-medida").value.trim();
				const precio_venta = parseFloat(document.getElementById("swal-precio-venta").value);
				const precio_compra = parseFloat(document.getElementById("swal-precio-compra").value);
				const categoriaId = document.getElementById("swal-categoria").value;
				const proveedorId = document.getElementById("swal-proveedor").value;

				if (!sku || !codEan || !nombre || !marca || !uni_medida) {
					Swal.showValidationMessage("Todos los campos son obligatorios");
					return false;
				}
				if (Number.isNaN(precio_venta) || Number.isNaN(precio_compra)) {
					Swal.showValidationMessage("Los precios deben ser números válidos");
					return false;
				}
				if (!categoriaId || !proveedorId) {
					Swal.showValidationMessage("Selecciona categoría y proveedor");
					return false;
				}

				return {
					sku,
					codEan,
					nombre: nombre,
					marca,
					uni_medida: uni_medida,
					precio_venta: precio_venta,
					precio_compra: precio_compra,
					categoria: { id_cat: parseInt(categoriaId, 10) },
					proveedor: { id_proveedor: parseInt(proveedorId, 10) },
				};
			},
		});

		if (!formValues) {
			return;
		}

		try {
			await updateProducto(productoId, formValues);
			MySwal.fire("Actualizado", "Producto actualizado correctamente", "success");
			cargarDatos();
		} catch (err) {
			console.error("Error al actualizar producto:", err);
			const mensaje = err.response?.data?.message || "No se pudo actualizar el producto";
			MySwal.fire("Error", mensaje, "error");
		}
	};

	const esEstadoActivo = (estado) => {
		if (typeof estado === "string") {
			const normalizado = estado.trim().toLowerCase();
			return normalizado === "1" || normalizado === "true" || normalizado === "activo";
		}
		if (typeof estado === "number") {
			return estado === 1;
		}
		return Boolean(estado);
	};

	const getEstadoTexto = (estado) => (esEstadoActivo(estado) ? "Activo" : "Inactivo");

	const formatearPrecio = (valor) => {
		if (valor === null || valor === undefined || valor === "") {
			return "-";
		}
		const numero = Number(valor);
		if (Number.isNaN(numero)) {
			return valor;
		}
		return numero.toLocaleString("es-PE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<LayoutDashboard>
			<div className="lista-panel-container productos-panel">
				<div className="lista-panel-header">
					<h2 className="lista-panel-title">Lista de Productos</h2>
					<div className="lista-panel-actions">
						<button
							type="button"
							className="lista-panel-back"
							onClick={() => navigate("/dashboard-productos")}
						>
							Volver
						</button>
						<button
							type="button"
							className="lista-panel-refresh"
							onClick={cargarDatos}
							disabled={loading}
						>
							{loading ? "Actualizando..." : "Actualizar"}
						</button>
						<button
							type="button"
							className="lista-panel-nuevo"
							onClick={() => navigate("/productos/nuevo")}
						>
							Ingresar Producto
						</button>
					</div>
				</div>

				<div className="panel-table-wrapper">
					<table className="panel-table productos-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>SKU</th>
								<th>EAN</th>
								<th>Nombre</th>
								<th>Marca</th>
								<th>Categoría</th>
								<th>Uni_medida</th>
								<th>Precio Venta</th>
								<th>Precio Compra</th>
								<th>Estado</th>
								<th>Proveedor</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td className="sin-datos" colSpan={12}>
										Cargando productos...
									</td>
								</tr>
							) : error ? (
								<tr>
									<td className="sin-datos" colSpan={12}>
										{error}
									</td>
								</tr>
							) : productos.length === 0 ? (
								<tr>
									<td className="sin-datos" colSpan={12}>
										No hay productos registrados.
									</td>
								</tr>
							) : (
								productos.map((producto) => {
									const productoId = resolveProductoId(producto);
									const estado = producto.estado ?? producto.estado_producto ?? producto.estadoProd;
									const estaActivo = esEstadoActivo(estado);
									return (
										<tr key={productoId}>
											<td>{productoId}</td>
											<td>{producto.sku || "-"}</td>
											<td>{producto.codEan || "-"}</td>
											<td>{producto.nombre_producto || producto.nombreProducto || producto.nombre || "-"}</td>
											<td>{producto.marca || "-"}</td>
											<td>{obtenerNombreCategoria(producto)}</td>
											<td>{producto.uni_medida || producto.unidad_medida || "-"}</td>
											<td>{formatearPrecio(producto.precio_venta ?? producto.precioVenta)}</td>
											<td>{formatearPrecio(producto.precio_compra ?? producto.precioCompra)}</td>
											<td>
												<span className={`estado-chip ${estaActivo ? "activo" : "inactivo"}`}>
													{getEstadoTexto(estado)}
												</span>
											</td>
											<td>{obtenerNombreProveedor(producto)}</td>
											<td>
												<div className="acciones-columna">
													<button
														type="button"
														className="btn-accion editar"
														onClick={() => handleEditar(producto)}
													>
														Editar
													</button>
													{estaActivo ? (
														<button
															type="button"
															className="btn-accion desactivar"
															onClick={() => handleDesactivar(producto)}
														>
															Desactivar
														</button>
													) : (
														<button
															type="button"
															className="btn-accion activar"
															onClick={() => handleActivar(producto)}
														>
															Activar
														</button>
													)}
													<button
														type="button"
														className="btn-accion eliminar"
														onClick={() => handleEliminar(producto)}
													>
														Eliminar
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</LayoutDashboard>
	);
};

export default ListaProductos;
