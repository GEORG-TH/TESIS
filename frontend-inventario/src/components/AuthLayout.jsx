import React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import "./styles/LoginSwic.css";

const EASE_OUT = [0.22, 1, 0.36, 1];

// Capa con parallax: se desplaza según el mouse con una profundidad propia.
function Layer({ mx, my, depth, className, children }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

function InfoCard({ index, icon, title, text }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="lg-card lg-info-card"
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3 + index * 0.12, ease: EASE_OUT }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
    >
      <motion.div
        className="lg-info-body"
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={{
          duration: 5 + index * 0.8,
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="lg-icon-chip">
          <span className="material-icons">{icon}</span>
        </span>
        <div>
          <p className="lg-info-title">{title}</p>
          {text && <p className="lg-info-text">{text}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Layout compartido de las pantallas de autenticación (SWIC+).
 * Panel izquierdo animado + tarjeta de cristal a la derecha.
 */
export default function AuthLayout({
  tag,
  tagIcon = "shield",
  headline,
  highlight,
  subtitle,
  cards = [],
  cardText,
  error,
  children,
  footer,
}) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 55, damping: 18, mass: 0.9 };
  const mx = useSpring(rawX, spring);
  const my = useSpring(rawY, spring);

  const handleMove = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const fade = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE_OUT },
  });

  return (
    <div className="lg-root">
      <div className="lg-ambient" aria-hidden="true">
        <Layer mx={mx} my={my} depth={-90} className="lg-blob lg-blob--a">
          <div className="lg-blob-inner" />
        </Layer>
        <Layer mx={mx} my={my} depth={70} className="lg-blob lg-blob--b">
          <div className="lg-blob-inner" />
        </Layer>
        <Layer mx={mx} my={my} depth={-50} className="lg-blob lg-blob--c">
          <div className="lg-blob-inner" />
        </Layer>
        <div className="lg-grid-dots" />
      </div>

      <section className="lg-left" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <motion.div className="lg-topbar" {...fade(0.05)}>
          <div className="lg-brand">
            <div className="lg-brand-icon">
              <span className="material-icons">dataset</span>
            </div>
            <div>
              <div className="lg-brand-line">
                <span className="lg-brand-name">SWIC<span>+</span></span>
                <span className="lg-pill">INVENTARIO</span>
              </div>
              <p className="lg-tagline">Control de inventario multisede</p>
            </div>
          </div>
          <div className="lg-status">
            <span className="lg-ping" />
            <span>PLATAFORMA EN LÍNEA</span>
          </div>
        </motion.div>

        <div className="lg-auth-center">
          <Layer mx={mx} my={my} depth={10} className="lg-hero-layer">
            <motion.div className="lg-hero" {...fade(0.15)}>
              <div className="lg-hero-tag">
                <span className="material-icons">{tagIcon}</span>
                <span>{tag}</span>
              </div>
              <h1>
                {headline}{" "}
                <span className="lg-gradient-text">{highlight}</span>
              </h1>
              <p>{subtitle}</p>
            </motion.div>
          </Layer>

          <div className="lg-info-grid">
            {cards.map((c, i) => (
              <Layer key={c.title} mx={mx} my={my} depth={16 + i * 8} className="lg-layer">
                <InfoCard index={i} {...c} />
              </Layer>
            ))}
          </div>
        </div>
      </section>

      <div className="lg-right">
        <motion.div
          className="lg-form-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
        >
          <div className="lg-form-glow" />
          <div className="lg-form-header">
            <div className="lg-logo"><div>S+</div></div>
            <h2>Portal Corporativo SWIC+</h2>
            {cardText && <p>{cardText}</p>}
          </div>

          {error && <div className="lg-error" role="alert">{error}</div>}

          {children}

          {footer}
        </motion.div>
      </div>
    </div>
  );
}
