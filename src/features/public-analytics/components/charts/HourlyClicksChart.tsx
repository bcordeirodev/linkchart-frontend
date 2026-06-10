"use client";

import { Clock } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { chartByType } from "@/lib/theme/colors";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { getPublicChartTheme } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface HourlyClicksChartProps {
  /** Pre-mapped hourly data with `hour` label and `clicks` count. */
  data: { hour: string; clicks: number }[];
}

/**
 * Area chart showing click distribution across the 24 hours of the day.
 *
 * Deep-merges the public chart base theme (palette, gradient fill, smooth
 * stroke, animations) with area-specific overrides. The `fill` gradient
 * is preserved from the base and overridden only at the colour/opacity level
 * so the area shape and base chart settings are never clobbered.
 */
export function HourlyClicksChart({ data }: HourlyClicksChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const base = getPublicChartTheme(theme, { reducedMotion });
  const color = chartByType.temporal.hourly;

  const series = [
    {
      name: t("publicAnalytics.charts.hourlyClicks"),
      data: data.map((d) => ({ x: d.hour, y: d.clicks })),
    },
  ];

  const options = {
    ...base,
    colors: [color],
    chart: {
      ...base.chart,
      type: "area" as const,
    },
    fill: {
      ...base.fill,
      type: "gradient",
      gradient: {
        ...((base.fill as { gradient?: Record<string, unknown> })?.gradient ??
          {}),
        gradientToColors: [color],
        shadeIntensity: 0.25,
        opacityFrom: 0.6,
        opacityTo: 0.08,
      },
    },
    stroke: {
      ...base.stroke,
      width: 2.5,
      curve: "smooth" as const,
    },
    plotOptions: {
      ...base.plotOptions,
    },
    xaxis: {
      type: "category" as const,
      tickAmount: 8,
      labels: {
        rotate: 0,
        style: { fontSize: "11px" },
      },
    },
    markers: { size: 0, hover: { size: 5 } },
    dataLabels: { enabled: false },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.hourlyClicks")}
      icon={<Clock {...ICON_LG} />}
      type="area"
      options={options}
      series={series}
    />
  );
}
