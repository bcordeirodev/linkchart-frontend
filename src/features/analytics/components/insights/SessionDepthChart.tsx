"use client";
import {
  MousePointer2,
  TrendingUp,
  Star,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { Box, Typography, Card, CardContent, Grid, Stack } from "@mui/material";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getChartColor } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
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
      height: 350,
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
          const item = data.session_distribution[dataPointIndex];
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
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("insights.session.noData")}
          </Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper animated={false}>
      {showTitle ? (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MousePointer2
              {...ICON_LG}
              style={{ color: "var(--mui-palette-primary-main)" }}
            />
            {displayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("insights.session.description")}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: 3 }}>
        {/* Real Metrics — no fabricated scores */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.session.avgDepth")}
              value={data.avg_session_clicks}
              icon={<MousePointer2 {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.session.clicksPerSession")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.session.powerUsers")}
              value={`${powerUsersPct}%`}
              icon={<Star {...ICON_LG} />}
              color="warning"
              subtitle={t("insights.session.powerUsersSub", {
                n: data.power_users_count,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.session.maxClicks")}
              value={data.max_session_depth}
              icon={<TrendingUp {...ICON_LG} />}
              color="info"
              subtitle={t("insights.session.inSession")}
            />
          </Grid>
        </Grid>

        {/* Distribution Histogram */}
        <Card
          sx={{
            borderRadius: `${radiusTokens.lg}px`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? elevationTokens.xs
                : elevationLightTokens.xs,
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
          </CardContent>
        </Card>

        {/* Distribution Detail Cards */}
        <Box sx={{ mb: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? elevationTokens.xs
                  : elevationLightTokens.xs,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BarChart3 size={16} strokeWidth={1.5} />
                {t("insights.session.distributionDetails")}
              </Typography>
              <Grid container spacing={2}>
                {data.session_distribution.slice(0, 6).map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: `${radiusTokens.md}px`,
                        backgroundColor: "background.paper",
                      }}
                    >
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
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Insights Card */}
        <Box sx={{ mt: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
              backgroundColor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? elevationTokens.xs
                  : elevationLightTokens.xs,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  variant="h6"
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
            </CardContent>
          </Card>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default SessionDepthChart;
