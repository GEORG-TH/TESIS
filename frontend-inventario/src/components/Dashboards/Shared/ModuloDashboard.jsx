import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Card, CardActionArea, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LayoutDashboard from "../../Layouts/LayoutDashboard";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const EASE = [0.22, 1, 0.36, 1];

function ItemCard({ item, index }) {
  const navigate = useNavigate();
  const color = item.color || "primary";
  const deshabilitado = !!item.proximamente;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 + index * 0.05, ease: EASE }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          height: "100%", border: "1px solid", borderColor: "divider",
          opacity: deshabilitado ? 0.6 : 1,
          backgroundImage: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette[color].main, t.palette.mode === "dark" ? 0.12 : 0.05)}, transparent 60%)`,
          transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
          "&:hover": deshabilitado
            ? undefined
            : { transform: "translateY(-3px)", borderColor: (t) => alpha(t.palette[color].main, 0.5) },
        }}
      >
        <CardActionArea
          disabled={deshabilitado}
          onClick={() => navigate(item.ruta)}
          sx={{ height: "100%", p: 2.25, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start", gap: 1.25 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                width: 42, height: 42, borderRadius: "12px", display: "flex", alignItems: "center",
                justifyContent: "center", color: `${color}.main`,
                bgcolor: (t) => alpha(t.palette[color].main, 0.14),
                border: "1px solid", borderColor: (t) => alpha(t.palette[color].main, 0.35),
                "& svg": { fontSize: 22 },
              }}
            >
              {item.icon}
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              {item.badge > 0 && (
                <Chip
                  size="small" color="warning" label={`${item.badge} pendiente${item.badge === 1 ? "" : "s"}`}
                  sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 700 }}
                />
              )}
              {deshabilitado ? (
                <Chip size="small" variant="outlined" label="Próximamente" sx={{ fontFamily: MONO, fontSize: 11 }} />
              ) : (
                <ArrowForwardIcon fontSize="small" sx={{ color: "text.secondary" }} />
              )}
            </Stack>
          </Stack>
          <Box>
            <Typography sx={{ fontFamily: SORA, fontWeight: 600, fontSize: 16, lineHeight: 1.3 }}>
              {item.titulo}
            </Typography>
            {item.descripcion && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {item.descripcion}
              </Typography>
            )}
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}

/**
 * Dashboard de módulo: cabecera + secciones de tarjetas con acceso a cada función.
 * secciones: [{ titulo, items: [{ id, titulo, descripcion, ruta, icon, color?, badge?, proximamente? }] }]
 */
export default function ModuloDashboard({ titulo, subtitulo, icon, secciones }) {
  let n = 0;
  return (
    <LayoutDashboard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 52, height: 52, borderRadius: "14px", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff", flexShrink: 0, "& svg": { fontSize: 28 },
              backgroundImage: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.info.main})`,
              boxShadow: (t) => `0 8px 20px ${alpha(t.palette.primary.main, 0.4)}`,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="h1" sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 22, md: 28 }, letterSpacing: "-0.01em" }}>
              {titulo}
            </Typography>
            {subtitulo && (
              <Typography variant="body2" color="text.secondary">{subtitulo}</Typography>
            )}
          </Box>
        </Stack>

        {secciones.map((sec) => (
          <Box key={sec.titulo}>
            <Typography
              sx={{
                fontFamily: MONO, fontWeight: 700, fontSize: 12, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "text.secondary", mb: 1.5,
                pb: 1, borderBottom: "1px solid", borderColor: "divider",
              }}
            >
              {sec.titulo}
            </Typography>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}>
              {sec.items.map((item) => (
                <ItemCard key={item.id} item={item} index={n++} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </LayoutDashboard>
  );
}
