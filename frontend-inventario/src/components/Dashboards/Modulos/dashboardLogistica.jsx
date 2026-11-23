import PalletIcon from "@mui/icons-material/ViewInAr";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ModuloDashboard from "../Shared/ModuloDashboard";

const DashboardLogistica = () => (
    <ModuloDashboard
        titulo="Logística"
        subtitulo="Unidades de manejo (HU) y órdenes de compra a proveedores."
        icon={<PalletIcon />}
        secciones={[
            {
                titulo: "Gestión y control",
                items: [
                    { id: "hu", titulo: "Lista de HU", descripcion: "Gestiona las HU (Handling Units / paletas) en el sistema.", ruta: "/hu/gestion", icon: <PalletIcon />, color: "primary" },
                ],
            },
            {
                titulo: "Operaciones",
                items: [
                    { id: "oc-generar", titulo: "Generar Orden de Compra", descripcion: "Genera órdenes de compra para los pedidos a proveedores.", ruta: "/logistica/oc/generar", icon: <NoteAddIcon />, color: "info" },
                    { id: "oc-lista", titulo: "Lista de Órdenes de Compra", descripcion: "Consulta, envía y da seguimiento a las órdenes emitidas.", ruta: "/logistica/oc/lista", icon: <ListAltIcon />, color: "success" },
                ],
            },
        ]}
    />
);

export default DashboardLogistica;
