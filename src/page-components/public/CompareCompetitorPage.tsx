"use client";

import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, ChevronDown, Minus, X } from "lucide-react";
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

import { PublicResourcesLinks } from "./PublicResourcesLinks";

/**
 * Visual verdict for a comparison cell — drives which icon renders next to the
 * value. `yes` = the feature is fully covered, `partial` = limited/conditional,
 * `no` = not available. Unlike the Bitly page, marks are data-driven per column
 * (both Link Charts and the rival can be any value) so honest ties/losses show.
 */
type Mark = "yes" | "partial" | "no";

/**
 * A single comparison row's copy (i18n-driven). Each column carries its own
 * mark, so neither side is forced to always "win". `emphasis` highlights the
 * signature differentiator rows (e.g. traffic-quality score, ad-free redirect).
 */
interface CompareRow {
  feature: string;
  lc: string;
  lcMark: Mark;
  rival: string;
  rivalMark: Mark;
  emphasis?: boolean;
}

/** A single FAQ entry (i18n-driven). */
interface FaqItem {
  q: string;
  a: string;
}

/**
 * A single dated policy/pricing change for the optional "what changed at
 * {competitor}" section (i18n-driven). `tag` is a short factual anchor rendered
 * as a chip above the title — a date ("Desde fev/2025") or a scope ("Plano
 * grátis") — so the structure encodes verifiable facts, not decoration.
 */
interface ChangeItem {
  tag?: string;
  title: string;
  desc: string;
}

/** Props for {@link CompareCompetitorPage}. */
interface CompareCompetitorPageProps {
  /** i18n namespace key holding this comparison's copy (e.g. "compareShortIo"). */
  i18nKey: string;
}

/**
 * Maps each comparison's i18n key to its route, so the "Leia também" block can
 * exclude the page currently being viewed from its own cross-links.
 */
const COMPARE_ROUTES: Record<string, string> = {
  compareBitly: "/comparar/bitly",
  compareDub: "/comparar/dub",
  compareShortIo: "/comparar/short-io",
};

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
 * Generalized "Link Charts vs {competitor}" comparison landing, shared by the
 * Bitly, Dub and Short.io pages.
 *
 * Built for honest comparisons: every cell renders its own i18n-driven mark on
 * BOTH columns, so ties and losses show and the table reads as balanced rather
 * than a fake sweep. Rows flagged `emphasis: true` in i18n get the highlight
 * badge as signature differentiators.
 *
 * Sections are driven entirely by the `${i18nKey}.*` resource shape. The
 * `changes` block ("what changed at {competitor}") is OPTIONAL per comparison:
 * it renders only when `${i18nKey}.changes.items` resolves to an array, so
 * comparisons without that key (Dub, Short.io) are unaffected.
 *
 * All visible copy is read from `${i18nKey}.*` (pt-BR default, en fallback); the
 * matching `FAQPage` JSON-LD is injected by the server page so crawlers and
 * users read identical answers.
 *
 * @param props - see {@link CompareCompetitorPageProps}
 */
