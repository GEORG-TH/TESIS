import React, { useState } from "react";
import LayoutDashboard from "../layouts/LayoutDashboard"; 
import "../styles/PerfilUsuario.css"; 
import MfaSetup from '../MfaSetup'; 
import '../styles/MfaSetup.css'; 

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return {}; 
    }
  });
  const apellidos = [usuario.apellido_pat, usuario.apellido_mat]
    .filter(Boolean)
    .join(" ");
  const nombreMostrar = [usuario.nombre_u]
    .filter(Boolean)
    .shift() || "";
  const estadoBruto = usuario.estado_u;
  const estadoTexto = typeof estadoBruto === "number"
    ? estadoBruto === 1
      ? "Activo"
      : "Inactivo"
    : estadoBruto || "—";
  const rolTexto = usuario.rol || "—"; 
  const datosPerfil = [
    { label: "ID", valor: usuario.id_u ?? usuario.id ?? "—" },
    { label: "DNI", valor: usuario.dni ?? "—" },
    { label: "Nombre", valor: nombreMostrar || "—" },
    { label: "Apellido", valor: apellidos || "—" },
    { label: "Email", valor: usuario.email ?? "—" },
    { label: "Estado", valor: estadoTexto },
    { label: "Rol", valor: rolTexto },
  ];

  const handleMfaStatusChange = (newStatus) => {
      setUsuario(prevUsuario => {
          const newUsuario = {
              ...prevUsuario,
              mfaEnabled: newStatus, 
              mfaSecret: newStatus ? prevUsuario.mfaSecret : null 
          };
          localStorage.setItem("usuario", JSON.stringify(newUsuario));
          return newUsuario; 
      });
  };

  return (
    <LayoutDashboard>
      <div className="perfil-container">
        <h1>Información del Perfil</h1>
        <div className="perfil-card">
          <div className="perfil-card-main">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Perfil"
              className="profile-img-perfil"
            />
            <div>
              <h2>
                {[nombreMostrar, apellidos].filter(Boolean).join(" ") || "Usuario"}
              </h2>
              <p className="perfil-rol">{rolTexto === "—" ? "Rol no asignado" : rolTexto}</p>
            </div>
          </div>
          <div className="perfil-card-info">
            {datosPerfil.length === 0 ? (
              <p className="perfil-info-empty">
                No hay información de usuario disponible.
              </p>
            ) : (
              <dl className="perfil-info-grid">
                {datosPerfil.map((dato) => (
                  <div className="perfil-info-item" key={dato.label}>
                    <dt>{dato.label}</dt>
                    <dd>{String(dato.valor)}</dd> 
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="seccion-seguridad">
                  <MfaSetup 
                      usuario={usuario}
                      onMfaStatusChange={handleMfaStatusChange}
                  />
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}

export default PerfilUsuario;