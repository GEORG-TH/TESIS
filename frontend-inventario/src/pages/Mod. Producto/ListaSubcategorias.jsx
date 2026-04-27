import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubcategorias,
  deleteSubcategoria,
  updateSubcategoria,
} from "../../api/subcategoriaApi";
import { getCategorias } from "../../api/categoriaApi";
import {
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablaLista from "../../components/TablaLista";
import FormularioDialogo from "../../components/FomularioDialogo";
import { subcategoriaSchema } from "../../Utils/productoSchema";

const MySwal = withReactContent(Swal);

const ListaSubcategorias = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  const {
    data: subcategoriasData,
    isLoading: isLoadingSubcategorias,
    refetch: refetchSubcategorias,
  } = useQuery({
    queryKey: ["subcategorias"],
    queryFn: getSubcategorias,
  });

  const {
    data: categoriasData,
    isLoading: isLoadingCategorias,
    refetch: refetchCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    initialData: [],
  });

  const isLoading = isLoadingSubcategorias || isLoadingCategorias;
  const categorias = categoriasData || [];

  const subcategoriasEnriquecidas = useMemo(() => {
    const categoriasMap = new Map(
      categorias.map((categoria) => [String(categoria.id_cat), categoria.nombreCat])
    );

    return (subcategoriasData || []).map((subcategoria) => ({
      id: subcategoria.id,
      ...subcategoria,
      nombreCategoria:
        subcategoria.categoria?.nombreCat ||
        categoriasMap.get(String(subcategoria.categoria?.id_cat)) ||
        "Sin categoria",
    }));
  }, [subcategoriasData, categorias]);

  const subcategoriasFields = [
    { name: "nombreSubcat", label: "Nombre de la Subcategoria", type: "text" },
    {
      name: "categoria",
      label: "Categoria",
      type: "select",
      options: categorias.map((categoria) => ({
        value: String(categoria.id_cat),
        label: categoria.nombreCat,
      })),
    },
  ];

  const deleteSubcategoriaMutation = useMutation({
    mutationFn: deleteSubcategoria,
    onSuccess: () => {
      queryClient.invalidateQueries(["subcategorias"]);
      MySwal.fire(
        "Eliminado",
        "La subcategoria fue eliminada correctamente",
        "success"
      );
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "No se pudo eliminar la subcategoria.";
      console.error("Error al eliminar subcategoria:", err);
      MySwal.fire("Error", errorMessage, "error");
    },
  });

  const updateSubcategoriaMutation = useMutation({
    mutationFn: (variables) => updateSubcategoria(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subcategorias"]);
      queryClient.invalidateQueries(["productos"]);
      setOpenEditDialog(false);
      MySwal.fire(
        "Actualizado",
        "La subcategoria se actualizo correctamente",
        "success"
      );
    },
    onError: (err) => {
      console.error("Error al actualizar subcategoria:", err);
      const mensaje = err.response?.data?.message || "No se pudo actualizar la subcategoria";
      MySwal.fire("Error", mensaje, "error");
    },
  });

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Eliminar subcategoria?",
      text: "Esta accion eliminara la subcategoria de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteSubcategoriaMutation.mutate(id);
  };

  const handleEdit = (subcategoria) => {
    setSubcategoriaSeleccionada({
      id: subcategoria.id,
      nombreSubcat: subcategoria.nombreSubcat,
      categoria: subcategoria.categoria?.id_cat ? String(subcategoria.categoria.id_cat) : "",
    });
    setOpenEditDialog(true);
  };

  const onSaveEdit = (formData) => {
    const payload = {
      nombreSubcat: formData.nombreSubcat,
      categoria: { id_cat: parseInt(formData.categoria, 10) },
    };

    updateSubcategoriaMutation.mutate({
      id: subcategoriaSeleccionada.id,
      data: payload,
    });
  };

  const handleRefresh = () => {
    refetchSubcategorias();
    refetchCategorias();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "nombreSubcat",
      headerName: "Nombre Subcategoria",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "nombreCategoria",
      headerName: "Categoria",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      type: "actions",
      width: 110,
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
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <TablaLista
        title="Lista de Subcategorias"
        columns={columns}
        data={subcategoriasEnriquecidas}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onAdd={() => navigate("/subcategorias/nuevo")}
        onBack={() => navigate("/dashboard-productos")}
        getRowId={(row) => row.id}
        addButtonLabel="Ingresar Nueva Subcategoria"
      />
      <FormularioDialogo
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        title="Editar Subcategoria"
        fields={subcategoriasFields}
        validationSchema={subcategoriaSchema}
        initialValues={subcategoriaSeleccionada}
        onConfirm={onSaveEdit}
        isSaving={updateSubcategoriaMutation.isPending}
      />
    </>
  );
};

export default ListaSubcategorias;
