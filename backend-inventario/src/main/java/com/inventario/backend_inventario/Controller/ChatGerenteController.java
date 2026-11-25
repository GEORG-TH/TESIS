package com.inventario.backend_inventario.Controller;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.inventario.backend_inventario.IA.MemoriaChatIa;
import com.inventario.backend_inventario.IA.ProgresoIa;
import com.inventario.backend_inventario.Model.Usuario;
import com.inventario.backend_inventario.Security.SedeAcceso;
import com.inventario.backend_inventario.Service.HistorialActividadService;

@RestController
@RequestMapping("/api/chat-gerente")
public class ChatGerenteController {

    private static final int MAX_MENSAJE = 2000;
    private static final int MENSAJES_DE_CONTEXTO = 20;
    private static final Pattern ID_CONVERSACION = Pattern.compile("^[A-Za-z0-9-]{1,64}$");
    /** Las herramientas necesitan el usuario del hilo (alcance por sede), por eso no se usa streaming reactivo. */
    private static final ExecutorService EJECUTOR = Executors.newFixedThreadPool(16);

    private final ChatClient chatClient;
    private final SedeAcceso sedeAcceso;
    private final MemoriaChatIa memoria;
    private final HistorialActividadService historial;

    public ChatGerenteController(ChatClient.Builder builder, SedeAcceso sedeAcceso, MemoriaChatIa memoria,
            HistorialActividadService historial) {
        this.chatClient = builder.defaultAdvisors(new MessageChatMemoryAdvisor(memoria)).build();
        this.sedeAcceso = sedeAcceso;
        this.memoria = memoria;
        this.historial = historial;
    }

    public record Peticion(String mensaje, String conversacionId) {
    }

    // ------------------------------------------------------------------ endpoints

    /** Versión simple (sin streaming). Recuerda la conversación si se envía la cabecera X-Conversacion. */
    @PostMapping
    public String conversar(@RequestBody String mensajeUsuario,
            @RequestHeader(value = "X-Conversacion", required = false) String conversacionId) {
        try {
            return responder(mensajeUsuario, conversacionId);
        } catch (Exception e) {
            return mensajeError(e);
        }
    }

