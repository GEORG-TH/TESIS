import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { listarPendientes } from "../../../api/transferenciaApi";
import { listarMermasPendientes } from "../../../api/mermaApi";
import { listarDevolucionesPendientes } from "../../../api/devolucionApi";
import { listarConteosPendientes } from "../../../api/conteoApi";
import { getReporteQuiebreStock } from "../../../api/reporteApi";
import { getOrdenes } from "../../../api/comprasApi";
import { getAllHus } from "../../../api/huApi";
import { listarMovimientos } from "../../../api/InventarioApi";
import { getHistorialActividad } from "../../../api/historialActividadApi";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { useSedes, ListRow, EmptyState, ListSkeleton } from "./DashboardParts";

const STALE = 60 * 1000;

const lista = (d) => (Array.isArray(d) ? d : d?.content ?? []);

/** Pendientes de aprobación: transferencias, mermas, devoluciones y conteos. */
export function usePendientes() {
  const t = useQuery({
    queryKey: ["transferenciasPendientes"],
    queryFn: async () => lista((await listarPendientes()).data),
    staleTime: STALE,
  });
  const m = useQuery({
    queryKey: ["mermasPendientes"],
    queryFn: async () => lista((await listarMermasPendientes()).data),
    staleTime: STALE,
  });
  const d = useQuery({
    queryKey: ["devolucionesPendientes"],
    queryFn: async () => lista((await listarDevolucionesPendientes()).data),
    staleTime: STALE,
  });
  const c = useQuery({
    queryKey: ["conteosPendientes"],
    queryFn: async () => lista((await listarConteosPendientes()).data),
    staleTime: STALE,
  });
  return {
    transferencias: t.data ?? [],
    mermas: m.data ?? [],
    devoluciones: d.data ?? [],
    conteos: c.data ?? [],
    isLoading: t.isLoading || m.isLoading || d.isLoading || c.isLoading,
    loadingT: t.isLoading,
    loadingM: m.isLoading,
    loadingD: d.isLoading,
    loadingC: c.isLoading,
  };
}

/** Quiebres de stock (todas las sedes) filtrados por la sede elegida. */
export function useQuiebre(sede) {
  const { data: sedes = [] } = useSedes();
  const q = useQuery({
    queryKey: ["reporteQuiebre"],
    queryFn: async () => lista((await getReporteQuiebreStock()).data),
    staleTime: STALE,
  });
  const nombreSede =
    sede && sede !== "all"
      ? sedes.find((s) => String(s.idSede) === String(sede))?.nombreSede
      : null;
  const rows = (q.data ?? []).filter((r) => !nombreSede || r.nombreSede === nombreSede);
  return { rows, isLoading: q.isLoading, isError: q.isError };
}

export function useOrdenesCompra() {
  return useQuery({
    queryKey: ["ordenesCompra"],
    queryFn: async () => lista(await getOrdenes()),
    staleTime: STALE,
  });
}

export function useHus() {
  return useQuery({
    queryKey: ["hus"],
    queryFn: async () => lista(await getAllHus()),
    staleTime: STALE,
  });
}

const fechaUtc = (s) => (s && !String(s).endsWith("Z") ? `${s}Z` : s);

export const esEntrada = (tipo, cantidad) => {
  if (!tipo) return false;
  const t = tipo.toLowerCase();
  if (t.includes("ajuste")) return cantidad >= 0;
  if (t.includes("salida")) return false;
  return ["recep", "devoluci", "entrada"].some((k) => t.includes(k));
};

export function useMovimientos() {
  return useQuery({
    queryKey: ["movimientos"],
    queryFn: async () => lista((await listarMovimientos()).data),
    staleTime: STALE,
  });
}

export const esHoy = (fecha) => {
  if (!fecha) return false;
  const d = new Date(fechaUtc(fecha));
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};

export const fmtFechaHora = (fecha) => {
  if (!fecha) return "-";
  return new Date(fechaUtc(fecha)).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
};

