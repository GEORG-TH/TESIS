import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const leerToken = () => {
  try {
    return JSON.parse(localStorage.getItem("global-storage"))?.state?.token || null;
  } catch {
    return null;
  }
};

/** Versión simple (sin streaming). Se mantiene por compatibilidad. */
export const chatConGerente = async (mensaje, conversacionId) => {
  const response = await axiosInstance.post("/chat-gerente", mensaje, {
    headers: {
      "Content-Type": "text/plain",
      ...(conversacionId ? { "X-Conversacion": conversacionId } : {}),
    },
  });
  return response.data;
};

/** Olvida el historial de una conversación en el servidor ("Nueva conversación"). */
export const olvidarConversacion = (conversacionId) =>
  axiosInstance.delete(`/chat-gerente/conversacion/${conversacionId}`).catch(() => {});

/**
 * Chat con eventos en vivo (SSE sobre POST). Llama a onEstado("Consultando stock…") mientras el
 * Gerente IA trabaja y devuelve { texto, error } con la respuesta final.
 */
export const chatEnVivo = async (mensaje, conversacionId, { onEstado, signal } = {}) => {
  const respuesta = await fetch(`${BASE_URL}/api/chat-gerente/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${leerToken()}`,
    },
    body: JSON.stringify({ mensaje, conversacionId }),
    signal,
  });

  if (respuesta.status === 401) {
    localStorage.clear();
    window.location.href = "/";
  }
  if (!respuesta.ok || !respuesta.body) {
    const error = new Error(`HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }

  const lector = respuesta.body.getReader();
  const decodificador = new TextDecoder("utf-8");
  let buffer = "";
  let resultado = null;

  const procesarBloque = (bloque) => {
    let evento = "message";
    const datos = [];
    for (const linea of bloque.split(/\r?\n/)) {
      if (linea.startsWith("event:")) evento = linea.slice(6).trim();
      else if (linea.startsWith("data:")) datos.push(linea.slice(5).replace(/^ /, ""));
    }
    if (!datos.length) return;
    let payload = {};
    try {
      payload = JSON.parse(datos.join("\n"));
    } catch {
      payload = { texto: datos.join("\n") };
    }
    if (evento === "estado") onEstado?.(payload.texto);
    else if (evento === "respuesta") resultado = { texto: payload.texto, error: false };
    else if (evento === "error") resultado = { texto: payload.texto, error: true };
  };

  for (;;) {
    const { value, done } = await lector.read();
    if (done) break;
    buffer += decodificador.decode(value, { stream: true });
    const bloques = buffer.split(/\r?\n\r?\n/);
    buffer = bloques.pop();
    bloques.forEach(procesarBloque);
  }
  if (buffer.trim()) procesarBloque(buffer);

  if (!resultado) throw new Error("La conexión se cerró sin respuesta");
  return resultado;
};
