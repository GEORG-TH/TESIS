import React, { useCallback } from "react"; // <-- ASEGÚRATE DE IMPORTAR useCallback
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useGlobalStore } from "../../store/useGlobalStore"; // Ajusta la ruta si es necesario
import "../styles/LayoutDashboard.css";

export default function LayoutDashboard({ children }) {
  // Obtenemos el estado Y la acción 'set' de Zustand
  const { sidebarCollapsed, showFooter, setSidebarCollapsed } = useGlobalStore();

  const empresa = "React+Vite-SpringBoot";
  const version = "v1.0.3";

  // Usamos 'useCallback' para que la función NO se vuelva a crear en cada render.
  // Esto rompe el bucle infinito.
  const handleSidebarToggle = useCallback((newCollapsedState) => {
    setSidebarCollapsed(newCollapsedState);
  }, [setSidebarCollapsed]); // La dependencia es estable

  // El className se basa en el estado de Zustand
  const layoutClassName = `layout-dashboard${
    sidebarCollapsed ? " layout-dashboard--collapsed" : ""
  }`;

  return (
    <div className={layoutClassName}>
      <Sidebar
        // Pasamos el estado de Zustand como prop
        collapsed={sidebarCollapsed}
        // Pasamos la función estable como prop
        onCollapsedChange={handleSidebarToggle}
      />
      <main className="main-content">
        <div className="main-scroll-area">{children}</div>
        {showFooter && <Footer empresa={empresa} version={version} />}
      </main>
    </div>
  );
}