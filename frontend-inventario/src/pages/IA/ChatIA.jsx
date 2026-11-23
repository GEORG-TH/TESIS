import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Button, ButtonBase, Card, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";
import { useChatIA, SUGERENCIAS } from "../../components/IA/useChatIA";
import {
  BotAvatar, ChatBubble, ChatInput, ChipsSugerencias, TypingDots,
} from "../../components/IA/ChatParts";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const ChatIA = () => {
  const { messages, isLoading, enviar, limpiar } = useChatIA();
  const [input, setInput] = useState("");
  const finRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    enviar(input);
    setInput("");
  };

  // Las sugerencias que terminan en espacio piden completar (producto/sede): se dejan en el campo.
  const elegir = (s) => {
    if (s.prompt.endsWith(" ")) {
      setInput(s.prompt);
      inputRef.current?.focus();
    } else {
      enviar(s.prompt);
    }
  };

  const soloBienvenida = messages.length === 1;

  return (
    <LayoutDashboard>
      <Card
        sx={{
          height: "calc(100dvh - 150px)", minHeight: 440, display: "flex", flexDirection: "column",
          overflow: "hidden", border: "1px solid", borderColor: "divider",
        }}
      >
        {/* Cabecera */}
        <Stack
          direction="row" alignItems="center" justifyContent="space-between" spacing={2}
          sx={{
            px: 2.5, py: 1.5, borderBottom: "1px solid", borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.1 : 0.05),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            <BotAvatar size={44} online />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: SORA, fontWeight: 700, fontSize: { xs: 16, md: 18 }, lineHeight: 1.2 }} noWrap>
                Gerente de Inventario IA
              </Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: 11, color: "success.main" }} noWrap>
                ● En línea · Llama 3
              </Typography>
            </Box>
          </Stack>
          <Button
            size="small" color="inherit" variant="outlined" startIcon={<DeleteSweepIcon />}
            onClick={limpiar} disabled={soloBienvenida && !isLoading}
            sx={{ borderColor: "divider", flexShrink: 0, "& .MuiButton-startIcon": { mr: { xs: 0, sm: 0.75 } } }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Nueva conversación</Box>
          </Button>
        </Stack>

        {/* Mensajes */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 1.5, md: 3 }, py: 2.5 }}>
          <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {messages.map((m) => <ChatBubble key={m.id} msg={m} />)}

            {soloBienvenida && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: "text.secondary", mb: 1, ml: { sm: 6 } }}>
                  PRUEBA PREGUNTANDO
                </Typography>
                <Box sx={{ display: "grid", gap: 1.25, ml: { sm: 6 }, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 210px), 1fr))" }}>
                  {SUGERENCIAS.map((s) => (
                    <ButtonBase
                      key={s.label}
                      onClick={() => elegir(s)}
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.25, p: 1.5, borderRadius: 2.5, textAlign: "left",
                        justifyContent: "flex-start", border: "1px solid", borderColor: "divider",
                        transition: "border-color .2s ease, transform .15s ease, background-color .2s ease",
                        "&:hover": {
                          borderColor: "info.main", transform: "translateY(-2px)",
                          bgcolor: (t) => alpha(t.palette.info.main, 0.07),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 34, height: 34, borderRadius: "10px", display: "flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0, color: "info.main",
                          bgcolor: (t) => alpha(t.palette.info.main, 0.13),
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: 19 }}>{s.icon}</span>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.label}</Typography>
                    </ButtonBase>
                  ))}
                </Box>
              </motion.div>
            )}

            {isLoading && (
              <Stack direction="row" spacing={1.25} alignItems="center">
                <BotAvatar size={34} />
                <Box
                  sx={{
                    px: 2, py: 1.1, borderRadius: 3, borderTopLeftRadius: 4, border: "1px solid", borderColor: "divider",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.07),
                  }}
                >
                  <TypingDots />
                </Box>
              </Stack>
            )}
            <div ref={finRef} />
          </Box>
        </Box>

        {/* Entrada */}
        <Box sx={{ px: { xs: 1.5, md: 3 }, pt: 1.5, pb: 1.25, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 1.25 }}>
            {!soloBienvenida && <ChipsSugerencias sugerencias={SUGERENCIAS} onPick={elegir} disabled={isLoading} />}
            <ChatInput
              value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} inputRef={inputRef}
              placeholder="Escribe tu consulta… (Ej: ¿Dónde hay stock de Leche Gloria?)"
            />
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", fontSize: 11 }}>
              La IA tiene acceso a inventario, sedes, proveedores y campañas, y puede equivocarse. Verifica los datos importantes.
            </Typography>
          </Box>
        </Box>
      </Card>
    </LayoutDashboard>
  );
};

export default ChatIA;
