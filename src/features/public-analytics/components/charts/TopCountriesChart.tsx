"use client";

import { useTranslation } from "react-i18next";

import { darkNeutral } from "@/lib/theme/colors/dark";
import { getPublicChartAnimations } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";
import { integerTickAmount } from "./integerTicks";

interface TopCountriesChartProps {
  /** Country data slice — country name + click count. */
  data: { country: string; clicks: number }[];
}

/**
 * Horizontal bar chart displaying the top countries by click count.
 *
 * `horizontal: true` puts the country names on the Y axis, where long names
 * fit. The in-bar value labels are drawn in `darkNeutral.bg` rather than
 * white: they sit on top of the bar fill, and the data-viz palette is light
 * enough that white-on-blue falls under the contrast floor — the same reason
 * `@/features/analytics`'s bar formatter uses that colour. Everything else
 * (solid blue fill, radius, grid, axes) is inherited.
 */
export function TopCountriesChart({ data }: TopCountriesChartProps) {
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const series = [
    {
      name: t("publicAnalytics.charts.topCountries"),
      data: data.map((d) => ({ x: d.country, y: d.clicks })),
    },
  ];

  const maxClicks = data.reduce((max, d) => Math.max(max, d.clicks), 0);

  const options = {
    chart: { animations: getPublicChartAnimations(reducedMotion) },
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    dataLabels: {
      enabled: true,
      style: {
        colors: [darkNeutral.bg],
        fontSize: "11px",
        fontWeight: 700,
      },
      formatter: (val: number) => val.toString(),
    },
    xaxis: { type: "numeric" as const, ...integerTickAmount(maxClicks) },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.topCountries")}
      subtitle={t("publicAnalytics.charts.topCountriesDesc")}
      type="bar"
      options={options}
      series={series}
    />
  );
}
