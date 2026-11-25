package com.inventario.backend_inventario.IA;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.stereotype.Component;

/**
 * Memoria de conversación del Gerente IA, en RAM y acotada para que no crezca sin límite:
 * máximo de mensajes por conversación, máximo de conversaciones activas y caducidad por inactividad.
 * La clave la arma el controlador como "idUsuario:idConversacion", así un usuario nunca ve la de otro.
 */
@Component
public class MemoriaChatIa implements ChatMemory {

    static final int MAX_MENSAJES = 30;
    static final int MAX_CONVERSACIONES = 500;
    static final long CADUCIDAD_MS = 2L * 60 * 60 * 1000;

    private static final class Conversacion {
        final List<Message> mensajes = new ArrayList<>();
        volatile long ultimoUso = System.currentTimeMillis();
    }

    private final Map<String, Conversacion> conversaciones = new ConcurrentHashMap<>();

    @Override
    public void add(String conversationId, List<Message> messages) {
        depurar();
        Conversacion c = conversaciones.computeIfAbsent(conversationId, k -> new Conversacion());
        synchronized (c) {
            c.mensajes.addAll(messages);
            while (c.mensajes.size() > MAX_MENSAJES) {
                c.mensajes.remove(0);
            }
            c.ultimoUso = System.currentTimeMillis();
        }
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        Conversacion c = conversaciones.get(conversationId);
        if (c == null) {
            return List.of();
        }
        synchronized (c) {
            c.ultimoUso = System.currentTimeMillis();
            int desde = Math.max(0, c.mensajes.size() - Math.max(lastN, 0));
            return new ArrayList<>(c.mensajes.subList(desde, c.mensajes.size()));
        }
    }

    @Override
    public void clear(String conversationId) {
        conversaciones.remove(conversationId);
    }

    /** Elimina conversaciones caducadas y, si aún hay demasiadas, las menos usadas. */
    private void depurar() {
        long limite = System.currentTimeMillis() - CADUCIDAD_MS;
        conversaciones.entrySet().removeIf(e -> e.getValue().ultimoUso < limite);
        while (conversaciones.size() >= MAX_CONVERSACIONES) {
            conversaciones.entrySet().stream()
                    .min((a, b) -> Long.compare(a.getValue().ultimoUso, b.getValue().ultimoUso))
                    .ifPresent(e -> conversaciones.remove(e.getKey()));
        }
    }
}
