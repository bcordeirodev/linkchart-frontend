"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { heatmapBlueScale } from "@/lib/theme/colors/chart";
import type { HeatmapSeriesEntry } from "@/types/analytics/temporal";

interface HourDayHeatmapChartProps {
  data: HeatmapSeriesEntry[];
}

export function HourDayHeatmapChart({ data }: HourDayHeatmapChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  if (!data || data.length === 0) {
    return null;
  }

  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    dataLabels: { enabled: false },
    colors: [heatmapBlueScale.high],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.8,
        radius: 2,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: isDark
                ? heatmapBlueScale.empty.dark
                : heatmapBlueScale.empty.light,
              name: t("temporal.heatmap.colorScaleNone"),
            },
            {
              from: 1,
              to: 5,
              color: heatmapBlueScale.low,
              name: t("temporal.heatmap.colorScaleLow"),
            },
            {
              from: 6,
              to: 15,
              color: heatmapBlueScale.medium,
              name: t("temporal.heatmap.colorScaleMedium"),
            },
            {
              from: 16,
              to: 50,
              color: heatmapBlueScale.high,
              name: t("temporal.heatmap.colorScaleHigh"),
            },
            {
              from: 51,
              to: 99999,
              color: heatmapBlueScale.veryHigh,
              name: t("temporal.heatmap.colorScaleVeryHigh"),
            },
          ],
        },
      },
    },
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          fontSize: "10px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          fontSize: "11px",
          fontWeight: "500",
        },
      },
    },
    grid: {
      borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) =>
          `${val} ${val === 1 ? t("temporal.heatmap.clickSingular") : t("temporal.heatmap.clickPlural")}`,
      },
    },
    legend: {
      show: true,
      position: "bottom" as const,
      labels: {
        colors: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      },
    },
  };

  return (
    <ChartCard
      title={t("temporal.heatmap.title")}
      subtitle={t("temporal.heatmap.subtitle")}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {t("temporal.heatmap.hint")}
        </Typography>
      </Box>
      <ApexChartWrapper
        type="heatmap"
        size="standard"
        series={data}
        options={options}
      />
    </ChartCard>
  );
}

export default HourDayHeatmapChart;
