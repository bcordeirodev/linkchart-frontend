"use client";
import { Box, Grid, Chip, Stack, Typography } from "@mui/material";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getStandardChartColors } from "@/lib/theme";
import { ChartCard } from "@/shared/ui/base/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { DailyTimelineEntry } from "@/types/analytics/temporal";

interface DailyTimelineChartProps {
  data: DailyTimelineEntry[];
}

export function DailyTimelineChart({ data }: DailyTimelineChartProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const chartColors = getStandardChartColors(theme);

  if (!data || data.length === 0) {
    return null;
  }

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const clickSeries = sorted.map((d) => ({ x: d.date, y: d.clicks }));
  const uniqueSeries = sorted.map((d) => ({ x: d.date, y: d.unique_visitors }));

  const totalClicks = sorted.reduce((s, d) => s + d.clicks, 0);
  const avgPerDay =
    sorted.length > 0 ? Math.round(totalClicks / sorted.length) : 0;
  const maxDay = sorted.reduce(
    (best, d) => (d.clicks > best.clicks ? d : best),
    sorted[0],
  );

  const recent = sorted.slice(-7).reduce((s, d) => s + d.clicks, 0);
  const previous = sorted.slice(-14, -7).reduce((s, d) => s + d.clicks, 0);
  const trend =
    previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;

  const labelStyle = {
    colors: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    fontSize: "11px" as const,
  };

  const commonOptions = {
    chart: {
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          reset: true,
          download: false,
          pan: false,
          zoomin: false,
          zoomout: false,
        },
      },
      animations: { enabled: true, speed: 600 },
    },
    stroke: { curve: "smooth" as const, width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime" as const,
      labels: { style: labelStyle, datetimeUTC: false },
    },
    yaxis: {
      labels: {
        style: labelStyle,
        formatter: (v: number) => v.toLocaleString(),
      },
    },
    grid: {
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    },
    tooltip: { theme: isDark ? "dark" : "light", x: { format: "dd/MM/yyyy" } },
    markers: { size: 0, hover: { size: 5 } },
  };

  const formattedPeakDate = maxDay
    ? new Date(maxDay.date + "T12:00:00").toLocaleDateString(i18n.language)
    : "";

  return (
    <Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
        <Chip
          label={t("temporal.timeline.totalChip", {
            total: totalClicks.toLocaleString(),
            days: sorted.length,
          })}
          color="primary"
          size="small"
        />
        <Chip
          label={t("temporal.timeline.avgPerDay", { avg: avgPerDay })}
          color="info"
          size="small"
        />
        {maxDay && (
          <Chip
            label={t("temporal.timeline.peakOn", {
              clicks: maxDay.clicks,
              date: formattedPeakDate,
            })}
            color="secondary"
            size="small"
          />
        )}
        <Chip
          icon={
            trend > 0 ? (
              <TrendingUp size={14} />
            ) : trend < 0 ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )
          }
          label={t("temporal.timeline.vsLastWeek", {
            trend: `${trend >= 0 ? "+" : ""}${trend}`,
          })}
          color={trend > 0 ? "success" : trend < 0 ? "error" : "default"}
          size="small"
        />
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 2 }}
      >
        {t("temporal.timeline.hint")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ChartCard
            title={t("temporal.timeline.clicksTitle")}
            subtitle={t("temporal.timeline.clicksSubtitle", {
              days: sorted.length,
            })}
          >
            <ApexChartWrapper
              type="area"
              size="standard"
              series={[
                { name: t("temporal.timeline.clicks"), data: clickSeries },
              ]}
              options={{ ...commonOptions, colors: [chartColors.primary.main] }}
            />
          </ChartCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartCard
            title={t("temporal.timeline.uniqueTitle")}
            subtitle={t("temporal.timeline.uniqueSubtitle")}
          >
            <ApexChartWrapper
              type="area"
              size="standard"
              series={[
                { name: t("temporal.timeline.unique"), data: uniqueSeries },
              ]}
              options={{
                ...commonOptions,
                colors: [chartColors.secondary.main],
              }}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DailyTimelineChart;
