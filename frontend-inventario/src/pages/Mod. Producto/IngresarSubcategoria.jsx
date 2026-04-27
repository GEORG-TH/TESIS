import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";
import "../../components/styles/styleRegistrar.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubcategoria } from "../../api/subcategoriaApi";
import { getCategorias } from "../../api/categoriaApi";
import { getAreas } from "../../api/areaApi";
import { subcategoriaSchema } from "../../Utils/productoSchema";
import { z } from "zod";
import { useMemo, useEffect } from "react";

const MySwal = withReactContent(Swal);
const subcategoriaConAreaSchema = subcategoriaSchema.extend({
  id_area: z.string().nonempty("Debes seleccionar un area"),
});

function IngresarSubcategoria() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: areas,
    isLoading: loadingAreas,
    isError: isErrorAreas,
    error: errorAreas,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
    initialData: [],
  });

  const {
    data: categorias,
    isLoading: loadingCategorias,
    isError: isErrorCategorias,
    error: errorCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    initialData: [],
  });

  const createSubcategoriaMutation = useMutation({
    mutationFn: createSubcategoria,
    onSuccess: () => {
      MySwal.fire("Exito", "Subcategoria registrada correctamente", "success");
      queryClient.invalidateQueries(["subcategorias"]);
      reset();
    },
    onError: (requestError) => {
      console.error("Error al registrar subcategoria:", requestError);
      if (requestError.response?.data?.errors) {
        const mensajes = Object.entries(requestError.response.data.errors)
          .map(([campo, msg]) => `${campo.toUpperCase()}: ${msg}`)
          .join("<br>");
        MySwal.fire({
          icon: "error",
          title: "Errores de validacion",
          html: mensajes,
        });
      } else {
        const mensaje =
          requestError.response?.data?.message || "No se pudo registrar la subcategoria";
        MySwal.fire("Error", mensaje, "error");
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(subcategoriaConAreaSchema),
    defaultValues: {
      nombreSubcat: "",
      id_area: "",
      id_cat: "",
    },
  });

  const selectedAreaId = watch("id_area");

  const categoriasDisponibles = useMemo(() => {
    if (!selectedAreaId) return [];

    const areaIdNum = parseInt(selectedAreaId, 10);
    return categorias.filter((categoria) => {
      const categoriaAreaRaw = categoria.area?.id_area ?? categoria.id_area;
      const categoriaAreaId = Number(categoriaAreaRaw);
      return !Number.isNaN(categoriaAreaId) && categoriaAreaId === areaIdNum;
    });
  }, [selectedAreaId, categorias]);

  useEffect(() => {
    setValue("id_cat", "");
  }, [selectedAreaId, setValue]);

  const onSubmit = (data) => {
    const payload = {
      nombreSubcat: data.nombreSubcat,
      categoria: { id_cat: parseInt(data.id_cat, 10) },
    };

    createSubcategoriaMutation.mutate(payload);
  };

  if (isErrorAreas || isErrorCategorias) {
    const errorMessage = errorAreas?.message || errorCategorias?.message || "Error desconocido";
    MySwal.fire("Error", `No se pudieron cargar datos: ${errorMessage}`, "error");
    navigate("/lista-subcategorias");
  }

  return (
    <LayoutDashboard>
      <div className="form-panel-container">
        <button
          type="button"
          className="form-panel-back"
          onClick={() => navigate("/lista-subcategorias")}
        >
          Volver
        </button>
        <h2>Registrar Nueva Subcategoria</h2>
        <form className="form-panel" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Nombre de la Subcategoria:</label>
            <input
              type="text"
              {...register("nombreSubcat")}
              disabled={createSubcategoriaMutation.isPending}
            />
            {errors.nombreSubcat && <span className="error-message">{errors.nombreSubcat.message}</span>}
          </div>

          <div className="form-group">
            <label>Area:</label>
            <select
              {...register("id_area")}
              disabled={loadingAreas || areas.length === 0}
            >
              <option value="">{loadingAreas ? "Cargando areas..." : "Seleccione un area"}</option>
              {areas.map((area) => (
                <option key={area.id_area} value={area.id_area}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            {errors.id_area && (
              <span className="error-message">{errors.id_area.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <select
              {...register("id_cat")}
              disabled={loadingCategorias || !selectedAreaId || categoriasDisponibles.length === 0}
            >
              <option value="">
                {!selectedAreaId
                  ? "Seleccione un area primero"
                  : categoriasDisponibles.length === 0
                    ? "Sin categorias disponibles"
                    : "Seleccione una categoria"}
              </option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.id_cat} value={categoria.id_cat}>
                  {categoria.nombreCat}
                </option>
              ))}
            </select>
            {errors.id_cat && (
              <span className="error-message">{errors.id_cat.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="form-panel-submit"
            disabled={loadingAreas || loadingCategorias || createSubcategoriaMutation.isPending}
          >
            {createSubcategoriaMutation.isPending ? "Registrando..." : "Registrar Subcategoria"}
          </button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default IngresarSubcategoria;
