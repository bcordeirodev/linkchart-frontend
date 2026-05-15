"use client";
import { Repeat2, TrendingUp, Users, BarChart3, Lightbulb } from "lucide-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
} from "@mui/material";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme, alpha } from "@mui/material/styles";
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

interface RetentionData {
  return_visitor_rate: number;
  new_visitor_rate: number;
  total_visitors: number;
  return_visitors: number;
  new_visitors: number;
  retention_score: number;
  benchmark_comparison:
    | "excellent"
    | "good"
    | "average"
    | "needs_improvement"
    | "insufficient_data";
}

interface RetentionAnalysisChartProps {
  data: RetentionData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * 🔄 RETENTION ANALYSIS CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 *
 * Componente para visualizar análise de retenção de visitantes
 * Mostra taxa de visitantes recorrentes vs novos com benchmarks
 */
export function RetentionAnalysisChart({
  data,
  loading = false,
  showTitle = true,
  title,
}: RetentionAnalysisChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.retention.title");

  // Configuração do gráfico de pizza para visitantes
  const visitorsPieOptions = {
    chart: {
      type: "donut" as const,
      height: 300,
      toolbar: { show: false },
    },
    labels: [
      t("insights.retention.returningLabel"),
      t("insights.retention.newLabel"),
    ],
    colors: [getChartColor(1), getChartColor(0)],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      position: "bottom" as const,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              color: theme.palette.text.primary,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.palette.text.primary,
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: t("insights.retention.retentionLabel"),
              fontSize: "14px",
              color: theme.palette.text.secondary,
              formatter: () => `${data.return_visitor_rate}%`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) =>
          t("insights.retention.visitorsTooltip", { n: val }),
      },
    },
  };

  const visitorsPieData = [data.return_visitors, data.new_visitors];

  // Configuração do gráfico de barras para benchmark
  const benchmarkBarOptions = {
    chart: {
      type: "bar" as const,
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: "center" as const,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      style: {
        colors: ["#fff"],
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: [
        t("insights.retention.yourRate"),
        t("insights.retention.avgBenchmark"),
      ],
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
      },
    },
    colors: [
      data.benchmark_comparison === "excellent"
        ? theme.palette.success.main
        : data.benchmark_comparison === "good"
          ? theme.palette.info.main
          : data.benchmark_comparison === "average"
            ? theme.palette.warning.main
            : theme.palette.error.main,
      alpha(theme.palette.text.secondary, 0.3),
    ],
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) =>
          t("insights.retention.retentionTooltip", { n: val }),
      },
    },
  };

  // Benchmark de referência da indústria
  const industryBenchmark = 20; // 20% é considerado médio
  const benchmarkBarData = [
    {
      name: t("insights.retention.seriesName"),
      data: [data.return_visitor_rate, industryBenchmark],
    },
  ];

  // Cor do benchmark baseada na performance
  const getBenchmarkColor = (comparison: string) => {
    switch (comparison) {
      case "excellent":
        return theme.palette.success.main;
      case "good":
        return theme.palette.info.main;
      case "average":
        return theme.palette.warning.main;
      case "needs_improvement":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getBenchmarkLabel = (comparison: string) => {
    const key = `insights.retention.quality.${comparison}` as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return t(key as any) || comparison;
  };

  if (loading) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.retention.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.total_visitors === 0) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("insights.retention.noData")}
          </Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper>
      {showTitle ? (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Repeat2
              {...ICON_LG}
              style={{ color: "var(--mui-palette-primary-main)" }}
            />
            {displayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("insights.retention.description")}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: 3 }}>
        {/* Métricas Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.retention.retentionRate")}
              value={`${data.return_visitor_rate}%`}
              icon={<Repeat2 {...ICON_LG} />}
              color="success"
              subtitle={t("insights.retention.returningVisitorsSub")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.retention.retentionScore")}
              value={data.retention_score}
              icon={<BarChart3 {...ICON_LG} />}
              color="info"
              subtitle={t("insights.retention.scoreSub")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.retention.returningVisitors")}
              value={data.return_visitors}
              icon={<Users {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.retention.loyalUsers")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.retention.totalVisitors")}
              value={data.total_visitors}
              icon={<TrendingUp {...ICON_LG} />}
              color="secondary"
              subtitle={t("insights.retention.uniqueVisitors")}
            />
          </Grid>
        </Grid>

        {/* Benchmark Status */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Chip
            label={t("insights.retention.performanceChip", {
              label: getBenchmarkLabel(data.benchmark_comparison),
            })}
            sx={{
              backgroundColor: getBenchmarkColor(data.benchmark_comparison),
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              px: 2,
              py: 1,
              borderRadius: `${radiusTokens.md}px`,
            }}
          />
        </Box>

        {/* Gráficos */}
        <Grid container spacing={3}>
          {/* Gráfico de Pizza - Distribuição de Visitantes */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
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
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  {t("insights.retention.visitorDistribution")}
                </Typography>
                <ApexChartWrapper
                  options={visitorsPieOptions}
                  series={visitorsPieData}
                  type="donut"
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Barras - Benchmark Comparison */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
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
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  {t("insights.retention.benchmarkComparison")}
                </Typography>
                <ApexChartWrapper
                  options={benchmarkBarOptions}
                  series={benchmarkBarData}
                  type="bar"
                  size="compact"
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  {t("insights.retention.benchmarkNote")}
                </Typography>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("insights.retention.industryBenchmark", {
                      n: industryBenchmark,
                    })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Insights e Recomendações */}
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
                  {t("insights.retention.insightsTitle")}
                </Typography>

                <Typography variant="body1">
                  {t("insights.retention.analysisPrefix", {
                    rate: data.return_visitor_rate,
                  })}{" "}
                  {data.benchmark_comparison === "excellent" &&
                    t("insights.retention.analysisExcellent")}
                  {data.benchmark_comparison === "good" &&
                    t("insights.retention.analysisGood")}
                  {data.benchmark_comparison === "average" &&
                    t("insights.retention.analysisAverage")}
                  {data.benchmark_comparison === "needs_improvement" &&
                    t("insights.retention.analysisNeedsImprovement")}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {data.return_visitor_rate >= 25
                    ? t("insights.retention.recHigh")
                    : t("insights.retention.recLow")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default RetentionAnalysisChart;
