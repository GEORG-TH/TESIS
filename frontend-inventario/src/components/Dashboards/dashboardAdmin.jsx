import React from "react";
import LayoutDashboard from "../layouts/LayoutDashboard";
import GraficoUsuariosPorRol from "../Graficos/GraficoUsuariosPorRol"

export default function DashboardAdmin() {
  return (
    <LayoutDashboard>
      <header className="header">
        <h1>Panel del Administrador</h1>
      </header>
      <section className="content">
        <p>
          Bienvenido al panel principal. Aquí puedes gestionar usuarios, productos,
          inventarios, reportes y configuraciones generales del sistema.
        </p>
        <GraficoUsuariosPorRol />
      </section>
    </LayoutDashboard>
  );
}
