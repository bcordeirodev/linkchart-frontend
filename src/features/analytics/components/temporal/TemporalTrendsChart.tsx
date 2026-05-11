"use client";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { TrendingUp, TrendingDown, LineChart } from "lucide-react";

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { getStandardChartColors } from "@/lib/theme";
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
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const chartColors = getStandardChartColors(theme);

  const weeklyData = [...weeklyTrends]
    .sort((a, b) => a.week.localeCompare(b.week))
    .map(({ week, clicks }) => ({ x: week, y: clicks }));

  const monthlyData = [...monthlyTrends]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, clicks }) => ({ x: month, y: clicks }));

  const weeklyValues = weeklyData.map((d) => d.y);
  const monthlyValues = monthlyData.map((d) => d.y);

  const weeklyTotal = weeklyValues.reduce((sum, val) => sum + val, 0);
  const weeklyAvg =
    weeklyValues.length > 0 ? weeklyTotal / weeklyValues.length : 0;

  const monthlyTotal = monthlyValues.reduce((sum, val) => sum + val, 0);
  const monthlyAvg =
    monthlyValues.length > 0 ? monthlyTotal / monthlyValues.length : 0;

  const weeklyTrend =
    weeklyValues.length >= 2
      ? weeklyValues[weeklyValues.length - 1] -
        weeklyValues[weeklyValues.length - 2]
      : 0;

  const monthlyTrend =
    monthlyValues.length >= 2
      ? monthlyValues[monthlyValues.length - 1] -
        monthlyValues[monthlyValues.length - 2]
      : 0;

  const hasWeeklyData = weeklyData.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

  if (!hasWeeklyData && !hasMonthlyData) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <LineChart
          size={64}
          strokeWidth={1.5}
          style={{ opacity: 0.3, marginBottom: 16 }}
        />
        <Typography variant="h6">{t("temporal.trends.noData")}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t("temporal.trends.noDataSub")}
        </Typography>
      </Box>
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
              subtitle={t("temporal.trends.weeklyAvg", {
                avg: Math.round(weeklyAvg),
              })}
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
                  chart: {
                    type: "area",
                    toolbar: { show: true },
                    zoom: { enabled: true },
                  },
                  colors: [chartColors.primary.main],
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.6,
                      opacityTo: 0.1,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  xaxis: {
                    type: "category",
                    labels: {
                      style: {
                        colors: isDark
                          ? "rgba(255, 255, 255, 0.85)"
                          : "rgba(0, 0, 0, 0.75)",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: isDark
                          ? "rgba(255, 255, 255, 0.85)"
                          : "rgba(0, 0, 0, 0.75)",
                      },
                      formatter(val: number) {
                        return val.toLocaleString();
                      },
                    },
                  },
                  grid: {
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                  tooltip: {
                    theme: isDark ? "dark" : "light",
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
                sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
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
              subtitle={t("temporal.trends.monthlyAvg", {
                avg: Math.round(monthlyAvg),
              })}
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
                  chart: {
                    type: "area",
                    toolbar: { show: true },
                    zoom: { enabled: true },
                  },
                  colors: [chartColors.secondary.main],
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.6,
                      opacityTo: 0.1,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  xaxis: {
                    type: "category",
                    labels: {
                      style: {
                        colors: isDark
                          ? "rgba(255, 255, 255, 0.85)"
                          : "rgba(0, 0, 0, 0.75)",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: isDark
                          ? "rgba(255, 255, 255, 0.85)"
                          : "rgba(0, 0, 0, 0.75)",
                      },
                      formatter(val: number) {
                        return val.toLocaleString();
                      },
                    },
                  },
                  grid: {
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                  tooltip: {
                    theme: isDark ? "dark" : "light",
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
                sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("temporal.trends.growthAnalysis")}
                </Typography>
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
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

export default TemporalTrendsChart;
