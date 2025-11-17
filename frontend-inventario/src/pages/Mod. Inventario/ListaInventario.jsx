// Ubicación: src/pages/Mod.Inventario/ListaInventario.jsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns"; // Usamos la librería que ya instalamos
import { Chip, Typography } from "@mui/material"; // Para el stock

// Tus componentes
import { getInventarioActual } from "../../api/InventarioApi";
import TablaLista from "../../components/TablaLista"; // Tu componente TablaLista

function ListaInventario() {
  const navigate = useNavigate();

  // 1. Cargar los datos
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["inventarioActual"],
    queryFn: getInventarioActual,
    initialData: { data: [] },
    select: (response) => response.data,
  });

  // 2. Procesar los datos (para formatear la fecha)
  const inventarioProcesado = useMemo(() => {
    if (!response) return [];
    return response.map(inv => ({
      ...inv,
      // Formateamos la fecha/hora
      ultimaActualizacionFormateada: format(new Date(inv.ultimaActualizacion), "dd/MM/yyyy HH:mm:ss")
    }));
  }, [response]);

  // 3. Definir las 5 columnas que pediste
  const columns = [
    { field: "idInventario", headerName: "ID", width: 80 },
    { field: "skuProducto", headerName: "SKU", width: 120 },
    { field: "nombreProducto", headerName: "Producto", flex: 1, minWidth: 150 },
    { field: "nombreSede", headerName: "Sede", width: 150 },
    { 
      field: "stockActual", 
      headerName: "Stock Actual", 
      width: 120, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={params.value > 10 ? 'success' : (params.value > 0 ? 'warning' : 'error')}
        />
      )
    },
    { 
      field: "ultimaActualizacionFormateada", 
      headerName: "Última Actualización", 
      width: 200 
    }
  ];

  // 4. Renderizar la tabla
  return (
    <TablaLista
      title="Lista de Inventario (Stock Actual)"
      columns={columns}
      data={inventarioProcesado}
      isLoading={isLoading}
      onBack={() => navigate("/dashboard-inventario")} // Botón "Volver"
      onRefresh={refetch} // Botón para refrescar
      getRowId={(row) => row.idInventario}
      showAddButton={false} // No se puede "Añadir" stock desde aquí
    />
  );
}

export default ListaInventario;