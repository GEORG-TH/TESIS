import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HistoryIcon from "@mui/icons-material/History";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import { DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess } from "../Shared/DashboardParts";
import { ColaAprobaciones, TablaQuiebre, usePendientes, useQuiebre } from "../Shared/dashboardData";

function DashboardJInventario() {
  const navigate = useNavigate();
  const [sede, setSede] = useState("all");
  const pend = usePendientes();
  const quiebre = useQuiebre(sede);

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={
          <DashboardHeader rol="Jefe de Inventario" badge="INVENTARIO" sede={sede} onSedeChange={setSede} />
        }
        kpis={
          <>
            <KpiCard
              index={0} label="Productos en quiebre" value={quiebre.rows.length} isLoading={quiebre.isLoading}
              icon={<ReportProblemIcon />} color={quiebre.rows.length > 0 ? "error" : "success"}
              helper={sede === "all" ? "Todas las sedes" : "Sede seleccionada"}
              onClick={() => navigate("/reporte-quiebre-stock")}
            />
            <KpiCard
              index={1} label="Transferencias por aprobar" value={pend.transferencias.length}
              isLoading={pend.loadingT} icon={<SwapHorizIcon />}
              color={pend.transferencias.length > 0 ? "warning" : "success"} helper="Esperando decisión"
              onClick={() => navigate("/inventario/transferencia/gestion")}
            />
            <KpiCard
              index={2} label="Mermas por aprobar" value={pend.mermas.length} isLoading={pend.loadingM}
              icon={<WarningAmberIcon />} color={pend.mermas.length > 0 ? "error" : "success"}
              helper="Pendientes de revisión"
              onClick={() => navigate("/inventario/merma/gestion")}
            />
            <KpiCard
              index={3} label="Devoluciones por aprobar" value={pend.devoluciones.length} isLoading={pend.loadingD}
              icon={<AssignmentReturnIcon />} color={pend.devoluciones.length > 0 ? "info" : "success"}
              helper={`${pend.conteos.length} conteo(s) por aprobar`}
              onClick={() => navigate("/inventario/devolucion/gestion")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Sugerencias de compra" subtitle="Productos con stock crítico"
            actionLabel="Ver reporte" onAction={() => navigate("/reporte-quiebre-stock")}
          >
            <TablaQuiebre rows={quiebre.rows} isLoading={quiebre.isLoading} />
          </Panel>
        }
        right={
          <Panel index={1} title="Cola de aprobaciones" subtitle="Solicitudes que esperan tu decisión">
            <ColaAprobaciones pend={pend} />
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Importar ventas", icon: <UploadFileIcon />, path: "/importar-ventas" },
              { label: "Kardex", icon: <HistoryIcon />, path: "/inventario/kardex" },
              { label: "Generar conteo", icon: <ChecklistIcon />, path: "/generar-conteo-inventario" },
              { label: "Reportes", icon: <BarChartIcon />, path: "/dashboard-reportes", primary: true },
            ]}
          />
        }
      />
    </LayoutDashboard>
  );
}

export default DashboardJInventario;
