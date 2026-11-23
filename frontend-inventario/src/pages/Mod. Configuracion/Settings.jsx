import React from "react";
import { motion } from "framer-motion";
import { useGlobalStore } from "../../store/useGlobalStore";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";
import { LOGO_NAVY } from "../../theme/appTheme";
import {
    Typography, Box, Card, Stack, Switch, Button, ButtonBase, Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PaletteIcon from "@mui/icons-material/Palette";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const EASE = [0.22, 1, 0.36, 1];
const COLOR_POR_DEFECTO = "#ffffffff"; // el sidebar interpreta el blanco como "usar el azul de marca"

const esBlanco = (c) => !c || ["#ffffffff", "#ffffff", "#fff"].includes(String(c).toLowerCase());

/** Tarjeta de sección con icono y descripción. */
function Seccion({ icon, titulo, descripcion, children, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.07 * index, ease: EASE }}
        >
            <Card sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            width: 40, height: 40, borderRadius: "11px", display: "flex", alignItems: "center",
                            justifyContent: "center", color: "primary.main", flexShrink: 0,
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.13),
                            border: "1px solid", borderColor: (t) => alpha(t.palette.primary.main, 0.3),
                            "& svg": { fontSize: 22 },
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: SORA, fontWeight: 600, fontSize: 17, lineHeight: 1.2 }}>
                            {titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }}>
                            {descripcion}
                        </Typography>
                    </Box>
                </Stack>
                {children}
            </Card>
        </motion.div>
    );
}

/** Botón-opción seleccionable (tema, densidad, tamaño de fuente). */
function Opcion({ selected, onClick, children, label, sx }) {
    return (
        <ButtonBase
            onClick={onClick}
            aria-pressed={selected}
            sx={{
                position: "relative", display: "flex", flexDirection: "column", alignItems: "stretch",
                gap: 1, p: 1.25, borderRadius: 2, textAlign: "left",
                border: "2px solid", borderColor: selected ? "primary.main" : "divider",
                bgcolor: (t) => (selected ? alpha(t.palette.primary.main, 0.07) : "transparent"),
                transition: "border-color .2s ease, background-color .2s ease, transform .15s ease",
                "&:hover": { borderColor: selected ? "primary.main" : "text.secondary", transform: "translateY(-2px)" },
                ...sx,
            }}
        >
            {selected && (
                <CheckCircleIcon
                    sx={{ position: "absolute", top: 8, right: 8, fontSize: 20, color: "primary.main", zIndex: 1 }}
                />
            )}
            {children}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
        </ButtonBase>
    );
}

/** Mini maqueta de la app: barra lateral + contenido, en claro u oscuro. */
function MiniApp({ modo, sidebar }) {
    const oscuro = modo === "dark";
    const fondo = oscuro ? "#18181b" : "#f8fafc";
    const papel = oscuro ? "#232326" : "#ffffff";
    const linea = oscuro ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.1)";
    return (
        <Box sx={{ display: "flex", height: 84, borderRadius: 1.5, overflow: "hidden", bgcolor: fondo, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ width: 22, bgcolor: sidebar, display: "flex", flexDirection: "column", gap: 0.6, p: 0.6, pt: 1 }}>
                {[0, 1, 2, 3].map((i) => (
                    <Box key={i} sx={{ height: 5, borderRadius: 1, bgcolor: "rgba(255,255,255,0.55)", opacity: i === 0 ? 1 : 0.4 }} />
                ))}
            </Box>
            <Box sx={{ flex: 1, p: 0.9, display: "flex", flexDirection: "column", gap: 0.7 }}>
                <Box sx={{ height: 6, width: "45%", borderRadius: 1, bgcolor: oscuro ? "#f4f4f5" : "#1f2937", opacity: 0.85 }} />
                <Box sx={{ display: "flex", gap: 0.6 }}>
                    {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ flex: 1, height: 20, borderRadius: 1, bgcolor: papel, border: `1px solid ${linea}` }} />
                    ))}
                </Box>
                <Box sx={{ flex: 1, borderRadius: 1, bgcolor: papel, border: `1px solid ${linea}` }} />
            </Box>
        </Box>
    );
}

