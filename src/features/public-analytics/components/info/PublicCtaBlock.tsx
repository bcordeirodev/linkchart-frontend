"use client";
import { Box, Button, Typography } from "@mui/material";

import { useNavigate } from "@/shared/hooks";

const features = [
  "Grátis para sempre",
  "QR Code incluso",
  "Sem cartão",
  "Slug personalizado",
];

export function PublicCtaBlock() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        p: "20px 24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 3,
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              mb: 0.5,
            }}
          >
            Crie sua conta gratuita
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.65,
              maxWidth: 480,
            }}
          >
            Acesse analytics completos com histórico de cliques, mapa de países,
            dispositivos e horários de pico. Gerencie todos os seus links em um
            painel próprio — com QR Code e slug personalizado em cada um.
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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          pt: 1.5,
        }}
      >
        {features.map((f) => (
          <Typography
            key={f}
            sx={{
              fontSize: "0.6875rem",
              color: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&::before": {
                content: '"✓"',
                color: "#6366f1",
                fontWeight: 700,
              },
            }}
          >
            {f}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
