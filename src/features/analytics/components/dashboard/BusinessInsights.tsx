"use client";
import { BarChart3, Lightbulb } from "lucide-react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";

import { radiusTokens, typographyScale } from "@/lib/theme/designSystem";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { AppIcon } from "@/shared/ui/icons";

import type { Theme } from "@mui/material/styles";
import type { BusinessInsight } from "../../hooks/useInsightsData";

interface HttpProtocolEntry {
  protocol: string;
  clicks: number;
  percentage: number;
}

/** Props accepted by the {@link BusinessInsights} component. */
interface BusinessInsightsProps {
  /** Array of insight objects to render. */
  insights: BusinessInsight[];
  /** When `true`, renders the "Business Insights" section title. Defaults to `true`. */
  showTitle?: boolean;
  /** Maximum number of insight cards to display. Defaults to `20`. */
  maxItems?: number;
  /** Optional HTTP protocol breakdown entries rendered as a bar chart at the bottom. */
  httpProtocol?: HttpProtocolEntry[];
}

/**
 * Light-mode override for {@link getSeverityHue}'s `high` accent (spec
 * §C2, finding F4). The theme's light `warning.main` (`#C2410C`) sits in
 * the same red-orange hue family as `error.main` (`#DC2626`) — on the pale
 * light card a "high priority" insight read as an actual error, undoing the
 * de-alarmized severity mapping documented below. This is the same
 * amber-dark accent `ViralRankMiniChart` uses for its light-mode `warming`
 * rank override (`RANK_COLORS_LIGHT.warming`): ~4.8:1 against the light
 * card `#F8F9FB`, same hue family as the dark-mode `warning.main`
 * (`#F59E0B`), just calibrated for a light surface instead of a dark one.
 * `medium`/`low` need no override — the theme's `info.main`/`text.secondary`
 * already clear contrast against the light card as-is.
 */
const HIGH_SEVERITY_HUE_LIGHT = "#B45309";

/**
 * Resolves the accent hue for an insight's priority (de-alarmized mapping,
 * refinamento visual 2026-08-08 §3.7). `high` reads as a caution (amber),
 * never as an error — no `BusinessInsight.type` available today represents
 * an actual security/fraud problem, so red stays reserved for a category
 * that would justify it, not for "you could optimize this".
 *
 * The three-way mapping is the same one `/reports`' portfolio insight cards
 * use, so a colored accent means the same thing on both screens:
 * **orange = attention** (`high`), **blue = info** (`medium`),
 * **green = positive** (`low`).
 *
 * `low` reads as success rather than as the bottom rung of a graded severity
 * scale, and that is literal, not decorative: the backend generators emit
 * `low` exactly when the measured number is *good* — see
 * `PerformanceInsightGenerator` (`$slow ? 'high' : 'low'`) and
 * `RetentionInsightGenerator` (`low` only at a return rate ≥ 25%). It used to
 * resolve to `text.secondary`, which left the "your link is fast" insight
 * looking like an unlabeled footnote next to the ones asking for action.
 *
 * Light mode swaps `high`'s accent for {@link HIGH_SEVERITY_HUE_LIGHT}
 * (spec §C2/F4, 2026-08-09) — same pattern as `ViralRankMiniChart`'s
 * `*_LIGHT` rank overrides. Dark mode is untouched: it keeps resolving
 * `theme.palette.warning.main` exactly as before. `medium`/`low` need no
 * override: both `info.main` and `success.main` are already calibrated per
 * mode in `colors/semantic.ts`.
 *
 * @param priority - Insight priority as returned by the API.
 * @param theme - Active MUI theme, used to resolve the semantic color tokens.
 * @returns The hue used for this insight's accent stripe, chip, callout and icon.
 */
function getSeverityHue(
  priority: BusinessInsight["priority"],
  theme: Theme,
): string {
  switch (priority) {
    case "high":
      return theme.palette.mode === "light"
        ? HIGH_SEVERITY_HUE_LIGHT
        : theme.palette.warning.main;
    case "medium":
      return theme.palette.info.main;
    default:
      return theme.palette.success.main;
  }
}

/**
 * Maps an insight priority to the {@link AppIcon} intent that carries the
 * same semantics as its hue — `warning` for attention, `info` for neutral
 * information, `success` for "this is already going well".
 *
 * Goes through `AppIcon` instead of importing the lucide glyphs directly so
 * the severity glyphs stay in step with the rest of the app's status icons
 * (`AppIcons.status`), which is where an icon swap would be made.
 *
 * @param priority - Insight priority as returned by the API.
 * @returns The `AppIcon` intent for that priority.
 */