export const fmtFechaCorta = (fecha) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const tiempoRelativo = (fecha) => {
  if (!fecha) return "";
  const diff = Math.floor((Date.now() - new Date(fechaUtc(fecha)).getTime()) / 1000);
  if (diff < 0 || diff < 60) return "hace instantes";
  const min = Math.floor(diff / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
};

const iniciales = (nombre = "") =>
  nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "US";

/** Lista de actividad reciente de usuarios (auditoría). */
export function ActividadList({ limite = 8 }) {
  const { data, isLoading } = useQuery({
    queryKey: ["historialActividad"],
    queryFn: getHistorialActividad,
    staleTime: 5 * 60 * 1000,
  });
  const items = lista(data).slice(0, limite);

  if (isLoading) return <ListSkeleton />;
  if (items.length === 0) return <EmptyState text="No hay actividad reciente." />;
  return items.map((a) => (
    <ListRow
      key={a.id}
      sigla={iniciales(a.nombreUsuario)}
      title={a.descripcion}
      subtitle={`${a.nombreUsuario || "Usuario"} · ${a.tipoAccion ? a.tipoAccion.toLowerCase() : "acción"}`}
      right={tiempoRelativo(a.fechaHora)}
    />
  ));
}

/** Cola de aprobaciones: una fila por tipo con su cantidad pendiente. */
export function ColaAprobaciones({ pend, incluirConteos = true }) {
  const navigate = useNavigate();
  const filas = [
    { sigla: "TR", label: "Transferencias", n: pend.transferencias.length, path: "/inventario/transferencia/gestion", color: "warning" },
    { sigla: "ME", label: "Mermas", n: pend.mermas.length, path: "/inventario/merma/gestion", color: "error" },
    { sigla: "DV", label: "Devoluciones", n: pend.devoluciones.length, path: "/inventario/devolucion/gestion", color: "info" },
    ...(incluirConteos
      ? [{ sigla: "CI", label: "Conteos de inventario", n: pend.conteos.length, path: "/aprobar-desaprobar-conteo", color: "secondary" }]
      : []),
  ];
  if (pend.isLoading) return <ListSkeleton rows={filas.length} />;
  return filas.map((f) => (
    <ListRow
      key={f.label}
      sigla={f.sigla}
      color={f.color}
      title={f.label}
      subtitle={f.n === 0 ? "Sin solicitudes pendientes" : `${f.n} solicitud${f.n === 1 ? "" : "es"} por revisar`}
      right={f.n === 0 ? "Al día" : `${f.n} · Revisar →`}
      rightColor={f.n === 0 ? "success.main" : `${f.color}.main`}
      onClick={() => navigate(f.path)}
    />
  ));
}

/** Tabla de stock crítico / sugerencias de compra (a partir del reporte de quiebre). */
export function TablaQuiebre({ rows, isLoading, max = 8 }) {
  if (isLoading) return <ListSkeleton />;
  if (rows.length === 0) return <EmptyState text="¡Todo en orden! No hay productos con stock crítico." />;
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ bgcolor: "background.paper" }}>Producto</TableCell>
          <TableCell align="center" sx={{ bgcolor: "background.paper" }}>Actual</TableCell>
          <TableCell align="center" sx={{ bgcolor: "background.paper" }}>Ideal</TableCell>
          <TableCell align="center" sx={{ bgcolor: "background.paper" }}>A comprar</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.slice(0, max).map((r) => (
          <TableRow key={r.idInventario ?? `${r.skuProducto}-${r.nombreSede}`} hover>
            <TableCell>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 260 }}>
                {r.nombreProducto}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {r.skuProducto} · {r.nombreSede}
              </Typography>
            </TableCell>
            <TableCell align="center"><Chip label={r.stockActual} color="error" size="small" /></TableCell>
            <TableCell align="center">{r.stockIdeal}</TableCell>
            <TableCell align="center">
              <Typography color="primary.main" fontWeight={700}>+{r.cantidadSugerida}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Nombre de la sede elegida ("all" o vacío => null = sin filtrar). */
export function useNombreSede(sede) {
  const { data: sedes = [] } = useSedes();
  if (!sede || sede === "all") return null;
  return sedes.find((s) => String(s.idSede) === String(sede))?.nombreSede ?? null;
}
