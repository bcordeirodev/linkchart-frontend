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

/** A quality-score tier (i18n-driven): label, numeric range, one-line meaning. */
interface ScoreTier {
  label: string;
  range: string;
  desc: string;
}

/** A bot signal (i18n-driven): short title + human explanation. */
interface Signal {
  title: string;
  desc: string;
}

/**
 * `/guia/cliques-bot-vs-humano` — guide: telling real clicks from bots.
 *
 * A pt-BR-first informational/AEO page targeting a differentiator with very low
 * competition ("como saber se os cliques são bots"). The signature element is
 * the 0–100 quality-score meter, split into the product's three real tiers
 * (organic / suspicious / likely fraud) — grounded in the actual scoring the
 * backend computes, not decoration. Everything else stays quiet and reuses the
 * public design system. The matching `FAQPage` JSON-LD is injected by the
 * server page so crawlers and users read identical answers.
 */
export function GuiaCliquesBotsPage() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const tiers = t("guiaBots.score.tiers", {
    returnObjects: true,
  }) as ScoreTier[];
  const signals = t("guiaBots.signals.items", {
    returnObjects: true,
  }) as Signal[];

  /** Tier colors, index-aligned with the i18n tiers array (organic, suspicious, fraud). */
  const tierColors = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  /** Meter segments, worst→best (left→right): fraud 0–49, suspicious 50–79, organic 80–100. */
  const segments = [
    { color: theme.palette.error.main, width: "50%" },
    { color: theme.palette.warning.main, width: "30%" },
    { color: theme.palette.success.main, width: "20%" },
  ];

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
        <GuideHero i18nKey="guiaBots" />

        {/* ---- Signature: quality-score meter ---- */}
        <Box component="section" aria-labelledby="guia-score-heading">
          <Typography
            id="guia-score-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaBots.score.sectionTitle")}
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
            {t("guiaBots.score.intro")}
          </Typography>

          <Box sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 3 } }}>
            {/* The meter bar (worst → best) */}
            <Box
              sx={{
                display: "flex",
                height: 14,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              {segments.map((seg) => (
                <Box
                  key={seg.width}
                  sx={{
                    flexBasis: seg.width,
                    bgcolor: alpha(seg.color, isDark ? 0.85 : 0.9),
                  }}
                />
              ))}
            </Box>
            {/* Scale ticks */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 0.75,
              }}
            >
              {["0", "50", "80", "100"].map((tick) => (
                <Typography
                  key={tick}
                  component="span"
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: theme.palette.text.disabled,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {tick}
                </Typography>
              ))}
            </Box>

            {/* Tier cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: { xs: 1.25, md: 1.75 },
                mt: 2.5,
              }}
            >
              {Array.isArray(tiers) &&
                tiers.map((tier, i) => {
                  const color = tierColors[i] ?? primary;
                  return (
                    <Box
                      key={tier.label}
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                        border: `1px solid ${alpha(color, 0.3)}`,
                        bgcolor: alpha(color, isDark ? 0.07 : 0.05),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          component="h3"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color,
                            m: 0,
                          }}
                        >
                          {tier.label}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {tier.range}
                        </Typography>
                      </Box>
                      <Typography
                        component="p"
                        sx={{
                          fontSize: "0.8125rem",
                          lineHeight: 1.55,
                          color: alpha(
                            theme.palette.text.primary,
                            isDark ? 0.72 : 0.75,
                          ),
                          m: 0,
                        }}
                      >
                        {tier.desc}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>

            <Typography
              component="p"
              sx={{
                mt: 2,
                fontSize: "0.8125rem",
                lineHeight: 1.55,
                color: theme.palette.text.secondary,
              }}
            >
              {t("guiaBots.score.scoreExplain")}
            </Typography>
          </Box>
        </Box>

        {/* ---- Signals ---- */}
        <Box component="section" aria-labelledby="guia-signals-heading">
          <Typography
            id="guia-signals-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaBots.signals.sectionTitle")}
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
            {t("guiaBots.signals.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(signals) &&
              signals.map((signal) => (
                <Box
                  key={signal.title}
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
                        {signal.title}
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
                        {signal.desc}
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
          <Typography
            id="guia-auto-heading"
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.35rem" },
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t("guiaBots.auto.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.65,
              color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82),
            }}
          >
            {t("guiaBots.auto.body")}
          </Typography>
        </Box>

        {/* ---- FAQ ---- */}
        <GuideFaq i18nKey="guiaBots" />

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
            {t("guiaBots.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>
      </Box>
    </PublicLayout>
  );
}

export default GuiaCliquesBotsPage;
