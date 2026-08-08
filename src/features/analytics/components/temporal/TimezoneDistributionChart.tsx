"use client";
import { Box, Grid, Typography, Stack, LinearProgress } from "@mui/material";
import { Globe } from "lucide-react";

import { useTranslation } from "react-i18next";

import { AnalyticsEmptyState } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { dataVizPalette } from "@/lib/theme/dataViz";
import { radiusTokens } from "@/lib/theme/designSystem";
import type { TimezoneAnalysis } from "@/types";

interface TimezoneDistributionChartProps {
  timezoneAnalysis: TimezoneAnalysis[];
}

/**
 * Componente para visualizar distribuição de cliques por timezone
 */
export function TimezoneDistributionChart({
  timezoneAnalysis,
}: TimezoneDistributionChartProps) {
  const { t } = useTranslation("analytics");

  if (!timezoneAnalysis || timezoneAnalysis.length === 0) {
    return (
      <AnalyticsEmptyState
        icon={<Globe size={48} strokeWidth={1.5} />}
        title={t("temporal.timezone.noData")}
        description={t("temporal.timezone.noDataSub")}
      />
    );
  }

  // Ordenar por cliques (decrescente)
  const sortedTimezones = [...timezoneAnalysis].sort(
    (a, b) => b.clicks - a.clicks,
  );

  // Top 10 timezones
  const topTimezones = sortedTimezones.slice(0, 10);

  // Preparar dados para o gráfico
  const chartData = topTimezones.map((tz) => ({
    x: tz.name.split("/").pop() || tz.name, // Mostrar apenas a cidade
    y: tz.clicks,
  }));

  const totalClicks = timezoneAnalysis.reduce((sum, tz) => sum + tz.clicks, 0);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Gráfico de Barras */}
        <Grid item xs={12} lg={8}>
          <ChartCard
            title={t("temporal.timezone.chartTitle")}
            subtitle={t("charts.descriptions.timezoneDistribution")}
          >
            <ApexChartWrapper
              type="bar"
              size="standard"
              series={[
                {
                  name: t("temporal.timezone.seriesName"),
                  data: chartData.map((d) => d.y),
                },
              ]}
              options={{
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    horizontal: true,
                    dataLabels: {
                      position: "top",
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter(val: number) {
                    return val.toLocaleString();
                  },
                  offsetX: 30,
                },
                xaxis: {
                  categories: chartData.map((d) => d.x),
                },
                tooltip: {
                  y: {
                    formatter(val: number, opts?: { dataPointIndex?: number }) {
                      const dataPointIndex = opts?.dataPointIndex;
                      const percentage =
                        dataPointIndex !== undefined
                          ? topTimezones[dataPointIndex]?.percentage || 0
                          : 0;
                      return `${val.toLocaleString()} ${t("temporal.timezone.seriesName").toLowerCase()} (${percentage.toFixed(1)}%)`;
                    },
                  },
                },
              }}
            />
          </ChartCard>
        </Grid>

        {/* Lista Detalhada */}
        <Grid item xs={12} lg={4}>
          <ChartCard
            title={t("temporal.timezone.topTimezones")}
            subtitle={t("temporal.timezone.total", {
              total: totalClicks.toLocaleString(),
            })}
          >
            <Stack spacing={2}>
              {topTimezones.map((tz, index) => (
                <Box key={tz.name}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      title={tz.name}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: 140, sm: 200 },
                      }}
                    >
                      {index + 1}. {tz.name.split("/").pop()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tz.clicks.toLocaleString()} ({tz.percentage?.toFixed(1)}
                      %)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={tz.percentage || 0}
                    sx={{
                      height: 6,
                      borderRadius: `${radiusTokens.sm}px`,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: `${radiusTokens.sm}px`,
                        // One flat tone for every row — a per-rank rainbow
                        // (success/info/warning) implied a meaning ("top 3")
                        // that isn't real; the numbering already says that.
                        bgcolor: dataVizPalette.primary,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    title={tz.name}
                    sx={{
                      display: "block",
                      mt: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: { xs: 140, sm: 200 },
                    }}
                  >
                    {tz.name}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {timezoneAnalysis.length > 10 && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  bgcolor: "action.hover",
                  borderRadius: `${radiusTokens.md}px`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t("temporal.timezone.others", {
                    count: timezoneAnalysis.length - 10,
                  })}
                </Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* Insights */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: `${radiusTokens.md}px`,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {t("temporal.timezone.insightTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sortedTimezones[0] ? (
                <>
                  {t("temporal.timezone.insightConcentrated", {
                    name: sortedTimezones[0].name,
                    percent: sortedTimezones[0].percentage?.toFixed(1),
                  })}
                  {sortedTimezones.length > 1 && (
                    <> {t("temporal.timezone.insightOptimize")}</>
                  )}
                </>
              ) : null}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TimezoneDistributionChart;
