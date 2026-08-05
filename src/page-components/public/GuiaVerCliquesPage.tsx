"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

import { GuideFaq } from "./guide/GuideFaq";
import { GuideHero } from "./guide/GuideHero";
import { PublicResourcesLinks } from "./PublicResourcesLinks";

/** A dashboard metric chip (i18n-driven): short label + illustrative value. */
interface MetricChip {
  label: string;
  value: string;
}

/** A single step to see clicks (i18n-driven): short title + explanation. */
interface Step {
  title: string;
  desc: string;
}

/**
 * `/guia/como-ver-cliques-do-link` — guide: how to see how many people
 * clicked your link.
 *
 * A pt-BR-first informational/AEO page targeting a very high-intent, low-
 * competition query ("como ver quantas pessoas clicaram no meu link"). The
 * signature element is a "dashboard snapshot" card: a large real-time
 * total-clicks number with a row of metric chips grounded in the actual
 * dashboard (país e cidade, dispositivo, horário de pico, origem/UTM) — so the
 * reader sees exactly what Link Charts delivers, not decoration. Everything
 * else stays quiet and reuses the public design system. The matching `FAQPage`
 * JSON-LD is injected by the server page so crawlers and users read identical
 * answers.
 */
export function GuiaVerCliquesPage() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const chips = t("guiaVerCliques.snapshot.chips", {
    returnObjects: true,
  }) as MetricChip[];
  const steps = t("guiaVerCliques.steps.items", {
    returnObjects: true,
  }) as Step[];

  return (
    <PublicLayout variant="simple" chrome="minimal">
      <Box
        component="main"
        sx={{
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 7, md: 8 },
          pb: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          gap: PUBLIC_SECTION_GAP,
        }}
      >
        {/* ---- Hero ---- */}
        <GuideHero i18nKey="guiaVerCliques" />

        {/* ---- Signature: dashboard snapshot ---- */}
        <Box component="section" aria-labelledby="guia-snapshot-heading">
          <Typography
            id="guia-snapshot-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaVerCliques.snapshot.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              mb: 2.5,
              maxWidth: 680,
            }}
          >
            {t("guiaVerCliques.snapshot.intro")}
          </Typography>

          <Box
            sx={{
              ...getPublicElevatedSx(theme),
              p: { xs: 2.5, md: 3.5 },
            }}
          >
            {/* Big total-clicks number */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                component="p"
                sx={{
                  // The page's one "número grande" — reads the display face off
                  // `theme.typography.h1`, the same source `getPublicDisplaySx`
                  // uses, instead of a literal font stack. Weight is 700, not
                  // 800: Space Grotesk is only loaded at 400/500/700
                  // (`app/layout.tsx`), so 800 would synthesise a faux-bold cut.
                  fontFamily: theme.typography.h1.fontFamily,
                  fontSize: { xs: "3.25rem", md: "4.25rem" },
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: primary,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {t("guiaVerCliques.snapshot.totalValue")}
              </Typography>
              <Typography
                component="p"
                sx={{
                  mt: 1,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: theme.palette.text.secondary,
                }}
              >
                {t("guiaVerCliques.snapshot.totalLabel")}
              </Typography>
            </Box>

            {/* Metric chips grounded in the real dashboard */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(4, 1fr)",
                },
                gap: { xs: 1.25, md: 1.5 },
                mt: 3,
              }}
            >
              {Array.isArray(chips) &&
                chips.map((chip) => (
                  <Box
                    key={chip.label}
                    sx={{
                      p: { xs: 1.5, md: 1.75 },
                      borderRadius: 2,
                      border: `1px solid ${alpha(primary, 0.24)}`,
                      bgcolor: alpha(primary, isDark ? 0.07 : 0.05),
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      {chip.label}
                    </Typography>
                    <Typography
                      component="p"
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: alpha(
                          theme.palette.text.primary,
                          isDark ? 0.88 : 0.9,
                        ),
                      }}
                    >
                      {chip.value}
                    </Typography>
                  </Box>
                ))}
            </Box>

            <Typography
              component="p"
              sx={{
                mt: 2.5,
                fontSize: "0.8125rem",
                lineHeight: 1.55,
                textAlign: "center",
                color: theme.palette.text.secondary,
              }}
            >
              {t("guiaVerCliques.snapshot.caption")}
            </Typography>
          </Box>
        </Box>

        {/* ---- Steps: how to see your clicks ---- */}
        <Box component="section" aria-labelledby="guia-steps-heading">
          <Typography
            id="guia-steps-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaVerCliques.steps.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              mb: 2.5,
              maxWidth: 680,
            }}
          >
            {t("guiaVerCliques.steps.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(steps) &&
              steps.map((step, i) => (
                <Box
                  key={step.title}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.25 } }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        flexShrink: 0,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: primary,
                        border: `1px solid ${alpha(primary, 0.32)}`,
                        bgcolor: alpha(primary, isDark ? 0.1 : 0.07),
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Box>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          fontSize: "0.8125rem",
                          lineHeight: 1.6,
                          color: alpha(
                            theme.palette.text.primary,
                            isDark ? 0.72 : 0.75,
                          ),
                          m: 0,
                        }}
                      >
                        {step.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>

        {/* ---- What you see beyond the total ---- */}
        <Box
          component="section"
          aria-labelledby="guia-beyond-heading"
          sx={{
            ...getPublicElevatedSx(theme),
            p: { xs: 2.5, md: 3 },
            borderColor: alpha(primary, 0.32),
            bgcolor: alpha(primary, isDark ? 0.06 : 0.04),
          }}
        >
          {/* `variant="h3"` brings in the Space Grotesk display face (see
              GuideHero for the full rationale); `component` alone would leave
              this heading in the default body typeface. */}
          <Typography
            id="guia-beyond-heading"
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.35rem" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t("guiaVerCliques.beyond.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.65,
              color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82),
              maxWidth: 680,
            }}
          >
            {t("guiaVerCliques.beyond.body")}
          </Typography>
        </Box>

        {/* ---- FAQ ---- */}
        <GuideFaq i18nKey="guiaVerCliques" />

        {/* ---- CTA ---- */}
        <Box>
          <Typography
            component="p"
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            {t("guiaVerCliques.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>

        {/* ---- Leia também: cross-links para os outros guias/comparações ---- */}
        <PublicResourcesLinks
          variant="readAlso"
          excludeHref="/guia/como-ver-cliques-do-link"
        />
      </Box>
    </PublicLayout>
  );
}

export default GuiaVerCliquesPage;
