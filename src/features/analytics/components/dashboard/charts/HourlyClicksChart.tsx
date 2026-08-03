"use client";
/**
 * 📈 HOURLY CLICKS CHART - Gráfico de Cliques por Hora
 */

import { useTranslation } from "react-i18next";

import { formatAreaChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { HourlyData } from "@/types";

interface HourlyClicksChartProps {
  data: HourlyData[];
  height?: number;
}

/**
 * "Cliques por Hora" — area chart. Series color and grid/tooltip styling
 * come entirely from `ApexChartWrapper`'s shared base theme (`dataVizPalette`
 * blue), no local override.
 */
export function HourlyClicksChart({ data, height }: HourlyClicksChartProps) {
  const { t } = useTranslation("analytics");

  return (
    <ChartCard
      title={t("charts.hourlyClicks")}
      subtitle={t("charts.descriptions.hourlyClicks")}
    >
      <ApexChartWrapper
        type="area"
        height={height}
        size="standard"
        {...formatAreaChart(data, "hour", "clicks")}
      />
    </ChartCard>
  );
}

export default HourlyClicksChart;