const COLORES_SIDEBAR = [
    { label: "Azul marino (predeterminado)", value: COLOR_POR_DEFECTO, mostrar: LOGO_NAVY },
    { label: "Negro azulado", value: "#0f172a", mostrar: "#0f172a" },
    { label: "Azul", value: "#1d4ed8", mostrar: "#1d4ed8" },
    { label: "Verde bosque", value: "#14532d", mostrar: "#14532d" },
    { label: "Violeta", value: "#5b21b6", mostrar: "#5b21b6" },
    { label: "Grafito", value: "#374151", mostrar: "#374151" },
];

const TAMANOS = [
    { value: "small", label: "Pequeño", px: 14 },
    { value: "medium", label: "Mediano", px: 17 },
    { value: "large", label: "Grande", px: 21 },
];

const Fila = ({ titulo, descripcion, checked, onChange }) => (
    <Stack
        direction="row" alignItems="center" justifyContent="space-between" spacing={2}
        sx={{ py: 1.25, "&:not(:last-of-type)": { borderBottom: "1px solid", borderColor: "divider" } }}
    >
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{titulo}</Typography>
            <Typography variant="caption" color="text.secondary">{descripcion}</Typography>
        </Box>
        <Switch checked={checked} onChange={onChange} inputProps={{ "aria-label": titulo }} />
    </Stack>
);

