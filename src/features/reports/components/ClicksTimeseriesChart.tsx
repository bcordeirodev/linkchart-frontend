"use client";
/**
 * Area chart of daily clicks across every link the user owns, for the active
 * `/reports` period filter. Thin presentational wrapper around `ChartCard` +
 * `ApexChartWrapper`, mirroring `HourlyClicksChart` (per-link dashboard) but
 * fed by the aggregated `GET /api/reports/timeseries` endpoint.
 */

import { useTheme } from "@mui/material/styles";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatAreaChart } from "@/features/analytics/utils/chartFormatters";
import { chartByType } from "@/lib/theme/colors";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { TimeseriesPoint } from "@/features/reports/types";

/**
 * Props accepted by {@link ClicksTimeseriesChart}.
 *
 * Loading/error/empty are gated by the caller's `AnalyticsStateManager`
 * (see `ReportsPage`) — this component only ever mounts with a non-empty
 * `data`, so it always renders the chart.
 */
interface ClicksTimeseriesChartProps {
  /** Daily click counts for the selected period. */
  data: TimeseriesPoint[];
}

/**
 * Total clicks per day across every link the user owns, for the active
 * period filter. The subtitle is required reading, not decoration — it is
 * what tells a reader this total is aggregated across their whole account
 * and not a single link (the shape they're used to from `/links/analytics`).
 */
export function ClicksTimeseriesChart({ data }: ClicksTimeseriesChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");
  const isDark = theme.palette.mode === "dark";

  // Re-mapped into a fresh literal (not the raw `TimeseriesPoint[]`) so it
  // structurally satisfies `formatAreaChart`'s `Record<string, unknown>[]`
  // parameter — same convention as `DeviceBreakdownChart`.
  const chartInput = data.map((point) => ({
    date: point.date,
    clicks: point.clicks,
  }));

  return (
    <ChartCard
      title={t("timeseries.title")}
      subtitle={t("timeseries.subtitle")}
      icon={<TrendingUp {...ICON_LG} />}
    >
      <ApexChartWrapper
        type="area"
        size="standard"
        {...formatAreaChart(
          chartInput,
          "date",
          "clicks",
          chartByType.temporal.daily,
          isDark,
          {
            series: t("timeseries.seriesName"),
            noData: t("empty"),
            clicksLabel: t("timeseries.clicksLabel"),
          },
        )}
      />
    </ChartCard>
  );
}

export default ClicksTimeseriesChart;
