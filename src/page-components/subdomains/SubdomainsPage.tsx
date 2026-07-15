"use client";

import { Box, Container, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";

/**
 * Página de Subdomínios (scaffold — conteúdo real chega no plano do módulo de subdomínios).
 */
export default function SubdomainsPage() {
  const { t } = useTranslation("common");

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<Skeleton height={400} />}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1">
          {t("nav.subdomains")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("nav.subdomainsDesc")}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={320} />
        </Box>
      </Container>
    </AuthGuardRedirect>
  );
}
