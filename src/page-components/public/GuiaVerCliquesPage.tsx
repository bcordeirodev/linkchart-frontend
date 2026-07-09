"use client";

import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

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

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  const chips = t("guiaVerCliques.snapshot.chips", {
    returnObjects: true,
  }) as MetricChip[];
  const steps = t("guiaVerCliques.steps.items", {
    returnObjects: true,
  }) as Step[];
  const faqItems = t("guiaVerCliques.faq.items", {
    returnObjects: true,
  }) as FaqItem[];

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
            {t("guiaVerCliques.hero.eyebrow")}
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
            {t("guiaVerCliques.hero.title")}
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
            {t("guiaVerCliques.hero.subtitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72),
            }}
          >
            {t("guiaVerCliques.hero.verdict")}
          </Typography>
        </Box>

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
                  fontSize: { xs: "3.25rem", md: "4.25rem" },
                  fontWeight: 800,
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
          <Typography
            id="guia-beyond-heading"
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.35rem" },
              fontWeight: 800,
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
            }}
          >
            {t("guiaVerCliques.beyond.body")}
          </Typography>
        </Box>

        {/* ---- FAQ ---- */}
        <Box component="section" aria-labelledby="guia-faq-heading">
          <Typography
            id="guia-faq-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaVerCliques.faq.sectionTitle")}
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
            {t("guiaVerCliques.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>
      </Box>
    </PublicLayout>
  );
}

export default GuiaVerCliquesPage;
