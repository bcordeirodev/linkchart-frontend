"use client";
import { ExternalLink, Zap } from "lucide-react";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

import { createComponentColorSet, createPresetShadows } from "@/lib/theme";

interface RedirectLoaderProps {
  targetUrl: string;
  countdown: number;
  isRedirecting: boolean;
}

/**
 * Componente de loading para redirecionamento
 * Componentizado seguindo padrão do projeto com utilitários de tema
 */
export function RedirectLoader({
  targetUrl,
  countdown,
  isRedirecting,
}: RedirectLoaderProps) {
  const theme = useTheme();

  // Usa utilitários de tema
  const primaryColors = createComponentColorSet(theme, "primary");
  const shadows = createPresetShadows(theme);
  // const animations = createPresetAnimations(theme); // Removido temporariamente

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 500,
          mx: "auto",
          // Background sólido consistente
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: shadows.primaryGlow,
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                // Usa cores padronizadas
                color: primaryColors.main,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {isRedirecting
              ? "🚀 Redirecionando..."
              : "⏳ Preparando redirecionamento..."}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 3,
            }}
          >
            Você será redirecionado para:
          </Typography>

          <Chip
            icon={<ExternalLink {...ICON_LG} />}
            label={
              targetUrl.length > 50
                ? `${targetUrl.substring(0, 50)}...`
                : targetUrl
            }
            sx={{
              bgcolor: "rgba(59, 130, 246, 0.2)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              mb: 3,
              maxWidth: "100%",
            }}
          />

          {countdown > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <Zap {...ICON_LG} style={{ color: "#10b981" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#10b981",
                  fontWeight: 500,
                }}
              >
                Redirecionando em {countdown}s
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default RedirectLoader;
