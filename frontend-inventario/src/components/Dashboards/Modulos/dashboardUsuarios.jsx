import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HistoryIcon from "@mui/icons-material/History";
import SensorsIcon from "@mui/icons-material/Sensors";
import ModuloDashboard from "../Shared/ModuloDashboard";

const DashboardUsuarios = () => (
    <ModuloDashboard
        titulo="Gestión de Usuarios"
        subtitulo="Cuentas, roles y actividad del personal en el sistema."
        icon={<GroupIcon />}
        secciones={[
            {
                titulo: "Gestión y control",
                items: [
                    { id: "usuarios", titulo: "Gestión de Usuarios", descripcion: "Administra cuentas, roles y estados del personal.", ruta: "/lista-usuarios", icon: <GroupIcon />, color: "primary" },
                    { id: "roles", titulo: "Gestión de Roles", descripcion: "Administra roles y permisos de los usuarios.", ruta: "/roles", icon: <AdminPanelSettingsIcon />, color: "secondary" },
                ],
            },
            {
                titulo: "Actividad del sistema",
                items: [
                    { id: "accesos", titulo: "Historial de Accesos", descripcion: "Verifica cuándo fue el último acceso de los usuarios.", ruta: "/historial-accesos", icon: <HistoryIcon />, color: "info" },
                    { id: "conectados", titulo: "Usuarios Conectados", descripcion: "Consulta qué usuarios están usando el sistema en tiempo real.", ruta: "/usuarios-conectados", icon: <SensorsIcon />, color: "success" },
                ],
            },
        ]}
    />
);

export default DashboardUsuarios;
