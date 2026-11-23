import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGlobalStore } from "../store/useGlobalStore";
import { rutaPorRol } from "../Utils/rutaPorRol";
import "./styles/ErrorPages.css";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Plantilla de páginas de error con temática de almacén/inventario.
 * detalle: [[clave, valor], ...] se muestra como una "etiqueta de kardex".
 */
export default function ErrorLayout({ codigo, titulo, descripcion, ilustracion, detalle = [], tono = "info" }) {
  const navigate = useNavigate();
  const user = useGlobalStore((s) => s.user);

  return (
    <div className={`er-root er-${tono}`}>
      <div className="er-ambient" aria-hidden="true">
        <div className="er-blob er-blob--a" />
        <div className="er-blob er-blob--b" />
        <div className="er-dots" />
      </div>

      <motion.main
        className="er-card"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="er-brand">
          <span className="er-brand-mark">S+</span>
          <span>SWIC<b>+</b> · Control de inventario</span>
        </div>

        <div className="er-art">{ilustracion}</div>

        <motion.div
          className="er-code"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          {codigo}
        </motion.div>
        <h1 className="er-title">{titulo}</h1>
        <p className="er-desc">{descripcion}</p>

        {detalle.length > 0 && (
          <dl className="er-ticket">
            {detalle.map(([k, v]) => (
              <div key={k} className="er-ticket-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="er-actions">
          <button type="button" className="er-btn er-btn--primary" onClick={() => navigate(user ? rutaPorRol(user.rol) : "/")}>
            <span className="material-icons">{user ? "home" : "login"}</span>
            {user ? "Ir a mi panel" : "Ir al inicio de sesión"}
          </button>
          <button type="button" className="er-btn er-btn--ghost" onClick={() => navigate(-1)}>
            <span className="material-icons">arrow_back</span>
            Volver atrás
          </button>
        </div>
      </motion.main>
    </div>
  );
}
