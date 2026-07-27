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
        border: `1px solid ${palette.buttonBorder}`,
        color: palette.textSecondary,
        textDecoration: "none",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
        transition: "color 160ms ease, border-color 160ms ease",
        "&:hover": {
          color: palette.textPrimary,
        },
      }}
    >
      <Link2 size={14} aria-hidden />
      Feito com Link Charts
    </Box>
  );
}
