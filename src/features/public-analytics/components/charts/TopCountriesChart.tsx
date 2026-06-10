"use client";

import { Globe } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { chartByType } from "@/lib/theme/colors";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { getPublicChartTheme } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface TopCountriesChartProps {
  /** Country data slice — country name + click count. */
  data: { country: string; clicks: number }[];
}

/**
 * Horizontal bar chart displaying the top countries by click count.
 *
 * Uses `plotOptions.bar.horizontal: true` so country labels render on the
 * Y-axis (more readable with long country names). The base theme's
 * `plotOptions.bar.borderRadius` is preserved via explicit spread.
 */
export function TopCountriesChart({ data }: TopCountriesChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const base = getPublicChartTheme(theme, { reducedMotion });
  const color = chartByType.geographic.countries;

  const series = [
    {
      name: t("publicAnalytics.charts.topCountries"),
      data: data.map((d) => ({ x: d.country, y: d.clicks })),
    },
  ];

  const options = {
    ...base,
    colors: [color],
    chart: {
      ...base.chart,
      type: "bar" as const,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    plotOptions: {
      ...base.plotOptions,
      bar: {
        ...base.plotOptions?.bar,
        horizontal: true,
        borderRadius: 4,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontSize: "11px",
        fontWeight: "bold",
      },
      formatter: (val: number) => val.toString(),
    },
    xaxis: { type: "numeric" as const },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.topCountries")}
      icon={<Globe {...ICON_LG} />}
      type="bar"
      options={options}
      series={series}
    />
  );
}
