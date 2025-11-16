// Ubicación: src/pages/Mod.Inventario/ListaMovimientos.jsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Chip, Typography } from "@mui/material";
import { format } from "date-fns"; // Para formatear la fecha

// Tus componentes
import { listarMovimientos } from "../../api/InventarioApi";
import TablaLista from "../../components/TablaLista"; // Tu componente TablaLista

function ListaMovimientos() {
  const navigate = useNavigate();

  // 1. Cargar los datos con React Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["movimientos"],
    queryFn: listarMovimientos,
    initialData: { data: [] }, // Aseguramos que la estructura inicial sea segura
  });
  
  // Usamos useMemo para procesar los datos solo cuando cambian
  const movimientosProcesados = useMemo(() => {
    return response.data.map(mov => ({
      ...mov,
      // Formateamos la fecha para que la tabla la lea bien
      fechaFormateada: format(new Date(mov.fecha), "dd/MM/yyyy HH:mm:ss"),
    }));
  }, [response.data]);

  // 2. Columnas para tu DataGrid (Las 9 columnas)
  const columns = [
    { field: "idMovimiento", headerName: "ID", width: 80 },
    { field: "skuProducto", headerName: "SKU", width: 100 },
    { field: "nombreProducto", headerName: "Producto", flex: 1, minWidth: 150 },
    { field: "nombreSede", headerName: "Sede", width: 130 },
    { field: "nombreCompletoUsuario", headerName: "Usuario", width: 160 },
    { field: "nombreRolUsuario", headerName: "Rol", width: 130 },
    { 
      field: "tipoMovimiento", 
      headerName: "Tipo", 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={params.value.startsWith('Recep') || params.value.startsWith('Devol') ? 'success' : 'error'} 
          variant="outlined"
        />
      )
    },
    { 
      field: "cantidad", 
      headerName: "Cantidad", 
      width: 90, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 'bold', color: params.value > 0 ? 'success.main' : 'error.main' }}>
          {params.value > 0 ? `+${params.value}` : params.value}
        </Typography>
      )
    },
    { 
      field: "fechaFormateada", // Usamos la fecha formateada
      headerName: "Fecha/Hora", 
      width: 170
    },
    { field: "observaciones", headerName: "Observaciones", flex: 2, minWidth: 200 },
  ];

  // 3. Renderizar la tabla con tu componente reutilizable
  return (
    <TablaLista
      title="KARDEX (Historial de Movimientos)"
      columns={columns}
      data={movimientosProcesados} // Usamos los datos procesados
      isLoading={isLoading}
      onBack={() => navigate("/dashboard-inventario")} // Botón "Volver"
      getRowId={(row) => row.idMovimiento} // Le decimos a la tabla cuál es el ID
      
      // Ocultamos los botones que no se usan en un reporte
      showAddButton={false} 
      showRefreshButton={true} // Dejamos el de refrescar
    />
  );
}

export default ListaMovimientos;