"use client";
/**
 * Hero block of the `/reports` page — ONE card fusing the period KPIs (a
 * stat strip: dominant total-clicks figure + variation pill, followed by
 * unique visitors / active links / avg-per-day) with the daily trend chart
 * (active window as a solid area, previous window as a dashed line overlay,
 * and a clicks/visitors metric toggle).
 *
 * Replaces the old `ReportsKpiHeader` + standalone `ClicksTimeseriesChart`
 * pair: fusing them gives the page a single visual protagonist and makes the
 * `variation_pct` pill physically adjacent to the curve that explains it.
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

import { chartByType } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import {
  formatSignedPct,
  getVariationPillSx,
} from "@/features/reports/utils/variationPillStyles";

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
  const accent = chartByType.temporal.daily;
  const mutedStroke = isDark
    ? "rgba(255, 255, 255, 0.35)"
    : "rgba(0, 0, 0, 0.3)";
  const textColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

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

  return {
    series,
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        animations: { enabled: true, easing: "easeinout", speed: 600 },
      },
      colors: [accent, mutedStroke],
      stroke: {
        curve: "smooth",
        width: showPrevious ? [3, 2] : [3],
        dashArray: showPrevious ? [0, 6] : [0],
        lineCap: "round",
      },
      fill: {
        type: showPrevious ? ["gradient", "solid"] : "gradient",
        opacity: showPrevious ? [0.45, 0] : 0.45,
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 0, hover: { size: 6 } },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 2,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      legend: {
        show: showPrevious,
        labels: { colors: textColor, useSeriesColors: false },
      },
      xaxis: {
        categories,
        labels: {
          style: { colors: textColor },
          rotate: 0,
          hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          style: { colors: textColor },
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
  const variationSx = getVariationPillSx(
    theme,
    variationPct === null ? null : variationPct >= 0,
  );

  const secondaryStats = [
    {
      key: "uniqueVisitors",
      label: t("kpis.uniqueVisitors"),
      value: (summary?.unique_visitors ?? 0).toLocaleString(),
    },
    {
      key: "activeLinks",
      label: t("kpis.activeLinks"),
      value:
        (summary?.total_links ?? 0) > 0
          ? `${(summary?.active_links ?? 0).toLocaleString()}/${(summary?.total_links ?? 0).toLocaleString()}`
          : (summary?.active_links ?? 0).toLocaleString(),
    },
    {
      key: "avgPerDay",
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

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: { xs: 2, md: 4 },
          }}
        >
          {/* Hero stat */}
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {t("kpis.totalClicks")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 1.25,
                flexWrap: "wrap",
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: "2.2rem", sm: "2.6rem" },
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {totalClicks.toLocaleString()}
              </Typography>
              <Box
                component="span"
                title={t("kpis.variation")}
                sx={{
                  mb: 0.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.375,
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  ...variationSx,
                }}
              >
                {formatSignedPct(variationPct)}
              </Box>
            </Box>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          {/* Secondary stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                md: "repeat(3, auto)",
              },
              gap: { xs: 1.5, md: 4 },
            }}
          >
            {secondaryStats.map((stat) => (
              <Box key={stat.key} sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    display: "block",
                    lineHeight: 1.3,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Chart + metric toggle */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: { xs: 1.5, sm: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={metric}
            aria-label={t("overview.metricToggleLabel")}
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
