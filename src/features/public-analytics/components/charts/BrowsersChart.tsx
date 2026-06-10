"use client";

import { Monitor } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { getPublicChartTheme } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface BrowsersChartProps {
  /** Browser breakdown data — browser label + click count. */
  data: { browser: string; clicks: number }[];
}

/**
 * Donut chart showing the share of clicks by browser
 * (Chrome, Firefox, Safari, etc.).
 *
 * Mirrors the same pattern as `DevicesChart`: flat numeric `series` array
 * with positionally-matching `options.labels`. Inherits the public chart
 * palette from `getPublicChartTheme` and overrides donut-specific `plotOptions`.
 */
export function BrowsersChart({ data }: BrowsersChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const base = getPublicChartTheme(theme, { reducedMotion });

  const series = data.map((d) => d.clicks);
  const labels = data.map((d) => d.browser);

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
      title={t("publicAnalytics.charts.browsers")}
      icon={<Monitor {...ICON_LG} />}
      type="donut"
      options={options}
      series={series}
    />
  );
}
