"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

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
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.75rem", md: "2.4rem" },
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: theme.palette.text.primary,
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
