import { Box, Typography, Stack } from "@mui/material";

/** Encabezado de página: barra de acento, título en Sora, subtítulo y acciones. */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "stretch", gap: 1.5, minWidth: 0 }}>
        <Box
          aria-hidden
          sx={{
            width: 4,
            borderRadius: 2,
            flexShrink: 0,
            backgroundImage: (t) => `linear-gradient(180deg, ${t.palette.primary.main}, ${t.palette.info.main})`,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontSize: { xs: "1.35rem", md: "1.7rem" }, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
          {actions}
        </Stack>
      )}
    </Box>
  );
}
