"use client";
import { BarChart3 } from "lucide-react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  insightsChartPanelDescSx,
  insightsChartPanelSx,
  insightsChartPanelTitleSx,
  insightsChartRowSx,
  insightsSectionHeadingSx,
  insightsTileSx,
} from "../insightsLayout";
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
  channels: TrafficChannel[];
  totalClicks: number;
  channelColors: Record<string, string>;
}

function safePercent(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function formatChannelLabel(channel: string): string {
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

/**
 * Donut + engagement bar charts and per-channel detail tiles.
 */
export function TrafficChannelsView({
  channels,
  totalClicks,
  channelColors,
}: TrafficChannelsViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const channelsPieOptions = {
    chart: {
      type: "donut" as const,
      toolbar: { show: false },
    },
    labels: channels.map((c) => formatChannelLabel(c.channel)),
    colors: channels.map(
      (c) => channelColors[c.channel] || channelColors.other,
    ),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      position: "bottom" as const,
      labels: { colors: theme.palette.text.primary },
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
              formatter: () =>
                t("insights.traffic.clicksCount", { n: totalClicks }),
            },
          },
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
          const channel = channels[seriesIndex]!;
          return `${channel.clicks} (${val.toFixed(1)}%)`;
        },
      },
    },
  };

  const channelsPieData = channels.map((c) => c.percentage);

  const performanceBarOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: { position: "center" as const },
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
      categories: channels.map((c) => formatChannelLabel(c.channel)),
      labels: { style: { colors: theme.palette.text.primary } },
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.primary } },
    },
    colors: channels.map(
      (c) => channelColors[c.channel] || channelColors.other,
    ),
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) =>
          t("insights.traffic.sessionDepthFmt", { n: val.toFixed(2) }),
      },
    },
  };

  const performanceBarData = [
    {
      name: t("insights.traffic.seriesName"),
      data: channels.map((c) => c.avg_session_depth),
    },
  ];

  const panelSx = { ...insightsChartPanelSx(theme), height: "100%" };

  return (
    <Box sx={{ minWidth: 0, width: "100%" }}>
      <Box sx={{ ...insightsChartRowSx }}>
        <Box sx={panelSx}>
          <Typography variant="subtitle1" sx={insightsChartPanelTitleSx}>
            {t("insights.traffic.channelDistribution")}
          </Typography>
          <Typography variant="body2" sx={insightsChartPanelDescSx}>
            {t("insights.traffic.channelDistributionDesc")}
          </Typography>
          <ApexChartWrapper
            options={channelsPieOptions}
            series={channelsPieData}
            type="donut"
            size="standard"
          />
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle1" sx={insightsChartPanelTitleSx}>
            {t("insights.traffic.engagementByChannel")}
          </Typography>
          <Typography variant="body2" sx={insightsChartPanelDescSx}>
            {t("insights.traffic.engagementByChannelDesc")}
          </Typography>
          <ApexChartWrapper
            options={performanceBarOptions}
            series={performanceBarData}
            type="bar"
            size="standard"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1, lineHeight: 1.45 }}
          >
            {t("insights.traffic.avgSessionByChannel")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

interface TrafficChannelDetailsViewProps {
  channels: TrafficChannel[];
  channelColors: Record<string, string>;
}

/** Per-channel performance tiles — pairs with {@link TrafficSourcesView} in a 2-col row. */
export function TrafficChannelDetailsView({
  channels,
  channelColors,
}: TrafficChannelDetailsViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const tileSx = insightsTileSx(theme);

  return (
    <Box component="section" sx={{ minWidth: 0, width: "100%" }}>
      <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
        <BarChart3 size={16} strokeWidth={1.5} />
        {t("insights.traffic.channelDetails")}
      </Typography>
      <Stack spacing={1.25}>
        {channels.map((channel) => {
          const pct = safePercent(channel.percentage);
          const color =
            channelColors[channel.channel] || channelColors.other || "";

          return (
            <Box key={channel.channel} sx={{ ...tileSx, p: 1.5 }}>
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
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, textTransform: "capitalize" }}
                >
                  {channel.channel}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  mb: 1,
                  bgcolor: alpha(color, 0.15),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    bgcolor: color,
                  },
                }}
              />
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  {t("insights.traffic.clicksCount", { n: channel.clicks })} ·{" "}
                  {pct.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("insights.traffic.uniqueVisitors", {
                    n: channel.unique_visitors,
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("insights.traffic.session", {
                    n: Number(channel.avg_session_depth).toFixed(2),
                  })}
                </Typography>
                {channel.avg_response_time > 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    {t("insights.traffic.time", {
                      n: Number(channel.avg_response_time).toFixed(2),
                    })}
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
