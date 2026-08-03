"use client";
/**
 * 🌍 TOP COUNTRIES CHART - Gráfico de Top Países
 */

import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { CountryData } from "@/types";

interface TopCountriesChartProps {
  data: CountryData[];
  height?: number;
  maxCountries?: number;
}

/**
 * "Top Países" — horizontal bar chart. Series color and grid styling come
 * entirely from `ApexChartWrapper`'s shared base theme, no local override.
 */
export function TopCountriesChart({
  data,
  height,
  maxCountries = 10,
}: TopCountriesChartProps) {
  const { t } = useTranslation("analytics");

  const topCountries = data.slice(0, maxCountries);

  return (
    <ChartCard
      title={t("charts.topCountries")}
      subtitle={t("charts.descriptions.topCountries")}
    >
      <ApexChartWrapper
        type="bar"
        height={height}
        size="standard"
        {...formatBarChart(
          topCountries,
          "country",
          "clicks",
          true, // horizontal bars
        )}
      />
    </ChartCard>
  );
}

export default TopCountriesChart;
