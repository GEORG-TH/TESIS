import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ModuloDashboard from "../Shared/ModuloDashboard";

const DashboardProveedores = () => (
    <ModuloDashboard
        titulo="Proveedores"
        subtitulo="Datos de proveedores y pedidos de mercadería."
        icon={<LocalShippingIcon />}
        secciones={[
            {
                titulo: "Gestión y control",
                items: [
                    { id: "proveedores", titulo: "Gestión de Proveedores", descripcion: "Administra datos de proveedores y sus contactos.", ruta: "/lista-proveedores", icon: <LocalShippingIcon />, color: "primary" },
                ],
            },
            {
                titulo: "Operaciones",
                items: [
                    { id: "pedido", titulo: "Pedido de Mercadería", descripcion: "Realiza un pedido de mercadería HU al almacén de tu elección.", ruta: "/proveedores/pedido-mercaderia", icon: <AddShoppingCartIcon />, color: "info" },
                ],
            },
            {
                titulo: "Soporte",
                items: [
                    // La ruta /proveedores/soporte aún no existe: se muestra como "Próximamente" en vez de llevar a un 404.
                    { id: "soporte", titulo: "Soporte Técnico", descripcion: "Solicita soporte técnico para resolver incidencias con electrodomésticos.", ruta: "/proveedores/soporte", icon: <SupportAgentIcon />, color: "secondary", proximamente: true },
                ],
            },
        ]}
    />
);

export default DashboardProveedores;
