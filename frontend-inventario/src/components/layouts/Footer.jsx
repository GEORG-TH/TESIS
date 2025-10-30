import { useState, useEffect } from "react";
import "../styles/Footer.css";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function Footer({ mostrarUsuario = true, empresa = "Empresa S.A.", version = "v1.0.0" }) {
  const user = useGlobalStore((state) => state.user);

  const nombreUsuario = user ? `${user.nombre_u || ""} ${user.apellido_pat || ""}`.trim() : null;
  const rolUsuario = user?.rol || null;
  const anio = new Date().getFullYear();

  const [horaActual, setHoraActual] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  const horaFormateada = horaActual.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <div className="footer-empresa">
          <strong>{empresa}</strong>
          <span className="footer-version">{version}</span>
        </div>
        <div className="footer-copy">© {anio}</div>
      </div>

      <div className="footer-right">
        {mostrarUsuario && nombreUsuario ? (
          <div className="footer-user">
            <span className="user-name">{nombreUsuario}</span>
            {rolUsuario && <span className="user-role"> — {rolUsuario}</span>}
            <span className="footer-time"> | {horaFormateada}</span>
          </div>
        ) : (
          <div className="footer-note">Sistema de Control de Inventarios</div>
        )}
      </div>
    </footer>
  );
}
