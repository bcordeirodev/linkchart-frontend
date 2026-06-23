import { alpha } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";
import type { ApexOptions } from "apexcharts";

/** Accessible categorical palette derived from the MUI theme (no red/green-only pairs). */
export function getPublicChartPalette(theme: Theme): string[] {
  return [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.success.main,
  ];
}

/**
 * Base ApexCharts options shared by every public-analytics chart.
 * Each chart deep-merges its specifics (series, type-specific plotOptions) on top.
 */
export function getPublicChartTheme(
  theme: Theme,
  options?: { reducedMotion?: boolean },
): ApexOptions {
  const isDark = theme.palette.mode === "dark";
  const grid = alpha(theme.palette.divider, isDark ? 0.16 : 0.2);
  const labelColor = alpha(theme.palette.text.primary, isDark ? 0.68 : 0.72);

  return {
    chart: {
      fontFamily: theme.typography.fontFamily,
      foreColor: labelColor,
      toolbar: { show: false },
      animations: { enabled: !options?.reducedMotion },
      background: "transparent",
    },
    colors: getPublicChartPalette(theme),
    grid: {
      borderColor: grid,
      strokeDashArray: 4,
      padding: { left: 4, right: 8 },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      marker: { show: true },
      style: { fontSize: "12px" },
    },
    plotOptions: { bar: { borderRadius: 7, columnWidth: "52%" } },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.22, opacityFrom: 0.42, opacityTo: 0.06 },
    },
    stroke: { curve: "smooth", width: 2 },
    legend: { labels: { colors: labelColor }, position: "bottom" },
  };
}
