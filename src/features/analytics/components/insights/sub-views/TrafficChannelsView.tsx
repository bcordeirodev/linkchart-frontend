"use client";
import { BarChart3 } from "lucide-react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
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

interface TrafficChannelsViewProps {
  /** Array of channel data with click counts and performance metrics. */
  channels: TrafficChannel[];
  /** Total click count, shown in the donut chart centre label. */
  totalClicks: number;
  /** Colour map keyed by channel name (e.g. `"social"`, `"search"`). */
  channelColors: Record<string, string>;
}

/**
 * Renders the Channels sub-view of TrafficSourceChart.
 *
 * Displays a donut chart with channel distribution, a horizontal bar chart
 * with average session depth per channel, and a detail grid card for each
 * channel.
 */
export function TrafficChannelsView({
  channels,
  totalClicks,
  channelColors,
}: TrafficChannelsViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  /** ApexCharts donut config for channel distribution. */
  const channelsPieOptions = {
    chart: {
      type: "donut" as const,
      height: 350,
      toolbar: { show: false },
    },
    labels: channels.map(
      (channel) =>
        channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
    ),
    colors: channels.map(
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
              formatter: () => `${totalClicks} clicks`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
          const channel = channels[seriesIndex];
          return `${channel.clicks} clicks (${val.toFixed(1)}%)`;
        },
      },
    },
  };

  const channelsPieData = channels.map((channel) => channel.percentage);

  /** ApexCharts horizontal bar config for avg session depth per channel. */
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
      categories: channels.map(
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
    colors: channels.map(
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
      data: channels.map((channel) => channel.avg_session_depth),
    },
  ];

  const cardSx = {
    height: "100%",
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow:
      theme.palette.mode === "dark"
        ? elevationTokens.xs
        : elevationLightTokens.xs,
  };

  return (
    <>
      {/* Gráficos Principais */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Donut — Distribuição por Canais */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
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

        {/* Bar — Engajamento por Canal */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
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
        <Card sx={cardSx}>
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
              {channels.map((channel, index) => (
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
    </>
  );
}
