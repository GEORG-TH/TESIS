import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { Box, Skeleton, Typography } from "@mui/material";
import { useMovimientos, esEntrada } from "../Dashboards/Shared/dashboardData";

const DIAS = 7;
const fechaUtc = (s) => (s && !String(s).endsWith("Z") ? `${s}Z` : s);
const claveDia = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Entradas vs. salidas (en unidades) de los últimos 7 días, a partir del kardex. */
export default function GraficoMovimientosSemana() {
  const theme = useTheme();
  const { data, isLoading } = useMovimientos();

  const serie = useMemo(() => {
    const hoy = new Date();
    const dias = Array.from({ length: DIAS }, (_, i) => {
      const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (DIAS - 1 - i));
      return {
        clave: claveDia(d),
        dia: d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric" }).replace(".", ""),
        entradas: 0,
        salidas: 0,
      };
    });
    const porClave = Object.fromEntries(dias.map((d) => [d.clave, d]));
    (data ?? []).forEach((m) => {
      if (!m.fecha) return;
      const fila = porClave[claveDia(new Date(fechaUtc(m.fecha)))];
      if (!fila) return;
      const unidades = Math.abs(Number(m.cantidad) || 0);
      if (esEntrada(m.tipoMovimiento, m.cantidad)) fila.entradas += unidades;
      else fila.salidas += unidades;
    });
    return dias;
  }, [data]);

  if (isLoading) return <Skeleton variant="rounded" width="100%" height="100%" />;

  const hayDatos = serie.some((d) => d.entradas > 0 || d.salidas > 0);
  const tick = { fill: theme.palette.text.secondary, fontSize: 11 };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, mb: 0.5 }}>
        Movimientos de los últimos 7 días (unidades)
      </Typography>
      <Box sx={{ flex: 1, minHeight: 150, position: "relative" }}>
        {hayDatos ? (
          <Box sx={{ position: "absolute", inset: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serie} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={2}>
                <CartesianGrid vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="dia" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: theme.palette.action.hover }}
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                    color: theme.palette.text.primary,
                  }}
                  formatter={(v, name) => [`${v} uds`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                <Bar dataKey="entradas" name="Entradas" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                <Bar dataKey="salidas" name="Salidas" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Sin movimientos en los últimos 7 días.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
