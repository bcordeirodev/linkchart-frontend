"use client";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AnalyticsEmptyState } from "@/shared/ui/base";

import type { AdvancedTemporalData } from "@/types";

import { DailyTimelineChart } from "../DailyTimelineChart";
import { HourDayHeatmapChart } from "../HourDayHeatmapChart";

/** Props for the Timeline tab content. */
export interface TemporalTimelineTabProps {
  /** Whether a valid daily timeline dataset is available. */
  hasDailyTimeline: boolean;
  /** Whether a valid heatmap dataset is available. */
  hasHeatmap: boolean;
  /** Full advanced temporal payload; charts read the relevant sub-keys. */
  advancedData?: AdvancedTemporalData;
}

/**
 * Renders the Timeline tab content for the TemporalChart.
 *
 * Shows the daily timeline and hour-of-day heatmap charts when data is
 * available, or a friendly empty-state alert otherwise.
 * All data is received via props — no hooks.
 */
export function TemporalTimelineTab({
  hasDailyTimeline,
  hasHeatmap,
  advancedData,
}: TemporalTimelineTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Stack spacing={2}>
      {hasDailyTimeline && advancedData?.daily_timeline ? (
        <DailyTimelineChart data={advancedData.daily_timeline} />
      ) : null}
      {hasHeatmap && advancedData?.heatmap_data ? (
        <HourDayHeatmapChart data={advancedData.heatmap_data} />
      ) : null}
      {!hasDailyTimeline && !hasHeatmap ? (
        <AnalyticsEmptyState title={t("temporal.chart.noData")} />
      ) : null}
    </Stack>
  );
}
