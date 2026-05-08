"use client";
import { Container, CircularProgress, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { PublicLayout } from "@/shared/layout";

/**
 * Estado de carregamento para Basic Analytics.
 * Usa o mesmo chrome ("minimal") da página em estado normal para manter
 * coerência visual entre carregamento, erro e conteúdo.
 */
export function LoadingState() {
  const { t } = useTranslation("public");
  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
          <Typography sx={{ fontSize: "0.9375rem", color: "text.secondary" }}>
            {t("publicAnalytics.title")}…
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  );
}
