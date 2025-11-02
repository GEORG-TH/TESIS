import React, { useCallback } from "react"; 
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useGlobalStore } from "../../store/useGlobalStore";
import "../styles/LayoutDashboard.css";

export default function LayoutDashboard({ children }) {
  const { sidebarCollapsed, showFooter, setSidebarCollapsed } = useGlobalStore();

  const empresa = "React+Vite-SpringBoot";
  const version = "v1.0.3";
  const handleSidebarToggle = useCallback((newCollapsedState) => {
    setSidebarCollapsed(newCollapsedState);
  }, [setSidebarCollapsed]);
  const layoutClassName = `layout-dashboard${
    sidebarCollapsed ? " layout-dashboard--collapsed" : ""
  }`;

  return (
    <div className={layoutClassName}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleSidebarToggle}
      />
      <main className="main-content">
        <div className="main-scroll-area">{children}</div>
        {showFooter && <Footer empresa={empresa} version={version} />}
      </main>
    </div>
  );
}