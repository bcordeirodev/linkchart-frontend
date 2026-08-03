"use client";
/**
 * 📱 DEVICE BREAKDOWN CHART - Gráfico de Dispositivos
 */

import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { DeviceData } from "@/types";

interface DeviceBreakdownChartProps {
  data: DeviceData[];
  height?: number;
}

/**
 * "Distribuição de Dispositivos" — a single horizontal stacked bar (one
 * segment per device) replacing the former donut. Colors come from the
 * shared `dataVizPalette` via `ApexChartWrapper`'s base theme; no per-device
 * color mapping is applied anymore, so the legend below the bar is what
 * identifies each segment.
 */
export function DeviceBreakdownChart({
  data,
  height,
}: DeviceBreakdownChartProps) {
  const { t } = useTranslation("analytics");

  const chartData = data.map((item) => ({
    device: item.device,
    clicks: item.clicks,
  }));

  return (
    <ChartCard
      title={t("charts.deviceBreakdown")}
      subtitle={t("charts.descriptions.deviceBreakdown")}
    >
      <ApexChartWrapper
        type="bar"
        height={height}
        size="standard"
        {...formatHorizontalStackedBar(chartData, "device", "clicks")}
      />
    </ChartCard>
  );
}

export default DeviceBreakdownChart;
