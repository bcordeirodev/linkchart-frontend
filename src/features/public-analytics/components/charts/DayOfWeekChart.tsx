"use client";

import { Calendar } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { chartByType } from "@/lib/theme/colors";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { getPublicChartTheme } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

/**
 * Pre-computed DOW i18n key array.
 * A literal array avoids the TS 5.8 template-literal overload resolution crash
 * that occurs when indexing with a numeric expression inside `t()`.
 */
const DOW_KEYS = [
  "publicAnalytics.charts.dow.0",
  "publicAnalytics.charts.dow.1",
  "publicAnalytics.charts.dow.2",
  "publicAnalytics.charts.dow.3",
  "publicAnalytics.charts.dow.4",
  "publicAnalytics.charts.dow.5",
  "publicAnalytics.charts.dow.6",
] as const;

interface DayOfWeekChartProps {
  /**
   * Raw day-of-week data from the analytics API.
   * `day` is 0–6 (Sunday=0); `clicks` is the count for that day.
   */
  rawData: { day: number; clicks: number }[];
}

/**
 * Vertical bar chart showing click volume by day of the week.
 *
 * Translates numeric day indices to locale-aware abbreviations using the
 * pre-computed `DOW_KEYS` array, then deep-merges the public base theme with
 * bar-specific overrides (rounded bars, column width).
 */
export function DayOfWeekChart({ rawData }: DayOfWeekChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const base = getPublicChartTheme(theme, { reducedMotion });
  const color = chartByType.temporal.weekly;

  const data = rawData.map((d) => ({
    x: t(DOW_KEYS[d.day as number] ?? DOW_KEYS[0], {
      defaultValue: String(d.day),
    }),
    y: d.clicks,
  }));

  const series = [
    {
      name: t("publicAnalytics.charts.dayOfWeek"),
      data,
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
        horizontal: false,
        borderRadius: 6,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: { type: "category" as const },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.dayOfWeek")}
      subtitle={t("publicAnalytics.charts.dayOfWeekDesc")}
      icon={<Calendar {...ICON_LG} />}
      type="bar"
      options={options}
      series={series}
    />
  );
}
