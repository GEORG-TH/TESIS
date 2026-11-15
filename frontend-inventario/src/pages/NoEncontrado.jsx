import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useGlobalStore } from "../store/useGlobalStore";
import { rutaPorRol } from "../utils/rutaPorRol";

const NoEncontrado = () => {
    const navigate = useNavigate();
    const user = useGlobalStore((s) => s.user);
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, p: 3, textAlign: "center" }}>
            <Typography variant="h2" fontWeight="bold">404</Typography>
            <Typography variant="h5">Página no encontrada</Typography>
            <Typography color="text.secondary">La dirección que buscas no existe.</Typography>
            <Button variant="contained" onClick={() => navigate(user ? rutaPorRol(user.rol) : "/")}>
                {user ? "Ir a mi panel" : "Ir al inicio de sesión"}
            </Button>
        </Box>
    );
};

export default NoEncontrado;
