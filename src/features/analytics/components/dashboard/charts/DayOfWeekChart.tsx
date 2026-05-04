"use client";
/**
 * 📅 DAY OF WEEK CHART - Gráfico de Cliques por Dia da Semana
 */

import { useTheme } from "@mui/material/styles";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { chartByType } from "@/lib/theme/colors";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { DayOfWeekData } from "@/types";

interface DayOfWeekChartProps {
  data: DayOfWeekData[];
  height?: number;
}

export function DayOfWeekChart({ data, height = 300 }: DayOfWeekChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  return (
    <ChartCard
      title={t("charts.dayOfWeek")}
      icon={<Calendar {...ICON_LG} />}
    >
      <ApexChartWrapper
        type="bar"
        height={height}
        {...formatBarChart(
          data,
          "day_name",
          "clicks",
          chartByType.temporal.weekly,
          false, // vertical bars
          isDark,
        )}
      />
    </ChartCard>
  );
}

export default DayOfWeekChart;
