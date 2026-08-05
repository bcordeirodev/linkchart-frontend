"use client";

import { useTranslation } from "react-i18next";

import { getPublicChartAnimations } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface HourlyClicksChartProps {
  /** Pre-mapped hourly data with `hour` label and `clicks` count. */
  data: { hour: string; clicks: number }[];
}

/**
 * Area chart showing click distribution across the 24 hours of the day.
 *
 * Passes only what is structural to a 24-point hourly series: the category
 * axis (thinned to 8 ticks so the labels don't collide inside a compact card)
 * and hover-only markers. Colour, the 18%→0 area gradient, stroke, grid and
 * tooltip all come from the shared base theme — the old local override painted
 * this chart amber (`chartByType.temporal.hourly`), a hue reserved for warnings.
 */
export function HourlyClicksChart({ data }: HourlyClicksChartProps) {
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const series = [
    {
      name: t("publicAnalytics.charts.hourlyClicks"),
      data: data.map((d) => ({ x: d.hour, y: d.clicks })),
    },
  ];

  const options = {
    chart: { animations: getPublicChartAnimations(reducedMotion) },
    xaxis: {
      type: "category" as const,
      tickAmount: 8,
      labels: { rotate: 0 },
    },
    markers: { size: 0, hover: { size: 5 } },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.hourlyClicks")}
      subtitle={t("publicAnalytics.charts.hourlyClicksDesc")}
      type="area"
      options={options}
      series={series}
    />
  );
}
