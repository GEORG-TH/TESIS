import React, { useEffect, useState } from "react";
import "../../components/styles/LoginSwic.css";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { login } from "../../api/authApi";
import { useGlobalStore } from '../../store/useGlobalStore';

const loginSchema = z.object({
  email: z.string().trim().email("Debe ser un email válido"),
  pass: z.string().min(1, "La contraseña no puede estar vacía"),
});

/* ------------------------------------------------------------------ */
/*  Panel izquierdo: movimiento fluido                                 */
/* ------------------------------------------------------------------ */

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

// Tarjeta: entrada escalonada + flotación suave + elevación al pasar el mouse.
function FloatCard({ index, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="lg-card"
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25 + index * 0.12, ease: EASE_OUT }}
      whileHover={reduce ? undefined : { y: -8, scale: 1.015 }}
    >
      <motion.div
        className="lg-card-body"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{
          duration: 5 + index * 0.8,
          delay: index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function AnimatedNumber({ to, decimals = 0, prefix = "", suffix = "" }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2.2,
      delay: 0.6,
      ease: EASE_OUT,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [to]);
  return (
    <>
      {prefix}
      {value.toLocaleString("es-PE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function ShowcasePanel() {
  const reduce = useReducedMotion();

  // Posición normalizada del mouse (-0.5 a 0.5) suavizada con un resorte.
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
    <>
      {/* Fondo ambiental con profundidad */}
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

      <section
        className="lg-left"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
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

        <Layer mx={mx} my={my} depth={10} className="lg-hero-layer">
          <motion.div className="lg-hero" {...fade(0.15)}>
            <div className="lg-hero-tag">
              <span className="material-icons">auto_awesome</span>
              <span>Gestión integral de inventario</span>
            </div>
            <h1>
              Todo tu inventario, en cada sede, con{" "}
              <span className="lg-gradient-text">trazabilidad total</span>
            </h1>
            <p>
              Recepción de mercadería, transferencias entre sedes, conteos,
              devoluciones y mermas con reportes valorizados, en una sola
              plataforma.
            </p>
          </motion.div>
        </Layer>

        <div className="lg-bento">
          {/* 1. Neural Ledger */}
          <Layer mx={mx} my={my} depth={22} className="lg-layer">
            <FloatCard index={0}>
              <div className="lg-card-head">
                <div className="lg-card-title">
                  <span className="lg-icon-chip">
                    <span className="material-icons">inventory_2</span>
                  </span>
                  <span>Stock y Kardex</span>
                </div>
                <span className="lg-badge">Tiempo real</span>
              </div>
              <div className="lg-metric">
                <strong><AnimatedNumber to={12480} /></strong>
                <span>unidades en stock</span>
              </div>
              <div className="lg-chart">
                <svg viewBox="0 0 280 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lgNeonGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0,50 Q40,48 70,30 T140,25 T210,12 T280,4 L280,60 L0,60 Z"
                    fill="url(#lgNeonGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, delay: 1.2 }}
                  />
                  <motion.path
                    d="M0,50 Q40,48 70,30 T140,25 T210,12 T280,4"
                    fill="none"
                    stroke="#4cd7f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, delay: 0.7, ease: EASE_OUT }}
                  />
                  <motion.path
                    d="M0,44 Q40,40 70,42 T140,34 T210,30 T280,24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, delay: 1, ease: EASE_OUT }}
                  />
                  <motion.circle
                    cx="280" cy="4" r="6" fill="#acedff"
                    animate={reduce ? undefined : { scale: [1, 2.2], opacity: [0.7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    style={{ transformOrigin: "280px 4px" }}
                  />
                  <circle cx="280" cy="4" r="3" fill="#4cd7f6" />
                </svg>
              </div>
              <div className="lg-caption">
                <span>Entradas vs. salidas</span>
                <b>Vista ilustrativa</b>
              </div>
            </FloatCard>
          </Layer>

          {/* 2. Supply Chain */}
          <Layer mx={mx} my={my} depth={34} className="lg-layer">
            <FloatCard index={1}>
              <div className="lg-card-head">
                <div className="lg-card-title">
                  <span className="lg-icon-chip lg-icon-chip--cyan">
                    <span className="material-icons">local_shipping</span>
                  </span>
                  <span>Sedes y Transferencias</span>
                </div>
                <span className="lg-badge" style={{ background: "transparent", color: "#b4c5ff" }}>
                  Multisede
                </span>
              </div>
              <div className="lg-nodes">
                <div className="lg-node">
                  <div className="lg-node-dot" style={{ color: "#b4c5ff" }}>
                    <span className="material-icons" style={{ fontSize: 16 }}>domain</span>
                  </div>
                  <small>Almacén</small>
                </div>
                <div className="lg-link"><div className="lg-link-flow" /></div>
                <div className="lg-node">
                  <div className="lg-node-dot" style={{ color: "#4cd7f6" }}>
                    <span className="material-icons" style={{ fontSize: 16 }}>swap_horiz</span>
                  </div>
                  <small>Sede</small>
                </div>
                <div className="lg-link"><div className="lg-link-flow" /></div>
                <div className="lg-node">
                  <div className="lg-node-dot" style={{ color: "#dbe1ff" }}>
                    <span className="material-icons" style={{ fontSize: 16 }}>store</span>
                  </div>
                  <small>Tienda</small>
                </div>
              </div>
              <div className="lg-card-foot">
                <span className="lg-card-foot-l">
                  <span className="material-icons">fact_check</span>
                  <span>Recepción de mercadería y OC</span>
                </span>
                <em>Trazable</em>
              </div>
            </FloatCard>
          </Layer>

          {/* 3. Copilot */}
          <Layer mx={mx} my={my} depth={30} className="lg-layer">
            <FloatCard index={2}>
              <div className="lg-copilot-head">
                <div className="lg-avatar">
                  <span className="material-icons">psychology</span>
                </div>
                <div>
                  <div className="lg-card-title">
                    <span>Asistente de Inventario</span>
                    <span className="lg-pill" style={{ background: "rgba(15,105,220,0.3)", color: "#adc6ff" }}>IA</span>
                  </div>
                  <p className="lg-copilot-status">
                    <span className="material-icons">graphic_eq</span>
                    <span>Analizando niveles de stock...</span>
                  </p>
                </div>
              </div>
              <p className="lg-quote">
                "Se sugiere reabastecer productos con riesgo de quiebre de stock
                y revisar los de baja rotación antes del próximo conteo."
              </p>
            </FloatCard>
          </Layer>

          {/* 4. Telemetría */}
          <Layer mx={mx} my={my} depth={18} className="lg-layer">
            <FloatCard index={3}>
              <div className="lg-card-head" style={{ marginBottom: 8 }}>
                <span className="lg-card-title">Conteos y Mermas</span>
                <span className="lg-badge" style={{ background: "transparent", color: "#4cd7f6", padding: 0 }}>
                  Auditoría
                </span>
              </div>
              <div className="lg-telemetry">
                <div className="lg-donut">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="#2f3445" strokeWidth="3.5"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="#4cd7f6" strokeWidth="3.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.98 }}
                      transition={{ duration: 2, delay: 0.9, ease: EASE_OUT }}
                    />
                  </svg>
                  <span>98%</span>
                </div>
                <div className="lg-telemetry-text">
                  <p>Exactitud de inventario</p>
                  <p className="lg-big">98% <small>vs. conteo físico</small></p>
                  <p>Mermas con flujo de aprobación</p>
                </div>
              </div>
              <div className="lg-progress">
                <motion.div
                  className="lg-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  transition={{ duration: 1.8, delay: 1, ease: EASE_OUT }}
                />
              </div>
            </FloatCard>
          </Layer>
        </div>

        <motion.div className="lg-banner" {...fade(0.9)}>
          <div className="lg-banner-l">
            <div className="lg-banner-ico">
              <span className="material-icons">account_tree</span>
            </div>
            <div>
              <p className="lg-banner-t">Trazabilidad completa del inventario</p>
              <p className="lg-banner-s">Recepción · Transferencias · Devoluciones · Mermas · Reportes</p>
            </div>
          </div>
          <div className="lg-banner-r">
            <span>Acceso por roles</span>
            <span className="material-icons">verified_user</span>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const loginAction = useGlobalStore((state) => state.login);
  const navigateBasedOnRole = (rol) => {
    switch (rol) {
      case "Administrador":
        navigate("/dashboard-administrador");
        break;
      case "Jefe de Inventario":
        navigate("/dashboard-jefe-inventario");
        break;
      case "Operador de Recepción de Mercadería":
        navigate("/dashboard-operador-recepcion");
        break;
      case "Auditor de Inventarios":
        navigate("/dashboard-auditor-inventarios");
        break;
      case "Operador de Tienda":
        navigate("/dashboard-operador-tienda");
        break;
      case "Jefe de Almacén":
        navigate("/dashboard-jefe-almacen");
        break;
      default:
        navigate("/");
        break;
    }
  };
  const {
    mutate,
    isPending,
    error: mutationError
  } = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      if (data.mfaRequired) {
        navigate('/verify-2fa', { state: { email: data.email } });
      } else {
        loginAction(data.token, data.usuario);
        navigate("/loading_login");

        setTimeout(() => {
          navigateBasedOnRole(data.usuario?.rol);
        }, 2000);
      }
    },
    onError: (err) => {
      console.error("Error de login:", err);
    }
  });
  const onSubmit = (data) => {
    mutate(data);
  };
  const getErrorMessage = () => {
    if (formErrors.email) return formErrors.email.message;
    if (formErrors.pass) return formErrors.pass.message;
    if (!mutationError) return null;
    const status = mutationError?.response?.status;
    if (status === 403) return "Cuenta desactivada";
    if (status === 401) return "Credenciales inválidas";
    return mutationError?.response?.data?.message || mutationError.message || "Error al conectar con el servidor";
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="lg-root">
      <ShowcasePanel />

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
            <p>Inicia sesión con tus credenciales corporativas.</p>
          </div>

          {errorMessage && <div className="lg-error" role="alert">{errorMessage}</div>}

          <form className="lg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="lg-label" htmlFor="email">
                Correo Corporativo
              </label>
              <div className="lg-field">
                <span className="material-icons lg-field-icon">badge</span>
                <input
                  id="email"
                  type="email"
                  placeholder="nombre.apellido@empresa.com"
                  {...register("email")}
                  required
                  className="lg-input"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="lg-label-row">
                <label className="lg-label" htmlFor="password">
                  Contraseña de Seguridad
                </label>
                <Link to="/forgot-password" className="lg-link-forgot">
                  ¿Olvidó su clave?
                </Link>
              </div>
              <div className="lg-field">
                <span className="material-icons lg-field-icon">lock</span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("pass")}
                  required
                  className="lg-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <span className="material-icons">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="lg-submit"
              disabled={isPending}
              whileHover={isPending ? undefined : { scale: 1.015 }}
              whileTap={isPending ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {isPending ? (
                <>
                  <span className="lg-spinner" />
                  <span>Validando credenciales…</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <span className="material-icons">arrow_forward</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="lg-secure">
            <i />
            <span>Acceso protegido con autenticación de dos factores</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
