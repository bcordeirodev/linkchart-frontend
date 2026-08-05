"use client";

import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { getPublicChartAnimations } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface BrowsersChartProps {
  /** Browser breakdown data — browser label + click count. */
  data: { browser: string; clicks: number }[];
}

/**
 * Share of clicks by browser (Chrome, Firefox, Safari…) as a single horizontal
 * stacked bar, mirroring {@link DevicesChart} — same formatter, same grammar,
 * so the two cards that sit side by side read as one pair instead of two
 * differently-shaped diagrams. Replaces the former donut.
 */
export function BrowsersChart({ data }: BrowsersChartProps) {
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const { series, options } = formatHorizontalStackedBar(
    data,
    "browser",
    "clicks",
  );

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.browsers")}
      subtitle={t("publicAnalytics.charts.browsersDesc")}
      type="bar"
      options={{
        ...options,
        chart: {
          ...(options.chart as Record<string, unknown>),
          animations: getPublicChartAnimations(reducedMotion),
        },
      }}
      series={series}
    />
  );
}
