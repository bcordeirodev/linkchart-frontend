"use client";
import { Alert, Box, Grid, Chip, Stack, Typography } from "@mui/material";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type {
  DailyTimeline,
  DailyTimelineEntry,
} from "@/types/analytics/temporal";

/**
 * Props accepted by {@link DailyTimelineChart}.
 *
 * Accepts either a legacy flat array (backward compat) or the new
 * {@link DailyTimeline} object that carries cap metadata.
 */
interface DailyTimelineChartProps {
  /** Timeline data. May be a legacy `DailyTimelineEntry[]` or the new `DailyTimeline` object. */
  data: DailyTimelineEntry[] | DailyTimeline;
}

/**
 * Normalises the `data` prop into a flat entry array plus cap metadata.
 * Supports both the legacy array shape and the new `DailyTimeline` object.
 */
function normalise(data: DailyTimelineEntry[] | DailyTimeline): {
  entries: DailyTimelineEntry[];
  capped: boolean;
  earliestAvailableAt: string | null;
} {
  if (Array.isArray(data)) {
    return { entries: data, capped: false, earliestAvailableAt: null };
  }
  return {
    entries: data.data,
    capped: data.capped,
    earliestAvailableAt: data.earliest_available_at,
  };
}

/**
 * Area charts showing daily click and unique-visitor trends.
 *
 * When the backend applied a 90-day cap (`capped === true`), an informational
 * MUI `Alert` is rendered above the charts directing users to the date filter.
 */
export function DailyTimelineChart({ data }: DailyTimelineChartProps) {
  const { t, i18n } = useTranslation("analytics");

  const { entries, capped } = normalise(data);

  if (!entries || entries.length === 0) {
    return null;
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const clickSeries = sorted.map((d) => ({ x: d.date, y: d.clicks }));
  const uniqueSeries = sorted.map((d) => ({ x: d.date, y: d.unique_visitors }));

  const totalClicks = sorted.reduce((s, d) => s + d.clicks, 0);
  const avgPerDay =
    sorted.length > 0 ? Math.round(totalClicks / sorted.length) : 0;
  const maxDay = sorted.reduce(
    (best, d) => (d.clicks > best.clicks ? d : best),
    sorted[0]!,
  );

  const recent = sorted.slice(-7).reduce((s, d) => s + d.clicks, 0);
  const previous = sorted.slice(-14, -7).reduce((s, d) => s + d.clicks, 0);
  const trend =
    previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;

  // Structural options only — colors, grid, fonts and tooltip theme all come
  // from `ApexChartWrapper`'s shared base theme; only orientation-neutral
  // behavior (datetime axis, date formatting) is genuinely per-chart here.
  const commonOptions = {
    xaxis: {
      type: "datetime" as const,
      labels: { datetimeUTC: false },
    },
    yaxis: {
      labels: { formatter: (v: number) => v.toLocaleString() },
    },
    tooltip: { x: { format: "dd/MM/yyyy" } },
    markers: { size: 0, hover: { size: 5 } },
  };

  const formattedPeakDate = maxDay
    ? new Date(maxDay.date + "T12:00:00").toLocaleDateString(i18n.language)
    : "";

  return (
    <Box>
      {capped && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t("temporal.dailyTimeline.cappedWarning")}
        </Alert>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
        <Chip
          label={t("temporal.timeline.totalChip", {
            total: totalClicks.toLocaleString(),
            days: sorted.length,
          })}
          color="primary"
          size="small"
        />
        <Chip
          label={t("temporal.timeline.avgPerDay", { avg: avgPerDay })}
          color="info"
          size="small"
        />
        {maxDay && (
          <Chip
            label={t("temporal.timeline.peakOn", {
              clicks: maxDay.clicks,
              date: formattedPeakDate,
            })}
            color="secondary"
            size="small"
          />
        )}
        <Chip
          icon={
            trend > 0 ? (
              <TrendingUp size={14} />
            ) : trend < 0 ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )
          }
          label={t("temporal.timeline.vsLastWeek", {
            trend: `${trend >= 0 ? "+" : ""}${trend}`,
          })}
          color={trend > 0 ? "success" : trend < 0 ? "error" : "default"}
          size="small"
        />
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 2 }}
      >
        {t("temporal.timeline.hint")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title={t("temporal.timeline.clicksTitle")}
            subtitle={t("temporal.timeline.clicksSubtitle", {
              days: sorted.length,
            })}
          >
            <ApexChartWrapper
              type="area"
              size="standard"
              series={[
                { name: t("temporal.timeline.clicks"), data: clickSeries },
              ]}
              options={commonOptions}
            />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title={t("temporal.timeline.uniqueTitle")}
            subtitle={t("temporal.timeline.uniqueSubtitle")}
          >
            <ApexChartWrapper
              type="area"
              size="standard"
              series={[
                { name: t("temporal.timeline.unique"), data: uniqueSeries },
              ]}
              options={commonOptions}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DailyTimelineChart;
