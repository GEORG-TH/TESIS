import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PaidIcon from "@mui/icons-material/Paid";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import {
  DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess, EmptyState, ListSkeleton,
} from "../Shared/DashboardParts";
import { ActividadList, useQuiebre } from "../Shared/dashboardData";
import {
  getReporteMerma, getReporteDiferencias, getReporteStockMuerto,
} from "../../../api/reporteApi";

const lista = (d) => (Array.isArray(d) ? d : d?.content ?? []);
const isoFecha = (d) => d.toISOString().slice(0, 10);

function DashboardAuditor() {
  const navigate = useNavigate();
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const merma = useQuery({
    queryKey: ["audMermaMes", isoFecha(inicioMes)],
    queryFn: async () => lista((await getReporteMerma(isoFecha(inicioMes), isoFecha(hoy))).data),
    staleTime: 60 * 1000,
  });
  const dif = useQuery({
    queryKey: ["audDiferencias"],
    queryFn: async () => lista((await getReporteDiferencias()).data),
    staleTime: 60 * 1000,
  });
  const muerto = useQuery({
    queryKey: ["reporteStockMuerto", 90],
    queryFn: async () => lista((await getReporteStockMuerto(90)).data),
    staleTime: 60 * 1000,
  });
  const quiebre = useQuiebre("all");

  const difRows = [...(dif.data ?? [])]
    .filter((r) => r.diferencia !== 0)
    .sort((a, b) => Math.abs(b.diferencia) - Math.abs(a.diferencia));

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={<DashboardHeader rol="Auditor de Inventarios" badge="AUDITORÍA · SOLO LECTURA" />}
        kpis={
          <>
            <KpiCard
              index={0} label="Mermas del mes" value={(merma.data ?? []).length} isLoading={merma.isLoading}
              icon={<WarningAmberIcon />} color={(merma.data ?? []).length > 0 ? "error" : "success"}
              helper="Registros en el mes en curso" onClick={() => navigate("/reporte-merma")}
            />
            <KpiCard
              index={1} label="Diferencias de conteo" value={difRows.length} isLoading={dif.isLoading}
              icon={<CompareArrowsIcon />} color={difRows.length > 0 ? "warning" : "success"}
              helper="Sistema vs. físico" onClick={() => navigate("/reporte-diferencias")}
            />
            <KpiCard
              index={2} label="Stock muerto" value={(muerto.data ?? []).length} isLoading={muerto.isLoading}
              icon={<InventoryIcon />} color={(muerto.data ?? []).length > 0 ? "info" : "success"}
              helper="Sin movimiento en 90 días" onClick={() => navigate("/reporte-stock-muerto")}
            />
            <KpiCard
              index={3} label="Quiebres de stock" value={quiebre.rows.length} isLoading={quiebre.isLoading}
              icon={<ReportProblemIcon />} color={quiebre.rows.length > 0 ? "error" : "success"}
              helper="Todas las sedes" onClick={() => navigate("/reporte-quiebre-stock")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Diferencias de inventario" subtitle="Mayores desviaciones sistema vs. conteo"
            actionLabel="Ver reporte" onAction={() => navigate("/reporte-diferencias")}
          >
            {dif.isLoading ? (
              <ListSkeleton />
            ) : difRows.length === 0 ? (
              <EmptyState text="No hay diferencias registradas." />
            ) : (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "background.paper" }}>Producto</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "background.paper" }}>Sistema</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "background.paper" }}>Físico</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "background.paper" }}>Dif.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {difRows.slice(0, 8).map((r, i) => (
                    <TableRow key={`${r.idHoja}-${r.skuProducto}-${i}`} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 240 }}>
                          {r.nombreProducto}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.skuProducto} · {r.nombreSede}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{r.stockSistema}</TableCell>
                      <TableCell align="center">{r.stockContado}</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={r.diferencia > 0 ? `+${r.diferencia}` : r.diferencia}
                          color={r.diferencia < 0 ? "error" : "warning"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        }
        right={
          <Panel
            index={1} title="Actividad de usuarios" subtitle="Auditoría"
            actionLabel="Ver historial" onAction={() => navigate("/auditoria/actividad/usuario")}
          >
            <ActividadList />
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Valorizado", icon: <PaidIcon />, path: "/reporte-valorizado" },
              { label: "Entradas", icon: <MoveToInboxIcon />, path: "/reporte-entradas" },
              { label: "Salidas", icon: <OutboxIcon />, path: "/reporte-salidas" },
              { label: "Stock muerto", icon: <InventoryIcon />, path: "/reporte-stock-muerto" },
              { label: "Todos los reportes", icon: <CompareArrowsIcon />, path: "/dashboard-reportes", primary: true },
            ]}
          />
        }
      />
    </LayoutDashboard>
  );
}
export default DashboardAuditor;
