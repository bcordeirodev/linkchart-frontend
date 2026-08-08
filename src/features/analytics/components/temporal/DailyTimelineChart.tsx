"use client";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { resolveCurve } from "@/lib/theme/apexBaseTheme";
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
  const theme = useTheme();

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

  // Structural options only — colors, grid, fonts, tooltip theme and the
  // integer y-axis formatter all come from `ApexChartWrapper`'s shared base
  // theme; only orientation-neutral behavior (datetime axis, date formatting,
  // curve honesty for sparse series) is genuinely per-chart here.
  const commonOptions = {
    xaxis: {
      type: "datetime" as const,
      labels: { datetimeUTC: false },
    },
    stroke: { curve: resolveCurve(sorted.length) },
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

      {/* Summary of the timeline as plain data, not controls: this used to be
          a row of pill `Chip`s, which reads as buttons the user could press.
          A dot-separated `body2` line (no border, no fill) keeps the same
          four facts legible while making clear they are read-only. */}
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        alignItems="center"
        sx={{ mb: 2, rowGap: 0.5 }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("temporal.timeline.totalChip", {
            total: totalClicks.toLocaleString(),
            days: sorted.length,
          })}
        </Typography>
        <Typography variant="body2" color="text.disabled" aria-hidden="true">
          ·
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("temporal.timeline.avgPerDay", { avg: avgPerDay })}
        </Typography>
        {maxDay && (
          <>
            <Typography
              variant="body2"
              color="text.disabled"
              aria-hidden="true"
            >
              ·
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("temporal.timeline.peakOn", {
                clicks: maxDay.clicks,
                date: formattedPeakDate,
              })}
            </Typography>
          </>
        )}
        <Typography variant="body2" color="text.disabled" aria-hidden="true">
          ·
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {trend > 0 ? (
            <TrendingUp size={14} color={theme.palette.success.main} />
          ) : trend < 0 ? (
            <TrendingDown size={14} color={theme.palette.error.main} />
          ) : (
            <Minus size={14} color={theme.palette.text.secondary} />
          )}
          <Typography
            variant="body2"
            sx={{
              color:
                trend > 0
                  ? "success.main"
                  : trend < 0
                    ? "error.main"
                    : "text.secondary",
            }}
          >
            {t("temporal.timeline.vsLastWeek", {
              trend: `${trend >= 0 ? "+" : ""}${trend}`,
            })}
          </Typography>
        </Stack>
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
