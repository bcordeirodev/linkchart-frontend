import { Box } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";

import { BIO_FONT_MONO } from "./bioPalette";

import type { BioPalette } from "./bioPalette";

interface BioFooterBadgeProps {
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * "Feito com Link Charts" badge — the product's viral loop.
 *
 * Always rendered, never conditional on plan/tier: every bio page links back
 * to the homepage so a visitor who lands on someone else's page can find the
 * product itself. Copy is pt-BR and hardcoded (not i18n) — this page renders
 * a stranger's data with no language preference of its own, and the product
 * targets a Brazilian audience first; see `not-found.tsx` in this route for
 * the same reasoning.
 *
 * Dressed as a maker's mark, not a CTA: mono caps at the page's smallest
 * type size, in the same veil + hairline pill every other element uses. It
 * stays legible and tappable (the acquisition link has to work) while
 * reading as the instrument's stamp at the bottom of the page rather than a
 * fifth button competing with the creator's own links. The decorative link
 * icon it used to carry is gone — in this language an icon has to be
 * functional (navigation, buttons, empty states), and here it was neither.
 */
export default function BioFooterBadge({ palette }: BioFooterBadgeProps) {
  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        mx: "auto",
        px: 1.75,
        py: 0.875,
        borderRadius: `${radiusTokens.full}px`,
        backgroundColor: palette.surface,
        border: `1px solid ${palette.hairline}`,
        color: palette.textSecondary,
        textDecoration: "none",
        fontFamily: BIO_FONT_MONO,
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        WebkitTapHighlightColor: "transparent",
        transition:
          "color 160ms ease, background-color 160ms ease, border-color 160ms ease",
        "&:hover": {
          color: palette.textPrimary,
          backgroundColor: palette.surfaceHover,
          borderColor: palette.hairlineStrong,
        },
        "&:focus-visible": {
          outline: `2px solid ${palette.focusRing}`,
          outlineOffset: 2,
        },
      }}
    >
      Feito com Link Charts
    </Box>
  );
}
