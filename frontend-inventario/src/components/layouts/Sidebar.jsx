import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUsers, FaBoxes, FaChartBar, FaCog,
  FaBars, FaSignOutAlt, FaTags, FaStore, FaClipboardList,
  FaTruck, FaHome
} from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar({ rolUsuario, collapsed = false, onCollapsedChange }) {
  const navigate = useNavigate();
  const MOBILE_QUERY = "(max-width: 420px)";
  const getIsMobile = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(MOBILE_QUERY).matches
      : false;
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [isOpen, setIsOpen] = useState(() => (!collapsed));

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const nombreCompleto = `${usuario.nombre_u || ""} ${usuario.apellido_pat || ""}`;
  const email = usuario.email || "";

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
      return;
    }

    setIsOpen((prev) => {
      const nextOpen = !prev;
      onCollapsedChange?.(!nextOpen);
      return nextOpen;
    });
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
      localStorage.clear();
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
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleMediaChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }

    mediaQuery.addListener(handleMediaChange);
    return () => mediaQuery.removeListener(handleMediaChange);
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
    if (isMobile) {
      setIsOpen(false);
      return undefined;
    }

    setIsOpen(!collapsed);
    return undefined;
  }, [collapsed, isMobile]);

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
                src="./logo_madrid.png"
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
  );
}
