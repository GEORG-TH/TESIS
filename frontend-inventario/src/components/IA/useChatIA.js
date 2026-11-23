import { useState, useCallback, useRef } from "react";
import { chatConGerente } from "../../api/iaApi";

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
    "Hola, soy el **Gerente de Inventario IA**. Puedo consultar tu inventario, sedes, proveedores y campañas.\n\n" +
    "Prueba con:\n" +
    "- **Reabastecimiento**: qué comprar y cuánto\n" +
    "- **Kardex**: movimientos recientes\n" +
    "- **Transferencias** pendientes y **campañas** activas\n" +
    "- **Stock**: «¿Dónde hay stock de [producto]?»\n" +
    "- **Valor del inventario** y **ficha técnica** de un producto",
};

/**
 * Lógica del chat con el Gerente IA, compartida por la página y el widget flotante.
 * Devuelve { messages, isLoading, enviar, limpiar }.
 */
export function useChatIA() {
  const [messages, setMessages] = useState([BIENVENIDA]);
  const [isLoading, setIsLoading] = useState(false);
  const enviando = useRef(false);

  const enviar = useCallback(async (texto) => {
    const mensaje = (texto || "").trim();
    if (!mensaje || enviando.current) return;
    enviando.current = true;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: "user", text: mensaje, ts: Date.now() }]);
    setIsLoading(true);
    try {
      const respuesta = await chatConGerente(mensaje);
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, sender: "bot", ts: Date.now(), text: typeof respuesta === "string" ? respuesta : JSON.stringify(respuesta) },
      ]);
    } catch (error) {
      console.error("Error en el chat IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          ts: Date.now(),
          sender: "bot",
          error: true,
          text: "**No pude conectar con el asistente.** Verifica que el servidor esté encendido e inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
      enviando.current = false;
    }
  }, []);

  const limpiar = useCallback(() => {
    setMessages([BIENVENIDA]);
  }, []);

  return { messages, isLoading, enviar, limpiar };
}
