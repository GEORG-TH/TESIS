import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";

import {
  getProductos,
  deleteProducto,
  updateProducto,
  activarProducto,
  desactivarProducto,
} from "../../api/productoApi";
import { getCategorias } from "../../api/categoriaApi";
import { getProveedores } from "../../api/proveedorApi";
import {
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const MySwal = withReactContent(Swal);

const ListaProductos = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const {
    data: productosData,
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
    error: errorProductos,
    refetch: refetchProductos,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const { data: categoriasData, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    initialData: [],
  });

  const { data: proveedoresData, isLoading: isLoadingProveedores } = useQuery({
    queryKey: ["proveedores"],
    queryFn: getProveedores,
    initialData: [],
  });

  const isLoading =
    isLoadingProductos || isLoadingCategorias || isLoadingProveedores;
  const isError = isErrorProductos ? errorProductos.message : null;
  const productos = productosData || [];
  const categorias = categoriasData || [];
  const proveedores = proveedoresData || [];

  const resolveProductoId = (producto) => producto.id_producto;

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

  const getEstadoTexto = (estado) =>
    (esEstadoActivo(estado) ? "Activo" : "Inactivo");

  const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return "0.00";
    }
    const numero = Number(valor);
    if (Number.isNaN(numero)) {
      return "-";
    }
    return `S/ ${numero.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  const obtenerNombreCategoria = (producto) => {
    const categoriaId =
        producto.categoria?.id_cat || producto.categoria?.id_categoria || producto.id_cat;
    const categoria = categorias.find(
        (cat) => cat.id_cat === categoriaId
    );
    return categoria?.nombreCat || "Sin categoría";
  };
  
  const obtenerNombreProveedor = (producto) => {
    const proveedorId =
        producto.proveedor?.id_proveedor || producto.id_proveedor || producto.proveedorId;
    const proveedor = proveedores.find((prov) => prov.id_proveedor === proveedorId);
    return proveedor?.nombre_proveedor || "Sin proveedor";
  };


  const processedProductos = useMemo(() => {
    if (!productos) return [];

    return productos.map((u) => {
      const estado = u.estado ?? u.estado_producto ?? u.estadoProd;
      const estaActivo = esEstadoActivo(estado);

      return {
        ...u,
        id: resolveProductoId(u), 
        nombreProducto: u.nombre_producto || u.nombreProducto || u.nombre || "-",
        categoriaNombre: obtenerNombreCategoria(u),
        proveedorNombre: obtenerNombreProveedor(u),
        precioVentaFormatted: formatearPrecio(u.precio_venta ?? u.precioVenta),
        precioCompraFormatted: formatearPrecio(u.precio_compra ?? u.precioCompra),
        estadoProducto: estado,
        estaActivo: estaActivo,
      };
    });
  }, [productos, categorias, proveedores]);

  const deleteProductoMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      MySwal.fire("Eliminado", "El producto fue eliminado.", "success");
    },
    onError: (err) => {
      const mensaje = err.response?.data?.message || "No se pudo eliminar el producto";
      MySwal.fire("Error", mensaje, "error");
    }
  });

  const toggleEstadoMutation = useMutation({
    mutationFn: (variables) =>
      variables.activar ? activarProducto(variables.id) : desactivarProducto(variables.id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['productos']);
      const accion = variables.activar ? "Activado" : "Desactivado";
      MySwal.fire(accion, `El producto fue ${accion.toLowerCase()}.`, "success");
    },
    onError: (err, variables) => {
      const accion = variables.activar ? "activar" : "desactivar";
      MySwal.fire("Error", `No se pudo ${accion} el producto`, "error");
    }
  });

  const updateProductoMutation = useMutation({
    mutationFn: (variables) => updateProducto(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      MySwal.fire("Actualizado", "Producto actualizado correctamente", "success");
    },
    onError: (err) => {
      const mensaje = err.response?.data?.message || "No se pudo actualizar el producto";
      MySwal.fire("Error", mensaje, "error");
    }
  });

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
    deleteProductoMutation.mutate(productoId);
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
    toggleEstadoMutation.mutate({ id: productoId, activar: false });
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
    toggleEstadoMutation.mutate({ id: productoId, activar: true });
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
		updateProductoMutation.mutate({ id: productoId, data: formValues });
	};


  const columns = [
	...(isDesktop ? [{ field: "id_producto", headerName: "ID", width: 30 },] : []),
    { field: "sku", headerName: "SKU", width: 90 },
    { field: "codEan", headerName: "EAN", width: 150 },
    { field: "nombreProducto", headerName: "Nombre", flex: 1, minWidth: 110 },
	...(isDesktop ? [{ field: "marca", headerName: "Marca", width: 100 },] : []),
    { field: "categoriaNombre", headerName: "Categoría", width: 150 },
    ...(isDesktop ? [{ field: "uni_medida", headerName: "Unidad", width: 50 },] : []),
    ...(isDesktop ? [{ 
        field: "precioVentaFormatted", 
        headerName: "P.V. (S/)", 
        width: 70,
        align: 'right',
        headerAlign: 'right'
    },
    { 
        field: "precioCompraFormatted", 
        headerName: "P.C. (S/)", 
        width: 70,
        align: 'right',
        headerAlign: 'right'
    }] : []),
    {
      field: "estadoProducto",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={getEstadoTexto(params.row.estadoProducto)}
          color={params.row.estaActivo ? "success" : "default"}
          size="small"
        />
      ),
    },
    { field: "proveedorNombre", headerName: "Proveedor", width: 150 },
    {
      field: "acciones",
      headerName: "Acciones",
      type: "actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const producto = params.row;
        const productoId = producto.id_producto;
        const estaActivo = producto.estaActivo;
        
        return (
          <Stack direction="row" spacing={0.5} justifyContent="center">
            
            <Tooltip title="Editar">
              <IconButton
                size="small"
                color="info"
                onClick={() => handleEditar(producto)} 
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {estaActivo ? (
              <Tooltip title="Desactivar">
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => handleDesactivar(producto)}
                >
                  <HighlightOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Activar">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleActivar(producto)}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleEliminar(producto)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <LayoutDashboard>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        sx={{
          m: { xs: 1, sm: 2, md: 2 },
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Lista de Productos
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard-productos")}
            >
              Volver
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchProductos()}
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/productos/nuevo")}
            >
              Ingresar Producto
            </Button>
          </Stack>
        </Box>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={processedProductos}
            columns={columns}
            loading={isLoading}
            
            getRowId={(row) => row.id} 
            
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ "& .MuiDataGrid-virtualScroller": {
                overflowX: 'auto', 
              },}}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Paper>
    </LayoutDashboard>
  );
};

export default ListaProductos;