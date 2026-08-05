"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { typographyScale } from "@/lib/theme";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

import { GuideFaq } from "./guide/GuideFaq";
import { GuideHero } from "./guide/GuideHero";
import { PublicResourcesLinks } from "./PublicResourcesLinks";

/** A step in the Instagram tracking flow (i18n-driven): number label, title, one-line meaning. */
interface FlowStep {
  number: string;
  title: string;
  desc: string;
}

/** A single tracked metric (i18n-driven): short title + human explanation. */
interface MetricItem {
  title: string;
  desc: string;
}

/**
 * `/guia/rastrear-link-instagram` — guide: tracking clicks from an Instagram link.
 *
 * A pt-BR-first informational/AEO page targeting a high-intent query ("como
 * rastrear cliques de um link no Instagram"). The signature element is a real,
 * ordered 3-step flow grounded in the actual Instagram use case — bio/Stories
 * link → Link Charts short link → analytics (source, device, city) — using only
 * theme tokens so it stays dark-theme-safe. Everything else stays quiet and
 * reuses the public design system. The matching `FAQPage` JSON-LD is injected by
 * the server page so crawlers and users read identical answers.
 */
export function GuiaInstagramPage() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const steps = t("guiaInstagram.flow.steps", {
    returnObjects: true,
  }) as FlowStep[];
  const metrics = t("guiaInstagram.metrics.items", {
    returnObjects: true,
  }) as MetricItem[];

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
        <GuideHero i18nKey="guiaInstagram" />

        {/* ---- Signature: 3-step flow ---- */}
        <Box component="section" aria-labelledby="guia-flow-heading">
          <Typography
            id="guia-flow-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaInstagram.flow.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              mb: 2.5,
              maxWidth: 680,
              mx: "auto",
              textAlign: "center",
            }}
          >
            {t("guiaInstagram.flow.intro")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              gap: { xs: 1.5, md: 1 },
            }}
          >
            {Array.isArray(steps) &&
              steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <Box
                    key={step.number}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: "stretch",
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        ...getPublicElevatedSx(theme),
                        p: { xs: 2, md: 2.25 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {/* No icon-chip beside the step title — the banned
                          decorative pattern. The number alone marks the
                          sequence, in the monospace face like the app's other
                          technical indices (zero-padded "01/02/03" reads as a
                          counter, not a display headline). */}
                      <Typography
                        component="span"
                        aria-hidden
                        sx={{
                          fontFamily: typographyScale.code.fontFamily,
                          fontSize: "1.375rem",
                          fontWeight: 600,
                          color: alpha(primary, isDark ? 0.6 : 0.55),
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {step.number}
                      </Typography>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          m: 0,
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

                    {!isLast && (
                      <Box
                        aria-hidden
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: alpha(primary, isDark ? 0.6 : 0.55),
                          py: { xs: 0.25, md: 0 },
                          px: { xs: 0, md: 0.25 },
                          transform: { xs: "rotate(90deg)", md: "none" },
                        }}
                      >
                        <ArrowRight size={20} strokeWidth={2.25} />
                      </Box>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>

        {/* ---- Why a short link on Instagram ---- */}
        <Box component="section" aria-labelledby="guia-why-heading">
          <Typography
            id="guia-why-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaInstagram.why.sectionTitle")}
          </Typography>
          <Box sx={{ ...getPublicElevatedSx(theme), p: { xs: 2.5, md: 3 } }}>
            <Typography
              component="p"
              sx={{
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82),
                maxWidth: 680,
                m: 0,
              }}
            >
              {t("guiaInstagram.why.body")}
            </Typography>
          </Box>
        </Box>

        {/* ---- What you see in each click ---- */}
        <Box component="section" aria-labelledby="guia-metrics-heading">
          <Typography
            id="guia-metrics-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaInstagram.metrics.sectionTitle")}
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
            {t("guiaInstagram.metrics.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(metrics) &&
              metrics.map((metric) => (
                <Box
                  key={metric.title}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.25 } }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.25,
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        mt: 0.75,
                        flexShrink: 0,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: primary,
                      }}
                    />
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
                        {metric.title}
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
                        {metric.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>

        {/* ---- How Link Charts does it ---- */}
        <Box
          component="section"
          aria-labelledby="guia-auto-heading"
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
            id="guia-auto-heading"
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.35rem" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t("guiaInstagram.auto.sectionTitle")}
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
            {t("guiaInstagram.auto.body")}
          </Typography>
        </Box>

        {/* ---- FAQ ---- */}
        <GuideFaq i18nKey="guiaInstagram" />

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
            {t("guiaInstagram.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>

        {/* ---- Leia também: cross-links para os outros guias/comparações ---- */}
        <PublicResourcesLinks
          variant="readAlso"
          excludeHref="/guia/rastrear-link-instagram"
        />
      </Box>
    </PublicLayout>
  );
}

export default GuiaInstagramPage;
