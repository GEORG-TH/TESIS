import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Chip, Typography } from "@mui/material";
import { getInventarioActual } from "../../api/InventarioApi";
import TablaLista from "../../components/TablaLista";

function ListaInventario() {
  const navigate = useNavigate();
  const location = useLocation();
  const filtros = location.state?.filtros;

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["inventarioActual"],
    queryFn: getInventarioActual,
    initialData: { data: [] },
    select: (response) => response.data,
  });

  const inventarioProcesado = useMemo(() => {
    if (!response) return [];
    
    let procesado = response.map(inv => {
      const fechaStr = inv.ultimaActualizacion;
      if (!fechaStr) return { ...inv, ultimaActualizacionFormateada: '-' };

      const fechaUTC = fechaStr.endsWith('Z') ? fechaStr : fechaStr + 'Z';

      return {
        ...inv,
        ultimaActualizacionFormateada: format(new Date(fechaUTC), "dd/MM/yyyy HH:mm:ss")
      };
    });

    if (filtros) {
      // 1. Filtro por Sede (Autocomplete)
      if (filtros.autocomplete?.id) {
        procesado = procesado.filter(inv => {
          const nombreSedeFiltro = filtros.autocomplete.label.split('-')[1]?.trim()?.toLowerCase() || filtros.autocomplete.label.toLowerCase();
          return inv.idSede === filtros.autocomplete.id || inv.nombreSede?.toLowerCase().includes(nombreSedeFiltro);
        });
      }

      if (filtros.toggle?.valor) {
        const valorFiltro = typeof filtros.toggle.valor === 'string' ? filtros.toggle.valor.toLowerCase() : String(filtros.toggle.valor).toLowerCase();
        const tipo = filtros.toggle.tipo; 
        
        procesado = procesado.filter(inv => {
          if (tipo === "SKU") {
            return inv.skuProducto?.toLowerCase().includes(valorFiltro);
          } else if (tipo === "NOMBRE") {
            return inv.nombreProducto?.toLowerCase().includes(valorFiltro);
          } else if (tipo === "EAN") {
            return inv.eanProducto?.toLowerCase().includes(valorFiltro) || inv.skuProducto?.toLowerCase().includes(valorFiltro);
          }
          return true;
        });
      }
    }

    return procesado;
  }, [response, filtros]);

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

  return (
    <TablaLista
      title="Lista de Inventario (Stock Actual)"
      columns={columns}
      data={inventarioProcesado}
      isLoading={isLoading}
      onBack={() => navigate("/inventario/BusquedaPersonalizadaStock")}
      onRefresh={refetch}
      getRowId={(row) => row.idInventario}
      showAddButton={false}
    />
  );
}

export default ListaInventario;