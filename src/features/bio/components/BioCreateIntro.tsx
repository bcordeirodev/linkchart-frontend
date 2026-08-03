"use client";

import { Box, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

/**
 * Short pitch shown above the form only while the user has no bio page yet
 * (`page === null`). Explains what the page is for in one line before
 * asking for a handle — disappears for good once the page exists.
 *
 * Accent-left-border callout — same visual recipe as `BioAddressCallout`
 * (`BioPageFormFields.tsx`) and the verdict callout in `GuideHero`/
 * `CompareCompetitorPage`: thin tinted border, 3px accent on the left,
 * primary-tinted background. No icon-chip beside the title (redesign
 * "instrumento técnico" — decorative title icons were dropped app-wide); the
 * accent stripe alone carries the "this is a callout" read.
 */
export function BioCreateIntro() {
  const theme = useTheme();
  const { t } = useTranslation("bio");
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.25 },
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.24)}`,
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.09 : 0.05),
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", mb: 0.25 }}>
        {t("intro.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("intro.description")}
      </Typography>
    </Box>
  );
}

export default BioCreateIntro;
