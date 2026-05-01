import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Grid,
  Paper,
  Divider,
  Container,
  Autocomplete,
  Stack
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getProductos } from "../../api/productoApi";
import { getSedes } from "../../api/sedeApi";
import { registrarRecepcion } from "../../api/InventarioApi";
import { recepcionMasivaSchema } from "../../Utils/inventarioSchema";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

function RecepcionMercaderia() {
  const navigate = useNavigate();

  const { data: productos, isLoading: isLoadingProductos } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
    initialData: [],
  });

  const { data: sedes, isLoading: isLoadingSedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
    initialData: [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recepcionMasivaSchema),
    defaultValues: {
      sedeIdOrigen: "",
      descripcion: "",
      detalles: [{ productoId: "", cantidad: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const createRecepcionMutation = useMutation({
    mutationFn: registrarRecepcion,
    onSuccess: () => {
      MySwal.fire({
        title: "¡Éxito!",
        text: "La recepción masiva se registró correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      reset();
    },
    onError: (error) => {
      MySwal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error en el servidor",
        icon: "error",
      });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      sedeIdOrigen: parseInt(data.sedeIdOrigen),
      descripcion: data.descripcion || null,
      detalles: data.detalles.map(item => ({
        productoId: parseInt(item.productoId),
        cantidad: parseInt(item.cantidad)
      }))
    };
    createRecepcionMutation.mutate(payload);
  };

  if (isLoadingProductos || isLoadingSedes) {
    return (
      <LayoutDashboard>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress size={60} />
        </Box>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <Container maxWidth={false} sx={{ mt: 3, mb: 3, px: { xs: 2, sm: 3, md: 4 } }}>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard-inventario")}
          >
            Volver
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Registrar Entrada de Inventario
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'background.paper' }}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
              Configuración de la Recepción
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'minmax(360px, 1.4fr) minmax(280px, 1fr)',
                },
                gap: 3,
                mb: 4,
                alignItems: 'start',
              }}
            >
              <FormControl fullWidth error={!!errors.sedeIdOrigen} required sx={{ minWidth: 0 }}>
                <InputLabel id="sede-label">Sede donde ingresa la mercadería</InputLabel>
                <Controller
                  name="sedeIdOrigen"
                  control={control}
                  render={({ field }) => (
                    <Select
                      fullWidth
                      labelId="sede-label"
                      label="Sede donde ingresa la mercadería"
                      {...field}
                    >
                      <MenuItem value=""><em>Seleccione una sede</em></MenuItem>
                      {sedes.map((sede) => (
                        <MenuItem key={sede.idSede} value={String(sede.idSede)}>
                          {sede.nombreSede}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.sedeIdOrigen?.message}</FormHelperText>
              </FormControl>

              <TextField
                label="Referencia / Notas"
                fullWidth
                {...register("descripcion")}
                placeholder="Ej: Guía de remisión 001..."
                sx={{ minWidth: 0 }}
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
              Detalle de Productos a Ingresar
            </Typography>

            {fields.map((item, index) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'background.default',
                  borderWidth: 1.5,
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ width: '100%', alignItems: { xs: 'stretch', md: 'flex-start' } }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Controller
                      name={`detalles.${index}.productoId`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          fullWidth
                          options={productos}
                          getOptionLabel={(option) => `[${option.sku}] ${option.nombre}`}
                          isOptionEqualToValue={(option, value) => option.id_producto === value}
                          onChange={(_, newValue) => onChange(newValue ? newValue.id_producto : "")}
                          value={productos.find(p => p.id_producto === value) || null}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Buscar por SKU o Nombre de Producto"
                              required
                              fullWidth
                              error={!!errors.detalles?.[index]?.productoId}
                              helperText={errors.detalles?.[index]?.productoId?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: { xs: '100%', md: 160 }, flexShrink: 0 }}>
                    <TextField
                      label="Cant."
                      type="number"
                      fullWidth
                      inputProps={{ min: 1 }}
                      {...register(`detalles.${index}.cantidad`)}
                      error={!!errors.detalles?.[index]?.cantidad}
                      helperText={errors.detalles?.[index]?.cantidad?.message}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' }, flexShrink: 0 }}>
                    <IconButton
                      color="error"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      sx={{ border: '1px solid', borderColor: 'error.light' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Paper>
            ))}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="text"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => append({ productoId: "", cantidad: "" })}
                sx={{ fontWeight: 'bold' }}
              >
                Agregar otra fila
              </Button>

              {errors.detalles?.root && (
                <Typography color="error" variant="caption">
                  {errors.detalles.root.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={createRecepcionMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={createRecepcionMutation.isPending}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  boxShadow: 4
                }}
              >
                {createRecepcionMutation.isPending ? "Procesando..." : "Finalizar Recepción"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </LayoutDashboard>
  );
}

export default RecepcionMercaderia;