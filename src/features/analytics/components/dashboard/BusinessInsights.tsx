"use client";
import {
  AlertCircle,
  Info,
  CheckCircle,
  BarChart3,
  Lightbulb,
} from "lucide-react";
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
 * Resolves the accent hue for an insight's priority (de-alarmized mapping,
 * refinamento visual 2026-08-08 §3.7). `high` reads as a caution (amber),
 * never as an error — no `BusinessInsight.type` available today represents
 * an actual security/fraud problem, so red stays reserved for a category
 * that would justify it, not for "you could optimize this". `low` carries no
 * hue at all (`text.secondary`), reading as a neutral note rather than the
 * bottom rung of a graded severity scale.
 *
 * @param priority - Insight priority as returned by the API.
 * @param theme - Active MUI theme, used to resolve the semantic color tokens.
 * @returns The hue used for this insight's chip, callout, and icon accents.
 */
function getSeverityHue(
  priority: BusinessInsight["priority"],
  theme: Theme,
): string {
  switch (priority) {
    case "high":
      return theme.palette.warning.main;
    case "medium":
      return theme.palette.info.main;
    default:
      return theme.palette.text.secondary;
  }
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

  const getPriorityIcon = (priority: string) => {
    const iconMap = {
      high: <AlertCircle {...ICON_MD} />,
      medium: <Info {...ICON_MD} />,
      low: <CheckCircle {...ICON_MD} />,
    };
    return iconMap[priority as keyof typeof iconMap] || <Info {...ICON_MD} />;
  };

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
            <ChartCard key={index}>
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
                    icon={getPriorityIcon(insight.priority)}
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
                  // of the severity hue behind a 2px left border in the
                  // same hue (spec §3.7).
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{
                      bgcolor: alpha(hue, 0.08),
                      borderLeft: `2px solid ${hue}`,
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
