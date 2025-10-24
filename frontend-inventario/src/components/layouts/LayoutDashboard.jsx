import React from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useSettings } from "../Mod. Configuracion/SettingsContext";
import "../styles/LayoutDashboard.css";

export default function LayoutDashboard({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const rol = typeof usuario.rol === "string" ? usuario.rol : usuario.rol|| null;
  const empresa = "Cencosud - Wong SAC";
  const version = "v1.0.2";
  const { settings, updateSetting } = useSettings();

  const handleSidebarToggle = (collapsed) => {
    updateSetting("sidebarCollapsed", collapsed);
  };

  const layoutClassName = `layout-dashboard${settings.sidebarCollapsed ? " layout-dashboard--collapsed" : ""}`;

  return (
    <div className={layoutClassName}>
      <Sidebar
        rolUsuario={rol}
        collapsed={settings.sidebarCollapsed}
        onCollapsedChange={handleSidebarToggle}
      />
      <main className="main-content">
        <div className="main-scroll-area">{children}</div>
        {settings.showFooter && <Footer empresa={empresa} version={version} />}
      </main>
    </div>
  );
}


