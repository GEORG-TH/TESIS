import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUsers, FaBoxes, FaChartBar, FaCog,
  FaBars, FaSignOutAlt, FaTags, FaStore, FaClipboardList,
  FaTruck, FaHome
} from "react-icons/fa";
import "../styles/Sidebar.css";
import { motion } from "framer-motion";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function Sidebar({ collapsed = false, onCollapsedChange }) {
  const navigate = useNavigate();
  const user = useGlobalStore((state) => state.user);
  console.log("[Sidebar] Datos del usuario en Zustand:", user);
  const MOBILE_QUERY = "(max-width: 420px)";
  const getIsMobile = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(MOBILE_QUERY).matches
      : false;
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const isOpen = isMobile ? isMobileOpen : !collapsed;
  const logout = useGlobalStore((state) => state.logout);
  const nombreCompleto = `${user?.nombre_u || ""} ${user?.apellido_pat || ""}`;
  const email = user?.email || "";
  const rolUsuario = user?.rol || null;

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
      return;
    }
    onCollapsedChange(!collapsed);
  };

  const handleMenuNavigation = (path) => {
    if (isMobile) {
      setIsOpen(false);
      setTimeout(() => navigate(path), 0);
      return;
    }

    navigate(path);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual y volverás al inicio de sesión.",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      imageUrl: "/logo_SWCI+.jpg",
      imageWidth: 80,
      imageHeight: 80,
    });

    if (result.isConfirmed) {
      logout();
      Swal.fire({
        title: "Sesión cerrada",
        text: "Has salido del sistema correctamente.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/"), 1800);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleMediaChange = (event) => {
      setIsMobile(event.matches);
      if (event.matches) {
        setIsMobileOpen(false);
      }
    };
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const menuPorRol = {
    "Administrador": [
      { icon: <FaHome />, label: "Inicio", path: "/dashboard-administrador" },
      { icon: <FaUsers />, label: "Usuarios", path: "/dashboard-usuarios" },
      { icon: <FaTags />, label: "Productos", path: "/dashboard-productos" },
      { icon: <FaStore />, label: "Sedes", path: "/dashboard-sedes" },
      { icon: <FaTruck />, label: "Proveedores", path: "/dashboard-proveedores" },
      { icon: <FaBoxes />, label: "Inventario", path: "/inventario" },
      { icon: <FaClipboardList />, label: "Conteo Inventario", path: "/mov_inventario" },
      { icon: <FaChartBar />, label: "Reportes", path: "/reportes" },
      { icon: <FaCog />, label: "Configuración", path: "/settings" },
    ],
    "Jefe de Inventario": [
      { icon: <FaHome />, label: "Inicio", path: "/dashboard-jefe-inventario" },
      { icon: <FaTags />, label: "Productos", path: "/dashboard-productos" },
      { icon: <FaStore />, label: "Sedes", path: "/dashboard-sedes" },
      { icon: <FaBoxes />, label: "Inventario", path: "/inventario" },
      { icon: <FaClipboardList />, label: "Conteo Inventario", path: "/mov_inventario" },
      { icon: <FaChartBar />, label: "Reportes", path: "/reportes" },
      { icon: <FaCog />, label: "Configuración", path: "/settings" },
    ],
    "Operador de Recepción de Mercadería": [
      { icon: <FaHome />, label: "Inicio", path: "/dashboard-operador-recepcion" },
      { icon: <FaTruck />, label: "Proveedores", path: "/dashboard-proveedores" },
      { icon: <FaBoxes />, label: "Inventario", path: "/inventario" },
      { icon: <FaClipboardList />, label: "Conteo Inventario", path: "/mov_inventario" },
      { icon: <FaChartBar />, label: "Reportes", path: "/reportes" },
      { icon: <FaCog />, label: "Configuración", path: "/settings" },
    ],
    "Auditor de Inventarios": [
      { icon: <FaHome />, label: "Inicio", path: "/dashboard-auditor-inventarios" },
      { icon: <FaChartBar />, label: "Reportes", path: "/reportes" },
      { icon: <FaCog />, label: "Configuración", path: "/settings" },
    ],
    "Operador de Tienda": [
      { icon: <FaHome />, label: "Inicio", path: "/dashboard-operador-tienda" },
      { icon: <FaTruck />, label: "Proveedores", path: "/dashboard-proveedores" },
      { icon: <FaBoxes />, label: "Inventario", path: "/inventario" },
      { icon: <FaClipboardList />, label: "Conteo Inventario", path: "/mov_inventario" },
      { icon: <FaChartBar />, label: "Reportes", path: "/reportes" },
      { icon: <FaCog />, label: "Configuración", path: "/settings" },
    ],
  };

  const menu = menuPorRol[rolUsuario] || [];

  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  return (
    <motion.aside
      initial={{ x: -250 }} 
      animate={{ x: 0 }}  
      exit={{ x: -250 }}         
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg"
    >
    <>
      {isMobile && (
        <button
          type="button"
          className={`mobile-toggle-btn${isOpen ? " active" : ""}`}
          onClick={toggleSidebar}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <FaBars />
        </button>
      )}
      {isMobile && (
        <div
          className={`mobile-overlay ${isOpen ? "" : "hidden"}`}
          onClick={toggleSidebar}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}>
        <div className="sidebar-header">
          {!isMobile && (
            <button className="toggle-btn" onClick={toggleSidebar}>
              <FaBars />
            </button>
          )}
          {isOpen && !isMobile && <h2 className="sidebar-title">Panel</h2>}
        </div>

        {(isOpen || !isMobile) && (
          <>
            <div className="profile-section">
              <img
                src="../../logo_madrid.png"
                alt="Perfil"
                className="profile-img"
              />
              {isOpen && (
                <>
                  <h3 className="profile-name" onClick={() => navigate("/perfil")}>
                    {nombreCompleto}
                  </h3>
                  <p className="profile-email">{email}</p>
                  <p className="profile-rol">{rolUsuario}</p>
                </>
              )}
            </div>
            <nav className="menu">
              <ul>
                {menu.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleMenuNavigation(item.path)}
                  >
                    {item.icon} {isOpen && item.label}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="logout-section" onClick={handleLogout}>
              <FaSignOutAlt className="menu-icon" />
              {isOpen && <span>Cerrar sesión</span>}
            </div>
          </>
        )}
      </aside>
    </>
    </motion.aside>
  );
}
