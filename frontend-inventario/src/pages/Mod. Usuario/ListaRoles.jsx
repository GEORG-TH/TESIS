import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, deleteRol, updateRol } from "../../api/rolApi";
import {
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablaLista from "../../components/TablaLista";

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
      minWidth: 150 
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
    <TablaLista
      title="Lista de Roles"
      data={roles}
      columns={columns}
      isLoading={isLoading}
      getRowId={(row) => row.id_rol}
      onRefresh={refetch}
      onBack={() => navigate("/dashboard-usuarios")}
      onAdd={() => navigate("/roles/nuevo")}
      addButtonLabel="Ingresar Rol"
    />
  );
}

export default ListaRoles;
