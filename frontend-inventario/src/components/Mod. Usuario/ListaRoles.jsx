import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import { getRoles, deleteRol, updateRol } from "../../api/rolApi";
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

function ListaRoles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
		data: rolesData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["roles"],
		queryFn: getRoles,
	});
  const roles = rolesData || [];
  const deleteRolMutation = useMutation({
		mutationFn: deleteRol,
		onSuccess: () => {
			queryClient.invalidateQueries(["roles"]);
			MySwal.fire("Eliminado", "El rol fue eliminado correctamente.", "success");
		},
		onError: (error) => {
			console.error("Error al eliminar rol:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo eliminar el rol.";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const updateRolMutation = useMutation({
		mutationFn: (variables) => updateRol(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["roles"]);
			MySwal.fire(
				"Actualizado",
				"El rol fue actualizado correctamente.",
				"success"
			);
		},
		onError: (error) => {
			console.error("Error al actualizar rol:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo actualizar el rol.";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleEliminar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción eliminará el rol permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }
    deleteRolMutation.mutate(id);
  };

  const handleEditar = async (rol) => {
    const { value: formValues, isConfirmed } = await MySwal.fire({
      title: "Editar Rol",
      html: `<div class="swal-form">
                <label>Nombre del Rol:</label>
                <input id="swal-nombre" class="swal-input" value="${rol.nombreRol ?? ""}">
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value.trim();
        if (!nombre) {
          Swal.showValidationMessage("El nombre del rol es obligatorio");
          return false;
        }
        return { nombreRol: nombre };
      },
    });
    if (!isConfirmed || !formValues) {
      return;
    }
    updateRolMutation.mutate({ id: rol.id_rol, data: formValues });
  };
  const columns = [
    { 
      field: "id_rol", 
      headerName: "ID", 
      width: 70 
    },
    { 
      field: "nombreRol", 
      headerName: "Nombre del Rol", 
      flex: 1, 
      minWidth: 300 
    },
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
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleEliminar(params.row.id_rol)}
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
              Lista de Roles
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/dashboard-usuarios")}
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
                onClick={() => navigate("/roles/nuevo")}
              >
                Nuevo Rol
              </Button>
            </Stack>
          </Box>

          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={roles}
              columns={columns} 
              loading={isLoading} 
              
              getRowId={(row) => row.id_rol}
              
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'id_rol', sort: 'asc' }] }
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>
        </Paper>
      </motion.div>
    </LayoutDashboard>
  );
}

export default ListaRoles;
