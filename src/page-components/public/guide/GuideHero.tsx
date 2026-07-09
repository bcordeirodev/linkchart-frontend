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
          mb: 2,
        }}
      >
        {t(`${i18nKey}.hero.subtitle`)}
      </Typography>
      <Typography
        component="p"
        sx={{
          fontSize: "0.9375rem",
          lineHeight: 1.6,
          color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72),
        }}
      >
        {t(`${i18nKey}.hero.verdict`)}
      </Typography>
    </Box>
  );
}
