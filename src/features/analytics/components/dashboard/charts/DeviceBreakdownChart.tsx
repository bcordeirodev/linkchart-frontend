"use client";
/**
 * 📱 DEVICE BREAKDOWN CHART - Gráfico de Dispositivos
 */

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import { resolveDataVizCategorical } from "@/lib/theme/dataViz";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { ViewFullAnalysisLink } from "./ViewFullAnalysisLink";

import type { DeviceData } from "@/types";

interface DeviceBreakdownChartProps {
  data: DeviceData[];
  height?: number;
}

/**
 * Cap on the chart canvas height for this single stacked bar (refinamento
 * visual 2026-08-08 §3.9): the "standard" responsive size (220–380px) was
 * built for multi-row charts and left a wall of empty space above/below the
 * one thin bar + legend a device breakdown actually needs.
 */
const MAX_CHART_HEIGHT = 120;

/**
 * "Distribuição de Dispositivos" — a single horizontal stacked bar (one
 * segment per device) replacing the former donut. Colors come from the
 * shared `dataVizCategorical` palette via `ApexChartWrapper`'s base theme —
 * each device segment gets its own distinguishable tone (blue/teal/violet/…)
 * instead of shades of the same blue; no per-device color mapping is applied
 * in this component, so the legend below the bar is what identifies each
 * segment. The same resolved palette (`seriesColors`) is also handed to
 * `formatHorizontalStackedBar` so it can pick a legible per-segment label
 * color via `labelColorFor` (ajuste fino de temas, 2026-08-09) — without it
 * every segment falls back to a fixed near-black that goes unreadable on the
 * darker tones of the light-mode ramp.
 *
 * The chart canvas is capped at {@link MAX_CHART_HEIGHT} and the card itself
 * is sized to its content (`height="auto"`) rather than stretching to match
 * its taller grid sibling (Top Countries) — otherwise the bordered card
 * would visually balloon to match a chart it doesn't contain, reintroducing
 * the "empty card" defect this height cap exists to fix.
 */
export function DeviceBreakdownChart({
  data,
  height,
}: DeviceBreakdownChartProps) {
  const { t, i18n } = useTranslation("analytics");
  const theme = useTheme();
  const seriesColors = resolveDataVizCategorical(theme.palette.mode);

  // Device names arrive as the tracking pipeline's raw values ("desktop",
  // "mobile") — reformatted here for display, same treatment as every other
  // device/browser/OS/engine label on the page (this chart drives both the
  // stacked-bar legend and, via `formatHorizontalStackedBar`'s tooltip, the
  // hover value).
  const chartData = data.map((item) => ({
    device: formatAnalyticsLabel(item.device),
    clicks: item.clicks,
  }));

  const resolvedHeight =
    height != null ? Math.min(height, MAX_CHART_HEIGHT) : MAX_CHART_HEIGHT;

  return (
    <ChartCard
      title={t("charts.deviceBreakdown")}
      subtitle={t("charts.descriptions.deviceBreakdown")}
      action={<ViewFullAnalysisLink tab="audience" />}
      height="auto"
    >
      <ApexChartWrapper
        type="bar"
        height={resolvedHeight}
        {...formatHorizontalStackedBar(
          chartData,
          "device",
          "clicks",
          undefined,
          i18n.language,
          seriesColors,
        )}
      />
    </ChartCard>
  );
}

export default DeviceBreakdownChart;
