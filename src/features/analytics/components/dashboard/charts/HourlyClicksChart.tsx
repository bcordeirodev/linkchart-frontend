"use client";
/**
 * 📈 HOURLY CLICKS CHART - Gráfico de Cliques por Hora
 */

import { useTheme } from "@mui/material/styles";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatAreaChart } from "@/features/analytics/utils/chartFormatters";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { chartByType } from "@/lib/theme/colors";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { HourlyData } from "@/types";

interface HourlyClicksChartProps {
  data: HourlyData[];
  height?: number;
}

export function HourlyClicksChart({
  data,
  height = 300,
}: HourlyClicksChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  return (
    <ChartCard
      title={t("charts.hourlyClicks")}
      subtitle={t("charts.descriptions.hourlyClicks")}
      icon={<TrendingUp {...ICON_LG} />}
    >
      <ApexChartWrapper
        type="area"
        height={height}
        {...formatAreaChart(
          data,
          "hour",
          "clicks",
          chartByType.temporal.hourly,
          isDark,
        )}
      />
    </ChartCard>
  );
}

export default HourlyClicksChart;
