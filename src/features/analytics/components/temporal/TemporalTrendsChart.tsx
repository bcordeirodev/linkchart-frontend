"use client";
import { Box, Grid, Typography, Stack, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, LineChart } from "lucide-react";

import { useTranslation } from "react-i18next";

import { AnalyticsEmptyState } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { radiusTokens } from "@/lib/theme/designSystem";
import { resolveCurve } from "@/lib/theme/apexBaseTheme";
import type {
  WeeklyTrendEntry,
  MonthlyTrendEntry,
} from "@/types/analytics/temporal";

interface TemporalTrendsChartProps {
  weeklyTrends: WeeklyTrendEntry[];
  monthlyTrends: MonthlyTrendEntry[];
}

/**
 * Componente para visualizar tendências temporais (semanais e mensais)
 */
export function TemporalTrendsChart({
  weeklyTrends,
  monthlyTrends,
}: TemporalTrendsChartProps) {
  const { t } = useTranslation("analytics");

  const weeklyData = [...weeklyTrends]
    .sort((a, b) => a.week.localeCompare(b.week))
    .map(({ week, clicks }) => ({ x: week, y: clicks }));

  const monthlyData = [...monthlyTrends]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, clicks }) => ({ x: month, y: clicks }));

  const weeklyValues = weeklyData.map((d) => d.y);
  const monthlyValues = monthlyData.map((d) => d.y);

  const weeklyTotal = weeklyValues.reduce((sum, val) => sum + val, 0);
  const monthlyTotal = monthlyValues.reduce((sum, val) => sum + val, 0);

  const weeklyTrend =
    weeklyValues.length >= 2
      ? weeklyValues[weeklyValues.length - 1]! -
        weeklyValues[weeklyValues.length - 2]!
      : 0;

  const monthlyTrend =
    monthlyValues.length >= 2
      ? monthlyValues[monthlyValues.length - 1]! -
        monthlyValues[monthlyValues.length - 2]!
      : 0;

  const hasWeeklyData = weeklyData.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

  if (!hasWeeklyData && !hasMonthlyData) {
    return (
      <AnalyticsEmptyState
        icon={<LineChart size={48} strokeWidth={1.5} />}
        title={t("temporal.trends.noData")}
        description={t("temporal.trends.noDataSub")}
      />
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Weekly Trends */}
        {hasWeeklyData ? (
          <Grid item xs={12} lg={6}>
            <ChartCard
              title={t("temporal.trends.weeklyTitle")}
              subtitle={t("charts.descriptions.temporalTrendsWeekly")}
            >
              <ApexChartWrapper
                type="area"
                size="standard"
                series={[
                  {
                    name: t("temporal.trends.seriesName"),
                    data: weeklyData,
                  },
                ]}
                options={{
                  chart: { zoom: { enabled: false } },
                  xaxis: { type: "category" },
                  stroke: { curve: resolveCurve(weeklyData.length) },
                  tooltip: {
                    y: {
                      formatter(val: number) {
                        return `${val.toLocaleString()} ${t("temporal.trends.seriesName").toLowerCase()}`;
                      },
                    },
                  },
                }}
              />

              {/* Insights Semanais */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: `${radiusTokens.md}px`,
                }}
              >
                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    icon={
                      weeklyTrend >= 0 ? (
                        <TrendingUp strokeWidth={1.5} />
                      ) : (
                        <TrendingDown strokeWidth={1.5} />
                      )
                    }
                    label={`${weeklyTrend >= 0 ? "+" : ""}${t("temporal.trends.weeklyDelta", { delta: weeklyTrend })}`}
                    color={weeklyTrend >= 0 ? "success" : "error"}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t("temporal.trends.weeklyTotal", {
                      total: weeklyTotal.toLocaleString(),
                      count: weeklyValues.length,
                    })}
                  </Typography>
                </Stack>
              </Box>
            </ChartCard>
          </Grid>
        ) : null}

        {/* Monthly Trends */}
        {hasMonthlyData ? (
          <Grid item xs={12} lg={6}>
            <ChartCard
              title={t("temporal.trends.monthlyTitle")}
              subtitle={t("charts.descriptions.temporalTrendsMonthly")}
            >
              <ApexChartWrapper
                type="area"
                size="standard"
                series={[
                  {
                    name: t("temporal.trends.seriesName"),
                    data: monthlyData,
                  },
                ]}
                options={{
                  chart: { zoom: { enabled: false } },
                  xaxis: { type: "category" },
                  stroke: { curve: resolveCurve(monthlyData.length) },
                  tooltip: {
                    y: {
                      formatter(val: number) {
                        return `${val.toLocaleString()} ${t("temporal.trends.seriesName").toLowerCase()}`;
                      },
                    },
                  },
                }}
              />

              {/* Insights Mensais */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: `${radiusTokens.md}px`,
                }}
              >
                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    icon={
                      monthlyTrend >= 0 ? (
                        <TrendingUp strokeWidth={1.5} />
                      ) : (
                        <TrendingDown strokeWidth={1.5} />
                      )
                    }
                    label={`${monthlyTrend >= 0 ? "+" : ""}${t("temporal.trends.monthlyDelta", { delta: monthlyTrend })}`}
                    color={monthlyTrend >= 0 ? "success" : "error"}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t("temporal.trends.monthlyTotal", {
                      total: monthlyTotal.toLocaleString(),
                      count: monthlyValues.length,
                    })}
                  </Typography>
                </Stack>
              </Box>
            </ChartCard>
          </Grid>
        ) : null}

        {/* Resumo Geral */}
        {hasWeeklyData || hasMonthlyData ? (
          <Grid item xs={12}>
            <ChartCard title={t("temporal.trends.growthAnalysis")}>
              <Grid container spacing={2}>
                {hasWeeklyData ? (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("temporal.trends.weeklyPerformance")}
                    </Typography>
                    <Typography variant="body2">
                      {weeklyTrend > 0
                        ? t("temporal.trends.weeklyGrowth", {
                            n: weeklyTrend,
                          })
                        : weeklyTrend < 0
                          ? t("temporal.trends.weeklyDrop", {
                              n: Math.abs(weeklyTrend),
                            })
                          : t("temporal.trends.weeklyStable")}
                    </Typography>
                  </Grid>
                ) : null}
                {hasMonthlyData ? (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("temporal.trends.monthlyPerformance")}
                    </Typography>
                    <Typography variant="body2">
                      {monthlyTrend > 0
                        ? t("temporal.trends.monthlyGrowth", {
                            n: monthlyTrend,
                          })
                        : monthlyTrend < 0
                          ? t("temporal.trends.monthlyDrop", {
                              n: Math.abs(monthlyTrend),
                            })
                          : t("temporal.trends.monthlyStable")}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            </ChartCard>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

export default TemporalTrendsChart;
