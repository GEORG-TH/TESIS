import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Box, Card, Typography, Skeleton, Chip, MenuItem, Select, FormControl,
  InputLabel, Button, Stack, Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getSedes } from "../../../api/sedeApi";
import { useGlobalStore } from "../../../store/useGlobalStore";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const EASE = [0.22, 1, 0.36, 1];

export const fmtFecha = () => {
  const s = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Sede elegida en el selector. "all" = todas. */
export function useSedes() {
  return useQuery({ queryKey: ["sedes"], queryFn: getSedes, staleTime: 5 * 60 * 1000 });
}

/** Cabecera: saludo + fecha + selector de sede opcional. */
export function DashboardHeader({ rol, badge, sede, onSedeChange, incluirTodas = true }) {
  const user = useGlobalStore((s) => s.user);
  const { data: sedes = [] } = useSedes();
  const nombre = user?.nombre_u ? `, ${user.nombre_u}` : "";

  return (
    <Box
      sx={{
        display: "flex", flexWrap: "wrap", alignItems: "flex-end",
        justifyContent: "space-between", gap: 2,
      }}
    >
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          <Typography
            component="h1"
            sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 22, md: 28 }, letterSpacing: "-0.01em" }}
          >
            Hola{nombre}
          </Typography>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", fontWeight: 600,
                color: "info.main", bgcolor: (t) => alpha(t.palette.info.main, 0.12),
                border: "1px solid", borderColor: (t) => alpha(t.palette.info.main, 0.4),
              }}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 12, mt: 0.5 }}>
          {rol} · {fmtFecha()}
        </Typography>
      </Box>

      {onSedeChange && (
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="sede-dash-label">Sede</InputLabel>
          <Select
            labelId="sede-dash-label"
            label="Sede"
            value={sede ?? ""}
            onChange={(e) => onSedeChange(e.target.value)}
          >
            {incluirTodas && <MenuItem value="all">Todas las sedes</MenuItem>}
            {sedes.map((s) => (
              <MenuItem key={s.idSede} value={String(s.idSede)}>{s.nombreSede}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

/** Tarjeta KPI: título, icono, valor grande y dos líneas de apoyo. */
export function KpiCard({ label, value, icon, color = "primary", isLoading, helper, helperRight, onClick, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.07, ease: EASE }}
      style={{ height: "100%" }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: "100%", p: 2.25, display: "flex", flexDirection: "column", gap: 1,
          cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden",
          border: "1px solid", borderColor: "divider",
          backgroundImage: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette[color].main, t.palette.mode === "dark" ? 0.16 : 0.07)}, transparent 60%)`,
          transition: "transform .2s ease, box-shadow .2s ease",
          "&:hover": onClick ? { transform: "translateY(-3px)" } : undefined,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap>
            {label}
          </Typography>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "10px", display: "flex", alignItems: "center",
              justifyContent: "center", color: `${color}.main`, flexShrink: 0,
              bgcolor: (t) => alpha(t.palette[color].main, 0.14),
              border: "1px solid", borderColor: (t) => alpha(t.palette[color].main, 0.35),
              "& svg": { fontSize: 20 },
            }}
          >
            {icon}
          </Box>
        </Stack>

        {isLoading ? (
          <Skeleton variant="text" width={80} height={48} />
        ) : (
          <Typography sx={{ fontFamily: SORA, fontWeight: 700, fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {value}
          </Typography>
        )}

        {(helper || helperRight) && (
          <Stack
            direction="row" justifyContent="space-between" spacing={1}
            sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }} noWrap>
              {helper}
            </Typography>
            {helperRight && (
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }} noWrap>
                {helperRight}
              </Typography>
            )}
          </Stack>
        )}
      </Card>
    </motion.div>
  );
}

/** Panel con título, subtítulo, acción y contenido con scroll interno. */
export function Panel({ title, subtitle, actionLabel, onAction, children, index = 0, sx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: EASE }}
      style={{ height: "100%", minHeight: 0 }}
    >
      <Card
        sx={{
          height: "100%", display: "flex", flexDirection: "column", p: 2.5,
          border: "1px solid", borderColor: "divider", ...sx,
        }}
      >
        <Stack
          direction="row" justifyContent="space-between" alignItems="flex-start"
          sx={{ pb: 1.5, mb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: SORA, fontWeight: 600, fontSize: 17 }} noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actionLabel && (
            <Button size="small" endIcon={<ArrowForwardIcon />} onClick={onAction} sx={{ flexShrink: 0, fontFamily: MONO, fontSize: 12 }}>
              {actionLabel}
            </Button>
          )}
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>
      </Card>
    </motion.div>
  );
}

/** Franja inferior de accesos rápidos. */
export function QuickAccess({ items }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
    >
      <Card
        sx={{
          px: 2.5, py: 1.5, display: "flex", alignItems: "center", flexWrap: "wrap",
          justifyContent: "space-between", gap: 1.5, border: "1px solid", borderColor: "divider",
        }}
      >
        <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em" }}>
          ACCESOS RÁPIDOS
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {items.map((it) => (
            <Button
              key={it.label}
              variant={it.primary ? "contained" : "outlined"}
              color={it.primary ? "primary" : "inherit"}
              size="small"
              startIcon={it.icon}
              onClick={() => navigate(it.path)}
              sx={{ borderColor: "divider", textTransform: "none", fontWeight: 600 }}
            >
              {it.label}
            </Button>
          ))}
        </Stack>
      </Card>
    </motion.div>
  );
}

/** Contenedor de página: cabecera, fila de KPIs, paneles y accesos. */
export function DashboardGrid({ header, kpis, left, right, quick }) {
  return (
    <Box
      sx={{
        display: "grid", gap: 2, minHeight: "100%",
        gridTemplateRows: "auto auto minmax(320px, 1fr) auto",
      }}
    >
      {header}
      <Box
        sx={{
          display: "grid", gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        }}
      >
        {kpis}
      </Box>
      <Box
        sx={{
          display: "grid", gap: 2, minHeight: 0,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        }}
      >
        <Box sx={{ minHeight: 320, minWidth: 0 }}>{left}</Box>
        <Box sx={{ minHeight: 320, minWidth: 0 }}>{right}</Box>
      </Box>
      {quick}
    </Box>
  );
}

/** Fila de lista (avatar con sigla + texto + extremo derecho). */
export function ListRow({ sigla, color = "primary", title, subtitle, right, rightColor, onClick }) {
  return (
    <Stack
      direction="row" alignItems="center" spacing={1.5}
      onClick={onClick}
      sx={{
        p: 1.25, mb: 1, borderRadius: 2, border: "1px solid", borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 36, height: 36, fontSize: 11, fontFamily: MONO, fontWeight: 700,
          color: `${color}.main`, bgcolor: (t) => alpha(t.palette[color].main, 0.14),
        }}
      >
        {sigla}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {right != null && (
        <Typography
          variant="caption"
          sx={{ fontFamily: MONO, fontWeight: 600, flexShrink: 0, color: rightColor || "text.secondary" }}
        >
          {right}
        </Typography>
      )}
    </Stack>
  );
}

export function EmptyState({ text }) {
  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
      ))}
    </>
  );
}
