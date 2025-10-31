import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence  } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import "../styles/styleLista.css";
import { getSedes, deleteSede, updateSede } from "../../api/sedeApi";
import {
  Paper,
  Box,
  Typography,
  Button,
  Stack,
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

const MySwal = withReactContent(Swal);

const ListaSedes = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: sedesData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["sedes"],
		queryFn: getSedes,
	});
	const sedes = sedesData || [];
	const deleteSedeMutation = useMutation({
		mutationFn: deleteSede,
		onSuccess: () => {
			queryClient.invalidateQueries(["sedes"]);
			MySwal.fire("Eliminado", "La sede fue eliminada correctamente", "success");
		},
		onError: (err) => {
			console.error("Error al eliminar sede:", err);
			const mensaje = err.response?.data?.message || "No se pudo eliminar la sede";
			MySwal.fire("Error", mensaje, "error");
		},
	});
	const updateSedeMutation = useMutation({
		mutationFn: (variables) => updateSede(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["sedes"]);
			MySwal.fire(
				"Actualizado",
				"La sede se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar sede:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar la sede";
			MySwal.fire("Error", mensaje, "error");
		},
	});
	const handleEliminar = async (id) => {
		const resultado = await MySwal.fire({
			title: "¿Eliminar sede?",
			text: "Esta acción eliminará la sede seleccionada.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
			reverseButtons: true,
		});

		if (!resultado.isConfirmed) {
			return;
		}
		deleteSedeMutation.mutate(id);
	};

	const handleEditar = async (sede) => {
		const { value: datosActualizados } = await MySwal.fire({
			title: "Editar Sede",
			html: `
				<div class="swal-form">
					<label>Nombre de la Sede:</label>
					<input id="swal-nombre-sede" class="swal-input" value="${sede.nombreSede ?? ""}">

					<label>Dirección:</label>
					<input id="swal-direccion" class="swal-input" value="${sede.direccion ?? ""}">

					<label>Anexo:</label>
					<input id="swal-anexo" class="swal-input" value="${sede.anexo ?? ""}">
				</div>
			`,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: "Guardar",
			cancelButtonText: "Cancelar",
			preConfirm: () => {
				const nombre = document.getElementById("swal-nombre-sede").value.trim();
				const direccion = document.getElementById("swal-direccion").value.trim();
				const anexo = document.getElementById("swal-anexo").value.trim();

				if (!nombre || !direccion || !anexo) {
					Swal.showValidationMessage("Todos los campos son obligatorios");
					return false;
				}

				return {
					nombreSede: nombre,
					direccion,
					anexo,
				};
			},
		});

		if (!datosActualizados) {
			return;
		}
		updateSedeMutation.mutate({ id: sede.idSede, data: datosActualizados });
	};
	const columns = [
		{ 
		field: "idSede", 
		headerName: "ID", 
		width: 80 
		},
		{ 
		field: "nombreSede", 
		headerName: "Sede", 
		minWidth: 200,
		flex: 1 
		},
		{
		field: "direccion", 
		headerName: "Dirección", 
		minWidth: 250,
		flex: 1
		},
		{ 
		field: "anexo", 
		headerName: "Anexo", 
		width: 120 
		},
		{
		field: "acciones",
		headerName: "Acciones",
		type: "actions",
		width: 100,
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
			<Tooltip title="Eliminar">
				<IconButton
				size="small"
				color="error"
				onClick={() => handleEliminar(params.row.idSede)}
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
              Lista de Sedes
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/dashboard-sedes")}
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
                onClick={() => navigate("/sedes/nuevo")}
              >
                Nueva Sede
              </Button>
            </Stack>
          </Box>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={sedes}
              columns={columns}
              loading={isLoading}
              
              getRowId={(row) => row.idSede}
              
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'idSede', sort: 'asc' }] }
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              autoHeight
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              
            />
          </Box>
        </Paper>
      </motion.div>
    </LayoutDashboard>
	);
};

export default ListaSedes;
