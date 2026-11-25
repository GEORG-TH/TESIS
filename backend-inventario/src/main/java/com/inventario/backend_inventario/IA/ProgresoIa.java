package com.inventario.backend_inventario.IA;

import java.util.function.Consumer;

/**
 * Canal para avisar en vivo qué está consultando el Gerente IA ("Consultando stock…").
 * Las herramientas se ejecutan en el mismo hilo que atiende la petición, por eso basta un ThreadLocal.
 */
public final class ProgresoIa {

    private static final ThreadLocal<Consumer<String>> OYENTE = new ThreadLocal<>();

    private ProgresoIa() {
    }

    public static void escuchar(Consumer<String> oyente) {
        OYENTE.set(oyente);
    }

    public static void dejarDeEscuchar() {
        OYENTE.remove();
    }

    /** Notifica un paso de progreso; nunca interrumpe la herramienta si el oyente falla. */
    public static void avisar(String mensaje) {
        Consumer<String> o = OYENTE.get();
        if (o != null) {
            try {
                o.accept(mensaje);
            } catch (RuntimeException ignorada) {
                // el cliente puede haberse desconectado; la consulta sigue su curso
            }
        }
    }
}
