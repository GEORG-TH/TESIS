package com.inventario.backend_inventario;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;

import com.inventario.backend_inventario.IA.MemoriaChatIa;

class MemoriaChatIaTest {

    @Test
    void recuerdaYDevuelveLosUltimosMensajes() {
        MemoriaChatIa m = new MemoriaChatIa();
        m.add("1:a", List.of(new UserMessage("hola"), new AssistantMessage("buenas")));
        m.add("1:a", List.of(new UserMessage("y la sede Larco?"), new AssistantMessage("claro")));
        assertEquals(4, m.get("1:a", 20).size());
        assertEquals(2, m.get("1:a", 2).size());
        assertEquals("claro", m.get("1:a", 1).get(0).getContent());
    }

    @Test
    void conversacionesDeDistintosUsuariosNoSeMezclan() {
        MemoriaChatIa m = new MemoriaChatIa();
        m.add("1:a", List.of(new UserMessage("secreto del usuario 1")));
        assertTrue(m.get("2:a", 20).isEmpty());
    }

    @Test
    void limitaMensajesPorConversacion() {
        MemoriaChatIa m = new MemoriaChatIa();
        List<Message> lote = new ArrayList<>();
        for (int i = 0; i < 100; i++) lote.add(new UserMessage("m" + i));
        m.add("1:a", lote);
        List<Message> guardados = m.get("1:a", 1000);
        assertEquals(30, guardados.size());
        assertEquals("m99", guardados.get(guardados.size() - 1).getContent());
    }

    @Test
    void limpiarOlvidaLaConversacion() {
        MemoriaChatIa m = new MemoriaChatIa();
        m.add("1:a", List.of(new UserMessage("hola")));
        m.clear("1:a");
        assertTrue(m.get("1:a", 20).isEmpty());
    }

    @Test
    void limitaLaCantidadDeConversaciones() {
        MemoriaChatIa m = new MemoriaChatIa();
        for (int i = 0; i < 600; i++) m.add("u:" + i, List.of(new UserMessage("x")));
        long vivas = java.util.stream.IntStream.range(0, 600).filter(i -> !m.get("u:" + i, 1).isEmpty()).count();
        assertTrue(vivas <= 500, "conversaciones vivas: " + vivas);
        assertFalse(m.get("u:599", 1).isEmpty());
    }
}
