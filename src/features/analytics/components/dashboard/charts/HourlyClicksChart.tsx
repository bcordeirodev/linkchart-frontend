"use client";
/**
 * 📈 HOURLY CLICKS CHART - Gráfico de Cliques por Hora
 */

import { useTranslation } from "react-i18next";

import { formatAreaChart } from "@/features/analytics/utils/chartFormatters";
import { resolveCurve } from "@/lib/theme/apexBaseTheme";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { ViewFullAnalysisLink } from "./ViewFullAnalysisLink";

import type { HourlyData } from "@/types";

interface HourlyClicksChartProps {
  data: HourlyData[];
  height?: number;
}

/**
 * "Cliques por Hora" — area chart. Series color and grid/tooltip styling
 * come entirely from `ApexChartWrapper`'s shared base theme (`dataVizCategorical`'s
 * first tone, blue — the base theme injects the full categorical palette as
 * the default `colors`, and a single-series chart like this one only ever
 * draws the first), no local override. Line curve is decided by
 * `resolveCurve` from the point count — below 10 hourly buckets the line
 * stays straight instead of smoothing a sparse sample into invented
 * peaks/valleys.
 */
export function HourlyClicksChart({ data, height }: HourlyClicksChartProps) {
  const { t } = useTranslation("analytics");

  const { series, options } = formatAreaChart(data, "hour", "clicks", {
    clicksLabel: t("temporal.viralRank.clicksUnit"),
  });

  return (
    <ChartCard
      title={t("charts.hourlyClicks")}
      subtitle={t("charts.descriptions.hourlyClicks")}
      action={<ViewFullAnalysisLink tab="when" />}
    >
      <ApexChartWrapper
        type="area"
        height={height}
        size="standard"
        series={series}
        options={{
          ...options,
          stroke: { curve: resolveCurve(data.length) },
        }}
      />
    </ChartCard>
  );
}

export default HourlyClicksChart;
