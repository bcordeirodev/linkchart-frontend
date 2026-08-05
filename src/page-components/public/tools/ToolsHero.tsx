"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getPublicDisplaySx } from "@/lib/theme/publicPageStyles";

import type { ToolsI18nKey } from "./types";

/** Props for {@link ToolsHero}. */
interface ToolsHeroProps {
  /** i18n prefix (under the `tools` namespace) holding `hero.{eyebrow,title,subtitle,verdict}`. */
  i18nKey: ToolsI18nKey;
}

/**
 * Shared hero block for the public `/ferramentas/*` tool pages.
 *
 * Reads `${i18nKey}.hero.{eyebrow,title,subtitle,verdict}` from the `tools`
 * i18n namespace. Mirrors the `/guia/*` hero (`GuideHero`) so the public pages
 * read as one family, while keeping the tool copy in its own namespace.
 *
 * Hierarchy is deliberate (same fix as `GuideHero`/`CompareCompetitorPage`):
 * eyebrow → H1 → ONE subtitle → answer card. `verdict` is not a second
 * subtitle — it renders as an accent-bordered callout, not another stacked
 * gray paragraph.
 */
export function ToolsHero({ i18nKey }: ToolsHeroProps) {
  const theme = useTheme();
  const { t } = useTranslation("tools");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return (
    <Box
      component="header"
      sx={{ textAlign: "center", maxWidth: 760, mx: "auto" }}
    >
      <Typography
        component="p"
        sx={{
          display: "inline-block",
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: primary,
          mb: 1.5,
        }}
      >
        {t(`${i18nKey}.hero.eyebrow`)}
      </Typography>
      {/* `variant="h1"` is load-bearing, not decoration: `component` alone
          only swaps the DOM tag, leaving MUI's default `body1` typography
          (Inter) on the page's most important heading. The variant selects
          the theme's display face; `getPublicDisplaySx` then re-states it for
          safety and layers the responsive clamp on top. Same fix as
          `ShorterHero`. */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          ...getPublicDisplaySx(theme),
          mb: 1.5,
        }}
      >
        {t(`${i18nKey}.hero.title`)}
      </Typography>
      <Typography
        component="p"
        sx={{
          fontSize: { xs: "1rem", md: "1.1rem" },
          fontWeight: 500,
          color: theme.palette.text.secondary,
        }}
      >
        {t(`${i18nKey}.hero.subtitle`)}
      </Typography>

      {/* Answer card: the tool's direct promise, highlighted — not a second
          subtitle. Same recipe as `GuideHero`/`CompareCompetitorPage`. */}
      <Box
        sx={{
          mt: { xs: 2.5, md: 3 },
          mx: "auto",
          maxWidth: 620,
          textAlign: "left",
          px: { xs: 2, md: 2.5 },
          py: { xs: 1.75, md: 2 },
          borderRadius: 2,
          border: `1px solid ${alpha(primary, isDark ? 0.3 : 0.24)}`,
          borderLeft: `3px solid ${primary}`,
          bgcolor: alpha(primary, isDark ? 0.09 : 0.05),
        }}
      >
        <Typography
          component="p"
          sx={{
            fontSize: "0.9375rem",
            lineHeight: 1.65,
            color: alpha(theme.palette.text.primary, isDark ? 0.88 : 0.9),
            m: 0,
          }}
        >
          {t(`${i18nKey}.hero.verdict`)}
        </Typography>
      </Box>
    </Box>
  );
}
