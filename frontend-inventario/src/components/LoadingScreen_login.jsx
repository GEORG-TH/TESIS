import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGlobalStore } from "../store/useGlobalStore";
import "./styles/LoadingScreen_login.css";

const EASE = [0.22, 1, 0.36, 1];
const MENSAJES = ["Iniciando sesión", "Preparando tu panel", "Casi listo"];

export default function LoadingScreen() {
  const reduce = useReducedMotion();
  const user = useGlobalStore((s) => s.user);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    document.body.classList.add("loading-active");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("loading-active");
      document.body.style.overflow = "auto";
    };
  }, []);

  // Cambia el mensaje de estado cada ~0.8 s (se queda en el último).
  useEffect(() => {
    const t = setInterval(() => setPaso((p) => Math.min(p + 1, MENSAJES.length - 1)), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="ls-root" role="status" aria-live="polite">
      <div className="ls-ambient" aria-hidden="true">
        <div className="ls-blob ls-blob--a" />
        <div className="ls-blob ls-blob--b" />
        <div className="ls-blob ls-blob--c" />
        <div className="ls-dots" />
      </div>

      <motion.div
        className="ls-card"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="ls-glow" />

        <div className="ls-logo-wrap">
          <svg className="ls-ring" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient id="lsGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#4cd7f6" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="54" className="ls-ring-track" />
            <circle cx="60" cy="60" r="54" className="ls-ring-arc" />
          </svg>
          <motion.div
            className="ls-logo"
            animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/logo.png" alt="Logo corporativo" />
          </motion.div>
        </div>

        <div className="ls-text">
          <h2>{user?.nombre_u ? `Bienvenido, ${user.nombre_u}` : "Bienvenido"}</h2>
          <p key={paso} className="ls-step">{MENSAJES[paso]}…</p>
        </div>

        <div className="ls-bar" aria-hidden="true">
          <motion.div
            className="ls-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: "92%" }}
            transition={{ duration: 2.2, ease: EASE }}
          />
        </div>

        <span className="ls-brand">SWIC<b>+</b> · Control de inventario</span>
      </motion.div>
    </div>
  );
}