    /**
     * Versión con eventos en vivo (SSE): "estado" mientras consulta datos, luego "respuesta" y "fin".
     * Se atiende en un hilo propio con el SecurityContext copiado para que el alcance por sede siga vigente.
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter conversarEnVivo(@RequestBody Peticion peticion) {
        SseEmitter emitter = new SseEmitter(180_000L);
        SecurityContext contexto = SecurityContextHolder.getContext();
        EJECUTOR.execute(() -> {
            SecurityContextHolder.setContext(contexto);
            ProgresoIa.escuchar(texto -> enviar(emitter, "estado", Map.of("texto", texto)));
            try {
                enviar(emitter, "estado", Map.of("texto", "Pensando…"));
                String respuesta = responder(peticion.mensaje(), peticion.conversacionId());
                enviar(emitter, "respuesta", Map.of("texto", respuesta));
                enviar(emitter, "fin", Map.of());
                emitter.complete();
            } catch (Exception e) {
                try {
                    enviar(emitter, "error", Map.of("texto", mensajeError(e)));
                    emitter.complete();
                } catch (RuntimeException clienteDesconectado) {
                    // nadie escucha: no hay nada más que enviar
                }
            } finally {
                ProgresoIa.dejarDeEscuchar();
                SecurityContextHolder.clearContext();
            }
        });
        return emitter;
    }

    /** "Nueva conversación": olvida el historial de esa conversación (solo la del propio usuario). */
    @DeleteMapping("/conversacion/{id}")
    public ResponseEntity<Void> olvidar(@PathVariable String id) {
        Usuario usuario = sedeAcceso.usuarioActual();
        if (usuario != null && ID_CONVERSACION.matcher(id).matches()) {
            memoria.clear(claveConversacion(usuario, id));
        }
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------------------ lógica

    private String responder(String mensajeUsuario, String conversacionId) {
        if (mensajeUsuario == null || mensajeUsuario.isBlank()) {
            throw new IllegalArgumentException("Escribe una pregunta.");
        }
        if (mensajeUsuario.length() > MAX_MENSAJE) {
            throw new IllegalArgumentException("La pregunta es demasiado larga (máximo " + MAX_MENSAJE + " caracteres).");
        }
        Usuario usuario = sedeAcceso.usuarioActual();
        String clave = claveConversacion(usuario, conversacionId);
        auditar(usuario, mensajeUsuario, conversacionId);

        String alcance = (usuario != null && sedeAcceso.restringido() && usuario.getSede() != null)
                ? "ALCANCE: solo puedes informar sobre la sede '" + usuario.getSede().getNombreSede()
                    + "'. Las herramientas ya filtran los datos a esa sede; si piden datos de otra sede, "
                    + "responde que solo tienes acceso a la suya. No inventes datos de otras sedes."
                : "ALCANCE: tienes acceso a todas las sedes.";
        String systemText = alcance + "\n\n" + """
            Eres el 'Gerente de Almacén IA', un asistente experto y proactivo.
            Tu trabajo es analizar el inventario y dar respuestas ejecutivas.
            Recuerdas lo hablado en esta conversación: si el usuario dice "y en esa sede?" o "y el mes pasado?",
            usa el contexto previo en lugar de volver a preguntar.

            TIENES ACCESO A ESTAS HERRAMIENTAS:
            1. analizarReabastecimiento: Úsala cuando pregunten qué comprar, qué falta o el estado de salud del stock.
            2. consultarMovimientos: Úsala para auditorías, ver quién sacó productos o historia reciente (Kardex).
            3. buscarDatosProveedor: Úsala cuando pidan contacto de proveedores (RUC, email).
            4. calcularValorInventario: Úsala cuando pregunten "cuánto vale mi inventario", "dinero en stock" o "valorización".
            5. ubicarProductoEnSedes: Úsala cuando pregunten "¿Dónde hay stock de X?", "¿En qué tienda tienen X?" o para buscar productos en otras sedes.
            6. resumenEstadoSede: Úsala para reportes generales como "¿Cómo va la sede Central?", "Resumen de la tienda Norte" o métricas rápidas.
            7. obtenerInformacionProducto: Úsala cuando pidan "información de X", "precio de X", "SKU de X", "ficha técnica" o detalles generales.
            8. consultarTransferencias: Úsala cuando pregunten por "envíos pendientes", "transferencias", "mercadería en tránsito" o "solicitudes".
            9. consultarCampaniasActivas: Úsala cuando pregunten por "ofertas", "promociones vigentes", "campañas" o "descuentos actuales".

            REGLAS:
            - Cuando inicies conversación o si te saludan, saluda formalmente como 'Gerente de Almacén IA'.
            - Si detectas stock bajo, alerta con urgencia.
            - Si preguntan por ubicación, menciona explícitamente la sede y la cantidad.
            - Sé conciso. Usa listas o viñetas.
            - Si no sabes algo, di que necesitas consultar la base de datos manual.
            """;

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withFunctions(Set.of(
                    "analizarReabastecimiento",
                    "consultarMovimientos",
                    "buscarDatosProveedor",
                    "calcularValorInventario",
                    "ubicarProductoEnSedes",
                    "resumenEstadoSede",
                    "obtenerInformacionProducto",
                    "consultarTransferencias",
                    "consultarCampaniasActivas"
                ))
                .build();

        return chatClient.prompt()
                .system(systemText)
                .user(mensajeUsuario)
                .options(options)
                .advisors(a -> a
                        .param(AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY, clave)
                        .param(AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY, MENSAJES_DE_CONTEXTO))
                .call()
                .content();
    }

    /** "idUsuario:conversacion": la memoria queda aislada por usuario aunque dos envíen el mismo id. */
    private String claveConversacion(Usuario usuario, String conversacionId) {
        String idUsuario = usuario != null ? String.valueOf(usuario.getId_u()) : "anon";
        String conv = (conversacionId != null && ID_CONVERSACION.matcher(conversacionId).matches())
                ? conversacionId : "principal";
        return idUsuario + ":" + conv;
    }

    private void auditar(Usuario usuario, String mensaje, String conversacionId) {
        if (usuario == null) {
            return;
        }
        try {
            String resumen = mensaje.length() > 200 ? mensaje.substring(0, 200) + "…" : mensaje;
            historial.registrarActividad(usuario, "CONSULTA_IA",
                    "Consultó al Gerente IA: «" + resumen.replace("\n", " ") + "»",
                    "IA", "ChatGerente", null, "Conversación: " + (conversacionId != null ? conversacionId : "principal"));
        } catch (Exception e) {
            System.err.println("No se pudo auditar la consulta a la IA: " + e.getMessage());
        }
    }

    private String mensajeError(Exception e) {
        String msg = e.getMessage();
        if (msg != null && msg.contains("429")) {
            return "⚠️ **El cerebro de la IA está saturado momentáneamente.**\n" +
                   "He alcanzado el límite de velocidad de Groq. Por favor, espera un minuto e intenta de nuevo.";
        }
        if (e instanceof IllegalArgumentException && msg != null) {
            return "⚠️ " + msg;
        }
        return "❌ Ocurrió un error al procesar tu solicitud: " + msg;
    }

    private void enviar(SseEmitter emitter, String evento, Map<String, String> datos) {
        try {
            emitter.send(SseEmitter.event().name(evento).data(datos, MediaType.APPLICATION_JSON));
        } catch (IOException | IllegalStateException e) {
            throw new IllegalStateException("Cliente desconectado", e);
        }
    }
}
