"use client";
import {
  MousePointer2,
  TrendingUp,
  Star,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { Box, Typography, Stack } from "@mui/material";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getChartColor } from "@/lib/theme/colors";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import {
  INSIGHTS_BLOCK_PAD,
  insightsChartPanelSx,
  insightsMetricRowSx,
  insightsSectionHeadingSx,
  insightsTileSx,
} from "../insights/insightsLayout";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
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

  // Bar chart: click distribution histogram
  const distributionBarOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
    },
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
      style: {
        fontSize: "12px",
        colors: [theme.palette.text.primary],
      },
    },
    xaxis: {
      categories: data.session_distribution.map(
        (item) =>
          `${item.clicks_count} click${item.clicks_count > 1 ? "s" : ""}`,
      ),
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
        formatter: (val: number) => `${val}%`,
      },
    },
    colors: [getChartColor(0)],
    tooltip: {
      theme: theme.palette.mode,
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
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.session.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.session_distribution.length === 0) {
    return (
      <EnhancedPaper>
        <AnalyticsEmptyState title={t("insights.session.noData")} />
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper animated={false} sx={{ height: "100%" }}>
      <Box sx={{ p: INSIGHTS_BLOCK_PAD }}>
        {showTitle ? (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              <MousePointer2
                {...ICON_LG}
                style={{ color: "var(--mui-palette-primary-main)" }}
              />
              {displayTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t("insights.session.description")}
            </Typography>
          </Box>
        ) : null}

        {/* Real Metrics — no fabricated scores */}
        <Box
          sx={{
            ...insightsMetricRowSx,
            mb: 3,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          <MetricCard
            title={t("insights.session.avgDepth")}
            value={data.avg_session_clicks}
            icon={<MousePointer2 {...ICON_LG} />}
            color="primary"
            subtitle={t("insights.session.clicksPerSession")}
          />
          <MetricCard
            title={t("insights.session.powerUsers")}
            value={`${powerUsersPct}%`}
            icon={<Star {...ICON_LG} />}
            color="warning"
            subtitle={t("insights.session.powerUsersSub", {
              n: data.power_users_count,
            })}
          />
          <MetricCard
            title={t("insights.session.maxClicks")}
            value={data.max_session_depth}
            icon={<TrendingUp {...ICON_LG} />}
            color="info"
            subtitle={t("insights.session.inSession")}
          />
        </Box>

        {/* Distribution Histogram */}
        <Box sx={{ ...insightsChartPanelSx(theme), mb: 3 }}>
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

        {/* Distribution Detail tiles */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
            <BarChart3 size={16} strokeWidth={1.5} />
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
              <Box key={index} sx={insightsTileSx(theme)}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.clicks_count} Click
                  {item.clicks_count > 1 ? "s" : ""}
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

        {/* Insights panel */}
        <Box sx={insightsChartPanelSx(theme)}>
          <Stack spacing={1.5}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              <Lightbulb size={16} strokeWidth={1.5} />
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
      </Box>
    </EnhancedPaper>
  );
}

export default SessionDepthChart;
