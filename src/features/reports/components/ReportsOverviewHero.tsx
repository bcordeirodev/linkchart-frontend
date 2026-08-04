"use client";
/**
 * Hero block of the `/reports` page — ONE card fusing the period KPIs (an
 * `OverviewMetricRow` stat strip: total clicks with a colored trend caption,
 * unique visitors, active links, avg-per-day — bare numbers + hairlines, no
 * card/icon-chip, per the "instrumento técnico" redesign) with the daily
 * trend chart (active window as a solid area, previous window as a dashed
 * line overlay, and a clicks/visitors metric toggle).
 *
 * Replaces the old `ReportsKpiHeader` + standalone `ClicksTimeseriesChart`
 * pair: fusing them gives the page a single visual protagonist and keeps the
 * `variation_pct` trend physically adjacent to the curve that explains it.
 */

import { useState } from "react";
import {
  Box,
  Card,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { dataVizPalette } from "@/lib/theme/dataViz";
import { radiusTokens } from "@/lib/theme/designSystem";
import { getFilterSegmentSx, OverviewMetricRow } from "@/shared/ui/base";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import { formatSignedPct } from "@/features/reports/utils/variationPillStyles";

import type { OverviewMetric as OverviewMetricItem } from "@/shared/ui/base";
import type {
  ReportsSummary,
  ReportsTimeseries,
} from "@/features/reports/types";

/** Metric the hero chart is currently plotting. */
type OverviewMetric = "clicks" | "visitors";

/** Props accepted by {@link ReportsOverviewHero}. */
interface ReportsOverviewHeroProps {
  /** Aggregated KPIs for the period; `null` while loading (renders zeros). */
  summary: ReportsSummary | null;
  /** Daily series + previous-window overlay; `null` while loading. */
  timeseries: ReportsTimeseries | null;
}

/**
 * Builds the two-series Apex config: active window as a smooth gradient
 * area, previous window as a muted dashed line with no fill. The previous
 * overlay only exists for the clicks metric (the backend has no historical
 * unique-visitors series) and only when both series have equal length —
 * they are aligned by index, one point per calendar day.
 */
function buildHeroChart(
  timeseries: ReportsTimeseries,
  metric: OverviewMetric,
  isDark: boolean,
  labels: { current: string; previous: string },
) {
  const current = timeseries.series.map((p) =>
    metric === "clicks" ? p.clicks : p.unique_visitors,
  );
  const categories = timeseries.series.map((p) => p.date);

  const showPrevious =
    metric === "clicks" &&
    timeseries.previous.length === timeseries.series.length &&
    timeseries.previous.length > 0;

  const series = [
    { name: labels.current, data: current },
    ...(showPrevious
      ? [
          {
            name: labels.previous,
            data: timeseries.previous.map((p) => p.clicks),
          },
        ]
      : []),
  ];

  // Series colors: the base theme's palette already covers the single-series
  // case (first tone = `dataVizPalette.primary`). The two-series overlay is
  // the one case that needs an explicit choice — `muted` is the tone the
  // palette reserves for comparison/baseline series (see `dataViz.ts`), which
  // is exactly what the dashed previous-period line is.
  const colors = showPrevious
    ? [dataVizPalette.primary, dataVizPalette.muted]
    : undefined;

  return {
    series,
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        animations: { enabled: true, easing: "easeinout", speed: 600 },
      },
      colors,
      stroke: {
        dashArray: showPrevious ? [0, 6] : [0],
      },
      // Same gradient the base theme uses for every area chart (18%→0) —
      // only the per-series array is local, to keep the previous-period
      // overlay a bare dashed line with no wash under it.
      fill: {
        gradient: {
          opacityFrom: showPrevious ? [0.18, 0] : 0.18,
          opacityTo: showPrevious ? [0, 0] : 0,
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 0, hover: { size: 6 } },
      legend: {
        show: showPrevious,
      },
      xaxis: {
        categories,
        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        shared: true,
        intersect: false,
      },
    } as Record<string, unknown>,
  };
}

/**
 * Renders the hero card. Callers gate loading/error via
 * `AnalyticsStateManager` — with `null` inputs this renders zeros and an
 * empty chart rather than owning its own skeleton.
 */
export function ReportsOverviewHero({
  summary,
  timeseries,
}: ReportsOverviewHeroProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");
  const isDark = theme.palette.mode === "dark";

  const [metric, setMetric] = useState<OverviewMetric>("clicks");

  const totalClicks = summary?.total_clicks ?? 0;
  const variationPct = summary?.variation_pct ?? null;

  // Trend color mirrors `OverviewKpiHeader`'s convention (Task 9's restored
  // semantic trend colors, Bruno's call): green trending up, red trending
  // down, default text color when there's no baseline to compare against
  // (`null`) or the period is exactly flat (`0`) — a flat trend isn't bad
  // news, so it doesn't borrow the "down" color either.
  const trendColor =
    variationPct === null || variationPct === 0
      ? undefined
      : variationPct > 0
        ? "success.main"
        : "error.main";

  const heroMetrics: OverviewMetricItem[] = [
    {
      label: t("kpis.totalClicks"),
      value: totalClicks.toLocaleString(),
      caption: (
        <Box
          component="span"
          title={t("kpis.variation")}
          sx={{ color: trendColor, fontWeight: 600 }}
        >
          {formatSignedPct(variationPct)}
        </Box>
      ),
    },
    {
      label: t("kpis.uniqueVisitors"),
      value: (summary?.unique_visitors ?? 0).toLocaleString(),
    },
    {
      label: t("kpis.activeLinks"),
      value:
        (summary?.total_links ?? 0) > 0
          ? `${(summary?.active_links ?? 0).toLocaleString()}/${(summary?.total_links ?? 0).toLocaleString()}`
          : (summary?.active_links ?? 0).toLocaleString(),
    },
    {
      label: t("kpis.avgPerDay"),
      value: (summary?.avg_clicks_per_day ?? 0).toLocaleString(undefined, {
        maximumFractionDigits: 1,
      }),
    },
  ];

  const chart = buildHeroChart(
    timeseries ?? { series: [], previous: [] },
    metric,
    isDark,
    {
      current:
        metric === "clicks"
          ? t("overview.metricClicks")
          : t("overview.metricVisitors"),
      previous: t("overview.previousPeriod"),
    },
  );

  return (
    <Card
      component="section"
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${radiusTokens.md}px`,
      }}
    >
      {/* Stat strip */}
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t("overview.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("overview.subtitle")}
        </Typography>

        <OverviewMetricRow metrics={heroMetrics} />
      </Box>

      <Divider />

      {/* Chart + metric toggle */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: { xs: 1.5, sm: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          {/* Level 3 — this narrows what the chart plots, so it wears the same
              trackless outlined grammar as the analytics tab filters instead
              of MUI's default toggle group. It was already in the right place
              (panel header, right-aligned, beside the chart it controls); only
              its treatment was off-system. */}
          <ToggleButtonGroup
            size="small"
            exclusive
            value={metric}
            aria-label={t("overview.metricToggleLabel")}
            sx={getFilterSegmentSx(theme, 32)}
            onChange={(_, next: OverviewMetric | null) => {
              if (next) {
                setMetric(next);
              }
            }}
          >
            <ToggleButton value="clicks">
              {t("overview.metricClicks")}
            </ToggleButton>
            <ToggleButton value="visitors">
              {t("overview.metricVisitors")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ApexChartWrapper
          type="area"
          size="standard"
          series={chart.series}
          options={chart.options}
        />
      </Box>
    </Card>
  );
}

export default ReportsOverviewHero;
