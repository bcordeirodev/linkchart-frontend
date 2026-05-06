"use client";
import { Box, Button, Typography } from "@mui/material";

import { useNavigate } from "@/shared/hooks";

export function PublicCtaBlock() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        p: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.65)",
            mb: 0.5,
          }}
        >
          Quer analytics completos?
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.6,
          }}
        >
          Dispositivos, países, horários de pico e histórico de cliques — tudo
          em um painel próprio.
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={() => navigate("/sign-up")}
        sx={{
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          fontWeight: 600,
          fontSize: "0.8125rem",
          px: 3,
          py: 1.25,
          borderRadius: "8px",
          boxShadow: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          "&:hover": { boxShadow: "none", opacity: 0.88 },
        }}
      >
        Criar conta gratis
      </Button>
    </Box>
  );
}
