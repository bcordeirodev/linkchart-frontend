"use client";
/**
 * 📅 DAY OF WEEK CHART - Gráfico de Cliques por Dia da Semana
 */

import { useTheme } from "@mui/material/styles";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { localizeWeekdayRows } from "@/features/analytics/utils/weekday";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { chartByType } from "@/lib/theme/colors";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { DayOfWeekData } from "@/types";

interface DayOfWeekChartProps {
  data: DayOfWeekData[];
  height?: number;
}

export function DayOfWeekChart({ data, height }: DayOfWeekChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  return (
    <ChartCard
      title={t("charts.dayOfWeek")}
      subtitle={t("charts.descriptions.dayOfWeek")}
      icon={<Calendar {...ICON_LG} />}
    >
      {/* The API's own `day_name` is hardcoded Portuguese — the category axis
          is labelled from the ISO day number instead. */}
      <ApexChartWrapper
        type="bar"
        height={height}
        size="standard"
        {...formatBarChart(
          localizeWeekdayRows(data, t),
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
