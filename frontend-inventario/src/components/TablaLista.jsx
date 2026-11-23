import { useState } from "react";
import { motion } from "framer-motion";
import {
    Card, Box, Button,
    Menu, MenuItem, ListItemIcon, ListItemText, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LayoutDashboard from "./Layouts/LayoutDashboard";
import PageHeader from "./PageHeader";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useGlobalStore } from "../store/useGlobalStore";
import { exportTableData } from "../Utils/exportUtils";

const GRADIENTE = "linear-gradient(135deg, #2563eb, #3b82f6 55%, #06b6d4)";

const TablaLista = ({
    title,
    columns,
    data,
    isLoading,
    onRefresh,
    onAdd,
    onBack,
    getRowId,
    addButtonLabel = "Ingresar Nuevo",
    children
}) => {
    const density = useGlobalStore((state) => state.density);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const encabezadoBg = alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClickExport = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleExport = (format) => {
        exportTableData(data, columns, title.replace(/\s+/g, '_'), format);
        handleCloseMenu();
    };

    const botonSuave = { borderColor: "divider" };

    return (
        <LayoutDashboard>
            {children}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <Card
                    sx={{
                        p: { xs: 2, md: 3 },
                        display: 'flex',
                        flexDirection: 'column',
                        height: { xs: 'auto', md: 'calc(100dvh - 140px)' },
                        minHeight: { md: 460 },
                        overflow: 'hidden'
                    }}
                >
                    <PageHeader
                        title={title}
                        actions={
                            <>
                                {onBack && (
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        sx={botonSuave}
                                        startIcon={<ArrowBackIcon />}
                                        onClick={onBack}
                                    >
                                        Volver
                                    </Button>
                                )}
                                {onRefresh && (
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        sx={botonSuave}
                                        startIcon={<RefreshIcon />}
                                        onClick={onRefresh}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Cargando..." : "Actualizar"}
                                    </Button>
                                )}
                                {onAdd && (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={onAdd}
                                        sx={{
                                            backgroundImage: GRADIENTE,
                                            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
                                            "&:hover": {
                                                filter: "brightness(1.08)",
                                                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.45)",
                                            },
                                        }}
                                    >
                                        {addButtonLabel}
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    sx={botonSuave}
                                    startIcon={<FileDownloadIcon />}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleClickExport}
                                    disabled={!data || data.length === 0}
                                >
                                    Exportar
                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={() => handleExport('xlsx')}>
                                        <ListItemIcon>
                                            <DescriptionIcon fontSize="small" sx={{ color: '#1D6F42' }} />
                                        </ListItemIcon>
                                        <ListItemText>Excel (.xlsx)</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleExport('csv')}>
                                        <ListItemIcon>
                                            <TextSnippetIcon fontSize="small" sx={{ color: '#217346' }} />
                                        </ListItemIcon>
                                        <ListItemText>CSV (.csv)</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                    />
                    {/* La grilla ocupa todo el alto restante de la tarjeta (antes tenía 650px fijos). */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 380,
                            width: "100%",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                        }}
                    >
                        <DataGrid
                            rows={data}
                            columns={columns}
                            density={density}
                            loading={isLoading}
                            getRowId={getRowId}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            overflowY="hidden"
                            sx={{
                                border: "none",
                                "--DataGrid-overlayHeight": "300px",
                                // El encabezado es "sticky": su fondo debe ser OPACO (color de la tarjeta
                                // + tinte encima). Con un color translúcido las filas se ven a través al hacer scroll.
                                "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller": {
                                    backgroundColor: theme.palette.background.paper,
                                    backgroundImage: `linear-gradient(${encabezadoBg}, ${encabezadoBg})`,
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    color: theme.palette.text.secondary,
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                },
                                "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
                                    color: theme.palette.text.secondary,
                                },
                                "& .MuiDataGrid-columnSeparator": {
                                    color: theme.palette.divider,
                                },
                                "& .MuiDataGrid-cell": {
                                    borderColor: theme.palette.divider,
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.06),
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderColor: theme.palette.divider,
                                },
                            }}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            slotProps={{
                                pagination: {
                                    labelRowsPerPage: "Filas por página:",
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
                                },
                            }}
                        />
                    </Box>
                </Card>
            </motion.div>
        </LayoutDashboard>
    );
};

export default TablaLista;
