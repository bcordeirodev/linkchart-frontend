"use client";

import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Instagram,
  Link2,
} from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

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

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  const steps = t("guiaInstagram.flow.steps", {
    returnObjects: true,
  }) as FlowStep[];
  const metrics = t("guiaInstagram.metrics.items", {
    returnObjects: true,
  }) as MetricItem[];
  const faqItems = t("guiaInstagram.faq.items", {
    returnObjects: true,
  }) as FaqItem[];

  /** Lucide icons, index-aligned with the i18n steps array (bio/Stories, short link, analytics). */
  const stepIcons = [Instagram, Link2, BarChart3];

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
            {t("guiaInstagram.hero.eyebrow")}
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
            {t("guiaInstagram.hero.title")}
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
            {t("guiaInstagram.hero.subtitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72),
            }}
          >
            {t("guiaInstagram.hero.verdict")}
          </Typography>
        </Box>

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
                const Icon = stepIcons[i] ?? Link2;
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box
                          aria-hidden
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: primary,
                            bgcolor: alpha(primary, isDark ? 0.14 : 0.1),
                            border: `1px solid ${alpha(primary, 0.28)}`,
                          }}
                        >
                          <Icon size={20} strokeWidth={2} />
                        </Box>
                        <Typography
                          component="span"
                          aria-hidden
                          sx={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            color: alpha(primary, isDark ? 0.55 : 0.5),
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: 1,
                          }}
                        >
                          {step.number}
                        </Typography>
                      </Box>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          mt: 0.5,
                          mb: 0,
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
            {t("guiaInstagram.auto.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.65,
              color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82),
            }}
          >
            {t("guiaInstagram.auto.body")}
          </Typography>
        </Box>

        {/* ---- FAQ ---- */}
        <Box component="section" aria-labelledby="guia-faq-heading">
          <Typography
            id="guia-faq-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaInstagram.faq.sectionTitle")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.isArray(faqItems) &&
              faqItems.map((item, i) => {
                const isOpen = openFaq === i;
                const triggerId = `${baseId}-gq-${i}`;
                const panelId = `${baseId}-ga-${i}`;
                return (
                  <Box
                    key={item.q}
                    sx={{
                      ...getPublicElevatedSx(theme),
                      overflow: "hidden",
                      ...(isOpen && {
                        borderColor: alpha(primary, 0.32),
                        boxShadow: `inset 3px 0 0 ${alpha(primary, isDark ? 0.5 : 0.4)}`,
                      }),
                    }}
                  >
                    <Box
                      component="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenFaq((prev) => (prev === i ? null : i))
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        px: { xs: 2, md: 2.5 },
                        py: { xs: 1.75, md: 2 },
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        gap: 2,
                        textAlign: "left",
                        color: "inherit",
                      }}
                    >
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          lineHeight: 1.5,
                          color: theme.palette.text.primary,
                          flex: 1,
                          m: 0,
                        }}
                      >
                        {item.q}
                      </Typography>
                      <Box
                        sx={{
                          flexShrink: 0,
                          display: "flex",
                          color: theme.palette.text.secondary,
                          transition: "transform 220ms ease",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <ChevronDown size={18} />
                      </Box>
                    </Box>
                    <Collapse in={isOpen} timeout={220}>
                      <Box
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        sx={{
                          px: { xs: 2, md: 2.5 },
                          pb: { xs: 2, md: 2.25 },
                          pt: 0,
                        }}
                      >
                        <Typography
                          component="p"
                          sx={{
                            fontSize: "0.8125rem",
                            lineHeight: 1.65,
                            color: alpha(
                              theme.palette.text.primary,
                              isDark ? 0.72 : 0.75,
                            ),
                            m: 0,
                          }}
                        >
                          {item.a}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
          </Box>
        </Box>

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
      </Box>
    </PublicLayout>
  );
}

export default GuiaInstagramPage;
