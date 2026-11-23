import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import {
  DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess, ListRow, EmptyState, ListSkeleton,
} from "../Shared/DashboardParts";
import { useHus, useOrdenesCompra, fmtFechaCorta } from "../Shared/dashboardData";

const ESTADOS_HU = [
  { key: "COMPLETO", label: "Completos", color: "success" },
  { key: "EN_CONSTRUCCION", label: "En construcción", color: "info" },
  { key: "SOLICITADO", label: "Solicitados", color: "warning" },
  { key: "QUIEBRE", label: "Quiebre", color: "primary" },
  { key: "VENCIDO", label: "Vencidos", color: "error" },
  { key: "ENTREGADO", label: "Entregados", color: "grey" },
];

function DashboardJAlmacen() {
  const navigate = useNavigate();
  const theme = useTheme();
  const hus = useHus();
  const ordenes = useOrdenesCompra();

  const colorDe = (c) => (c === "grey" ? theme.palette.grey[500] : theme.palette[c].main);

  const porEstado = useMemo(() => {
    const rows = hus.data ?? [];
    return ESTADOS_HU.map((e) => ({
      ...e,
      value: rows.filter((h) => h.estado === e.key).length,
    }));
  }, [hus.data]);
  const dona = porEstado.filter((e) => e.value > 0);
  const totalHu = (hus.data ?? []).length;
  const n = (k) => porEstado.find((e) => e.key === k)?.value ?? 0;

  const oc = ordenes.data ?? [];
  const ocPorRecibir = oc.filter((o) => ["ENVIADA", "PARCIAL"].includes(o.estado)).length;
  const ocPendientes = oc.filter((o) => o.estado === "PENDIENTE").length;
  const recientes = useMemo(
    () => [...oc].sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)).slice(0, 8),
    [oc]
  );

  const colorEstadoOc = { PENDIENTE: "warning", ENVIADA: "info", PARCIAL: "secondary", COMPLETADA: "success", CANCELADA: "error" };

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={<DashboardHeader rol="Jefe de Almacén" badge="ALMACÉN" />}
        kpis={
          <>
            <KpiCard
              index={0} label="HU completos" value={n("COMPLETO")} isLoading={hus.isLoading}
              icon={<ViewInArIcon />} color="success" helper={`${totalHu} HU en total`}
              onClick={() => navigate("/hu/gestion")}
            />
            <KpiCard
              index={1} label="HU solicitados" value={n("SOLICITADO")} isLoading={hus.isLoading}
              icon={<PendingActionsIcon />} color={n("SOLICITADO") > 0 ? "warning" : "success"}
              helper={`${n("EN_CONSTRUCCION")} en construcción`} onClick={() => navigate("/hu/gestion")}
            />
            <KpiCard
              index={2} label="OC por recibir" value={ocPorRecibir} isLoading={ordenes.isLoading}
              icon={<LocalShippingIcon />} color={ocPorRecibir > 0 ? "info" : "success"}
              helper="Enviadas o parciales" onClick={() => navigate("/logistica/oc/lista")}
            />
            <KpiCard
              index={3} label="OC pendientes de envío" value={ocPendientes} isLoading={ordenes.isLoading}
              icon={<ReceiptLongIcon />} color={ocPendientes > 0 ? "warning" : "success"}
              helper="Aún no enviadas al proveedor" onClick={() => navigate("/logistica/oc/lista")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Estado de HU" subtitle="Unidades de manejo por estado"
            actionLabel="Gestionar" onAction={() => navigate("/hu/gestion")}
          >
            {hus.isLoading ? (
              <ListSkeleton />
            ) : dona.length === 0 ? (
              <EmptyState text="Aún no hay HU registradas." />
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2} sx={{ height: "100%" }}>
                <Box sx={{ width: { xs: "100%", sm: "50%" }, height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={dona} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                        {dona.map((e) => <Cell key={e.key} fill={colorDe(e.color)} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ flex: 1, width: "100%" }}>
                  {porEstado.map((e) => (
                    <Stack key={e.key} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: colorDe(e.color) }} />
                        <Typography variant="body2">{e.label}</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={700}>{e.value}</Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>
            )}
          </Panel>
        }
        right={
          <Panel
            index={1} title="Órdenes de compra recientes" subtitle="Últimas emitidas"
            actionLabel="Ver todas" onAction={() => navigate("/logistica/oc/lista")}
          >
            {ordenes.isLoading ? (
              <ListSkeleton />
            ) : recientes.length === 0 ? (
              <EmptyState text="Aún no hay órdenes de compra." />
            ) : (
              recientes.map((o) => (
                <ListRow
                  key={o.idOrden ?? o.id ?? o.codigoOrden}
                  sigla="OC"
                  color={colorEstadoOc[o.estado] || "primary"}
                  title={o.codigoOrden}
                  subtitle={`${o.proveedor?.nombre_proveedor || "Proveedor"} · ${o.sedeDestino?.nombreSede || "Sede"}`}
                  right={`${fmtFechaCorta(o.fechaEmision)} · ${o.estado}`}
                  onClick={() => navigate("/logistica/oc/lista")}
                />
              ))
            )}
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Gestión de HU", icon: <ViewInArIcon />, path: "/hu/gestion" },
              { label: "Lista de órdenes", icon: <ListAltIcon />, path: "/logistica/oc/lista" },
              { label: "Generar orden de compra", icon: <ReceiptLongIcon />, path: "/logistica/oc/generar" },
              { label: "Crear HU", icon: <AddBoxIcon />, path: "/hu/gestion/crear", primary: true },
            ]}
          />
        }
      />
    </LayoutDashboard>
  );
}

export default DashboardJAlmacen;