const Settings = () => {
    const {
        theme, fontSize, density, sidebarCollapsed, showFooter, lightThemeColor,
        setTheme, setFontSize, setDensity, setSidebarCollapsed, setShowFooter, setLightThemeColor,
    } = useGlobalStore();

    const sidebarMini = esBlanco(lightThemeColor) ? LOGO_NAVY : lightThemeColor;
    const restablecer = () => {
        setTheme("light");
        setFontSize("medium");
        setDensity("comfortable");
        setSidebarCollapsed(false);
        setShowFooter(true);
        setLightThemeColor(COLOR_POR_DEFECTO);
    };

    return (
        <LayoutDashboard>
            <Box sx={{ maxWidth: 1000, mx: "auto", display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} flexWrap="wrap" useFlexGap>
                    <Box>
                        <Typography component="h1" sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 22, md: 28 }, letterSpacing: "-0.01em" }}>
                            Preferencias de la interfaz
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Personaliza el aspecto y la lectura del sistema para tu espacio de trabajo. Los cambios se aplican al instante.
                        </Typography>
                    </Box>
                    <Button variant="outlined" color="inherit" size="small" startIcon={<RestartAltIcon />} onClick={restablecer} sx={{ borderColor: "divider" }}>
                        Restablecer
                    </Button>
                </Stack>

                {/* Tema */}
                <Seccion index={0} icon={<PaletteIcon />} titulo="Tema de la aplicación" descripcion="Elige el estilo visual">
                    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                        <Opcion selected={theme === "light"} onClick={() => setTheme("light")} label="Claro">
                            <MiniApp modo="light" sidebar={sidebarMini} />
                        </Opcion>
                        <Opcion selected={theme === "dark"} onClick={() => setTheme("dark")} label="Oscuro">
                            <MiniApp modo="dark" sidebar="#27272a" />
                        </Opcion>
                    </Box>

                    {theme === "light" && (
                        <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                                Color de la barra lateral y el pie
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Solo en tema claro.
                            </Typography>
                            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                                {COLORES_SIDEBAR.map((c) => {
                                    const activo = c.value === COLOR_POR_DEFECTO
                                        ? esBlanco(lightThemeColor)
                                        : String(lightThemeColor).toLowerCase() === c.value;
                                    return (
                                        <Tooltip key={c.label} title={c.label}>
                                            <ButtonBase
                                                onClick={() => setLightThemeColor(c.value)}
                                                aria-label={c.label}
                                                aria-pressed={activo}
                                                sx={{
                                                    width: 36, height: 36, borderRadius: "50%", bgcolor: c.mostrar,
                                                    border: "3px solid", borderColor: activo ? "primary.main" : "transparent",
                                                    outline: "1px solid", outlineColor: "divider", outlineOffset: 1,
                                                    transition: "transform .15s ease",
                                                    "&:hover": { transform: "scale(1.1)" },
                                                }}
                                            >
                                                {activo && <CheckCircleIcon sx={{ fontSize: 18, color: "#fff" }} />}
                                            </ButtonBase>
                                        </Tooltip>
                                    );
                                })}
                                <Tooltip title="Color personalizado">
                                    <Box
                                        component="label"
                                        sx={{
                                            display: "inline-flex", alignItems: "center", gap: 1, px: 1.25, height: 36,
                                            borderRadius: 999, border: "1px dashed", borderColor: "divider", cursor: "pointer",
                                            fontFamily: MONO, fontSize: 11, color: "text.secondary",
                                        }}
                                    >
                                        Personalizado
                                        <input
                                            type="color"
                                            value={esBlanco(lightThemeColor) ? "#00265f" : lightThemeColor.slice(0, 7)}
                                            onChange={(e) => setLightThemeColor(e.target.value)}
                                            style={{ width: 24, height: 24, border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
                                        />
                                    </Box>
                                </Tooltip>
                            </Stack>
                        </Box>
                    )}
                </Seccion>

                {/* Tipografía */}
                <Seccion index={1} icon={<TextFieldsIcon />} titulo="Tamaño de fuente" descripcion="Escala tipográfica de la interfaz">
                    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "repeat(3, 1fr)" }}>
                        {TAMANOS.map((t) => (
                            <Opcion key={t.value} selected={fontSize === t.value} onClick={() => setFontSize(t.value)} label={t.label}>
                                <Typography sx={{ fontFamily: SORA, fontWeight: 700, fontSize: t.px + 8, lineHeight: 1.1 }}>
                                    Aa
                                </Typography>
                            </Opcion>
                        ))}
                    </Box>
                </Seccion>

                {/* Densidad */}
                <Seccion index={2} icon={<ViewAgendaIcon />} titulo="Densidad" descripcion="Espaciado de listas y tablas">
                    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
                        {[
                            { value: "comfortable", label: "Cómodo", gap: 0.9 },
                            { value: "compact", label: "Compacto", gap: 0.35 },
                        ].map((d) => (
                            <Opcion key={d.value} selected={density === d.value} onClick={() => setDensity(d.value)} label={d.label}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: d.gap, py: 0.5 }}>
                                    {[0, 1, 2, 3].map((i) => (
                                        <Box key={i} sx={{ height: 7, borderRadius: 1, bgcolor: "action.disabledBackground", width: `${92 - i * 12}%` }} />
                                    ))}
                                </Box>
                            </Opcion>
                        ))}
                    </Box>
                </Seccion>

                {/* Comportamiento */}
                <Seccion index={3} icon={<TuneIcon />} titulo="Visibilidad y comportamiento" descripcion="Elementos auxiliares y menú">
                    <Fila
                        titulo="Colapsar la barra lateral por defecto"
                        descripcion="El menú aparece reducido a iconos; puedes expandirlo cuando quieras."
                        checked={sidebarCollapsed}
                        onChange={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                    <Fila
                        titulo="Mostrar pie de página"
                        descripcion="Barra inferior con la versión del sistema y tu sesión."
                        checked={showFooter}
                        onChange={() => setShowFooter(!showFooter)}
                    />
                </Seccion>
            </Box>
        </LayoutDashboard>
    );
};

export default Settings;
