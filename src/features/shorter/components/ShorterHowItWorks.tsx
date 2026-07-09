"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BarChart2, Link2, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import {
  getPublicBlockTitleSx,
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
} from "@/lib/theme/publicPageStyles";
import { PublicBlockIcon } from "@/shared/ui/base";

type StepKey = "paste" | "shorten" | "track";

const STEPS: Array<{ key: StepKey; icon: typeof Link2; step: string }> = [
  { key: "paste", icon: Link2, step: "01" },
  { key: "shorten", icon: Zap, step: "02" },
  { key: "track", icon: BarChart2, step: "03" },
];

/**
 * Three-step explainer for /shorter — placed directly below the shortener form.
 */
export function ShorterHowItWorks() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  // Pre-resolved so tsc doesn't crash on template-literal overload resolution (TS 5.8 bug).
  const stepLabels: Record<StepKey, { title: string; desc: string }> = {
    paste: {
      title: t("shorter.steps.paste.title"),
      desc: t("shorter.steps.paste.desc"),
    },
    shorten: {
      title: t("shorter.steps.shorten.title"),
      desc: t("shorter.steps.shorten.desc"),
    },
    track: {
      title: t("shorter.steps.track.title"),
      desc: t("shorter.steps.track.desc"),
    },
  };

  return (
    <Box
      component="section"
      aria-labelledby="shorter-how-it-works"
      sx={{
        mb: 2,
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
      }}
    >
      <Typography
        id="shorter-how-it-works"
        component="h2"
        sx={getPublicSectionHeadingSx(theme)}
      >
        {t("shorter.howItWorks")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {STEPS.map(({ key, icon, step }) => (
          <Box
            key={key}
            component="article"
            aria-labelledby={`shorter-step-${key}`}
            sx={{
              ...getPublicElevatedSx(theme),
              textAlign: "center",
              px: 2.5,
              py: 3,
              transition: "border-color 200ms ease, background 200ms ease",
              "&:hover": {
                borderColor: alpha(theme.palette.primary.main, 0.28),
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.05 : 0.04,
                ),
              },
            }}
          >
            <PublicBlockIcon icon={icon} variant="step" />
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: alpha(theme.palette.primary.main, isDark ? 0.85 : 0.75),
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.14 : 0.08,
                ),
                px: 1,
                py: 0.25,
                borderRadius: "20px",
                mb: 0.5,
              }}
            >
              {step}
            </Typography>
            <Typography
              id={`shorter-step-${key}`}
              component="h3"
              sx={{
                ...getPublicBlockTitleSx(theme),
                display: "block",
                mt: 0.5,
              }}
            >
              {stepLabels[key].title}
            </Typography>
            <Typography
              component="p"
              sx={{
                color: alpha(
                  theme.palette.text.primary,
                  theme.palette.mode === "dark" ? 0.62 : 0.68,
                ),
                mt: 0.75,
                fontSize: "0.8125rem",
                lineHeight: 1.55,
                m: 0,
              }}
            >
              {stepLabels[key].desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ShorterHowItWorks;
