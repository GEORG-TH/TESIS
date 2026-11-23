import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import GroupIcon from "@mui/icons-material/Group";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LayoutDashboard from "../../Layouts/LayoutDashboard";
import GraficoUsuariosPorRol from "../../Graficos/GraficoUsuariosPorRol";
import ChartExportContainer from "../../Graficos/ChartExportContainer";
import GraficoMovimientosSemana from "../../Graficos/GraficoMovimientosSemana";
import ChatWidget from "../../IA/ChatWidget";
import { DashboardHeader, DashboardGrid, KpiCard, Panel, QuickAccess } from "../Shared/DashboardParts";
import { ActividadList, usePendientes, useQuiebre } from "../Shared/dashboardData";
import { getProductos } from "../../../api/productoApi";
import { getUsuariosConectados } from "../../../api/usuarioApi";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [sede, setSede] = useState("all");

  const { data: productos = [], isLoading: lp } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
  const { data: conectados = [], isLoading: lc } = useQuery({
    queryKey: ["usuariosConectados"],
    queryFn: getUsuariosConectados,
    staleTime: 30 * 1000,
  });
  const pend = usePendientes();
  const quiebre = useQuiebre(sede);

  return (
    <LayoutDashboard>
      <DashboardGrid
        header={
          <DashboardHeader rol="Administrador" badge="PANEL CENTRAL" sede={sede} onSedeChange={setSede} />
        }
        kpis={
          <>
            <KpiCard
              index={0} label="Total productos" value={productos.length} isLoading={lp}
              icon={<Inventory2Icon />} color="primary" helper="Registrados en el sistema"
              onClick={() => navigate("/lista-productos")}
            />
            <KpiCard
              index={1} label="Transferencias pendientes" value={pend.transferencias.length}
              isLoading={pend.loadingT} icon={<SwapHorizIcon />}
              color={pend.transferencias.length > 0 ? "warning" : "success"}
              helper="Esperando aprobación"
              onClick={() => navigate("/inventario/transferencia/gestion")}
            />
            <KpiCard
              index={2} label="Usuarios conectados" value={Array.isArray(conectados) ? conectados.length : 0}
              isLoading={lc} icon={<GroupIcon />} color="success" helper="Sesiones activas ahora"
              onClick={() => navigate("/usuarios-conectados")}
            />
            <KpiCard
              index={3} label="Mermas por aprobar" value={pend.mermas.length} isLoading={pend.loadingM}
              icon={<WarningAmberIcon />} color={pend.mermas.length > 0 ? "error" : "success"}
              helper={`${quiebre.rows.length} producto(s) en quiebre`}
              onClick={() => navigate("/inventario/merma/gestion")}
            />
          </>
        }
        left={
          <Panel
            index={0} title="Distribución de usuarios por rol" subtitle="Cuentas registradas"
            actionLabel="Gestionar" onAction={() => navigate("/lista-usuarios")}
          >
            {/* Dos gráficos que se reparten el alto del panel. Cada uno va dentro de un
                contenedor "relative + absolute inset 0" para que su tamaño dependa del
                reparto y no al revés. El padding deja sitio al botón de exportar. */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100%", minHeight: 440 }}>
              <Box sx={{ flex: "1 1 52%", minHeight: 210, position: "relative" }}>
                <Box sx={{ position: "absolute", inset: 0, boxSizing: "border-box", p: "12px 14px 0 0" }}>
                  <ChartExportContainer title="Usuarios por Rol">
                    <GraficoUsuariosPorRol />
                  </ChartExportContainer>
                </Box>
              </Box>
              <Box sx={{ flex: "1 1 48%", minHeight: 190, borderTop: "1px solid", borderColor: "divider", pt: 1.5 }}>
                <Box sx={{ height: "100%", boxSizing: "border-box", pr: "14px" }}>
                  <GraficoMovimientosSemana />
                </Box>
              </Box>
            </Box>
          </Panel>
        }
        right={
          <Panel
            index={1} title="Actividad reciente del sistema" subtitle="Auditoría"
            actionLabel="Ver historial" onAction={() => navigate("/auditoria/actividad/usuario")}
          >
            <ActividadList />
          </Panel>
        }
        quick={
          <QuickAccess
            items={[
              { label: "Usuarios", icon: <GroupIcon />, path: "/dashboard-usuarios" },
              { label: "Sedes", icon: <StorefrontIcon />, path: "/dashboard-sedes" },
              { label: "Campañas", icon: <CampaignIcon />, path: "/productos/campanias-activas" },
              { label: "Reportes", icon: <BarChartIcon />, path: "/dashboard-reportes" },
              { label: "Asistente IA", icon: <SmartToyIcon />, path: "/chat-ia", primary: true },
            ]}
          />
        }
      />
      <ChatWidget />
    </LayoutDashboard>
  );
}
