import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHuById } from "../../api/huApi";
import {
    Box, Button, Card, CardContent, Chip, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";

const fmt = (v) => (v ? new Date(v).toLocaleString("es-PE") : "---");

const DetalleHu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: hu, isLoading, isError } = useQuery({
        queryKey: ["hu", id],
        queryFn: () => getHuById(id),
    });

    const detalle = hu?.detalle || [];
    const total = detalle.reduce((acc, d) => acc + (d.cantidad || 0), 0);

    return (
        <LayoutDashboard>
            <Box sx={{ p: 3, width: "100%", boxSizing: "border-box" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate("/hu/gestion")}>
                        Volver
                    </Button>
                    <Typography variant="h5" fontWeight="bold">
                        Detalle de HU{hu?.codHu ? `: ${hu.codHu}` : ""}
                    </Typography>
                </Box>

                {isLoading && <Typography>Cargando información de HU...</Typography>}
                {isError && <Typography color="error">No se pudo cargar la HU.</Typography>}

                {hu && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Información General</Typography>
                                    <Typography variant="body2" color="text.secondary">Estado</Typography>
                                    <Chip label={hu.estado} color="primary" variant="outlined" sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">Origen</Typography>
                                    <Typography sx={{ mb: 1 }}>{hu.almacen?.nombreSede || "N/A"}</Typography>
                                    <Typography variant="body2" color="text.secondary">Destino</Typography>
                                    <Typography sx={{ mb: 1 }}>{hu.sedeDestino?.nombreSede || "---"}</Typography>
                                    <Typography variant="body2" color="text.secondary">Tipo</Typography>
                                    <Typography sx={{ mb: 1 }}>{hu.tipoIndicador || "---"}</Typography>
                                    <Typography variant="body2" color="text.secondary">Creación</Typography>
                                    <Typography sx={{ mb: 1 }}>{fmt(hu.fechaCreacion)}</Typography>
                                    <Typography variant="body2" color="text.secondary">Solicitada</Typography>
                                    <Typography sx={{ mb: 1 }}>{fmt(hu.fechaSolicitada)}</Typography>
                                    <Typography variant="body2" color="text.secondary">Vencimiento</Typography>
                                    <Typography>{hu.fechaVencimiento || "---"}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Productos ({detalle.length}) · {total} unidades
                                    </Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell>Producto</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {detalle.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="center">Esta HU no tiene productos.</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    detalle.map((d) => (
                                                        <TableRow key={d.id}>
                                                            <TableCell>{d.producto?.sku || "---"}</TableCell>
                                                            <TableCell>{d.producto?.nombre || "---"}</TableCell>
                                                            <TableCell align="right">{d.cantidad}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </LayoutDashboard>
    );
};

export default DetalleHu;
