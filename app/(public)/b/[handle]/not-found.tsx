import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { Link2Off } from "lucide-react";

import { darkNeutral } from "@/lib/theme/colors/dark";
import {
  ANALYTICS_GRADIENT_FROM,
  ANALYTICS_GRADIENT_TO,
} from "@/lib/theme/publicActionColors";

/**
 * Not-found UI for `/@{handle}` (real route `/b/[handle]`) — covers both a
 * malformed handle and a handle the backend doesn't know about.
 *
 * Copy is hardcoded pt-BR, not run through i18n, on purpose: this route
 * renders a stranger's data (or, here, no data at all) to a visitor with no
 * established language preference — most arrive cold from a social app — and
 * the product's SEO target is the Brazilian market first. If the bio feature
 * ever needs a multi-language handle (e.g. a creator picking their page's
 * language), revisit this and wire it through the `public` i18n namespace
 * instead of hardcoding.
 *
 * Renders in the dark palette unconditionally: an unresolved handle has no
 * `theme` to read.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function BioNotFound() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        bgcolor: darkNeutral.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 380 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: darkNeutral.elevated,
            color: darkNeutral.text.secondary,
          }}
        >
          <Link2Off size={28} aria-hidden />
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: "1.375rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: darkNeutral.text.primary,
            mb: 1,
          }}
        >
          Essa página não existe
        </Typography>

        <Typography
          sx={{
            fontSize: "0.9375rem",
            lineHeight: 1.55,
            color: darkNeutral.text.secondary,
            mb: 4,
          }}
        >
          O link que você acessou não existe ou foi removido.
        </Typography>

        <Box
          component="a"
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            px: 3.5,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${ANALYTICS_GRADIENT_FROM} 0%, ${ANALYTICS_GRADIENT_TO} 100%)`,
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: "0.9375rem",
            fontWeight: 700,
            transition: "opacity 160ms ease",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Crie a sua página bio grátis
        </Box>
      </Box>
    </Box>
  );
}
