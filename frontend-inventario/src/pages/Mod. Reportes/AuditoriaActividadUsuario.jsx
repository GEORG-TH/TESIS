import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // 1. Importar hook
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Chip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import TablaLista from '../../components/TablaLista';
import { filtrarActividades } from '../../api/historialActividadApi';
import { getUsuarios } from '../../api/usuarioApi'; // Asegúrate que esta importación sea correcta

const AuditoriaActividadUsuario = () => {
    const navigate = useNavigate();

    // Estado del formulario (Inputs)
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        usuarioId: '',
        modulo: ''
    });

    // Estado para la consulta (Lo que dispara el fetch)
    const [filtrosAplicados, setFiltrosAplicados] = useState({});

    // 2. Query para cargar Usuarios (Reemplaza el useEffect de usuarios)
    const { data: listaUsuarios = [] } = useQuery({
        queryKey: ['usuarios'],
        queryFn: getUsuarios,
        staleTime: 1000 * 60 * 10, // Cachear usuarios por 10 minutos
        initialData: []
    });

    // 3. Query para cargar Actividades (Depende de filtrosAplicados)
    const {
        data: actividades = [],
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['auditoria', filtrosAplicados], // Al cambiar filtrosAplicados, React Query refesca
        queryFn: () => filtrarActividades(filtrosAplicados),
        // keepPreviousData: true // (Opcional) Mantiene los datos viejos mientras cargan los nuevos
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    // 4. Manejador de búsqueda: Actualiza filtrosAplicados para disparar el Query
    const handleBuscar = () => {
        const params = {};
        // Solo agregamos al objeto si tienen valor
        if (filtros.usuarioId) params.usuarioId = filtros.usuarioId;
        if (filtros.modulo) params.modulo = filtros.modulo;
        if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
        if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;

        setFiltrosAplicados(params); // Esto cambiará la queryKey y disparará el fetch
    };

    const handleLimpiar = () => {
        const estadoInicial = {
            fechaInicio: '',
            fechaFin: '',
            usuarioId: '',
            modulo: ''
        };
        setFiltros(estadoInicial);
        setFiltrosAplicados({}); // Limpia la tabla o trae todo (según tu backend)
    };

    const columns = useMemo(() => [
        {
            field: 'fechaHora',
            headerName: 'Fecha y Hora',
            width: 200,
            valueFormatter: (params) => {
                if (!params) return '';
                return new Date(params).toLocaleString('es-PE');
            }
        },
        { field: 'nombreUsuario', headerName: 'Usuario', width: 100 },
        {
            field: 'rolUsuario',
            headerName: 'Rol',
            width: 120,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined" color="primary" />
            )
        },
        {
            field: 'tipoAccion',
            headerName: 'Acción',
            width: 120,
            renderCell: (params) => {
                let color = 'default';
                if (params.value === 'CREACIÓN') color = 'success';
                if (params.value === 'ACTUALIZACIÓN') color = 'primary';
                if (params.value === 'ELIMINACIÓN') color = 'error';
                if (params.value === 'LOGIN') color = 'info';
                if (params.value === 'ACTIVACIÓN') {
                    return <Chip label={params.value} sx={{ bgcolor: 'green', color: 'white', fontWeight: 'bold' }} />;
                }
                if (params.value === 'DESACTIVACIÓN') {
                    return <Chip label={params.value} sx={{ bgcolor: 'yellow', color: 'black', fontWeight: 'bold' }} />;
                }
                if (params.value === 'RECEPCIÓN') {
                    return <Chip label={params.value} sx={{ bgcolor: 'orange', color: 'black', fontWeight: 'bold' }} />;
                }

                return <Chip label={params.value} color={color} size="small" sx={{ fontWeight: 'bold',  }} />;
            }
        },
        { field: 'modulo', headerName: 'Módulo', width: 130 },
        { field: 'entidadAfectada', headerName: 'Entidad', width: 120 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 250 },
        { field: 'ipDireccion', headerName: 'IP', width: 130 },
    ], []);

    return (
        <>
            <Box sx={{ p: 2, m: { xs: 1, sm: 2, md: 3 }, mb: 0, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            label="Desde"
                            type="datetime-local"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            label="Hasta"
                            type="datetime-local"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Usuario"
                            name="usuarioId"
                            value={filtros.usuarioId}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            {listaUsuarios.map((user) => (
                                <MenuItem key={user.id_u} value={user.id_u}>
                                    {user.nombre_u} {user.apellido_pat}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Módulo"
                            name="modulo"
                            value={filtros.modulo}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="Inventario">Inventario</MenuItem>
                            <MenuItem value="Seguridad">Seguridad</MenuItem>
                            <MenuItem value="Reportes">Reportes</MenuItem>
                            <MenuItem value="Ventas">Ventas</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleBuscar}
                            disabled={isLoading}
                            fullWidth
                        >
                            Buscar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleLimpiar}>
                            <CleaningServicesIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <TablaLista
                title="Reporte de Auditoría"
                columns={columns}
                data={actividades}
                isLoading={isLoading}
                onRefresh={refetch} // TanStack Query nos da esta función directa
                getRowId={(row) => row.id}
                onBack={() => navigate('/dashboard-reportes')}
            />
        </>
    );
};

export default AuditoriaActividadUsuario;