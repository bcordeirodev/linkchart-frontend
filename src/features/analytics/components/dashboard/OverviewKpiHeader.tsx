"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { OverviewMetricRow } from "@/shared/ui/base";

import type { OverviewMetric } from "@/shared/ui/base";

/** Props accepted by the {@link OverviewKpiHeader} component. */
interface OverviewKpiHeaderProps {
  /** Total clicks in the active period — the dominant hero metric. */
  totalClicks: number;
  /** Distinct visitors in the active period. */
  uniqueVisitors: number;
  /** Number of countries reached in the active period. */
  countries: number;
  /** Already formatted (e.g. "2") or null when unavailable. */
  avgDaily: string | null;
  /** Already formatted quality label, e.g. "85%". */
  qualityLabel: string;
  /** Hourly (or daily) click counts for the sparkline. */
  sparkline: number[];
  /** Optional period-over-period variation; omit the pill when null. */
  trendPct?: number | null;
}

/**
 * Overview KPI header — "instrumento técnico" redesign (2026-08-03): five bare
 * numbers (total clicks, unique visitors, countries, avg daily, quality) in a
 * single {@link OverviewMetricRow}, hairline-separated, no card/icon-chip.
 * Total clicks keeps its compact area sparkline and, when available, the
 * period-over-period trend folded into its caption. Presentational only —
 * `LinkDashboard` maps the dashboard payload into these resolved props.
 */
export function OverviewKpiHeader({
  totalClicks,
  uniqueVisitors,
  countries,
  avgDaily,
  qualityLabel,
  sparkline,
  trendPct = null,
}: OverviewKpiHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const { t: tl } = useTranslation("links");

  // Visual gate fix (2026-08-03, item 4): the neutral-arrow argument below
  // lost — Bruno's call is that the trend direction IS the information, and
  // burying it in a same-color arrow made the KPI row read as "numbers with
  // no verdict". Restored the semantic color the fleet had neutralized:
  // green (`success.main`) trending up, red (`error.main`) trending down,
  // default text color when there's no period to compare against (`null`)
  // or the period is exactly flat (`0`) — a flat trend isn't bad news, so it
  // doesn't borrow the "down" color either.
  const trendColor =
    trendPct == null || trendPct === 0
      ? undefined
      : trendPct > 0
        ? "success.main"
        : "error.main";

  const totalClicksCaption =
    trendPct != null ? (
      <>
        <Box
          component="span"
          sx={{ color: trendColor, fontWeight: 600 }}
        >{`${trendPct >= 0 ? "▲" : "▼"} ${Math.abs(trendPct)}%`}</Box>
        {` · ${tl("metrics.totalClicksSubtitle")}`}
      </>
    ) : (
      tl("metrics.totalClicksSubtitle")
    );

  const metrics: OverviewMetric[] = [
    {
      label: t("metrics.totalClicks"),
      value: totalClicks.toLocaleString(),
      caption: totalClicksCaption,
      sparkline: <Sparkline data={sparkline} color={theme.palette.info.main} />,
    },
    {
      label: t("metrics.uniqueVisitors"),
      value: uniqueVisitors.toLocaleString(),
    },
    {
      label: t("metrics.countriesReached"),
      value: countries.toString(),
    },
    {
      label: t("metrics.avgDailyClicks"),
      value: avgDaily ?? t("metrics.noData"),
    },
    {
      label: t("metrics.quality"),
      value: qualityLabel,
    },
  ];

  return <OverviewMetricRow metrics={metrics} size="md" />;
}

/** Props accepted by the internal {@link Sparkline} helper. */
interface SparklineProps {
  /** Sequential numeric values plotted left-to-right. */
  data: number[];
  /** Stroke and gradient color (hex/rgb resolved from the theme). */
  color: string;
}

/**
 * Lightweight area sparkline rendered as an inline SVG. Scales to the container
 * width via `preserveAspectRatio="none"`; renders an empty spacer when there is
 * no data so the metric row keeps a stable height.
 */
function Sparkline({ data, color }: SparklineProps) {
  if (!data.length) return <Box sx={{ height: 40 }} />;
  const max = Math.max(...data, 1);
  const step = 320 / Math.max(1, data.length - 1);
  const pts = data.map(
    (v, i) => `${(i * step).toFixed(1)},${(40 - (v / max) * 36).toFixed(1)}`,
  );
  const line = `M${pts.join(" L")}`;
  const area = `${line} L320,40 L0,40 Z`;
  return (
    <Box aria-hidden="true">
      <svg
        width="100%"
        height="40"
        viewBox="0 0 320 40"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="ovkpi-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.32" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ovkpi-grad)" />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

export default OverviewKpiHeader;
