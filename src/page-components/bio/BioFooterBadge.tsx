import { Box } from "@mui/material";
import { Link2 } from "lucide-react";

import type { BioPalette } from "./bioPalette";

interface BioFooterBadgeProps {
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * "Made with Link Charts" badge — the product's viral loop.
 *
 * Always rendered, never conditional on plan/tier: every bio page links back
 * to the homepage so a visitor who lands on someone else's page can find the
 * product itself. Copy is pt-BR and hardcoded (not i18n) — this page renders
 * a stranger's data with no language preference of its own, and the product
 * targets a Brazilian audience first; see `not-found.tsx` in this route for
 * the same reasoning.
 *
 * Deliberately quieter than the link buttons: a filled chip (not a bare
 * outline) so it reads as a real, tappable pill rather than an afterthought,
 * but with no gradient border of its own — that accent is spent once, on the
 * primary links, so the badge stays the calm anchor at the bottom of the
 * page instead of competing with the CTAs above it.
 */
export default function BioFooterBadge({ palette }: BioFooterBadgeProps) {
  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        mx: "auto",
        px: 2,
        py: 0.875,
        borderRadius: "999px",
        bgcolor: palette.buttonBg,
        border: `1px solid ${palette.buttonBorder}`,
        color: palette.textSecondary,
        textDecoration: "none",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        WebkitTapHighlightColor: "transparent",
        transition:
          "color 160ms ease, background-color 160ms ease, box-shadow 200ms ease, transform 160ms ease",
        "@media (prefers-reduced-motion: reduce)": {
          transition:
            "color 160ms ease, background-color 160ms ease, box-shadow 200ms ease",
        },
        "&:hover": {
          color: palette.textPrimary,
          bgcolor: palette.buttonBgHover,
          boxShadow: `0 8px 20px -14px ${palette.interactiveGlow}`,
          "@media (prefers-reduced-motion: no-preference)": {
            transform: "translateY(-1px)",
          },
        },
        "&:focus-visible": {
          outline: `2px solid ${palette.focusRing}`,
          outlineOffset: 2,
        },
      }}
    >
      <Link2 size={14} aria-hidden />
      Feito com Link Charts
    </Box>
  );
}
