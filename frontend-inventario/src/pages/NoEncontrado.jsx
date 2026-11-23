import React from "react";
import { useLocation } from "react-router-dom";
import ErrorLayout from "../components/ErrorLayout";

/** Estantería con un hueco vacío y un lector de códigos escaneando: "producto no encontrado". */
function EstanteriaVacia() {
  const caja = (x, y, w, h, fill, cls = "") => (
    <g className={cls}>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} />
      <rect x={x} y={y + h * 0.38} width={w} height="5" fill="rgba(255,255,255,0.22)" />
      <rect x={x + w * 0.12} y={y + 7} width={w * 0.28} height="4" rx="2" fill="rgba(255,255,255,0.35)" />
    </g>
  );

  return (
    <svg viewBox="0 0 360 236" role="img" aria-label="Estantería con un espacio vacío">
      <defs>
        <linearGradient id="erLaser" x1="0" x2="1">
          <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0" />
          <stop offset="50%" stopColor="#4cd7f6" />
          <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0" />
        </linearGradient>
        <filter id="erGlow" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Estructura */}
      <rect x="34" y="8" width="9" height="224" rx="3" fill="#2f3445" />
      <rect x="318" y="8" width="9" height="224" rx="3" fill="#2f3445" />
      <rect x="34" y="82" width="293" height="8" rx="3" fill="#3b4256" />
      <rect x="34" y="156" width="293" height="8" rx="3" fill="#3b4256" />
      <rect x="34" y="228" width="293" height="8" rx="3" fill="#3b4256" />

      {/* Fila superior */}
      {caja(58, 40, 56, 42, "#2563eb", "er-float")}
      {caja(124, 52, 44, 30, "#0f69dc", "er-float er-float--b")}
      {caja(250, 36, 58, 46, "#03b5d3", "er-float er-float--c")}

      {/* Fila media: con el hueco vacío */}
      {caja(58, 112, 52, 44, "#0f69dc")}
      {caja(118, 124, 40, 32, "#2563eb")}
      <rect x="176" y="104" width="68" height="52" rx="6" fill="none" stroke="#4cd7f6" strokeWidth="2" strokeDasharray="6 5" opacity="0.8" />
      <text x="210" y="141" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="32" fontWeight="800" fill="#4cd7f6" className="er-pulse">?</text>
      {caja(256, 122, 52, 34, "#03b5d3")}

      {/* Fila inferior */}
      {caja(58, 182, 74, 46, "#2563eb")}
      {caja(142, 192, 52, 36, "#0f69dc")}
      {caja(254, 186, 56, 42, "#03b5d3")}

      {/* Lector láser */}
      <g className="er-scan">
        <rect x="34" y="22" width="293" height="6" fill="url(#erLaser)" filter="url(#erGlow)" opacity="0.8" />
        <rect x="34" y="24" width="293" height="2" fill="url(#erLaser)" />
      </g>
    </svg>
  );
}

const NoEncontrado = () => {
  const { pathname } = useLocation();
  return (
    <ErrorLayout
      codigo="404"
      titulo="Producto no encontrado en el almacén"
      descripcion="Esta ubicación está vacía: la página que buscas no existe o fue trasladada a otra sede. Revisa la dirección o vuelve a tu panel."
      ilustracion={<EstanteriaVacia />}
      detalle={[
        ["SKU", "404-NOT-FOUND"],
        ["UBICACIÓN", pathname.length > 34 ? `${pathname.slice(0, 32)}…` : pathname],
        ["STOCK ACTUAL", "0 unidades"],
      ]}
    />
  );
};

export default NoEncontrado;
