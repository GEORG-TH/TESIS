import { useState, useCallback, useRef, useEffect } from "react";
import { chatEnVivo, olvidarConversacion } from "../../api/iaApi";

export const SUGERENCIAS = [
  { icon: "shopping_cart", label: "Analizar reabastecimiento", prompt: "Analiza el reabastecimiento: ¿qué productos debo comprar?" },
  { icon: "history", label: "Movimientos recientes", prompt: "Muéstrame los movimientos recientes del Kardex" },
  { icon: "swap_horiz", label: "Transferencias pendientes", prompt: "¿Qué transferencias están pendientes?" },
  { icon: "campaign", label: "Campañas activas", prompt: "¿Qué campañas están activas?" },
  { icon: "storefront", label: "Resumen de una sede", prompt: "Dame un resumen de la sede " },
  { icon: "place", label: "¿Dónde hay stock de…?", prompt: "¿Dónde hay stock de " },
  { icon: "paid", label: "Valor del inventario", prompt: "¿Cuál es el valor del inventario?" },
  { icon: "description", label: "Ficha técnica", prompt: "Dame la ficha técnica de " },
];

const BIENVENIDA = {
  id: "bienvenida",
  sender: "bot",
  text:
    "Hola, soy el **Gerente de Inventario IA**. Puedo consultar tu inventario, sedes, proveedores y campañas, " +
    "y **recuerdo lo que hablamos** en esta conversación.\n\n" +
    "Prueba con:\n" +
    "- **Reabastecimiento**: qué comprar y cuánto\n" +
    "- **Kardex**: movimientos recientes\n" +
    "- **Transferencias** pendientes y **campañas** activas\n" +
    "- **Stock**: «¿Dónde hay stock de [producto]?»\n" +
    "- **Valor del inventario** y **ficha técnica** de un producto\n\n" +
    "Luego puedes seguir con preguntas cortas como «¿y en la otra sede?».",
};

const nuevoIdConversacion = () => {
  const base = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return base.replace(/[^A-Za-z0-9-]/g, "").slice(0, 64);
};

/**
 * Lógica del chat con el Gerente IA, compartida por la página y el widget flotante.
 * - Memoria: cada chat tiene un id de conversación que el servidor usa para recordar el contexto.
 * - En vivo: mientras trabaja muestra el paso actual ("Consultando stock…") y escribe la respuesta progresivamente.
 * Devuelve { messages, isLoading, estado, enviar, limpiar }.
 */
export function useChatIA() {
  const [messages, setMessages] = useState([BIENVENIDA]);
  const [isLoading, setIsLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const enviando = useRef(false);
  const conversacionId = useRef(nuevoIdConversacion());
  const revelado = useRef(null); // { id, texto, timer } mientras se escribe una respuesta

  const terminarRevelado = useCallback(() => {
    const r = revelado.current;
    if (!r) return;
    clearInterval(r.timer);
    revelado.current = null;
    setMessages((prev) => prev.map((m) => (m.id === r.id ? { ...m, text: r.texto, typing: false } : m)));
  }, []);

  useEffect(() => () => revelado.current && clearInterval(revelado.current.timer), []);

  const revelar = useCallback((id, texto) => {
    let n = 0;
    const paso = Math.max(3, Math.ceil(texto.length / 90)); // ~1.5 s para respuestas largas
    const timer = setInterval(() => {
      n = Math.min(texto.length, n + paso);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: texto.slice(0, n) } : m)));
      if (n >= texto.length) terminarRevelado();
    }, 16);
    revelado.current = { id, texto, timer };
  }, [terminarRevelado]);

  const enviar = useCallback(async (texto) => {
    const mensaje = (texto || "").trim();
    if (!mensaje || enviando.current) return;
    enviando.current = true;
    terminarRevelado();

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: "user", text: mensaje, ts: Date.now() }]);
    setIsLoading(true);
    setEstado("");
    try {
      const { texto: respuesta, error } = await chatEnVivo(mensaje, conversacionId.current, { onEstado: setEstado });
      const id = `b-${Date.now()}`;
      setMessages((prev) => [...prev, { id, ts: Date.now(), sender: "bot", error, typing: !error, text: error ? respuesta : "" }]);
      if (!error) revelar(id, respuesta);
    } catch (e) {
      console.error("Error en el chat IA:", e);
      const sinPermiso = e?.status === 403;
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          ts: Date.now(),
          sender: "bot",
          error: true,
          text: sinPermiso
            ? "**No tienes permiso para usar el Gerente IA.** Solo el Administrador y el Jefe de Inventario pueden consultarlo."
            : "**No pude conectar con el asistente.** Verifica que el servidor esté encendido e inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setEstado("");
      enviando.current = false;
    }
  }, [revelar, terminarRevelado]);

  const limpiar = useCallback(() => {
    terminarRevelado();
    olvidarConversacion(conversacionId.current);
    conversacionId.current = nuevoIdConversacion();
    setMessages([BIENVENIDA]);
  }, [terminarRevelado]);

  return { messages, isLoading, estado, enviar, limpiar };
}
