"use client";

import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, ChevronDown, Minus, X } from "lucide-react";
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

/** A single comparison row's copy (i18n-driven). */
interface CompareRow {
  feature: string;
  lc: string;
  bitly: string;
}

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
}

/**
 * Visual verdict for a cell — drives which icon renders next to the value.
 * This is structural (same across languages), so it lives here rather than in
 * i18n. `yes` = the feature is fully covered, `partial` = limited/conditional,
 * `no` = not available.
 */
type Mark = "yes" | "partial" | "no";

/**
 * Per-row marks, index-aligned with `compareBitly.table.rows` in the i18n
 * locale files. The Link Charts column is always a full "yes"; the Bitly column
 * varies. Keep this in lockstep with the locale array order.
 */
const BITLY_MARKS: readonly Mark[] = [
  "partial", // Preço
  "partial", // Links por mês
  "partial", // Analytics em tempo real
  "partial", // Geografia
  "partial", // Dispositivo e navegador
  "yes", // Origem de tráfego e UTM
  "no", // Score de qualidade (bot vs humano)
  "no", // Subdomínio personalizado
  "partial", // QR Code
  "no", // Página de analytics pública
  "partial", // Interface em português
];

/** Index of the differentiator row (Quality score) — gets the highlight badge. */
const EMPHASIS_INDEX = 6;

/**
 * Renders the mark icon for a comparison cell.
 *
 * @param mark - the visual verdict for the cell
 * @param color - resolved icon color
 */
function MarkIcon({ mark, color }: { mark: Mark; color: string }) {
  const props = { size: 15, color, strokeWidth: 2.5 };
  if (mark === "yes") return <Check {...props} />;
  if (mark === "no") return <X {...props} />;
  return <Minus {...props} />;
}

/**
 * `/comparar/bitly` — "Link Charts vs Bitly" comparison landing.
 *
 * A marketing/SEO page built to be cited by AI answer engines and to rank for
 * commercial-intent queries ("alternativa ao Bitly", "encurtador de URL vs").
 * It reuses the public design system (elevated cards, section headings, CTA
 * block) so it reads as native to the site; the signature element is the
 * feature-by-feature table, where the Link Charts column is visually favored
 * and the traffic-quality-score row is flagged as the key differentiator.
 *
 * All visible copy is i18n-driven (pt-BR default, en fallback); the matching
 * `FAQPage` JSON-LD is injected by the server page so crawlers and users read
 * identical answers.
 */
