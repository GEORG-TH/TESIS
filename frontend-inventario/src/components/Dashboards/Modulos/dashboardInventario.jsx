import { useGlobalStore } from "../../../store/useGlobalStore";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HistoryIcon from "@mui/icons-material/History";
import ModuloDashboard from "../Shared/ModuloDashboard";
import { usePendientes } from "../Shared/dashboardData";

const ROLES_APROBADORES_MERMA = ["Administrador", "Jefe de Inventario"];

const DashboardInventario = () => {
    const user = useGlobalStore((state) => state.user);
    const puedeAprobar = ROLES_APROBADORES_MERMA.includes(user?.rol);
    const pend = usePendientes();

    return (
        <ModuloDashboard
            titulo="Inventario"
            subtitulo="Consulta de stock y movimientos de inventario."
            icon={<Inventory2Icon />}
            secciones={[
                {
                    titulo: "Inventario",
                    items: [
                        { id: "stock", titulo: "Consulta de Stock", descripcion: "Verifica el stock de productos.", ruta: "/inventario/BusquedaPersonalizadaStock", icon: <SearchIcon />, color: "primary" },
                        { id: "kardex", titulo: "Kardex", descripcion: "Verifica el historial de movimientos.", ruta: "/inventario/kardex", icon: <HistoryIcon />, color: "info" },
                    ],
                },
                {
                    titulo: "Movimientos de inventario",
                    items: [
                        { id: "transferencia", titulo: "Transferencia entre Sedes", descripcion: "Pedidos de transferencia de productos entre diferentes sedes.", ruta: "/inventario/transferencia/gestion", icon: <SwapHorizIcon />, color: "info", badge: puedeAprobar ? pend.transferencias.length : 0 },
                        { id: "recepcion", titulo: "Recepción de Mercadería", descripcion: "Registra la recepción de mercadería en el inventario.", ruta: "/inventario/recepcion-merceria", icon: <MoveToInboxIcon />, color: "success" },
                        { id: "devolucion", titulo: "Devolución de Mercadería", descripcion: "Solicita devolver mercadería a otra sede/almacén o a un proveedor.", ruta: "/devolucion-mercaderia", icon: <AssignmentReturnIcon />, color: "secondary" },
                        ...(puedeAprobar
                            ? [{ id: "devolucion-gestion", titulo: "Aprobar / Rechazar Devolución", descripcion: "Revisa las solicitudes de devolución de mercadería.", ruta: "/inventario/devolucion/gestion", icon: <AssignmentTurnedInIcon />, color: "warning", badge: pend.devoluciones.length }]
                            : []),
                        { id: "merma", titulo: "Merma de Productos", descripcion: "Registra una solicitud de merma de productos en el inventario.", ruta: "/inventario/merma/registrar", icon: <WarningAmberIcon />, color: "error" },
                        ...(puedeAprobar
                            ? [{ id: "merma-gestion", titulo: "Aprobar / Rechazar Merma", descripcion: "Revisa las solicitudes de merma registradas.", ruta: "/inventario/merma/gestion", icon: <FactCheckIcon />, color: "warning", badge: pend.mermas.length }]
                            : []),
                        { id: "ventas", titulo: "Importar Ventas", descripcion: "Importa ventas en formato CSV para actualizar el inventario.", ruta: "/importar-ventas", icon: <UploadFileIcon />, color: "primary" },
                    ],
                },
            ]}
        />
    );
};

export default DashboardInventario;
