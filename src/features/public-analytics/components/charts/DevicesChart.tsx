"use client";

import { Smartphone } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { getPublicChartTheme } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface DevicesChartProps {
  /** Device breakdown data — device label + click count. */
  data: { device: string; clicks: number }[];
}

/**
 * Donut chart showing the share of clicks by device type
 * (mobile, desktop, tablet, etc.).
 *
 * For donut/pie charts, `series` is a flat number array and labels are passed
 * as a separate `options.labels` field, which ApexCharts maps positionally.
 * The base theme `colors` array is preserved (first N colours match the slices).
 */
export function DevicesChart({ data }: DevicesChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const base = getPublicChartTheme(theme, { reducedMotion });

  const series = data.map((d) => d.clicks);
  const labels = data.map((d) => d.device);

  const isDark = theme.palette.mode === "dark";
  const textColor = isDark
    ? "rgba(255, 255, 255, 0.85)"
    : "rgba(0, 0, 0, 0.75)";

  const options = {
    ...base,
    chart: {
      ...base.chart,
      type: "donut" as const,
    },
    labels,
    // For donut charts the gradient fill looks odd — use solid slices
    fill: { type: "solid" },
    stroke: { show: false },
    plotOptions: {
      ...base.plotOptions,
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontWeight: 600,
              color: textColor,
            },
            value: {
              show: true,
              fontSize: "15px",
              fontWeight: 700,
              color: textColor,
              formatter: (val: string) => parseInt(val).toLocaleString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      ...base.legend,
      position: "bottom" as const,
    },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.devices")}
      icon={<Smartphone {...ICON_LG} />}
      type="donut"
      options={options}
      series={series}
    />
  );
}
