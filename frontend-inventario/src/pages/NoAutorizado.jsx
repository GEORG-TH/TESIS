import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useGlobalStore } from "../store/useGlobalStore";
import { rutaPorRol } from "../utils/rutaPorRol";

const NoAutorizado = () => {
    const navigate = useNavigate();
    const user = useGlobalStore((s) => s.user);
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, p: 3, textAlign: "center" }}>
            <LockIcon sx={{ fontSize: 72 }} color="error" />
            <Typography variant="h4" fontWeight="bold">Acceso no autorizado</Typography>
            <Typography color="text.secondary">No tienes permisos para ver esta página.</Typography>
            <Button variant="contained" onClick={() => navigate(user ? rutaPorRol(user.rol) : "/")}>
                {user ? "Ir a mi panel" : "Ir al inicio de sesión"}
            </Button>
        </Box>
    );
};

export default NoAutorizado;
