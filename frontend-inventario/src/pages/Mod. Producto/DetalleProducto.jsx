import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducto } from '../../api/productoApi';
import LayoutDashboard from '../../components/Layouts/LayoutDashboard';
import {
    Box, Paper, Typography, Grid, Chip, Divider, Button,
    Stack, CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QrCodeIcon from '@mui/icons-material/QrCode';

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: producto, isLoading, isError } = useQuery({
        queryKey: ['producto', id],
        queryFn: () => getProducto(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <LayoutDashboard>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            </LayoutDashboard>
        );
    }

    if (isError || !producto) {
        return (
            <LayoutDashboard>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                        No se pudo cargar la información del producto. Verifica que el ID sea correcto.
                    </Alert>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/lista-productos')}
                        sx={{ mt: 2 }}
                    >
                        Volver a la lista
                    </Button>
                </Box>
            </LayoutDashboard>
        );
    }

    // Helper para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    };

    return (
        <LayoutDashboard>
            <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>

                {/* --- HEADER --- */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/lista-productos')}
                        color="inherit"
                    >
                        Volver
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Botón opcional para ir a editar directamente */}
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/productos/editar/${id}`)} 
                            disabled={true}
                        >
                            Editar
                        </Button>
                    </Box>
                </Box>

                {/* --- TARJETA PRINCIPAL --- */}
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: 3
                    }}
                >
                    {/* Título y Estado */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Inventory2Icon color="primary" sx={{ fontSize: 60, mb: 1, opacity: 0.8 }} />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {producto.nombre}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {producto.marca}
                        </Typography>
                        <Chip
                            label={producto.estado ? "ACTIVO" : "INACTIVO"}
                            color={producto.estado ? "success" : "default"}
                            sx={{ mt: 1, fontWeight: 'bold' }}
                        />
                    </Box>

                    <Grid container spacing={4}>

                        {/* COLUMNA 1: Datos de Identificación */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" mb={2} gap={1}>
                                        <QrCodeIcon color="action" />
                                        <Typography variant="h6">Identificación</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">SKU</Typography>
                                            <Typography variant="body1" fontWeight="medium">{producto.sku}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Código EAN</Typography>
                                            <Typography variant="body1" fontWeight="medium">{producto.codEan || producto.ean || '-'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Categoría</Typography>
                                            <Typography variant="body1">{producto.categoria?.nombreCat || '-'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Unidad de Medida</Typography>
                                            <Typography variant="body1">{producto.uni_medida}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* COLUMNA 2: Datos Económicos */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" mb={2} gap={1}>
                                        <MonetizationOnIcon color="action" />
                                        <Typography variant="h6">Precios y Costos</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Precio de Compra</Typography>
                                            <Typography variant="h6" color="text.primary">
                                                {formatCurrency(producto.precio_compra)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Precio de Venta</Typography>
                                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                {formatCurrency(producto.precio_venta)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Alert severity="info" icon={false} sx={{ py: 0, mt: 1 }}>
                                                Margen estimado: {formatCurrency(producto.precio_venta - producto.precio_compra)}
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* COLUMNA 3: Logística y Stock (Nuevos Campos) */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" mb={2} gap={1}>
                                        <Inventory2Icon color="action" />
                                        <Typography variant="h6">Configuración de Stock</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Stock Mínimo (Alerta)</Typography>
                                            <Chip
                                                label={producto.stockMinimo ?? "No definido"}
                                                color="warning"
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold', mt: 0.5 }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Stock Ideal (Meta)</Typography>
                                            <Chip
                                                label={producto.stockIdeal ?? "No definido"}
                                                color="success"
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold', mt: 0.5 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                * Estos valores se usan para generar las sugerencias de compra automática.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* COLUMNA 4: Proveedor */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" mb={2} gap={1}>
                                        <LocalShippingIcon color="action" />
                                        <Typography variant="h6">Proveedor Principal</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Razón Social</Typography>
                                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                                            {producto.proveedor?.nombre_proveedor || "No asignado"}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">Contacto</Typography>
                                        <Typography variant="body2">
                                            {producto.proveedor?.telefono || "-"}
                                        </Typography>
                                        <Typography variant="body2">
                                            {producto.proveedor?.email || "-"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </LayoutDashboard>
    );
};

export default DetalleProducto;