import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LabelIcon from "@mui/icons-material/Label";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CampaignIcon from "@mui/icons-material/Campaign";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SellIcon from "@mui/icons-material/Sell";
import ModuloDashboard from "../Shared/ModuloDashboard";

const DashboardProductos = () => (
    <ModuloDashboard
        titulo="Gestión de Productos"
        subtitulo="Administra el catálogo, las campañas y las operaciones de productos."
        icon={<SellIcon />}
        secciones={[
            {
                titulo: "Gestión y control",
                items: [
                    { id: "areas", titulo: "Gestión de Áreas", descripcion: "Administra áreas del negocio.", ruta: "/lista-areas", icon: <AccountTreeIcon />, color: "primary" },
                    { id: "categorias", titulo: "Gestión de Categorías", descripcion: "Administra categorías de productos.", ruta: "/lista-categorias", icon: <CategoryIcon />, color: "info" },
                    { id: "subcategorias", titulo: "Gestión de Subcategorías", descripcion: "Administra subcategorías por cada categoría.", ruta: "/lista-subcategorias", icon: <LabelIcon />, color: "secondary" },
                    { id: "productos", titulo: "Gestión de Productos", descripcion: "Administra productos en el sistema.", ruta: "/lista-productos", icon: <Inventory2Icon />, color: "success" },
                ],
            },
            {
                titulo: "Operaciones",
                items: [
                    { id: "etiquetas", titulo: "Códigos de Barras y QR", descripcion: "Genera códigos de barras y QR para productos, listos para colocar en las góndolas.", ruta: "/productos/etiquetas", icon: <QrCode2Icon />, color: "primary" },
                    { id: "campanias", titulo: "Campañas Promocionales", descripcion: "Verifica qué campañas se acercan para promocionar productos.", ruta: "/productos/campanias-activas", icon: <CampaignIcon />, color: "warning" },
                    { id: "reabastecimiento", titulo: "Sugerencia de Reabastecimiento", descripcion: "Sugerencias para reabastecer productos y búsqueda inteligente.", ruta: "/productos/sugerencias/reabastecimiento", icon: <AutoGraphIcon />, color: "info" },
                ],
            },
        ]}
    />
);

export default DashboardProductos;
