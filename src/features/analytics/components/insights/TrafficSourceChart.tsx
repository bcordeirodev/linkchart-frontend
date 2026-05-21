"use client";
import {
  Activity,
  TrendingUp,
  Users2,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Wrench,
  Target,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Alert,
  LinearProgress,
} from "@mui/material";

import { ICON_MD, ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { chartPalette } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface TrafficSource {
  source: string;
  clicks: number;
  percentage: number;
  avg_response_time: number;
  avg_session_depth: number;
}

interface TrafficChannel {
  channel: string;
  clicks: number;
  percentage: number;
  unique_visitors: number;
  sources: TrafficSource[];
  avg_response_time: number;
  avg_session_depth: number;
}

interface TrafficRecommendation {
  type: "optimization" | "growth" | "diversification";
  message: string;
  priority: "high" | "medium" | "low";
}

interface NavigationContextEntry {
  context: string;
  clicks: number;
  percentage: number;
}

interface TrafficSourceData {
  sources: TrafficSource[];
  channels: TrafficChannel[];
  top_source: {
    source: string;
    clicks: number;
    percentage: number;
  } | null;
  source_diversity: number;
  total_clicks: number;
  recommendations: TrafficRecommendation[];
  navigation_context?: NavigationContextEntry[];
}

interface TrafficSourceChartProps {
  data: TrafficSourceData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * 🎯 TRAFFIC SOURCE CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 *
 * Componente para visualizar análise de fontes de tráfego
 * Mostra categorização por canais e performance de cada fonte
 */
export function TrafficSourceChart({
  data,
  loading = false,
  showTitle = true,
  title,
}: TrafficSourceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.traffic.title");

  // Cores para diferentes canais — usando chartPalette para harmonia visual
  const channelColors: Record<string, string> = {
    social: chartPalette[0],
    search: chartPalette[1],
    direct: chartPalette[3],
    email: chartPalette[2],
    referral: chartPalette[5],
    paid: chartPalette[6],
    other: theme.palette.text.secondary,
  };

  // Configuração do gráfico de pizza para canais
  const channelsPieOptions = {
    chart: {
      type: "donut" as const,
      height: 350,
      toolbar: { show: false },
    },
    labels: data.channels.map(
      (channel) =>
        channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
    ),
    colors: data.channels.map(
      (channel) => channelColors[channel.channel] || channelColors.other,
    ),
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
              label: t("insights.traffic.totalLabel"),
              fontSize: "14px",
              color: theme.palette.text.secondary,
              formatter: () => `${data.total_clicks} clicks`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
          const channel = data.channels[seriesIndex];
          return `${channel.clicks} clicks (${val.toFixed(1)}%)`;
        },
      },
    },
  };

  const channelsPieData = data.channels.map((channel) => channel.percentage);

  // Configuração do gráfico de barras para performance por canal
  const performanceBarOptions = {
    chart: {
      type: "bar" as const,
      height: 300,
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
      formatter: (val: number) => val.toFixed(2),
      style: {
        colors: ["#fff"],
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: data.channels.map(
        (channel) =>
          channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
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
    colors: data.channels.map(
      (channel) => channelColors[channel.channel] || channelColors.other,
    ),
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => `${val.toFixed(2)} clicks/sessão`,
      },
    },
  };

  const performanceBarData = [
    {
      name: t("insights.traffic.seriesName"),
      data: data.channels.map((channel) => channel.avg_session_depth),
    },
  ];

  // Função para obter cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Função para obter ícone da recomendação
  const getRecommendationIcon = (type: string): ReactNode => {
    switch (type) {
      case "optimization":
        return <Wrench size={16} strokeWidth={1.5} />;
      case "growth":
        return <TrendingUp size={16} strokeWidth={1.5} />;
      case "diversification":
        return <Target size={16} strokeWidth={1.5} />;
      default:
        return <Lightbulb size={16} strokeWidth={1.5} />;
    }
  };

  if (loading) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.traffic.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.sources.length === 0) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("insights.traffic.noData")}
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
            <Activity
              {...ICON_LG}
              style={{ color: "var(--mui-palette-primary-main)" }}
            />
            {displayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("insights.traffic.description")}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: 3 }}>
        {/* Métricas Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.topSource")}
              value={data.top_source?.source || "N/A"}
              icon={<TrendingUp {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.traffic.trafficPercent", {
                n: data.top_source?.percentage || 0,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.diversity")}
              value={data.source_diversity}
              icon={<Users2 {...ICON_LG} />}
              color="info"
              subtitle={t("insights.traffic.differentSources")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.totalClicks")}
              value={data.total_clicks}
              icon={<BarChart3 {...ICON_LG} />}
              color="success"
              subtitle={t("insights.traffic.allChannels")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.activeChannels")}
              value={data.channels.length}
              icon={<Activity {...ICON_LG} />}
              color="secondary"
              subtitle={t("insights.traffic.categories")}
            />
          </Grid>
        </Grid>

        {/* Alertas de Diversidade */}
        {data.source_diversity < 3 && (
          <Box sx={{ mb: 3 }}>
            <Alert
              severity="warning"
              icon={<AlertTriangle {...ICON_MD} />}
              sx={{ borderRadius: `${radiusTokens.lg}px` }}
            >
              <Typography variant="body2">
                {t("insights.traffic.lowDiversityAlert", {
                  n: data.source_diversity,
                })}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Gráficos Principais */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Gráfico de Pizza - Distribuição por Canais */}
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
                  {t("insights.traffic.channelDistribution")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  {t("insights.traffic.channelDistributionDesc")}
                </Typography>
                <ApexChartWrapper
                  options={channelsPieOptions}
                  series={channelsPieData}
                  type="donut"
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Barras - Performance por Canal */}
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
                  {t("insights.traffic.engagementByChannel")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  {t("insights.traffic.engagementByChannelDesc")}
                </Typography>
                <ApexChartWrapper
                  options={performanceBarOptions}
                  series={performanceBarData}
                  type="bar"
                  size="standard"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 1 }}
                >
                  {t("insights.traffic.avgSessionByChannel")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detalhes dos Canais */}
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
                {t("insights.traffic.channelDetails")}
              </Typography>
              <Grid container spacing={2}>
                {data.channels.map((channel, index) => (
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              channelColors[channel.channel] ||
                              channelColors.other,
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        >
                          {channel.channel}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {channel.clicks} clicks (
                        {Number(channel.percentage).toFixed(1)}%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("insights.traffic.uniqueVisitors", {
                          n: channel.unique_visitors,
                        })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("insights.traffic.session", {
                          n: Number(channel.avg_session_depth).toFixed(2),
                        })}
                      </Typography>
                      {channel.avg_response_time > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {t("insights.traffic.time", {
                            n: Number(channel.avg_response_time).toFixed(2),
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

        {/* Top Sources */}
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
                <Trophy size={16} strokeWidth={1.5} />
                {t("insights.traffic.topSources")}
              </Typography>
              <Grid container spacing={1}>
                {data.sources.slice(0, 5).map((source, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: `${radiusTokens.md}px`,
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: index === 0 ? 600 : 400 }}
                        >
                          {index + 1}. {source.source}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t("insights.traffic.session", {
                            n: Number(source.avg_session_depth).toFixed(2),
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {source.clicks} clicks
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Number(source.percentage).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Contexto de Navegação */}
        {data.navigation_context && data.navigation_context.length > 0 ? (
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
                  <Activity size={16} strokeWidth={1.5} />
                  Contexto de Navegação
                </Typography>
                {(() => {
                  const contextLabels: Record<string, string> = {
                    browser_direct: "Direto (navegador)",
                    browser_referral: "Referral (navegador)",
                    in_app_webview: "App (WebView)",
                    api_programmatic: "Programático/API",
                    preload: "Pré-carregado",
                  };
                  return (
                    <Stack spacing={1.5}>
                      {data.navigation_context!.map((entry) => (
                        <Box key={entry.context}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={
                                  contextLabels[entry.context] ?? entry.context
                                }
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {entry.clicks} (
                              {Number(entry.percentage).toFixed(1)}%)
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
                  );
                })()}
              </CardContent>
            </Card>
          </Box>
        ) : null}

        {/* Recomendações */}
        {data.recommendations.length > 0 && (
          <Box sx={{ mt: 3 }}>
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
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 600,
                  }}
                >
                  <Lightbulb size={16} strokeWidth={1.5} />
                  {t("insights.traffic.strategicRecs")}
                </Typography>
                <Stack spacing={2}>
                  {data.recommendations.map((rec, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: `${radiusTokens.md}px`,
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "primary.main",
                            mt: 0.5,
                          }}
                        >
                          {getRecommendationIcon(rec.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Chip
                              label={rec.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(rec.priority),
                                color: "white",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                height: 20,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {rec.type}
                            </Typography>
                          </Box>
                          <Typography variant="body2">{rec.message}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </EnhancedPaper>
  );
}

export default TrafficSourceChart;