function severityIntent(
  priority: BusinessInsight["priority"],
): "warning" | "info" | "success" {
  switch (priority) {
    case "high":
      return "warning";
    case "medium":
      return "info";
    default:
      return "success";
  }
}

/**
 * Recommendation-callout tint for a resolved severity hue (spec §C2). The
 * light-mode `high` accent ({@link HIGH_SEVERITY_HUE_LIGHT}) reads slightly
 * denser than the dark-mode amber it replaces, so its callout uses a 6%
 * tint instead of the usual 8% to avoid the callout reading as a solid
 * banner on the pale light card. Every other severity/mode pairing keeps
 * the original 8% tint, byte-identical to before this fix.
 *
 * @param hue - Resolved severity accent, see {@link getSeverityHue}.
 * @param priority - Insight priority driving the tint variant.
 * @param mode - Active `theme.palette.mode`.
 * @returns An `alpha()`-mixed background color for the recommendation callout.
 */
function getCalloutTint(
  hue: string,
  priority: BusinessInsight["priority"],
  mode: Theme["palette"]["mode"],
): string {
  const isHighLight = priority === "high" && mode === "light";
  return alpha(hue, isHighLight ? 0.06 : 0.08);
}

/**
 * Renders AI-generated business insights as priority-sorted cards.
 *
 * Displays each insight with a colour-coded priority badge (high/medium/low)
 * and optional HTTP protocol usage bars. When the `insights` array is empty
 * an info Alert is shown instead. Visual gate fix (2026-08-03): dropped the
 * per-category `Avatar` icon-chip beside every title (redundant with the
 * priority `Chip` and the category tag at the bottom of the card) and moved
 * both cards in this file off an opaque `background.paper` fill onto the
 * translucent surface grammar shared with `/links` (`getLinkCardShellSx`).
 * De-alarmized (2026-08-08, §3.7): severity no longer reaches for red —
 * see {@link getSeverityHue} — and the recommendation callout reads as a
 * tip (lightbulb icon, `text.primary` body) instead of a warning banner.
 * Light-mode fix (2026-08-09, spec §C2/F4): `high` no longer borrows the
 * theme's light `warning.main`, which sat close enough to `error.main`'s
 * hue to read as an actual error on light surfaces — see
 * {@link HIGH_SEVERITY_HUE_LIGHT}. Dark mode is unchanged.
 *
 * Accent pass (2026-08-18): each card now carries the 3px left stripe that
 * `/reports`' `InsightsPanel` already used for its portfolio insights, in
 * the severity hue, so severity is readable from the column's edge before
 * any text is. The hue scale gained its third semantic step at the same
 * time — `low` resolves to `success.main` instead of `text.secondary`, see
 * {@link getSeverityHue}.
 */
