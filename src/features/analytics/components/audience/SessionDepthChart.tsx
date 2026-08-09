"use client";
import { Box, Typography, Stack } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { AnalyticsEmptyState, OverviewMetricRow } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { insightsSectionHeadingSx } from "../insights/insightsLayout";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

/**
 * Single bucket in the session distribution histogram.
 *
 * Field names match the updated backend shape:
 *   `clicks_count` (previously `session_clicks`) and `frequency` (previously `users`).
 */
interface SessionDistribution {
  /** Number of clicks that define this bucket. */
  clicks_count: number;
  /** Number of sessions in this bucket. */
  frequency: number;
  percentage: number;
  avg_response_time: number;
}

/**
 * Real session depth data returned by the backend.
 *
 * Removed fabricated fields:
 *   - `engagement_score`: was `min(100, avg * 20)` — arbitrary scaling.
 *   - `session_quality`: label derived from hardcoded thresholds.
 *   - `total_sessions`: not needed externally; derived from distribution.
 *
 * `power_users_count` now counts sessions with 3+ clicks (was 5+ before).
 */
interface SessionDepthData {
  /** Mean number of clicks per session (real aggregate). */
  avg_session_clicks: number;
  max_session_depth: number;
  session_distribution: SessionDistribution[];
  /** Count of sessions with 3 or more clicks. */
  power_users_count: number;
}

/** Props accepted by {@link SessionDepthChart}. */
interface SessionDepthChartProps {
  data: SessionDepthData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * Visualises session depth analytics: average clicks per session,
 * a histogram of the click distribution, and a power-users count.
 *
 * Removed fabricated displays: `engagement_score` LinearProgress gauge
 * and `session_quality` chip. Raw data is shown instead.
 */
export function SessionDepthChart({
  data,
  loading = false,
  showTitle = true,
  title,
}: SessionDepthChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.session.title");

  // Total sessions derived from distribution for power-user % calculation
  const totalSessions = data.session_distribution.reduce(
    (sum, item) => sum + item.frequency,
    0,
  );
  const powerUsersPct =
    totalSessions > 0
      ? Math.round((data.power_users_count / totalSessions) * 100 * 10) / 10
      : 0;

  // Bar chart: click distribution histogram. Only structural options are set
  // here — no colors/grid/tooltip.theme/axis-label styling — so the shared
  // base theme from `ApexChartWrapper` (dataVizPalette, mono axes, dark
  // tooltip) shows through unmodified.
  const distributionBarOptions = {
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: "top" as const,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetY: -20,
      // `offsetY: -20` lifts the label above the bar, onto the chart's own
      // canvas/card background — which follows the active theme, not a
      // fixed fill. Without an explicit color, ApexCharts' own default
      // (fixed white) goes invisible over a short bar on a light card
      // (achado F1, ajuste fino de temas 2026-08-09). `theme.palette.text.primary`
      // is always legible there because it *is* the theme's text color.
      style: { colors: [theme.palette.text.primary] },
    },
    xaxis: {
      categories: data.session_distribution.map((item) =>
        t("insights.session.clickBucket", { count: item.clicks_count }),
      ),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (
          val: number,
          { dataPointIndex }: { dataPointIndex: number },
        ) => {
          const item = data.session_distribution[dataPointIndex]!;
          return `${item.frequency} ${t("insights.session.sessionsUnit")} (${val}%)`;
        },
      },
    },
  };

  const distributionBarData = [
    {
      name: t("insights.session.usersByClicks"),
      data: data.session_distribution.map((item) => item.percentage),
    },
  ];

  if (loading) {
    return (
      <ChartCard height="auto">
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.session.loading")}</Typography>
        </Box>
      </ChartCard>
    );
  }

  if (data.session_distribution.length === 0) {
    return (
      <ChartCard height="auto">
        <AnalyticsEmptyState title={t("insights.session.noData")} />
      </ChartCard>
    );
  }

  // Section separator between the bare sub-blocks below — a single top
  // hairline, not a bordered box. `insightsChartPanelSx`/`insightsTileSx`
  // (bg + border + shadow) used to wrap each of these sections and every
  // tile on top of the card's own border, stacking three surfaces; the card
  // itself is now the only surface and everything inside it is plain
  // content, divided by spacing + a hairline.
  const sectionDividerSx = {
    pt: 3,
    borderTop: `1px solid ${theme.palette.divider}`,
  } as const;

  return (
    // `height="auto"` — see RetentionAnalysisChart: ChartCard's default
    // `height="100%"` stretches the card to the grid row's height instead of
    // its own content.
    <ChartCard
      height="auto"
      title={showTitle ? displayTitle : undefined}
      subtitle={showTitle ? t("insights.session.description") : undefined}
    >
      {/* Real Metrics — no fabricated scores.
          `labelLines={2}` mirrors `RetentionAnalysisChart`, the card this
          one sits beside in the loyalty grid: both rows reserve the same
          label height, so the two cards' numbers land on the same line as
          each other whether or not a label wraps at a given width. */}
      <Box sx={{ mb: 3 }}>
        <OverviewMetricRow
          size="md"
          labelLines={2}
          metrics={[
            {
              label: t("insights.session.avgDepth"),
              value: data.avg_session_clicks,
              caption: t("insights.session.clicksPerSession"),
            },
            {
              label: t("insights.session.powerUsers"),
              value: `${powerUsersPct}%`,
              caption: t("insights.session.powerUsersSub", {
                n: data.power_users_count,
              }),
            },
            {
              label: t("insights.session.maxClicks"),
              value: data.max_session_depth,
              caption: t("insights.session.inSession"),
            },
          ]}
        />
      </Box>

      {/* Distribution Histogram — bare block, no nested card */}
      <Box sx={{ ...sectionDividerSx, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          {t("insights.session.clickDistribution")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("insights.session.clickDistributionDesc")}
        </Typography>
        <ApexChartWrapper
          options={distributionBarOptions}
          series={distributionBarData}
          type="bar"
          size="standard"
        />
      </Box>

      {/* Distribution Detail tiles — bare block, boxless tiles */}
      <Box sx={{ ...sectionDividerSx, mb: 3 }}>
        <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
          {t("insights.session.distributionDetails")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {data.session_distribution.slice(0, 6).map((item, index) => (
            <Box key={index}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {t("insights.session.clickBucket", {
                  count: item.clicks_count,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("insights.session.usersCount", {
                  n: item.frequency,
                  percent: item.percentage,
                })}
              </Typography>
              {item.avg_response_time > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {t("insights.session.avgTime", {
                    n: Number(item.avg_response_time).toFixed(2),
                  })}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Insights panel — bare block, no nested card */}
      <Box sx={sectionDividerSx}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t("insights.session.sessionInsights")}
          </Typography>

          <Typography variant="body1">
            {t("insights.session.analysisRaw", {
              avg: data.avg_session_clicks,
              power: powerUsersPct,
              powerCount: data.power_users_count,
            })}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {data.avg_session_clicks >= 2.5
              ? t("insights.session.recHigh")
              : t("insights.session.recLow")}
          </Typography>

          {powerUsersPct > 20 && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 500,
              }}
            >
              {t("insights.session.powerUserHighlight", {
                percent: powerUsersPct,
              })}
            </Typography>
          )}
        </Stack>
      </Box>
    </ChartCard>
  );
}

export default SessionDepthChart;
