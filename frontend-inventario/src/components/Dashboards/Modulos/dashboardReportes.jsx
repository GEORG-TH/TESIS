import BarChartIcon from "@mui/icons-material/BarChart";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PaidIcon from "@mui/icons-material/Paid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import InventoryIcon from "@mui/icons-material/Inventory";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ModuloDashboard from "../Shared/ModuloDashboard";

const DashboardReportes = () => (
    <ModuloDashboard
        titulo="Reportes"
        subtitulo="Indicadores de inventario, movimientos y auditoría."
        icon={<BarChartIcon />}
        secciones={[
            {
                titulo: "Inventario",
                items: [
                    { id: "quiebre", titulo: "Quiebres de Stock", descripcion: "Verifica los quiebres de stock en el inventario.", ruta: "/reporte-quiebre-stock", icon: <ReportProblemIcon />, color: "error" },
                    { id: "valorizado", titulo: "Reporte Valorizado", descripcion: "Consulta el valor monetario del inventario por sede, categoría o proveedor.", ruta: "/reporte-valorizado", icon: <PaidIcon />, color: "success" },
                    { id: "muerto", titulo: "Stock Muerto", descripcion: "Productos que no se han movido en el inventario.", ruta: "/reporte-stock-muerto", icon: <InventoryIcon />, color: "info" },
                ],
            },
            {
                titulo: "Movimientos",
                items: [
                    { id: "entradas", titulo: "Entradas", descripcion: "Visualiza las entradas de productos al inventario.", ruta: "/reporte-entradas", icon: <MoveToInboxIcon />, color: "success" },
                    { id: "salidas", titulo: "Salidas", descripcion: "Visualiza las salidas de productos del inventario.", ruta: "/reporte-salidas", icon: <OutboxIcon />, color: "warning" },
                    { id: "merma", titulo: "Merma", descripcion: "Visualiza el costo de merma en el inventario.", ruta: "/reporte-merma", icon: <WarningAmberIcon />, color: "error" },
                ],
            },
            {
                titulo: "Auditoría",
                items: [
                    { id: "diferencias", titulo: "Diferencias de Inventario", descripcion: "Verifica las diferencias entre el sistema y el conteo físico.", ruta: "/reporte-diferencias", icon: <CompareArrowsIcon />, color: "secondary" },
                    { id: "auditoria", titulo: "Auditoría de Usuarios", descripcion: "Verifica las acciones realizadas por los usuarios en el sistema.", ruta: "/auditoria/actividad/usuario", icon: <ManageSearchIcon />, color: "primary" },
                ],
            },
        ]}
    />
);

export default DashboardReportes;
