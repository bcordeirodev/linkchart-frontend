"use client";
/**
 * 📅 DAY OF WEEK CHART - Gráfico de Cliques por Dia da Semana
 */

import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { localizeWeekdayRows } from "@/features/analytics/utils/weekday";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { ViewFullAnalysisLink } from "./ViewFullAnalysisLink";

import type { DayOfWeekData } from "@/types";

interface DayOfWeekChartProps {
  data: DayOfWeekData[];
  height?: number;
}

/**
 * "Cliques por Dia da Semana" — vertical bar chart, Resumo-only instance.
 * Series color and grid styling come entirely from `ApexChartWrapper`'s
 * shared base theme, no local override. Subtitle is the Resumo-specific
 * quick-view copy (`dashboard.charts.dayOfWeekSummaryDesc`) rather than the
 * generic chart description, since the full breakdown lives one click away
 * via the card's cross-link into the Momento tab.
 */
export function DayOfWeekChart({ data, height }: DayOfWeekChartProps) {
  const { t } = useTranslation("analytics");

  return (
    <ChartCard
      title={t("charts.dayOfWeek")}
      subtitle={t("dashboard.charts.dayOfWeekSummaryDesc")}
      action={<ViewFullAnalysisLink tab="when" />}
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
          false, // vertical bars
          { clicksLabel: t("temporal.viralRank.clicksUnit") },
        )}
      />
    </ChartCard>
  );
}

export default DayOfWeekChart;