export function BusinessInsights({
  insights,
  showTitle = true,
  maxItems = 20,
  httpProtocol,
}: BusinessInsightsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  /**
   * Resolves insight text by preferring an i18n key (with optional interpolation
   * params) over the raw fallback string. Returns an empty string when both are
   * absent.
   *
   * When `params` contains a `bench_key` entry, its value is treated as a
   * nested translation key whose result is substituted as `bench` in the
   * interpolation map. This enables the retention generator's benchmark label
   * to be fully localised without special-casing the generator on the backend.
   *
   * @param key - Optional i18next translation key.
   * @param params - Optional interpolation variables for the key.
   * @param fallback - Raw string to use when no key is provided.
   */
  const resolveText = (
    key?: string,
    params?: Record<string, string | number>,
    fallback?: string,
  ): string => {
    if (key) {
      let resolved: Record<string, string | number> = { ...(params ?? {}) };
      if (resolved.bench_key && typeof resolved.bench_key === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolved = { ...resolved, bench: t(resolved.bench_key as any) };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any, resolved);
    }
    return fallback ?? "";
  };

  if (!insights || insights.length === 0) {
    return (
      <AnalyticsEmptyState
        icon={<BarChart3 size={48} strokeWidth={1.5} />}
        title={t("insights.unavailableTitle")}
        description={t("insights.unavailableDesc")}
      />
    );
  }

  const organizedInsights = [...insights]
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      const categoryOrder: Record<string, number> = {
        security: 10,
        performance: 9,
        geographic: 8,
        engagement: 7,
        retention: 7,
        traffic_source: 6,
        optimization: 5,
        audience: 4,
        temporal: 3,
        conversion: 2,
        business: 1,
      };
      return (categoryOrder[b.type] || 0) - (categoryOrder[a.type] || 0);
    })
    .slice(0, maxItems);

  return (
    <Box>
      {showTitle ? (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {t("insights.title")}
        </Typography>
      ) : null}

      <Stack spacing={2}>
        {organizedInsights.map((insight, index) => {
          const hue = getSeverityHue(insight.priority, theme);

          const recommendationText = resolveText(
            insight.recommendation_key,
            insight.recommendation_params,
            insight.recommendation,
          );

          return (
            // `ChartCard` shell (refinamento visual 2026-08-08, §3.3) — no
            // `title`/`subtitle` prop used here, since the header is a custom
            // title+severity-chip row, not a plain heading. Everything below
            // the shell (header row, description, recommendation callout,
            // divider, category tag) is untouched from before the migration:
            // de-alarmized severity (§3.7) already reads as a tip, not a
            // warning, and swapping the wrapper doesn't change that.
            //
            // `accentColor` (2026-08-18) borrows the exact recipe from
            // `/reports`' portfolio insight cards: a 3px stripe on the left
            // border in the severity hue. Before it, an insight's severity
            // was legible only *inside* the card (chip + callout), so a
            // column of stacked insight cards read as one undifferentiated
            // block until you started reading text.
            <ChartCard key={index} accentColor={hue}>
              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {resolveText(
                      insight.title_key,
                      insight.title_params,
                      insight.title,
                    )}
                  </Typography>

                  {/* Outline chip, not a pastel-fill + same-hue-text badge
                      — a filled tint under text of that same hue reads as
                      low-contrast "pastel", which is what made every
                      severity look like decoration instead of a signal.
                      Text/icon/border share the hue; the fill stays
                      transparent. */}
                  <Chip
                    icon={
                      <AppIcon
                        intent={severityIntent(insight.priority)}
                        {...ICON_MD}
                      />
                    }
                    label={t(`insights.priority.${insight.priority}`)}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: hue,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderColor: alpha(hue, 0.5),
                      "& .MuiChip-icon": {
                        color: hue,
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    color: "text.secondary",
                    mb: recommendationText ? 1.5 : 2,
                  }}
                >
                  {resolveText(
                    insight.description_key,
                    insight.description_params,
                    insight.description,
                  )}
                </Typography>

                {recommendationText ? (
                  // Action callout — reads as a tip, not a warning:
                  // lightbulb icon, `text.primary` body copy, an 8% tint
                  // of the severity hue (6% for light-mode `high`, see
                  // `getCalloutTint`) behind a 3px left border in the same
                  // hue (spec §3.7, §C2) — 3px, not 2px, so the "what to do
                  // about it" panel and its card share one stripe width
                  // instead of two that almost match.
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{
                      bgcolor: getCalloutTint(
                        hue,
                        insight.priority,
                        theme.palette.mode,
                      ),
                      borderLeft: `3px solid ${hue}`,
                      borderRadius: `${radiusTokens.md}px`,
                      p: 1.5,
                      mb: 2,
                    }}
                  >
                    <Lightbulb
                      size={16}
                      style={{ color: hue, marginTop: 2, flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                      }}
                    >
                      {recommendationText}
                    </Typography>
                  </Stack>
                ) : null}

                <Divider sx={{ my: 1 }} />

                {/* Category tag: monospace uppercase signature stays,
                    but the color is always `text.secondary` now — it's a
                    classification label, not a severity signal, so it no
                    longer borrows the severity hue (§3.7). */}
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: typographyScale.code.fontFamily,
                    color: "text.secondary",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t(`filters.insightTypeOptions.${insight.type}`, {
                    defaultValue:
                      insight.type.charAt(0).toUpperCase() +
                      insight.type.slice(1),
                  })}
                </Typography>
              </Box>
            </ChartCard>
          );
        })}
      </Stack>

      {/* Protocolo HTTP */}
      {httpProtocol && httpProtocol.length > 0 ? (
        <ChartCard
          title={t("insights.httpProtocolTitle")}
          height="auto"
          sx={{ mt: 3 }}
        >
          {(() => {
            const http2 = httpProtocol.find(
              (e) =>
                e.protocol === "HTTP/2" ||
                e.protocol === "h2" ||
                e.protocol === "http2",
            );
            return http2 ? (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={t("insights.http2Connections", {
                    percent: Number(http2.percentage).toFixed(1),
                  })}
                  color="success"
                  variant="filled"
                  size="small"
                />
              </Box>
            ) : null;
          })()}

          <Stack spacing={1.5}>
            {httpProtocol.map((entry) => (
              <Box key={entry.protocol}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {entry.protocol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.clicks} ({Number(entry.percentage).toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Number(entry.percentage)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Stack>
        </ChartCard>
      ) : null}
    </Box>
  );
}

export default BusinessInsights;
