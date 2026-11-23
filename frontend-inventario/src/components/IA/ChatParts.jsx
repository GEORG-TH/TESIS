import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box, ButtonBase, IconButton, TextField, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

const MONO = '"JetBrains Mono", ui-monospace, monospace';
export const GRADIENTE = "linear-gradient(135deg, #2563eb, #3b82f6 55%, #06b6d4)";

export const hora = (ts) =>
  ts ? new Date(ts).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "";

/** Avatar del asistente: icono de robot sobre degradado cobalto-cian. */
export function BotAvatar({ size = 34, online = false }) {
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <Box
        sx={{
          width: "100%", height: "100%", borderRadius: "28%", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", backgroundImage: GRADIENTE,
          boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
        }}
      >
        <SmartToyIcon sx={{ fontSize: size * 0.58 }} />
      </Box>
      {online && (
        <Box
          sx={{
            position: "absolute", right: -2, bottom: -2, width: size * 0.3, height: size * 0.3,
            borderRadius: "50%", bgcolor: "#22c55e", border: "2px solid", borderColor: "background.paper",
          }}
        />
      )}
    </Box>
  );
}

/** Indicador "escribiendo…" con tres puntos animados. */
export function TypingDots() {
  return (
    <Box sx={{ display: "flex", gap: 0.6, alignItems: "center", py: 0.5, px: 0.5 }} aria-label="El asistente está escribiendo">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#4cd7f6", display: "block" }}
          animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </Box>
  );
}

/** Estilos del contenido markdown dentro de una burbuja (listas, tablas, código). */
const markdownSx = (theme) => ({
  fontSize: 14,
  lineHeight: 1.6,
  "& p": { m: 0, mb: 1 },
  "& p:last-child": { mb: 0 },
  "& ul, & ol": { pl: 2.5, my: 0.5, listStylePosition: "outside" },
  "& li": { mb: 0.4 },
  "& strong": { fontWeight: 700 },
  "& h1, & h2, & h3": { fontFamily: '"Sora", "Inter", sans-serif', fontSize: "1.05em", m: 0, mb: 0.75 },
  "& a": { color: "#4cd7f6", textDecoration: "underline" },
  "& blockquote": { m: 0, my: 1, pl: 1.5, borderLeft: "3px solid", borderColor: "primary.main", color: "text.secondary" },
  "& pre": { m: 0, mt: 1, p: 0, borderRadius: 2, overflow: "hidden" },
  "& .md-tabla": {
    overflowX: "auto", my: 1, borderRadius: 2,
    border: "1px solid", borderColor: "divider",
  },
  "& table": { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  "& th, & td": { p: "7px 10px", textAlign: "left", whiteSpace: "nowrap", borderBottom: "1px solid", borderColor: "divider" },
  "& th": {
    fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase",
    bgcolor: alpha(theme.palette.primary.main, 0.1), color: "text.secondary",
  },
  "& tr:last-child td": { borderBottom: "none" },
});

function Markdown({ text }) {
  const theme = useTheme();
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className="md-tabla"><table>{children}</table></div>
        ),
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className={className}
              {...props}
              style={{
                background: alpha(theme.palette.text.primary, 0.1), padding: "2px 5px",
                borderRadius: 4, fontFamily: MONO, fontSize: "0.88em",
              }}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

/** Burbuja de mensaje (asistente o usuario). */
export function ChatBubble({ msg, compact = false }) {
  const theme = useTheme();
  const esUsuario = msg.sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", justifyContent: esUsuario ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}
    >
      {!esUsuario && <BotAvatar size={compact ? 28 : 34} />}
      <Box
        sx={{
          maxWidth: compact ? "88%" : "min(78%, 760px)", minWidth: 0,
          px: compact ? 1.5 : 2, py: compact ? 1.1 : 1.4,
          borderRadius: 3,
          borderTopLeftRadius: esUsuario ? 12 : 4,
          borderTopRightRadius: esUsuario ? 4 : 12,
          color: esUsuario ? "#fff" : "text.primary",
          backgroundImage: esUsuario ? GRADIENTE : "none",
          bgcolor: esUsuario ? "transparent" : alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.08 : 0.05),
          border: esUsuario ? "none" : "1px solid",
          borderColor: msg.error ? "error.main" : "divider",
          boxShadow: esUsuario ? "0 8px 20px rgba(37, 99, 235, 0.3)" : "none",
          ...(!esUsuario && markdownSx(theme)),
          ...(esUsuario && { fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }),
        }}
      >
        {esUsuario ? msg.text : <Markdown text={msg.text} />}
        {msg.ts && (
          <Typography
            component="div"
            sx={{
              mt: 0.5, textAlign: "right", fontFamily: MONO, fontSize: 10,
              color: esUsuario ? "rgba(255,255,255,0.75)" : "text.disabled",
            }}
          >
            {hora(msg.ts)}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}

/** Fila de chips con las capacidades reales del asistente (desplazable, sin barra). */
export function ChipsSugerencias({ sugerencias, onPick, disabled }) {
  return (
    <Box
      sx={{
        display: "flex", gap: 1, overflowX: "auto", pb: 0.5, scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {sugerencias.map((s) => (
        <ButtonBase
          key={s.label}
          disabled={disabled}
          onClick={() => onPick(s)}
          sx={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.75,
            borderRadius: 999, fontSize: 13, fontWeight: 500, color: "info.main",
            border: "1px solid", borderColor: (t) => alpha(t.palette.info.main, 0.4),
            bgcolor: (t) => alpha(t.palette.info.main, 0.08),
            transition: "background-color .2s ease, transform .15s ease",
            "&:hover": { bgcolor: (t) => alpha(t.palette.info.main, 0.16), transform: "translateY(-1px)" },
            "&.Mui-disabled": { opacity: 0.5 },
          }}
        >
          <span className="material-icons" style={{ fontSize: 16 }}>{s.icon}</span>
          {s.label}
        </ButtonBase>
      ))}
    </Box>
  );
}

/** Caja de texto + botón enviar en degradado. Enter envía, Shift+Enter hace salto de línea. */
export function ChatInput({ value, onChange, onSend, disabled, placeholder, inputRef, compact = false }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-end" }}>
      <TextField
        fullWidth
        multiline
        maxRows={compact ? 3 : 5}
        size={compact ? "small" : "medium"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        inputRef={inputRef}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: (t) => alpha(t.palette.background.default, t.palette.mode === "dark" ? 0.6 : 0.8),
            "&.Mui-focused fieldset": { borderColor: "info.main", boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.info.main, 0.2)}` },
          },
        }}
      />
      <IconButton
        onClick={onSend}
        disabled={!value.trim() || disabled}
        aria-label="Enviar mensaje"
        sx={{
          width: compact ? 40 : 48, height: compact ? 40 : 48, mb: compact ? 0 : 0.25, flexShrink: 0,
          color: "#fff", backgroundImage: GRADIENTE, boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
          transition: "transform .15s ease, filter .2s ease",
          "&:hover": { filter: "brightness(1.1)", transform: "translateY(-1px)" },
          "&.Mui-disabled": { backgroundImage: "none", bgcolor: "action.disabledBackground", color: "action.disabled", boxShadow: "none" },
        }}
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
