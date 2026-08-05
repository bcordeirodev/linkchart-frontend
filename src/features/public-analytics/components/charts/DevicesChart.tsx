"use client";

import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { getPublicChartAnimations } from "@/lib/theme/publicChartTheme";
import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

import { PublicChartCard } from "./ChartCard";

interface DevicesChartProps {
  /** Device breakdown data — device label + click count. */
  data: { device: string; clicks: number }[];
}

/**
 * Share of clicks by device type (mobile, desktop, tablet) as a single
 * horizontal stacked bar — one segment per device, percentages inside the
 * segments and the legend below identifying them.
 *
 * This was a donut. Donuts are out of the "instrumento técnico" language, and
 * the logged-in dashboard's `DeviceBreakdownChart` made exactly this swap;
 * reusing `formatHorizontalStackedBar` means the public page shows the same
 * object, not a lookalike.
 */
export function DevicesChart({ data }: DevicesChartProps) {
  const { t } = useTranslation("public");
  const reducedMotion = usePrefersReducedMotion();

  const { series, options } = formatHorizontalStackedBar(
    data,
    "device",
    "clicks",
  );

  return (
    <PublicChartCard
      title={t("publicAnalytics.charts.devices")}
      subtitle={t("publicAnalytics.charts.devicesDesc")}
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
