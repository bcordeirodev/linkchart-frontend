"use client";
/**
 * 🌍 TOP COUNTRIES CHART - Gráfico de Top Países
 */

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { resolveDataVizCategorical } from "@/lib/theme/dataViz";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { ViewFullAnalysisLink } from "./ViewFullAnalysisLink";

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
  const { t, i18n } = useTranslation("analytics");
  const theme = useTheme();

  const topCountries = data.slice(0, maxCountries);
  // Single-series chart (formatBarChart's default series name, "Clicks") —
  // every bar fills with `colors[0]` of the active mode's ramp, the same
  // color resolved (and consumed) below via `style.barColor` so the
  // in-bar value label picks a legible text color for that exact fill
  // (ajuste fino de temas, 2026-08-09; ver `labelColorFor`).
  const barColor = resolveDataVizCategorical(theme.palette.mode)[0];

  return (
    <ChartCard
      title={t("charts.topCountries")}
      subtitle={t("charts.descriptions.topCountries")}
      action={<ViewFullAnalysisLink tab="places" />}
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
          { clicksLabel: t("temporal.viralRank.clicksUnit") },
          i18n.language,
          { barColor },
        )}
      />
    </ChartCard>
  );
}

export default TopCountriesChart;