export function CompareBitlyPage() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  const rows = t("compareBitly.table.rows", {
    returnObjects: true,
  }) as CompareRow[];
  const faqItems = t("compareBitly.faq.items", {
    returnObjects: true,
  }) as FaqItem[];

  /** Shared tint for the favored Link Charts column. */
  const lcTint = alpha(primary, isDark ? 0.08 : 0.06);
  const lcColor = primary;
  const mutedIcon = alpha(theme.palette.text.primary, isDark ? 0.45 : 0.5);

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
          sx={{ textAlign: "center", maxWidth: 720, mx: "auto" }}
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
            {t("compareBitly.hero.eyebrow")}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: theme.palette.text.primary,
              mb: 1.5,
            }}
          >
            {t("compareBitly.hero.title")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: "1rem", md: "1.15rem" },
              fontWeight: 500,
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {t("compareBitly.hero.subtitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72),
            }}
          >
            {t("compareBitly.hero.verdict")}
          </Typography>
        </Box>

        {/* ---- Signature: feature-by-feature table ---- */}
        <Box component="section" aria-labelledby="compare-table-heading">
          <Typography
            id="compare-table-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("compareBitly.table.sectionTitle")}
          </Typography>

          <Box sx={{ ...getPublicElevatedSx(theme), overflow: "hidden", p: 0 }}>
            {/* Header row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                alignItems: "stretch",
              }}
            >
              <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: 1.5 }} />
              <Box
                sx={{
                  px: { xs: 1, md: 2 },
                  py: 1.5,
                  textAlign: "center",
                  bgcolor: lcTint,
                  borderBottom: `2px solid ${alpha(primary, 0.5)}`,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "0.8125rem", md: "0.9375rem" },
                    fontWeight: 800,
                    color: primary,
                  }}
                >
                  {t("compareBitly.table.colLinkCharts")}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: { xs: 1, md: 2 },
                  py: 1.5,
                  textAlign: "center",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "0.8125rem", md: "0.9375rem" },
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t("compareBitly.table.colBitly")}
                </Typography>
              </Box>
            </Box>

            {/* Data rows */}
            {Array.isArray(rows) &&
              rows.map((row, i) => {
                const emphasis = i === EMPHASIS_INDEX;
                const bitlyMark = BITLY_MARKS[i] ?? "partial";
                return (
                  <Box
                    key={row.feature}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 1fr 1fr",
                      alignItems: "center",
                      borderTop: `1px solid ${theme.palette.divider}`,
                      ...(emphasis && {
                        bgcolor: alpha(primary, isDark ? 0.05 : 0.035),
                      }),
                    }}
                  >
                    {/* Feature label */}
                    <Box
                      sx={{
                        px: { xs: 1.5, md: 2.5 },
                        py: { xs: 1.25, md: 1.5 },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.8125rem" },
                          fontWeight: emphasis ? 700 : 500,
                          lineHeight: 1.35,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {row.feature}
                      </Typography>
                      {emphasis && (
                        <Typography
                          component="span"
                          sx={{
                            display: "inline-block",
                            ml: 1,
                            px: 0.75,
                            py: 0.125,
                            borderRadius: 1,
                            fontSize: "0.625rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: primary,
                            bgcolor: alpha(primary, 0.14),
                            verticalAlign: "middle",
                          }}
                        >
                          {t("compareBitly.table.highlightBadge")}
                        </Typography>
                      )}
                    </Box>

                    {/* Link Charts value (favored column) */}
                    <Box
                      sx={{
                        px: { xs: 1, md: 2 },
                        py: { xs: 1.25, md: 1.5 },
                        height: "100%",
                        bgcolor: lcTint,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                      }}
                    >
                      <MarkIcon mark="yes" color={lcColor} />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.8125rem" },
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          textAlign: "center",
                        }}
                      >
                        {row.lc}
                      </Typography>
                    </Box>

                    {/* Bitly value */}
                    <Box
                      sx={{
                        px: { xs: 1, md: 2 },
                        py: { xs: 1.25, md: 1.5 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                      }}
                    >
                      <MarkIcon mark={bitlyMark} color={mutedIcon} />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.8125rem" },
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          textAlign: "center",
                        }}
                      >
                        {row.bitly}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>

          <Typography
            component="p"
            sx={{
              mt: 1.25,
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {t("compareBitly.table.disclaimer")}
          </Typography>
        </Box>

        {/* ---- When to choose ---- */}
        <Box component="section" aria-labelledby="compare-choose-heading">
          <Typography
            id="compare-choose-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("compareBitly.choose.sectionTitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            <Box
              sx={{
                ...getPublicElevatedSx(theme),
                p: { xs: 2, md: 2.5 },
                borderColor: alpha(primary, 0.32),
                bgcolor: lcTint,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: primary,
                  mb: 0.75,
                }}
              >
                {t("compareBitly.choose.linkChartsTitle")}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.8),
                }}
              >
                {t("compareBitly.choose.linkChartsBody")}
              </Typography>
            </Box>
            <Box sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.5 } }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.75,
                }}
              >
                {t("compareBitly.choose.bitlyTitle")}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                }}
              >
                {t("compareBitly.choose.bitlyBody")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ---- FAQ ---- */}
        <Box component="section" aria-labelledby="compare-faq-heading">
          <Typography
            id="compare-faq-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("compareBitly.faq.sectionTitle")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.isArray(faqItems) &&
              faqItems.map((item, i) => {
                const isOpen = openFaq === i;
                const triggerId = `${baseId}-cq-${i}`;
                const panelId = `${baseId}-ca-${i}`;
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
            {t("compareBitly.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>
      </Box>
    </PublicLayout>
  );
}

export default CompareBitlyPage;
