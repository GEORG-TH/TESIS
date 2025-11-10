import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, deleteArea, updateArea } from "../../api/areaApi";
import {
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablaLista from "../../components/TablaLista";

const MySwal = withReactContent(Swal);

const AreaList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
		data: areasData,
		isLoading,
		isError,
		error,
		refetch, 
	} = useQuery({
		queryKey: ["areas"],
		queryFn: getAreas,
	});
  const areas = areasData || [];
  const deleteAreaMutation = useMutation({
		mutationFn: deleteArea,
		onSuccess: () => {
			queryClient.invalidateQueries(["areas"]);
			MySwal.fire("Eliminado", "El área fue eliminada correctamente", "success");
		},
		onError: (err) => {
			let errorMessage = "No se pudo eliminar el área.";
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			}
			console.error("Error al eliminar área:", err);
			MySwal.fire("Error", errorMessage, "error");
		},
	});
  const updateAreaMutation = useMutation({
		mutationFn: (variables) => updateArea(variables.id, variables.data),
		onSuccess: () => {
			queryClient.invalidateQueries(["areas"]);
			MySwal.fire(
				"Actualizado",
				"El área se actualizó correctamente",
				"success"
			);
		},
		onError: (err) => {
			console.error("Error al actualizar área:", err);
			const mensaje =
				err.response?.data?.message || "No se pudo actualizar el área";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "¿Eliminar área?",
      text: "Esta acción eliminará el área seleccionada de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    deleteAreaMutation.mutate(id);
  };
  const handleEdit = async (area) => {
    const { value: nombreActualizado, isConfirmed } = await MySwal.fire({
      title: "Editar Área",
      html: `<div class="swal-form">
                <label>Nombre del Área:</label>
                <input id="swal-nombre-area" class="swal-input" value="${area.nombreArea ?? ""}">
             </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre-area").value.trim();
        if (!nombre) {
          Swal.showValidationMessage("El nombre del área es obligatorio");
          return false;
        }
        return nombre;
      },
    });

    if (!isConfirmed || !nombreActualizado) {
      return;
    }

    updateAreaMutation.mutate({
			id: area.id_area,
			data: { nombreArea: nombreActualizado },
		});
  };
  const columns = [
    { 
      field: "id_area", 
      headerName: "ID", 
      width: 100 
    },
    { 
      field: "nombreArea", 
      headerName: "Nombre del Área", 
      flex: 1, 
      minWidth: 250 
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
              onClick={() => handleDelete(params.row.id_area)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  return (
    <TablaLista
      title="Lista de Áreas"
      columns={columns}
      data={areas}
      isLoading={isLoading}
      onRefresh={() => refetch()}
      onAdd={() => navigate("/areas/nuevo")}
      onBack={() => navigate("/dashboard-productos")}
      getRowId={(row) => row.id_area}
      addButtonLabel="Ingresar Nueva Área"
    />
  );
};

export default AreaList;