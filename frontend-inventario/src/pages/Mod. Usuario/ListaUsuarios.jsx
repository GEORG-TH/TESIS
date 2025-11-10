import { useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import {
  getUsuarios,
  deleteUsuario,
  desactivarUsuarioApi,
  activarUsuarioApi,
  updateUsuario,
} from "../../api/usuarioApi";
import {
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useGlobalStore } from "../../store/useGlobalStore";
import { getRoles } from "../../api/rolApi";
import TablaLista from "../../components/TablaLista";

const MySwal = withReactContent(Swal);
function ListaUsuarios() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const usuarioLogueado = useGlobalStore((state) => state.user);
  const {
		data: usuariosData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["usuarios"], 
		queryFn: getUsuarios,
	});
  const { 
      data: rolesData, 
      isLoading: isLoadingRoles 
    } = useQuery({
      queryKey: ['roles'], 
      queryFn: getRoles
    });
  const roles = rolesData || [];
  const processedUsuarios = useMemo(() => {
    if (!usuariosData) {
      return [];
    }
    return usuariosData.map((u) => ({
      ...u,
      nombreCompleto: `${u.nombre_u || ""} ${u.apellido_pat || ""} ${
        u.apellido_mat || ""
      }`.trim(),
      rolNombre: u.rol?.nombreRol || "N/A",
    }));
  }, [usuariosData]);
  const deleteUsuarioMutation = useMutation({
		mutationFn: deleteUsuario, 
		onSuccess: () => {
			queryClient.invalidateQueries(["usuarios"]);
			MySwal.fire("Eliminado", "El usuario fue eliminado.", "success");
		},
		onError: (error) => {
			console.error("Error al eliminar usuario:", error);
			MySwal.fire("Error", "No se pudo eliminar el usuario", "error");
		},
	});
  const toggleEstadoMutation = useMutation({
		mutationFn: (variables) =>
			variables.activar
				? activarUsuarioApi(variables.id)
				: desactivarUsuarioApi(variables.id),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["usuarios"]);
			const accion = variables.activar ? "Activado" : "Desactivado";
			MySwal.fire(accion, `El usuario fue ${accion.toLowerCase()}.`, "success");
		},
		onError: (error, variables) => {
			const accion = variables.activar ? "activar" : "desactivar";
			console.error(`Error al ${accion} usuario:`, error);
			MySwal.fire("Error", `No se pudo ${accion} el usuario`, "error");
		},
	});
  const updateUsuarioMutation = useMutation({
		mutationFn: (variables) => updateUsuario(variables.id, variables.data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(["usuarios"]);
			if (usuarioLogueado && usuarioLogueado.id_u === variables.id) {
				MySwal.fire(
					"Actualizado",
					"Tu cuenta ha sido actualizada, para que se reflejen los cambios, por favor cierra sesión y vuelve a iniciar sesión.",
					"success"
				);
			} else {
				MySwal.fire(
					"Actualizado",
					`Usuario [${variables.originalNombre}] actualizado correctamente`,
					"success"
				);
			}
		},
		onError: (error) => {
			console.error("Error al actualizar usuario:", error);
			const mensaje =
				error.response?.data?.message || "No se pudo actualizar el usuario";
			MySwal.fire("Error", mensaje, "error");
		},
	});
  const handleEliminar = async (id) => {
    if (usuarioLogueado?.id_u === id) {
      return MySwal.fire(
        "Error",
        "No puedes eliminar tu propia cuenta mientras estás logueado",
        "warning"
      );
    }
    const result = await MySwal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteUsuarioMutation.mutate(id);
    }
  };

  const handleDesactivar = async (id) => {
    if (usuarioLogueado?.id_u === id) {
      return MySwal.fire(
        "Error",
        "No puedes desactivar tu propia cuenta mientras estás logueado",
        "warning"
      );
    }
    const result = await MySwal.fire({
      title: "¿Desactivar usuario?",
      text: "El usuario no podrá iniciar sesión mientras esté desactivado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      toggleEstadoMutation.mutate({ id, activar: false });
    }
  };

  const handleActivar = async (id) => {
    const result = await MySwal.fire({
      title: "¿Activar usuario?",
      text: "El usuario podrá iniciar sesión después de activar la cuenta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      toggleEstadoMutation.mutate({ id, activar: true });
    }
  };
  const handleEditar = async (usuario) => {
  const { value: formValues } = await MySwal.fire({
    title: "Editar Usuario",
    html:
      `<div class="swal-form">
        <label>Nombre:</label>
        <input id="swal-nombre" class="swal-input" value="${usuario.nombre_u}">
        
        <label>Email:</label>
        <input id="swal-email" class="swal-input" value="${usuario.email}">
        
        <label>Rol:</label>
        <select id="swal-rol" class="swal-input">
          ${roles.map(r => `<option value="${r.id_rol}" ${usuario.rol?.id_rol===r.id_rol ? "selected":""}>${r.nombreRol}</option>`).join("")}
        </select>
      </div>`,
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById("swal-nombre").value.trim();
      const email = document.getElementById("swal-email").value.trim();
      const rolId = parseInt(document.getElementById("swal-rol").value);

      if (!nombre || !email || !rolId) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      return {
        nombre_u: nombre,
        email: email,
        rol: { id_rol: rolId },
      };
    },
  });

  if (formValues) {
      updateUsuarioMutation.mutate({
        id: usuario.id_u,
        data: formValues,
        originalNombre: usuario.nombre_u, 
      });
    }
  };
  const columns = [
    { 
      field: "id_u", 
      headerName: "ID", 
      width: 70 
    },
    { 
      field: "dni", 
      headerName: "DNI", 
      width: 100 
    },
    {
      field: "nombreCompleto",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
    },
    { 
      field: "email", 
      headerName: "Email", 
      flex: 1, 
      minWidth: 150 
    },
    {
      field: "rolNombre",
      headerName: "Rol",
      width: 280,
    },
    {
      field: "estado_u",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={getEstadoTexto(params.value)}
          color={params.value === 1 ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      type: "actions", 
      width: 180,
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
          {params.row.estado_u === 1 ? (
            <Tooltip title="Desactivar">
                <span>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => handleDesactivar(params.row.id_u)}
                  >
                    <HighlightOffIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Activar">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleActivar(params.row.id_u)}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          <Tooltip title="Eliminar">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar(params.row.id_u)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
        </Stack>
      )
    },
  ];

  const getEstadoTexto = (estado) => (estado === 1 ? "Activo" : "Inactivo");

  return (
    <TablaLista
      title="Lista de Usuarios"
      data={processedUsuarios}
      columns={columns}
      isLoading={isLoading}
      getRowId={(row) => row.id_u}
      onRefresh={refetch}
      onBack={() => navigate("/dashboard-usuarios")}
      onAdd={() => navigate("/usuarios/nuevo")}
      addButtonLabel="Ingresar Usuario"
    />
  );
}

export default ListaUsuarios;
