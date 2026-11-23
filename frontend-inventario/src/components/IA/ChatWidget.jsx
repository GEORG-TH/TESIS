import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Fab, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useChatIA, SUGERENCIAS } from "./useChatIA";
import { BotAvatar, ChatBubble, ChatInput, ChipsSugerencias, TypingDots, GRADIENTE } from "./ChatParts";

const SORA = '"Sora", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Widget flotante del Gerente IA (esquina inferior derecha del dashboard). */
const ChatWidget = () => {
  const { messages, isLoading, enviar, limpiar } = useChatIA();
  const [abierto, setAbierto] = useState(false);
  const [input, setInput] = useState("");
  const finRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, abierto]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    enviar(input);
    setInput("");
  };

  const elegir = (s) => {
    if (s.prompt.endsWith(" ")) {
      setInput(s.prompt);
      inputRef.current?.focus();
    } else {
      enviar(s.prompt);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed", right: { xs: 12, sm: 20 }, bottom: { xs: 12, sm: 20 }, zIndex: 1200,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5,
      }}
    >
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
          >
            <Box
              role="dialog"
              aria-label="Asistente IA"
              sx={{
                width: { xs: "calc(100vw - 24px)", sm: 390 },
                height: "min(560px, calc(100dvh - 110px))",
                display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 4,
                bgcolor: "background.paper", border: "1px solid", borderColor: (t) => alpha(t.palette.info.main, 0.35),
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
              }}
            >
              {/* Cabecera */}
              <Stack
                direction="row" alignItems="center" justifyContent="space-between" spacing={1}
                sx={{
                  px: 2, py: 1.25, borderBottom: "1px solid", borderColor: "divider",
                  bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.14 : 0.07),
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
                  <BotAvatar size={38} online />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontFamily: SORA, fontWeight: 700, fontSize: 16, lineHeight: 1.2 }} noWrap>
                      Gerente IA
                    </Typography>
                    <Typography sx={{ fontFamily: MONO, fontSize: 11, color: "success.main" }} noWrap>
                      ● En línea
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.25}>
                  <Tooltip title="Nueva conversación">
                    <span>
                      <IconButton size="small" onClick={limpiar} aria-label="Nueva conversación" disabled={messages.length === 1 && !isLoading}>
                        <DeleteSweepIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Cerrar">
                    <IconButton size="small" onClick={() => setAbierto(false)} aria-label="Cerrar chat">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* Mensajes */}
              <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
                {messages.map((m) => <ChatBubble key={m.id} msg={m} compact />)}
                {isLoading && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BotAvatar size={28} />
                    <Box sx={{ px: 1.5, py: 0.8, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: (t) => alpha(t.palette.primary.main, 0.07) }}>
                      <TypingDots />
                    </Box>
                  </Stack>
                )}
                <div ref={finRef} />
              </Box>

              {/* Sugerencias + entrada */}
              <Box sx={{ px: 2, pt: 1.25, pb: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.1 }}>
                <ChipsSugerencias sugerencias={SUGERENCIAS} onPick={elegir} disabled={isLoading} />
                <ChatInput
                  compact value={input} onChange={setInput} onSend={handleSend} disabled={isLoading}
                  inputRef={inputRef} placeholder="Escribe tu consulta…"
                />
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <Box sx={{ position: "relative" }}>
        <Fab
          aria-label={abierto ? "Cerrar asistente IA" : "Abrir asistente IA"}
          onClick={() => setAbierto((v) => !v)}
          sx={{
            color: "#fff", backgroundImage: GRADIENTE, boxShadow: "0 10px 28px rgba(37, 99, 235, 0.5)",
            "&:hover": { filter: "brightness(1.1)", backgroundImage: GRADIENTE },
          }}
        >
          {abierto ? <CloseIcon /> : <SmartToyIcon />}
        </Fab>
        {!abierto && (
          <Box
            sx={{
              position: "absolute", top: 2, right: 2, width: 13, height: 13, borderRadius: "50%",
              bgcolor: "#22c55e", border: "2px solid", borderColor: "background.paper", pointerEvents: "none",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatWidget;
