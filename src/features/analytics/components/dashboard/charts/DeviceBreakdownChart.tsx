"use client";
/**
 * 📱 DEVICE BREAKDOWN CHART - Gráfico de Dispositivos
 */

import { useTheme } from "@mui/material/styles";
import { Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { chartByType, getChartColor } from "@/lib/theme/colors";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { DeviceData } from "@/types";

interface DeviceBreakdownChartProps {
  data: DeviceData[];
  height?: number;
}

/**
 * Mapeia o nome do device para a cor semântica em chartByType.devices.
 * Faz fallback pela paleta genérica quando o nome não for reconhecido.
 */
function resolveDeviceColor(device: string, fallbackIndex: number): string {
  const key = device?.toLowerCase().trim() as keyof typeof chartByType.devices;
  return chartByType.devices[key] ?? getChartColor(fallbackIndex);
}

export function DeviceBreakdownChart({
  data,
  height,
}: DeviceBreakdownChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const pieProps = formatPieChart(
    data.map((item) => ({
      device: item.device,
      clicks: item.clicks,
    })),
    "device",
    "clicks",
    isDark,
  );

  const colors = data.map((item, index) =>
    resolveDeviceColor(item.device, index),
  );

  return (
    <ChartCard
      title={t("charts.deviceBreakdown")}
      subtitle={t("charts.descriptions.deviceBreakdown")}
      icon={<Smartphone {...ICON_LG} />}
    >
      <ApexChartWrapper
        type="donut"
        height={height}
        size="standard"
        series={pieProps.series}
        options={{
          ...pieProps.options,
          colors,
        }}
      />
    </ChartCard>
  );
}

export default DeviceBreakdownChart;
