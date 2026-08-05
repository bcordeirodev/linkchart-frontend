"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { PublicCtaBlock } from "@/features/public-analytics/components/info/PublicCtaBlock";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { typographyScale } from "@/lib/theme";
import {
  getPublicElevatedSx,
  getPublicSectionHeadingSx,
  publicHairline,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

import { CompareTable } from "./compare/CompareTable";
import { GuideFaq } from "./guide/GuideFaq";
import { GuideHero } from "./guide/GuideHero";
import { PublicResourcesLinks } from "./PublicResourcesLinks";

import type { Mark } from "./compare/CompareTable";

/** One evaluation criterion (i18n-driven): short title + why it matters. */
interface CriterionItem {
  title: string;
  desc: string;
}

/**
 * One shortener in the listicle (i18n-driven). `note` carries the disclosure
 * line and is present only on Link Charts' own entry — its presence is also
 * what flags the card as the author's product, so the highlight can never be
 * applied to a competitor by accident.
 */
interface OptionItem {
  number: string;
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  note?: string;
}

/** One row of the summary table (i18n-driven): the option and its two verdicts. */
interface TableRow {
  option: string;
  analytics: string;
  analyticsMark: Mark;
  signup: string;
  signupMark: Mark;
  emphasis?: boolean;
}

/**
 * A dated change to Bitly's free plan (i18n-driven). `tag` is the factual
 * anchor rendered as a chip above the title (a date or a scope), matching the
 * `changes` block on `/comparar/bitly`.
 */
interface ChangeItem {
  tag: string;
  title: string;
  desc: string;
}

/**
 * `/guia/alternativa-ao-bitly` — listicle: the best free Bitly alternatives.
 *
 * A pt-BR-first informational/AEO page targeting "alternativa ao bitly",
 * "alternativa ao bitly grátis" and "encurtador melhor que bitly". It is a
 * *list of options*, deliberately distinct from `/comparar/bitly` (the 1×1
 * head-to-head) — the Bitly section says so out loud and links there, so the
 * two pages complement instead of cannibalizing each other.
 *
 * The page is built to be quotable by answer engines: the hero verdict is the
 * answer capsule, the criteria are published before the ranking, every claim
 * about a competitor is dated and attributed, and Link Charts' own authorship
 * is disclosed above the list rather than buried. The matching `FAQPage`
 * JSON-LD is derived from the same locale entries the FAQ renders, so crawlers
 * and users read identical answers.
 */
export function GuiaAlternativaBitlyPage() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const criteria = t("guiaAlternativaBitly.criteria.items", {
    returnObjects: true,
  }) as CriterionItem[];
  const options = t("guiaAlternativaBitly.options.items", {
    returnObjects: true,
  }) as OptionItem[];
  const rows = t("guiaAlternativaBitly.table.rows", {
    returnObjects: true,
  }) as TableRow[];
  const changes = t("guiaAlternativaBitly.bitly.items", {
    returnObjects: true,
  }) as ChangeItem[];

  const bodyColor = alpha(theme.palette.text.primary, isDark ? 0.72 : 0.75);
  /** Subtle brand tint reserved for the card that is Link Charts itself. */
  const selfTint = alpha(primary, isDark ? 0.06 : 0.04);

  /** Micro caps label above the pros/cons lists inside an option card. */
  const listLabelSx = {
    display: "block",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: theme.palette.text.secondary,
    mb: 1,
  } as const;

  /**
   * Renders one bullet list inside an option card.
   *
   * @param label - caps label above the list ("A favor" / "Limitações")
   * @param items - the bullet lines
   * @param dotColor - resolved bullet color (accent for pros, muted for cons)
   */
  const renderBullets = (label: string, items: string[], dotColor: string) => (
    <Box>
      <Typography component="span" sx={listLabelSx}>
        {label}
      </Typography>
      <Box
        component="ul"
        sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}
      >
        {items.map((item) => (
          <Box
            key={item}
            component="li"
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}
          >
            <Box
              aria-hidden
              sx={{
                mt: 0.75,
                flexShrink: 0,
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: dotColor,
              }}
            />
            <Typography
              component="span"
              sx={{ fontSize: "0.8125rem", lineHeight: 1.6, color: bodyColor }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

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
        <GuideHero i18nKey="guiaAlternativaBitly" />

        {/* ---- Disclosure: we are on our own list, and we say it first ---- */}
        <Box
          component="section"
          aria-labelledby="guia-disclosure-heading"
          sx={{
            ...getPublicElevatedSx(theme),
            p: { xs: 2.5, md: 3 },
            borderColor: alpha(primary, 0.32),
            bgcolor: selfTint,
          }}
        >
          {/* `variant="h3"` brings in the Space Grotesk display face (see
              GuideHero for the full rationale); `component` alone would leave
              this heading in the default body typeface. */}
          <Typography
            id="guia-disclosure-heading"
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: "1.15rem", md: "1.35rem" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t("guiaAlternativaBitly.disclosure.sectionTitle")}
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
            {t("guiaAlternativaBitly.disclosure.body")}
          </Typography>
        </Box>

        {/* ---- Criteria: published before the ranking ---- */}
        <Box component="section" aria-labelledby="guia-criteria-heading">
          <Typography
            id="guia-criteria-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaAlternativaBitly.criteria.sectionTitle")}
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
            {t("guiaAlternativaBitly.criteria.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(criteria) &&
              criteria.map((criterion) => (
                <Box
                  key={criterion.title}
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
                        {criterion.title}
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          fontSize: "0.8125rem",
                          lineHeight: 1.6,
                          color: bodyColor,
                          m: 0,
                        }}
                      >
                        {criterion.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>

        {/* ---- Signature: the ranked list, pros and cons per option ---- */}
        <Box component="section" aria-labelledby="guia-options-heading">
          <Typography
            id="guia-options-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaAlternativaBitly.options.sectionTitle")}
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
            {t("guiaAlternativaBitly.options.intro")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {Array.isArray(options) &&
              options.map((option) => {
                // The disclosure note only exists on our own entry, so it is
                // also the flag for the brand tint — a competitor card can
                // never pick it up by mistake.
                const isSelf = Boolean(option.note);
                return (
                  <Box
                    key={option.name}
                    sx={{
                      ...getPublicElevatedSx(theme),
                      p: { xs: 2, md: 2.5 },
                      ...(isSelf && {
                        borderColor: alpha(primary, 0.32),
                        bgcolor: selfTint,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1.25,
                        mb: 0.5,
                      }}
                    >
                      {/* Zero-padded index in the monospace face, like the
                          other technical counters in the app — it marks the
                          order without an icon-chip beside the title. */}
                      <Typography
                        component="span"
                        aria-hidden
                        sx={{
                          fontFamily: typographyScale.code.fontFamily,
                          fontSize: "1.125rem",
                          fontWeight: 600,
                          color: alpha(primary, isDark ? 0.6 : 0.55),
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {option.number}
                      </Typography>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: { xs: "1rem", md: "1.0625rem" },
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          m: 0,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {option.name}
                      </Typography>
                    </Box>
                    <Typography
                      component="p"
                      sx={{
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: theme.palette.text.secondary,
                        mb: 2,
                      }}
                    >
                      {option.tagline}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: { xs: 2, md: 3 },
                      }}
                    >
                      {renderBullets(
                        t("guiaAlternativaBitly.options.prosLabel"),
                        option.pros,
                        primary,
                      )}
                      {renderBullets(
                        t("guiaAlternativaBitly.options.consLabel"),
                        option.cons,
                        alpha(theme.palette.text.primary, isDark ? 0.35 : 0.4),
                      )}
                    </Box>

                    {option.note && (
                      <Typography
                        component="p"
                        sx={{
                          mt: 2,
                          pt: 1.5,
                          borderTop: `1px solid ${publicHairline(theme, "inset")}`,
                          fontSize: "0.75rem",
                          lineHeight: 1.55,
                          color: theme.palette.text.disabled,
                        }}
                      >
                        {option.note}
                      </Typography>
                    )}
                  </Box>
                );
              })}
          </Box>

          <Typography
            component="p"
            sx={{
              mt: 1.5,
              fontSize: "0.75rem",
              lineHeight: 1.55,
              color: theme.palette.text.disabled,
            }}
          >
            {t("guiaAlternativaBitly.options.sourcesNote")}
          </Typography>
        </Box>

        {/* ---- Summary table (the surface answer engines quote) ---- */}
        <Box component="section" aria-labelledby="guia-table-heading">
          <Typography
            id="guia-table-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaAlternativaBitly.table.sectionTitle")}
          </Typography>

          {Array.isArray(rows) && (
            <CompareTable
              density="listicle"
              labelHeader={t("guiaAlternativaBitly.table.colOption")}
              columns={[
                { label: t("guiaAlternativaBitly.table.colAnalytics") },
                { label: t("guiaAlternativaBitly.table.colSignup") },
              ]}
              rows={rows.map((row) => ({
                label: row.option,
                cells: [
                  { value: row.analytics, mark: row.analyticsMark },
                  { value: row.signup, mark: row.signupMark },
                ],
                emphasis: row.emphasis === true,
              }))}
              disclaimer={t("guiaAlternativaBitly.table.disclaimer")}
            />
          )}
        </Box>

        {/* ---- What changed at Bitly (+ pointer to the 1×1 comparison) ---- */}
        <Box component="section" aria-labelledby="guia-bitly-heading">
          <Typography
            id="guia-bitly-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("guiaAlternativaBitly.bitly.sectionTitle")}
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
            {t("guiaAlternativaBitly.bitly.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {Array.isArray(changes) &&
              changes.map((item) => (
                <Box
                  key={item.title}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.5 } }}
                >
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
                      color: bodyColor,
                      m: 0,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              ))}
          </Box>
          <Typography
            component="p"
            sx={{
              mt: 1.25,
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {t("guiaAlternativaBitly.bitly.note")}
          </Typography>

          {/* Anti-cannibalization: this page ranks options, `/comparar/bitly`
              does the 1×1. The copy says so and hands the reader over. */}
          <Typography
            component="p"
            sx={{
              mt: 2.5,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
            }}
          >
            {t("guiaAlternativaBitly.bitly.crossLinkIntro")}
          </Typography>
          <Box
            component={Link}
            href="/comparar/bitly"
            sx={{
              mt: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 1,
              borderRadius: 1.5,
              textDecoration: "none",
              color: primary,
              fontSize: "0.8125rem",
              fontWeight: 600,
              transition: "background 160ms ease",
              "&:hover": { bgcolor: alpha(primary, isDark ? 0.08 : 0.06) },
            }}
          >
            {t("guiaAlternativaBitly.bitly.crossLinkLabel")}
            <ArrowRight size={15} style={{ flexShrink: 0 }} />
          </Box>
        </Box>

        {/* ---- FAQ ---- */}
        <GuideFaq i18nKey="guiaAlternativaBitly" />

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
            {t("guiaAlternativaBitly.ctaTitle")}
          </Typography>
          <PublicCtaBlock variant="landing" />
        </Box>

        {/* ---- Leia também: cross-links para os outros guias/comparações ---- */}
        <PublicResourcesLinks
          variant="readAlso"
          excludeHref="/guia/alternativa-ao-bitly"
        />
      </Box>
    </PublicLayout>
  );
}

export default GuiaAlternativaBitlyPage;
