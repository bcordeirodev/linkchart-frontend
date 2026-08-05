import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link2Off } from "lucide-react";

import { darkNeutral, darkPrimary } from "@/lib/theme/colors/dark";
import { radiusTokens, surfaceOverlayTokens } from "@/lib/theme/designSystem";
import { BIO_FONT_DISPLAY } from "@/page-components/bio/bioPalette";

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
 * `theme` to read. Same "instrumento técnico" grammar as the resolved page
 * (`BioPublicPage`): flat canvas, veil + hairline surfaces, Space Grotesk
 * heading, and a single solid-blue action — the violet→blue gradient button
 * this screen used to end on was the same AI-template tell the bio page
 * itself dropped on 2026-08-04. The icon stays: this is an empty state, one
 * of the three places the language still allows an icon.
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
            bgcolor: alpha("#FFFFFF", surfaceOverlayTokens.card.dark),
            border: `1px solid ${darkNeutral.border.default}`,
            color: darkNeutral.text.secondary,
          }}
        >
          <Link2Off size={28} aria-hidden />
        </Box>

        <Typography
          component="h1"
          sx={{
            fontFamily: BIO_FONT_DISPLAY,
            fontSize: "1.375rem",
            fontWeight: 700,
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
            borderRadius: `${radiusTokens.md}px`,
            backgroundColor: darkPrimary.main,
            color: darkPrimary.contrastText,
            textDecoration: "none",
            fontSize: "0.9375rem",
            fontWeight: 600,
            transition: "background-color 160ms ease",
            "&:hover": { backgroundColor: darkPrimary[400] },
            "&:focus-visible": {
              outline: `2px solid ${darkPrimary.main}`,
              outlineOffset: 3,
            },
          }}
        >
          Crie a sua página bio grátis
        </Box>
      </Box>
    </Box>
  );
}
