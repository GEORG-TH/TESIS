import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, LinearProgress, Typography, Stack, Chip } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import {
  DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess, ListRow, EmptyState, ListSkeleton, useSedes,
} from "../Shared/DashboardParts";
import {
  usePendientes, useQuiebre, useMovimientos, useNombreSede, fmtFechaHora,
} from "../Shared/dashboardData";
import { getInventarioPorSede } from "../../../api/InventarioApi";

function DashboardOTienda() {
  const navigate = useNavigate();
  const { data: sedes = [] } = useSedes();
  const [sedeSel, setSedeSel] = useState(null);
  // Sin sede asignada al usuario: parte de la primera sede y puede cambiarla.
  const sede = sedeSel ?? (sedes[0] ? String(sedes[0].idSede) : "");
  const nombreSede = useNombreSede(sede);

  const pend = usePendientes();
  const quiebre = useQuiebre(sede || "all");
  const movs = useMovimientos();

  const inv = useQuery({
    queryKey: ["inventarioSede", sede],
    queryFn: async () => (await getInventarioPorSede(sede)).data,
    enabled: !!sede,
    staleTime: 60 * 1000,
  });
  const productosSede = Array.isArray(inv.data) ? inv.data.length : 0;

  const movsSede = useMemo(
    () =>
      (movs.data ?? [])
        .filter((m) => !nombreSede || m.nombreSede === nombreSede)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [movs.data, nombreSede]
  );

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={
          <DashboardHeader
            rol="Operador de Tienda" badge="TIENDA" sede={sede} onSedeChange={setSedeSel} incluirTodas={false}
          />
        }
        kpis={
          <>
            <KpiCard
              index={0} label="Productos en la sede" value={productosSede} isLoading={inv.isLoading || !sede}
              icon={<Inventory2Icon />} color="primary" helper={nombreSede || "Selecciona una sede"}
              onClick={() => navigate("/inventario/BusquedaPersonalizadaStock/stock")}
            />
            <KpiCard
              index={1} label="Stock bajo" value={quiebre.rows.length} isLoading={quiebre.isLoading}
              icon={<ReportProblemIcon />} color={quiebre.rows.length > 0 ? "error" : "success"}
              helper="Bajo el mínimo" onClick={() => navigate("/reporte-quiebre-stock")}
            />
            <KpiCard
              index={2} label="Transferencias pendientes" value={pend.transferencias.length} isLoading={pend.loadingT}
              icon={<SwapHorizIcon />} color={pend.transferencias.length > 0 ? "warning" : "success"}
              helper="Esperando aprobación" onClick={() => navigate("/inventario/transferencia/gestion")}
            />
            <KpiCard
              index={3} label="Conteos pendientes" value={pend.conteos.length} isLoading={pend.loadingC}
              icon={<ChecklistIcon />} color={pend.conteos.length > 0 ? "warning" : "success"}
              helper="Por registrar o aprobar" onClick={() => navigate("/lista-conteo-inventario")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Alertas de stock bajo" subtitle={nombreSede || "Sede"}
            actionLabel="Reabastecer" onAction={() => navigate("/inventario/transferencia/solicitar")}
          >
            {quiebre.isLoading ? (
              <ListSkeleton />
            ) : quiebre.rows.length === 0 ? (
              <EmptyState text="¡Todo en orden! No hay productos bajo el mínimo en esta sede." />
            ) : (
              quiebre.rows.slice(0, 8).map((r) => {
                const ideal = r.stockIdeal || r.stockMinimo || 1;
                const pct = Math.max(0, Math.min(100, (r.stockActual / ideal) * 100));
                return (
                  <Box
                    key={r.idInventario ?? `${r.skuProducto}-${r.nombreSede}`}
                    sx={{ p: 1.25, mb: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{r.nombreProducto}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.skuProducto}</Typography>
                      </Box>
                      <Chip size="small" color="error" label={`${r.stockActual} / ${ideal}`} />
                    </Stack>
                    <LinearProgress
                      variant="determinate" value={pct} color={pct < 30 ? "error" : "warning"}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                );
              })
            )}
          </Panel>
        }
        right={
          <Panel
            index={1} title="Movimientos de la sede" subtitle="Últimos registros del kardex"
            actionLabel="Ver kardex" onAction={() => navigate("/inventario/kardex")}
          >
            {movs.isLoading ? (
              <ListSkeleton />
            ) : movsSede.length === 0 ? (
              <EmptyState text="Sin movimientos recientes en esta sede." />
            ) : (
              movsSede.slice(0, 8).map((m) => (
                <ListRow
                  key={m.idMovimiento}
                  sigla="MV"
                  color="info"
                  title={m.nombreProducto}
                  subtitle={`${m.tipoMovimiento} · ${m.cantidad} uds`}
                  right={fmtFechaHora(m.fecha)}
                />
              ))
            )}
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Registrar merma", icon: <WarningAmberIcon />, path: "/inventario/merma/registrar" },
              { label: "Devolución", icon: <AssignmentReturnIcon />, path: "/devolucion-mercaderia" },
              { label: "Conteo de inventario", icon: <ChecklistIcon />, path: "/dashboard-conteoinventario" },
              { label: "Solicitar transferencia", icon: <SwapHorizIcon />, path: "/inventario/transferencia/solicitar", primary: true },
            ]}
          />
        }
      />
    </LayoutDashboard>
  );
}
export default DashboardOTienda;
