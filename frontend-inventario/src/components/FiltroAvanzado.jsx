import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Typography, Box, Button, Paper, TextField, 
  ToggleButton, ToggleButtonGroup, Autocomplete, Stack, useTheme 
} from "@mui/material";

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';

// Importa tu Layout
import LayoutDashboard from "./Layouts/LayoutDashboard"; 

const FiltroAvanzado = ({
  titulo = "Filtro Avanzado",
  onVolver,
  onLimpiar,
  onConsultar,
  filtroAutocomplete, // { label: 'SEDE', placeholder: '...', options: [] }
  filtroToggle,       // { label: 'PRODUCTO', opciones: ['SKU', 'EAN', 'NOMBRE'] }
  filtrosRango = [],  // ['SUBCATEGORÍA', 'CATEGORÍA', 'ÁREA']
}) => {
  const theme = useTheme();

  // Estados para capturar la data
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [toggleSelection, setToggleSelection] = useState(filtroToggle?.opciones[0] || '');
  const [toggleInput, setToggleInput] = useState('');
  const [rangosState, setRangosState] = useState({});

  const handleRangoChange = (tituloRango, campo, valor) => {
    setRangosState(prev => ({
      ...prev,
      [tituloRango]: {
        ...prev[tituloRango],
        [campo]: valor
      }
    }));
  };

  const handleLimpiar = () => {
    setAutocompleteValue(null);
    setToggleSelection(filtroToggle?.opciones[0] || '');
    setToggleInput('');
    setRangosState({});
    if (onLimpiar) onLimpiar();
  };

  const handleConsultar = () => {
    if (onConsultar) {
      onConsultar({
        autocomplete: autocompleteValue,
        toggle: { tipo: toggleSelection, valor: toggleInput },
        rangos: rangosState
      });
    }
  };

  // Estilos responsivos reutilizables
  const labelColumnStyle = {
    width: { xs: '100%', md: '25%' }, 
    borderRight: { md: 1 }, 
    borderBottom: { xs: 1, md: 0 }, 
    borderColor: 'divider', 
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: { xs: 'flex-start', md: 'center' }, 
    p: { xs: 2, md: 3 },
    bgcolor: 'action.hover' 
  };

  const contentColumnStyle = {
    width: { xs: '100%', md: '75%' },
    p: { xs: 2, md: 3 },
    display: 'flex', alignItems: 'center',
    flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 2
  };

  return (
    <LayoutDashboard>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          {/* Encabezado */}
          <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2.125rem' }, color: 'text.primary' }}>
              {titulo}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {onVolver && (
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onVolver} sx={{ flex: { xs: 1, sm: 'none' } }}>VOLVER</Button>
              )}
              <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={handleLimpiar} sx={{ flex: { xs: 1, sm: 'none' } }}>LIMPIAR</Button>
            </Stack>
          </Box>

          {/* Contenedor Principal */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            
            {/* 1. Autocomplete Dinámico */}
            {filtroAutocomplete && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={labelColumnStyle}>
                  <Typography variant="subtitle2" fontWeight="bold">{filtroAutocomplete.label}</Typography>
                </Box>
                <Box sx={contentColumnStyle}>
                  <Autocomplete
                    disablePortal
                    options={filtroAutocomplete.options}
                    value={autocompleteValue}
                    onChange={(e, newValue) => setAutocompleteValue(newValue)}
                    renderInput={(params) => <TextField {...params} placeholder={filtroAutocomplete.placeholder} size="small" />}
                    sx={{ width: '100%' }} // Ajustado al 100% para alinear todo el formulario
                  />
                </Box>
              </Box>
            )}

            {/* 2. Toggle Multiopción Dinámico */}
            {filtroToggle && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderBottom: filtrosRango.length > 0 ? 1 : 0, borderColor: 'divider' }}>
                <Box sx={labelColumnStyle}>
                  <Typography variant="subtitle2" fontWeight="bold">{filtroToggle.label}</Typography>
                </Box>
                <Box sx={{ ...contentColumnStyle, flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
                  
                  {/* Botones de Selección (Centrados) */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <ToggleButtonGroup
                      color="primary" value={toggleSelection} exclusive size="small"
                      onChange={(e, newValue) => { if (newValue !== null) setToggleSelection(newValue); }}
                      sx={{ width: { xs: '100%', md: '80%' }, display: 'flex' }}
                    >
                      {filtroToggle.opciones.map((opcion) => (
                        <ToggleButton key={opcion} value={opcion} sx={{ flex: 1 }}>{opcion}</ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                  
                  {/* Input y Flecha (Alineados al borde usando flex: 1) */}
                  <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField 
                      size="small" 
                      sx={{ flex: 1 }} // Esto obliga al input a empujar el botón a la derecha
                      value={toggleInput} 
                      onChange={(e) => setToggleInput(e.target.value)} 
                    />
                    <Button variant="contained" color="primary" sx={{ minWidth: { xs: '100%', sm: '45px' }, width: { xs: '100%', sm: '45px' } }}>
                      <ArrowRightAltIcon sx={{ transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
                    </Button>
                  </Box>

                </Box>
              </Box>
            )}

            {/* 3. Rangos Dinámicos */}
            {filtrosRango.map((rango, index) => {
              const isLast = index === filtrosRango.length - 1;
              return (
                <Box key={rango} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderBottom: isLast ? 0 : 1, borderColor: 'divider' }}>
                  <Box sx={{ ...labelColumnStyle, borderBottom: isLast ? 0 : labelColumnStyle.borderBottom }}>
                    <Typography variant="subtitle2" fontWeight="bold">{rango}:</Typography>
                    <Typography variant="caption" color="text.secondary">Rango de ID</Typography>
                  </Box>
                  <Box sx={contentColumnStyle}>
                    <TextField 
                      size="small" placeholder="Desde" sx={{ flex: 1 }} 
                      value={rangosState[rango]?.desde || ''}
                      onChange={(e) => handleRangoChange(rango, 'desde', e.target.value)}
                    />
                    <Box sx={{ bgcolor: 'action.selected', borderRadius: '50%', minWidth: 28, height: 28, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">a</Typography>
                    </Box>
                    <TextField 
                      size="small" placeholder="Hasta" sx={{ flex: 1 }}
                      value={rangosState[rango]?.hasta || ''}
                      onChange={(e) => handleRangoChange(rango, 'hasta', e.target.value)}
                    />
                    <Button variant="contained" color="primary" sx={{ minWidth: { xs: '100%', sm: '45px' }, width: { xs: '100%', sm: '45px' } }}>
                      <ArrowRightAltIcon sx={{ transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Botón Inferior */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: 3 }}>
            <Button variant="contained" color="primary" startIcon={<SearchIcon />} size="large" onClick={handleConsultar} sx={{ px: 5, fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}>
              CONSULTAR
            </Button>
          </Box>

        </Paper>
      </motion.div>
    </LayoutDashboard>
  );
};

export default FiltroAvanzado;