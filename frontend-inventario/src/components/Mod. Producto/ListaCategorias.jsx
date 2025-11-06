import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LayoutDashboard from "../layouts/LayoutDashboard";
import {
  getCategorias,
  deleteCategoria,
  updateCategoria,
} from "../../api/categoriaApi";
import { getAreas } from "../../api/areaApi";
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

const ListaCategorias = () => {
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
		data: categoriasData,
		isLoading: isLoadingCategorias,
		isError: isErrorCategorias,
		error: errorCategorias,
		refetch: refetchCategorias,
	} = useQuery({
		queryKey: ["categorias"],
		queryFn: getCategorias,
	});
	const {
		data: areasData,
		isLoading: isLoadingAreas,
		isError: isErrorAreas,
		error: errorAreas,
		refetch: refetchAreas,
	} = useQuery({
		queryKey: ["areas"],
		queryFn: getAreas,
    initialData: [],
	});
  const isLoading = isLoadingCategorias || isLoadingAreas;
  const isError = isErrorCategorias || isErrorAreas;
  const error = errorCategorias || errorAreas;
  const areas = areasData;
  const categoriasEnriquecidas = useMemo(() => {
    const areasMap = new Map(
      areas.map((area) => [area.id_area, area.nombreArea])
    );

    return (categoriasData || []).map((categoria) => ({
      id: categoria.id_cat,
      ...categoria,
      nombreArea: areasMap.get(categoria.area?.id_area) || "Sin área",
    }));
  }, [categoriasData, areas]);
  const deleteCategoriaMutation = useMutation({
		mutationFn: deleteCategoria,
		onSuccess: () => {
			queryClient.invalidateQueries(["categorias"]);
			MySwal.fire(
				"Eliminado",
				"La categoría fue eliminada correctamente",
				"success"
			);
		},
		onError: (err) => {
			let errorMessage = "No se pudo eliminar la categoría.";
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			}
			console.error("Error al eliminar categoría:", err);
			MySwal.fire("Error", errorMessage, "error");
		},
	});
  const updateCategoriaMutation = useMutation({
		mutationFn: (variables) => updateCategoria(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["categorias"]);
      queryClient.invalidateQueries(["areas"]);
			MySwal.fire(
				"Actualizado",
				"La categoría se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar categoría:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar la categoría";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción eliminará la categoría de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteCategoriaMutation.mutate(id);
  };
  const handleEdit = async (categoria) => {
    const { value: datosActualizados, isConfirmed } = await MySwal.fire({
      title: "Editar Categoría",
      html: `<div class="swal-form">
                <label>Nombre de la Categoría:</label>
                <input id="swal-nombre-categoria" class="swal-input" value="${categoria.nombreCat ?? ""}">
                <label>Área:</label>
                <select id="swal-area" class="swal-input">
                  ${areas
                    .map(
                      (area) =>
                        `<option value="${area.id_area}" ${
                          area.id_area === categoria.area?.id_area ? "selected" : ""
                        }>${area.nombreArea}</option>`
                    )
                    .join("")}
                </select>
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre-categoria").value.trim();
        const areaId = document.getElementById("swal-area").value;

        if (!nombre) {
          Swal.showValidationMessage("El nombre de la categoría es obligatorio");
          return false;
        }
        if (!areaId) {
          Swal.showValidationMessage("Selecciona un área");
          return false;
        }

        return {
          nombreCat: nombre,
          area: { id_area: parseInt(areaId, 10) },
        };
      },
    });

    if (!isConfirmed || !datosActualizados) {
      return;
    }

    updateCategoriaMutation.mutate({
			id: categoria.id_cat,
			data: datosActualizados,
		});
  };
  const handleRefresh = () => {
    refetchCategorias();
    refetchAreas();
  };
  const columns = [
    { 
      field: "id_cat", 
      headerName: "ID", 
      width: 100 
    },
    { 
      field: "nombreCat", 
      headerName: "Nombre Categoría", 
      flex: 1, 
      minWidth: 200 
    },
    {
      field: "nombreArea", 
      headerName: "Área",
      flex: 1,
      minWidth: 200,
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
              onClick={() => handleEdit(params.row)} 
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id_cat)}
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
              Lista de Categorías
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
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Actualizar"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/categorias/nuevo")}
              >
                Nueva Categoría
              </Button>
            </Stack>
          </Box>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={categoriasEnriquecidas}
              columns={columns}
              loading={isLoading}
              
              getRowId={(row) => row.id}
              
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'id_cat', sort: 'asc' }] }
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

export default ListaCategorias;
