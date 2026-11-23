import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ModuloDashboard from "../Shared/ModuloDashboard";
import { usePendientes } from "../Shared/dashboardData";

const DashboardSedes = () => {
    const pend = usePendientes();
    return (
        <ModuloDashboard
            titulo="Sedes"
            subtitulo="Información de las sedes, su inventario y las transferencias entre ellas."
            icon={<StorefrontIcon />}
            secciones={[
                {
                    titulo: "Gestión y control",
                    items: [
                        { id: "sedes", titulo: "Gestión de Sedes", descripcion: "Consulta y administra la información de las sedes.", ruta: "/lista-sedes", icon: <StorefrontIcon />, color: "primary" },
                        { id: "inventario-sede", titulo: "Inventario por Sede", descripcion: "Asocia productos a cada sede y consulta su stock.", ruta: "/sedes/inventario", icon: <InventoryIcon />, color: "success" },
                    ],
                },
                {
                    titulo: "Operaciones",
                    items: [
                        { id: "transf-solicitar", titulo: "Pedido de Transferencia entre Sedes", descripcion: "Solicita transferir productos de una sede a otra.", ruta: "/inventario/transferencia/solicitar", icon: <SwapHorizIcon />, color: "info" },
                        { id: "transf-gestion", titulo: "Solicitudes de Transferencia", descripcion: "Consulta los pedidos de transferencia entre sedes.", ruta: "/inventario/transferencia/gestion", icon: <FactCheckIcon />, color: "warning", badge: pend.transferencias.length },
                    ],
                },
            ]}
        />
    );
};

export default DashboardSedes;
