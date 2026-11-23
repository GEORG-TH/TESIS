import React from "react";
import ErrorLayout from "../components/ErrorLayout";
import { useGlobalStore } from "../store/useGlobalStore";

/** Cinta de precaución en movimiento + palé con candado: "zona restringida". */
function ZonaRestringida() {
  const cintas = Array.from({ length: 12 }, (_, i) => <span key={i}>ZONA RESTRINGIDA</span>);
  return (
    <div style={{ width: "100%" }}>
      <div className="er-tape" aria-hidden="true">
        <div className="er-tape-inner">{cintas}</div>
      </div>
      <svg viewBox="0 0 280 210" role="img" aria-label="Palé con un candado: zona restringida">
        {/* Palé */}
        <rect x="40" y="176" width="200" height="10" rx="2" fill="#6b4f2a" />
        <rect x="40" y="194" width="200" height="10" rx="2" fill="#6b4f2a" />
        <rect x="52" y="186" width="22" height="8" fill="#4d3920" />
        <rect x="129" y="186" width="22" height="8" fill="#4d3920" />
        <rect x="206" y="186" width="22" height="8" fill="#4d3920" />

        {/* Cajas apiladas */}
        <g>
          <rect x="52" y="112" width="84" height="64" rx="4" fill="#2563eb" />
          <rect x="52" y="136" width="84" height="6" fill="rgba(255,255,255,0.2)" />
          <rect x="144" y="124" width="84" height="52" rx="4" fill="#0f69dc" />
          <rect x="144" y="144" width="84" height="6" fill="rgba(255,255,255,0.2)" />
          <rect x="84" y="64" width="86" height="48" rx="4" fill="#03b5d3" />
          <rect x="84" y="82" width="86" height="6" fill="rgba(255,255,255,0.22)" />
        </g>

        {/* Candado */}
        <g className="er-shake">
          <path d="M112 112 V96 a28 28 0 0 1 56 0 V112" fill="none" stroke="#fbbf24" strokeWidth="11" strokeLinecap="round" />
          <rect x="98" y="108" width="84" height="64" rx="12" fill="#fbbf24" />
          <rect x="98" y="108" width="84" height="64" rx="12" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          <circle cx="140" cy="136" r="9" fill="#1c1917" />
          <rect x="136" y="140" width="8" height="18" rx="3" fill="#1c1917" />
        </g>
      </svg>
    </div>
  );
}

const NoAutorizado = () => {
  const user = useGlobalStore((s) => s.user);
  return (
    <ErrorLayout
      tono="warn"
      codigo="403"
      titulo="Zona de almacén restringida"
      descripcion="Esta área requiere un permiso que tu cuenta no tiene. Si crees que deberías tener acceso, pídeselo a un administrador."
      ilustracion={<ZonaRestringida />}
      detalle={[
        ["ZONA", "Acceso restringido"],
        ["TU ROL", user?.rol || "Sin sesión"],
        ["PERMISO", "Insuficiente"],
      ]}
    />
  );
};

export default NoAutorizado;
