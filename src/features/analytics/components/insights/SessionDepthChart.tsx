"use client";
import {
  MousePointer2,
  TrendingUp,
  Star,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  LinearProgress,
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

interface SessionDistribution {
  session_clicks: number;
  users: number;
  percentage: number;
  avg_response_time: number;
}

interface SessionDepthData {
  avg_session_depth: number;
  max_session_depth: number;
  session_distribution: SessionDistribution[];
  power_users_count: number;
  power_users_percentage: number;
  engagement_score: number;
  session_quality: "excellent" | "good" | "average" | "low" | "no_data";
  total_sessions: number;
}

interface SessionDepthChartProps {
  data: SessionDepthData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * 📈 SESSION DEPTH CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 *
 * Componente para visualizar análise de profundidade de sessão
 * Mostra distribuição de clicks por sessão e identifica power users
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

  // Configuração do gráfico de barras para distribuição de sessões
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
          `${item.session_clicks} click${item.session_clicks > 1 ? "s" : ""}`,
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
          return `${item.users} usuários (${val}%)`;
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

  // Configuração do gráfico de área para engagement progression
  const engagementAreaOptions = {
    chart: {
      type: "area" as const,
      height: 250,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.session_distribution.map(
        (item) => `${item.session_clicks}`,
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
      },
    },
    colors: [getChartColor(1)],
    tooltip: {
      theme: theme.palette.mode,
      x: {
        formatter: (val: number) => `${val} clicks por sessão`,
      },
      y: {
        formatter: (val: number) => `${val} usuários`,
      },
    },
  };

  const engagementAreaData = [
    {
      name: t("insights.session.usersByClicks"),
      data: data.session_distribution.map((item) => item.users),
    },
  ];

  // Cor da qualidade da sessão
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return theme.palette.success.main;
      case "good":
        return theme.palette.info.main;
      case "average":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getQualityLabel = (quality: string) => {
    const key = `insights.session.qualityLabel.${quality}` as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return t(key as any) || quality;
  };

  if (loading) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.session.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.total_sessions === 0) {
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
    <EnhancedPaper>
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
        {/* Métricas Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.session.avgDepth")}
              value={data.avg_session_depth}
              icon={<MousePointer2 {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.session.clicksPerSession")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.session.engagementScore")}
              value={data.engagement_score}
              icon={<BarChart3 {...ICON_LG} />}
              color="success"
              subtitle={t("insights.session.scoreSub")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.session.powerUsers")}
              value={`${data.power_users_percentage}%`}
              icon={<Star {...ICON_LG} />}
              color="warning"
              subtitle={t("insights.session.powerUsersSub", {
                n: data.power_users_count,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.session.maxClicks")}
              value={data.max_session_depth}
              icon={<TrendingUp {...ICON_LG} />}
              color="info"
              subtitle={t("insights.session.inSession")}
            />
          </Grid>
        </Grid>

        {/* Status da Qualidade */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Chip
            label={t("insights.session.sessionQuality", {
              label: getQualityLabel(data.session_quality),
            })}
            sx={{
              backgroundColor: getQualityColor(data.session_quality),
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              px: 2,
              py: 1,
              borderRadius: `${radiusTokens.md}px`,
            }}
          />
        </Box>

        {/* Indicador de Engajamento */}
        <Box sx={{ mb: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? elevationTokens.xs
                  : elevationLightTokens.xs,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {t("insights.session.engagementLevel")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={data.engagement_score}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getQualityColor(data.session_quality),
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ minWidth: 60, textAlign: "right" }}
                >
                  {data.engagement_score}/100
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("insights.session.engagementBasis")}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Gráficos */}
        <Grid container spacing={3}>
          {/* Gráfico de Barras - Distribuição de Sessões */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                height: "100%",
                borderRadius: `${radiusTokens.lg}px`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? elevationTokens.xs
                    : elevationLightTokens.xs,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {t("insights.session.clickDistribution")}
                </Typography>
                <ApexChartWrapper
                  options={distributionBarOptions}
                  series={distributionBarData}
                  type="bar"
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Área - Curva de Engajamento */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                height: "100%",
                borderRadius: `${radiusTokens.lg}px`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? elevationTokens.xs
                    : elevationLightTokens.xs,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {t("insights.session.engagementCurve")}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  {t("insights.session.curveDesc")}
                </Typography>
                <ApexChartWrapper
                  options={engagementAreaOptions}
                  series={engagementAreaData}
                  type="area"
                  size="compact"
                />
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    {t("insights.session.usersByClicks")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detalhes da Distribuição */}
        <Box sx={{ mt: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
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
                        backgroundColor: "background.default",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.session_clicks} Click
                        {item.session_clicks > 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("insights.session.usersCount", {
                          n: item.users,
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

        {/* Insights e Recomendações */}
        <Box sx={{ mt: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
              backgroundColor: "background.paper",
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
                  {t("insights.session.analysisText", {
                    avg: data.avg_session_depth,
                    power: data.power_users_percentage,
                    quality: getQualityLabel(
                      data.session_quality,
                    ).toLowerCase(),
                  })}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {data.avg_session_depth >= 2.5
                    ? t("insights.session.recHigh")
                    : t("insights.session.recLow")}
                </Typography>

                {data.power_users_percentage > 20 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.success.main,
                      fontWeight: 500,
                    }}
                  >
                    {t("insights.session.powerUserHighlight", {
                      percent: data.power_users_percentage,
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
