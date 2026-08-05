"use client";

import { useTranslation } from "react-i18next";

import { getPublicChartAnimations } from "@/lib/theme/publicChartTheme";
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
 * pre-computed `DOW_KEYS` array. The only option left is the category axis:
 * bar radius (2), column width (45%), solid fill and colour now come from the
 * shared base theme, which is what makes these columns read as the same bars
 * as the logged-in dashboard's — the old override rounded them to 6 and
 * painted them `chartByType.temporal.weekly` green.
 */
export function DayOfWeekChart({ rawData }: DayOfWeekChartProps) {
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

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
    chart: { animations: getPublicChartAnimations(reducedMotion) },
    xaxis: { type: "category" as const },
  };

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.dayOfWeek")}
      subtitle={t("publicAnalytics.charts.dayOfWeekDesc")}
      type="bar"
      options={options}
      series={series}
    />
  );
}