export function CompareCompetitorPage({ i18nKey }: CompareCompetitorPageProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const baseId = useId();

  // i18next resource keys are statically typed, but this page resolves them
  // dynamically from `i18nKey`. Route dynamic lookups through loosely-typed
  // helpers so they type-check without weakening the rest of the codebase.
  const tstr = t as unknown as (key: string) => string;
  const tobj = <T,>(key: string): T =>
    (t as unknown as (key: string, opts: { returnObjects: true }) => T)(key, {
      returnObjects: true,
    });

  /**
   * Resolves an optional i18n string: i18next echoes the key back when a
   * translation is missing, so a value equal to its own key means "absent".
   *
   * @param key - namespace-relative resource key
   * @returns the translated string, or `null` when the key is not defined
   */
  const topt = (key: string): string | null => {
    const value = tstr(key);
    return value === key ? null : value;
  };

  const rows = tobj<CompareRow[]>(`${i18nKey}.table.rows`);
  const faqItems = tobj<FaqItem[]>(`${i18nKey}.faq.items`);

  // Optional "what changed at {competitor}" block — present only for
  // comparisons that define `${i18nKey}.changes` (currently Bitly). A missing
  // key resolves to the key string itself, never an array.
  const changesRaw = tobj<ChangeItem[] | string>(`${i18nKey}.changes.items`);
  const changeItems = Array.isArray(changesRaw) ? changesRaw : null;
  const changesIntro = topt(`${i18nKey}.changes.intro`);
  const changesNote = topt(`${i18nKey}.changes.note`);

  /** Subtle brand tint for the Link Charts column (no fake winning). */
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
            {tstr(`${i18nKey}.hero.eyebrow`)}
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
            {tstr(`${i18nKey}.hero.title`)}
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
            {tstr(`${i18nKey}.hero.subtitle`)}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72),
            }}
          >
            {tstr(`${i18nKey}.hero.verdict`)}
          </Typography>
        </Box>

        {/* ---- Optional: dated "what changed at {competitor}" context ---- */}
        {changeItems && (
          <Box component="section" aria-labelledby="compare-changes-heading">
            <Typography
              id="compare-changes-heading"
              component="h2"
              sx={getPublicSectionHeadingSx(theme)}
            >
              {tstr(`${i18nKey}.changes.sectionTitle`)}
            </Typography>
            {changesIntro && (
              <Typography
                component="p"
                sx={{
                  mb: 2,
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                }}
              >
                {changesIntro}
              </Typography>
            )}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {changeItems.map((item) => (
                <Box
                  key={item.title}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.5 } }}
                >
                  {item.tag && (
                    <Typography
                      component="span"
                      sx={{
                        display: "inline-block",
                        mb: 1,
                        px: 0.75,
                        py: 0.125,
                        borderRadius: 1,
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: primary,
                        bgcolor: alpha(primary, 0.14),
                      }}
                    >
                      {item.tag}
                    </Typography>
                  )}
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 0.75,
                    }}
                  >
                    {item.title}
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
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
            {changesNote && (
              <Typography
                component="p"
                sx={{
                  mt: 1.25,
                  fontSize: "0.75rem",
                  color: theme.palette.text.disabled,
                }}
              >
                {changesNote}
              </Typography>
            )}
          </Box>
        )}

        {/* ---- Signature: feature-by-feature table ---- */}
        <Box component="section" aria-labelledby="compare-table-heading">
          <Typography
            id="compare-table-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {tstr(`${i18nKey}.table.sectionTitle`)}
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
                  {tstr(`${i18nKey}.table.colLinkCharts`)}
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
                  {tstr(`${i18nKey}.table.colRival`)}
                </Typography>
              </Box>
            </Box>

            {/* Data rows */}
            {Array.isArray(rows) &&
              rows.map((row) => {
                const emphasis = row.emphasis === true;
                const lcMark: Mark = row.lcMark ?? "yes";
                const rivalMark: Mark = row.rivalMark ?? "partial";
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
                          {tstr(`${i18nKey}.table.highlightBadge`)}
                        </Typography>
                      )}
                    </Box>

                    {/* Link Charts value (subtle brand tint, honest mark) */}
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
                      <MarkIcon
                        mark={lcMark}
                        color={lcMark === "yes" ? lcColor : mutedIcon}
                      />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.8125rem" },
                          fontWeight: lcMark === "yes" ? 700 : 500,
                          color:
                            lcMark === "yes"
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          textAlign: "center",
                        }}
                      >
                        {row.lc}
                      </Typography>
                    </Box>

                    {/* Rival value (honest mark) */}
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
                      <MarkIcon
                        mark={rivalMark}
                        color={rivalMark === "yes" ? lcColor : mutedIcon}
                      />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.8125rem" },
                          fontWeight: rivalMark === "yes" ? 700 : 500,
                          color:
                            rivalMark === "yes"
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          textAlign: "center",
                        }}
                      >
                        {row.rival}
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
            {tstr(`${i18nKey}.table.disclaimer`)}
          </Typography>
        </Box>

        {/* ---- When to choose ---- */}
        <Box component="section" aria-labelledby="compare-choose-heading">
          <Typography
            id="compare-choose-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {tstr(`${i18nKey}.choose.sectionTitle`)}
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
                {tstr(`${i18nKey}.choose.linkChartsTitle`)}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.8),
                }}
              >
                {tstr(`${i18nKey}.choose.linkChartsBody`)}
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
                {tstr(`${i18nKey}.choose.rivalTitle`)}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                }}
              >
                {tstr(`${i18nKey}.choose.rivalBody`)}
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
            {tstr(`${i18nKey}.faq.sectionTitle`)}
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
            {tstr(`${i18nKey}.ctaTitle`)}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>

        {/* ---- Leia também: cross-links para os outros guias/comparações ---- */}
        <PublicResourcesLinks
          variant="readAlso"
          excludeHref={COMPARE_ROUTES[i18nKey]}
        />
      </Box>
    </PublicLayout>
  );
}

export default CompareCompetitorPage;
