import { useGlobalStore } from "../../../store/useGlobalStore";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import RuleIcon from "@mui/icons-material/Rule";
import ModuloDashboard from "../Shared/ModuloDashboard";
import { usePendientes } from "../Shared/dashboardData";

const ROLES_APROBADORES_CONTEO = ["Administrador", "Jefe de Inventario"];

const DashboardConteoI = () => {
    const user = useGlobalStore((state) => state.user);
    const puedeAprobarConteo = ROLES_APROBADORES_CONTEO.includes(user?.rol);
    const pend = usePendientes();

    return (
        <ModuloDashboard
            titulo="Conteo de Inventario"
            subtitulo="Hojas de conteo programadas o sorpresivas y su aprobación."
            icon={<ChecklistIcon />}
            secciones={[
                {
                    titulo: "Gestión y control",
                    items: [
                        { id: "lista", titulo: "Lista de Conteos de Inventario", descripcion: "Verifica los conteos realizados en las distintas sedes.", ruta: "/lista-conteo-inventario", icon: <ListAltIcon />, color: "primary" },
                    ],
                },
                {
                    titulo: "Operaciones",
                    items: [
                        { id: "generar", titulo: "Generar Hoja de Conteo", descripcion: "Genera hojas de conteo (programado o sorpresivo) de inventario.", ruta: "/generar-conteo-inventario", icon: <PlaylistAddCheckIcon />, color: "info" },
                        ...(puedeAprobarConteo
                            ? [{ id: "aprobar", titulo: "Aprobar / Desaprobar Conteo", descripcion: "Gestiona la aprobación de los conteos de inventario realizados.", ruta: "/aprobar-desaprobar-conteo", icon: <RuleIcon />, color: "warning", badge: pend.conteos.length }]
                            : []),
                    ],
                },
            ]}
        />
    );
};

export default DashboardConteoI;
