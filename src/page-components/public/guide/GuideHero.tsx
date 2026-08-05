"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getPublicDisplaySx } from "@/lib/theme/publicPageStyles";

import type { GuideI18nKey } from "./types";

/** Props for {@link GuideHero}. */
interface GuideHeroProps {
  /** i18n namespace prefix (under `public`) holding `hero.{eyebrow,title,subtitle,verdict}`. */
  i18nKey: GuideI18nKey;
}

/**
 * Shared hero block for the public `/guia/*` pages.
 *
 * Reads `${i18nKey}.hero.{eyebrow,title,subtitle,verdict}` from the `public`
 * i18n namespace. Markup and styling are identical across every guide page —
 * only the i18n namespace differs — so this is extracted once instead of
 * duplicated per page.
 *
 * Hierarquia deliberada (feedback 2026-08-02: heros empilhavam parágrafos
 * cinza demais): eyebrow → H1 → UM subtítulo → cartão de resposta. O
 * `verdict` não é um segundo subtítulo — é a resposta direta da página, e
 * renderiza como um callout destacado (borda de acento + fundo leve), o que
 * também marca visualmente o trecho citável para AEO.
 */
export function GuideHero({ i18nKey }: GuideHeroProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
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
      {/* `variant="h1"` is load-bearing, not decoration: `component` alone only
          swaps the DOM tag, leaving MUI's default `body1` typography (Inter)
          on the page's actual heading. Same recipe as every other public hero
          (ShorterHero, ToolsHero, CompareCompetitorPage,
          PublicAnalyticsPageContent): `getPublicDisplaySx` resolves the
          Space Grotesk family from `theme.typography.h1` and uses weight 700,
          not 800 — `app/layout.tsx` loads Space Grotesk at 400/500/700 only,
          so 800 would ask the browser to synthesise a bolder face. */}
      <Typography
        variant="h1"
        component="h1"
        sx={{ ...getPublicDisplaySx(theme), mb: 1.5 }}
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

      {/* Cartão de resposta: a conclusão direta do guia, destacada — não é
          um segundo subtítulo. */}
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
