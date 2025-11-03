import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import {
  getProveedores,
  deleteProveedor,
  updateProveedor,
  activarProveedor,
  desactivarProveedor,
} from "../../api/proveedorApi";
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
const MySwal = withReactContent(Swal);

const ListaProveedores = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }, 
    }),
  };
  const {
		data: proveedoresData,
		isLoading,
		isError,  
		error,
		refetch,   
	} = useQuery({
		queryKey: ["proveedores"],
		queryFn: getProveedores,
	});
  const proveedores = proveedoresData || [];
  const deleteProveedorMutation = useMutation({
		mutationFn: deleteProveedor,
		onSuccess: () => {
			queryClient.invalidateQueries(["proveedores"]);
			MySwal.fire("Eliminado", "El proveedor fue eliminado.", "success");
		},
		onError: (error) => {
			console.error("Error al eliminar proveedor:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo eliminar el proveedor";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const toggleEstadoMutation = useMutation({
		mutationFn: (variables) =>
			variables.activar
				? activarProveedor(variables.id)
				: desactivarProveedor(variables.id),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["proveedores"]);
			const accion = variables.activar ? "Activado" : "Desactivado";
			MySwal.fire(accion, `El proveedor fue ${accion.toLowerCase()}.`, "success");
		},
		onError: (error, variables) => {
			const accion = variables.activar ? "activar" : "desactivar";
			console.error(`Error al ${accion} proveedor:`, error);
			MySwal.fire("Error", `No se pudo ${accion} el proveedor`, "error");
		},
	});
  const updateProveedorMutation = useMutation({
		mutationFn: (variables) => updateProveedor(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["proveedores"]);
			MySwal.fire(
				"Actualizado",
				"Proveedor actualizado correctamente",
				"success"
			);
		},
		onError: (error) => {
			console.error("Error al actualizar proveedor:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo actualizar el proveedor";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleEliminar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar proveedor?",
      text: "Esta acción eliminará al proveedor permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    deleteProveedorMutation.mutate(id);
  };

  const handleDesactivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Desactivar proveedor?",
      text: "El proveedor no podrá interactuar mientras esté desactivado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    toggleEstadoMutation.mutate({ id, activar: false });
  };

  const handleActivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Activar proveedor?",
      text: "El proveedor podrá interactuar después de activar la cuenta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    toggleEstadoMutation.mutate({ id, activar: true });
  };

  const handleEditar = async (proveedor) => {
    const { value: formValues } = await MySwal.fire({
      title: "Editar Proveedor",
      html: `
        <div class="swal-form">
          <label>RUC:</label>
          <input id="swal-ruc" class="swal-input" value="${proveedor.ruc || ""}">

          <label>Razón Social:</label>
          <input id="swal-razon" class="swal-input" value="${proveedor.nombre_proveedor || ""}">

          <label>Teléfono:</label>
          <input id="swal-telefono" class="swal-input" value="${proveedor.telefono || ""}">

          <label>Email:</label>
          <input id="swal-email" class="swal-input" value="${proveedor.email || ""}">

          <label>Dirección:</label>
          <input id="swal-direccion" class="swal-input" value="${proveedor.direccion || ""}">
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const ruc = document.getElementById("swal-ruc").value.trim();
        const nombre_proveedor = document.getElementById("swal-razon").value.trim();
        const telefono = document.getElementById("swal-telefono").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const direccion = document.getElementById("swal-direccion").value.trim();

        if (!ruc || !nombre_proveedor || !telefono || !email || !direccion) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { ruc, nombre_proveedor, telefono, email, direccion };
      },
    });

    if (!formValues) {
      return;
    }
    updateProveedorMutation.mutate({
			id: proveedor.id_proveedor,
			data: formValues,
		});
  };
  const columns = [
    { field: "id_proveedor", headerName: "ID", width: 50 },
    { field: "ruc", headerName: "RUC", width: 120 },
    { field: "nombre_proveedor", headerName: "Razón Social", flex: 1, minWidth: 200 },
    { field: "telefono", headerName: "Teléfono", width: 120 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "direccion", headerName: "Dirección", minWidth: 250, flex: 1.5 },
    /*{
      field: "estado",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={getEstadoTexto(params.value)}
          color={params.value === 1 ? "success" : "default"}
          size="small"
        />
      ),
    },*/ 
    {
      field: "acciones",
      headerName: "Acciones",
      type: "actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="info"
              onClick={() => handleEditar(params.row)} 
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {params.row.estado === 1 ? (
            <Tooltip title="Desactivar">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleDesactivar(params.row.id_proveedor)}
              >
                <HighlightOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleActivar(params.row.id_proveedor)}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleEliminar(params.row.id_proveedor)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <LayoutDashboard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Paper
          sx={{
            m: { xs: 1, sm: 2, md: 3 },
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
              Lista de Proveedores
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/dashboard-proveedores")}
              >
                Volver
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Actualizar"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/proveedores/nuevo")}
              >
                Ingresar Proveedor
              </Button>
            </Stack>
          </Box>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={proveedores}
              columns={columns}
              loading={isLoading}
              
              getRowId={(row) => row.id_proveedor} 
              
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'nombre_proveedor', sort: 'asc' }] }
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              autoHeight
            />
          </Box>
        </Paper>
      </motion.div>
    </LayoutDashboard>
  );
};

export default ListaProveedores;
