import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import {
  DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess, ListRow, EmptyState, ListSkeleton,
} from "../Shared/DashboardParts";
import {
  usePendientes, useOrdenesCompra, useMovimientos, useNombreSede, esEntrada, esHoy,
  fmtFechaHora, fmtFechaCorta,
} from "../Shared/dashboardData";

function DashboardORecepcion() {
  const navigate = useNavigate();
  const [sede, setSede] = useState("all");
  const nombreSede = useNombreSede(sede);
  const pend = usePendientes();
  const ordenes = useOrdenesCompra();
  const movs = useMovimientos();

  const porRecepcionar = useMemo(
    () =>
      (ordenes.data ?? [])
        .filter((o) => ["ENVIADA", "PARCIAL"].includes(o.estado))
        .filter((o) => !nombreSede || o.sedeDestino?.nombreSede === nombreSede)
        .sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)),
    [ordenes.data, nombreSede]
  );
  const parciales = porRecepcionar.filter((o) => o.estado === "PARCIAL").length;

  const entradas = useMemo(
    () =>
      (movs.data ?? [])
        .filter((m) => esEntrada(m.tipoMovimiento, m.cantidad))
        .filter((m) => !nombreSede || m.nombreSede === nombreSede)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [movs.data, nombreSede]
  );
  const entradasHoy = entradas.filter((m) => esHoy(m.fecha)).length;

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={
          <DashboardHeader rol="Operador de Recepción de Mercadería" badge="RECEPCIÓN" sede={sede} onSedeChange={setSede} />
        }
        kpis={
          <>
            <KpiCard
              index={0} label="OC por recepcionar" value={porRecepcionar.length} isLoading={ordenes.isLoading}
              icon={<LocalShippingIcon />} color={porRecepcionar.length > 0 ? "warning" : "success"}
              helper="Enviadas o parciales" onClick={() => navigate("/inventario/recepcion-merceria")}
            />
            <KpiCard
              index={1} label="Recepciones parciales" value={parciales} isLoading={ordenes.isLoading}
              icon={<PendingActionsIcon />} color={parciales > 0 ? "info" : "success"}
              helper="Falta mercadería por llegar"
            />
            <KpiCard
              index={2} label="Entradas de hoy" value={entradasHoy} isLoading={movs.isLoading}
              icon={<MoveToInboxIcon />} color="primary" helper="Movimientos de ingreso"
              onClick={() => navigate("/inventario/kardex")}
            />
            <KpiCard
              index={3} label="Conteos pendientes" value={pend.conteos.length} isLoading={pend.loadingC}
              icon={<ChecklistIcon />} color={pend.conteos.length > 0 ? "warning" : "success"}
              helper={`${pend.transferencias.length} transferencia(s) pendiente(s)`}
              onClick={() => navigate("/lista-conteo-inventario")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Órdenes de compra esperando recepción" subtitle="Enviadas al proveedor"
            actionLabel="Recepcionar" onAction={() => navigate("/inventario/recepcion-merceria")}
          >
            {ordenes.isLoading ? (
              <ListSkeleton />
            ) : porRecepcionar.length === 0 ? (
              <EmptyState text="No hay órdenes esperando recepción." />
            ) : (
              porRecepcionar.slice(0, 8).map((o) => (
                <ListRow
                  key={o.idOrden ?? o.id ?? o.codigoOrden}
                  sigla="OC"
                  color={o.estado === "PARCIAL" ? "secondary" : "info"}
                  title={o.codigoOrden}
                  subtitle={`${o.proveedor?.nombre_proveedor || "Proveedor"} · ${o.sedeDestino?.nombreSede || "Sede"}`}
                  right={`${fmtFechaCorta(o.fechaEmision)} · ${o.estado}`}
                  onClick={() => navigate("/inventario/recepcion-merceria")}
                />
              ))
            )}
          </Panel>
        }
        right={
          <Panel
            index={1} title="Últimas entradas al inventario" subtitle="Kardex"
            actionLabel="Ver kardex" onAction={() => navigate("/inventario/kardex")}
          >
            {movs.isLoading ? (
              <ListSkeleton />
            ) : entradas.length === 0 ? (
              <EmptyState text="Aún no hay entradas registradas." />
            ) : (
              entradas.slice(0, 8).map((m) => (
                <ListRow
                  key={m.idMovimiento}
                  sigla="IN"
                  color="success"
                  title={m.nombreProducto}
                  subtitle={`${m.nombreSede || "Sede"} · ${m.cantidad} uds · ${m.nombreCompletoUsuario || ""}`}
                  right={fmtFechaHora(m.fecha)}
                />
              ))
            )}
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Kardex", icon: <HistoryIcon />, path: "/inventario/kardex" },
              { label: "Conteo", icon: <ChecklistIcon />, path: "/dashboard-conteoinventario" },
              { label: "Devolución", icon: <AssignmentReturnIcon />, path: "/devolucion-mercaderia" },
              { label: "Merma", icon: <WarningAmberIcon />, path: "/inventario/merma/registrar" },
              { label: "Registrar recepción", icon: <AddBoxIcon />, path: "/inventario/recepcion-merceria", primary: true },
            ]}
          />
        }
      />
    </LayoutDashboard>
  );
}
export default DashboardORecepcion;
