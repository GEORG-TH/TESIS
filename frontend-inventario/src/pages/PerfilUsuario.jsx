import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import LayoutDashboard from "../components/Layouts/LayoutDashboard";
import MfaSetup from "./MfaSetup";
import { useGlobalStore } from "../store/useGlobalStore";
import {
  Typography, Box, Avatar, Chip, IconButton, Badge, Card, Stack, Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Swal from "sweetalert2";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BadgeIcon from "@mui/icons-material/Badge";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import TagIcon from "@mui/icons-material/Tag";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { subirFotoPerfil } from "../api/usuarioApi";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const EASE = [0.22, 1, 0.36, 1];

const iniciales = (n = "", a = "") =>
  `${n.trim()[0] || ""}${a.trim()[0] || ""}`.toUpperCase() || "U";

function DatoFila({ icon, label, valor, mono }) {
  return (
    <Stack
      direction="row" spacing={1.5} alignItems="center"
      sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", minWidth: 0 }}
    >
      <Box
        sx={{
          width: 38, height: 38, borderRadius: "10px", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0, color: "primary.main",
          bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          "& svg": { fontSize: 20 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em" }}>
          {label}
        </Typography>
        <Typography
          variant="body2" noWrap title={String(valor)}
          sx={{ fontWeight: 600, ...(mono && { fontFamily: MONO }) }}
        >
          {String(valor)}
        </Typography>
      </Box>
    </Stack>
  );
}

function PerfilUsuario() {
  const usuario = useGlobalStore((state) => state.user) || {};
  const setUser = useGlobalStore((state) => state.setUser);
  const fileInputRef = useRef(null);
  const [fotoActual, setFotoActual] = useState(usuario.fotoUrl || "");

  const apellidos = [usuario.apellido_pat, usuario.apellido_mat].filter(Boolean).join(" ");
  const nombre = usuario.nombre_u || "";
  const nombreCompleto = [nombre, apellidos].filter(Boolean).join(" ") || "Usuario";
  const estadoBruto = usuario.estado_u;
  const estadoTexto =
    typeof estadoBruto === "boolean" ? (estadoBruto ? "Activo" : "Inactivo") : estadoBruto || "—";
  const activo = estadoTexto === "Activo";
  const rolTexto = usuario.rol || "—";

  useEffect(() => {
    if (usuario.fotoUrl) setFotoActual(usuario.fotoUrl);
  }, [usuario.fotoUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "El archivo debe ser una imagen", "error");
      return;
    }
    try {
      Swal.fire({ title: "Subiendo foto...", didOpen: () => Swal.showLoading() });
      const respuesta = await subirFotoPerfil(usuario.id_u, file);
      setFotoActual(respuesta.fotoUrl);
      setUser((prevUser) => ({ ...prevUser, fotoUrl: respuesta.fotoUrl }));
      Swal.fire("Éxito", "Tu foto de perfil ha sido actualizada", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  const datos = [
    { icon: <PersonIcon />, label: "NOMBRE", valor: nombre || "—" },
    { icon: <PersonIcon />, label: "APELLIDOS", valor: apellidos || "—" },
    { icon: <BadgeIcon />, label: "DNI", valor: usuario.dni ?? "—", mono: true },
    { icon: <MailOutlineIcon />, label: "CORREO", valor: usuario.email ?? "—" },
    { icon: <AdminPanelSettingsIcon />, label: "ROL", valor: rolTexto },
    { icon: <TagIcon />, label: "ID DE USUARIO", valor: usuario.id_u ?? usuario.id ?? "—", mono: true },
  ];

  const fade = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  });

  return (
    <LayoutDashboard>
      <Box sx={{ maxWidth: 1100, mx: "auto", display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography component="h1" sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 22, md: 28 }, letterSpacing: "-0.01em" }}>
          Mi perfil
        </Typography>

        {/* Cabecera: portada + avatar + identidad */}
        <motion.div {...fade(0)}>
          <Card sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Box
              sx={{
                height: 96,
                backgroundImage: (t) =>
                  `linear-gradient(120deg, ${t.palette.primary.dark}, ${t.palette.primary.main} 55%, ${t.palette.info.main})`,
                position: "relative",
                "&::after": {
                  content: '""', position: "absolute", inset: 0,
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
                  backgroundSize: "22px 22px", opacity: 0.5,
                },
              }}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "flex-end" }}
              spacing={2.5} sx={{ px: 3, pb: 3, mt: "-48px", position: "relative", zIndex: 1 }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Tooltip title="Cambiar foto">
                    <IconButton
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Cambiar foto de perfil"
                      sx={{
                        bgcolor: "primary.main", color: "#fff", width: 34, height: 34,
                        border: "3px solid", borderColor: "background.paper",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={fotoActual || undefined}
                  alt="Foto de perfil"
                  sx={{
                    width: 104, height: 104, fontSize: 36, fontFamily: SORA, fontWeight: 700,
                    border: "4px solid", borderColor: "background.paper",
                    bgcolor: "primary.main", color: "#fff",
                    boxShadow: (t) => `0 8px 24px ${alpha(t.palette.primary.main, 0.35)}`,
                  }}
                >
                  {iniciales(nombre, usuario.apellido_pat)}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" } }}>
                <Typography sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 20, md: 24 }, lineHeight: 1.2 }} noWrap>
                  {nombreCompleto}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                  {usuario.email || ""}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent={{ xs: "center", sm: "flex-start" }} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small" icon={<AdminPanelSettingsIcon />}
                    label={rolTexto === "—" ? "Rol no asignado" : rolTexto}
                    color="primary" variant="outlined"
                    sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}
                  />
                  <Chip
                    size="small" label={estadoTexto} color={activo ? "success" : "error"}
                    sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}
                  />
                  {usuario.mfaEnabled && (
                    <Chip
                      size="small" icon={<VerifiedUserIcon />} label="2FA activo" color="success" variant="outlined"
                      sx={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* Detalles + Seguridad */}
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" }, alignItems: "start" }}>
          <motion.div {...fade(1)}>
            <Card sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontFamily: SORA, fontWeight: 600, fontSize: 17, mb: 0.25 }}>
                Detalles de la cuenta
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }}>
                Información registrada en el sistema
              </Typography>
              <Box
                sx={{
                  mt: 2, display: "grid", gap: 1.5,
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))",
                }}
              >
                {datos.map((d) => <DatoFila key={d.label} {...d} />)}
              </Box>
            </Card>
          </motion.div>

          <motion.div {...fade(2)}>
            <Card sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontFamily: SORA, fontWeight: 600, fontSize: 17, mb: 0.25 }}>
                Seguridad
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: MONO, fontSize: 11 }}>
                Autenticación de dos factores
              </Typography>
              <Box sx={{ mt: 2 }}>
                <MfaSetup />
              </Box>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </LayoutDashboard>
  );
}

export default PerfilUsuario;
