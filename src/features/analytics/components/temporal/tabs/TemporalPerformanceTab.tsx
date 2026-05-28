"use client";
import { Alert, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { AdvancedTemporalData, TemporalData } from "@/types";

import { PeakAnalysisCard } from "../PeakAnalysisCard";
import { TemporalTrendsChart } from "../TemporalTrendsChart";

/** Props for the Performance tab content. */
export interface TemporalPerformanceTabProps {
  /** Whether a valid peak analysis entry is present. */
  hasPeakAnalysis: boolean;
  /** Whether weekly or monthly trend data is available. */
  hasTrends: boolean;
  /** Full advanced temporal payload; charts read the relevant sub-keys. */
  advancedData?: AdvancedTemporalData;
  /** Whether viral rank data is available. */
  hasViralRank: boolean;
  /** Viral rank by day data. */
  viralRankByDay?: TemporalData["viral_rank_by_day"];
}

/**
 * Renders the Performance tab content for the TemporalChart.
 *
 * Shows the peak analysis card and trend charts when data is available,
 * or a friendly empty-state alert otherwise.
 * All data is received via props — no hooks.
 */
export function TemporalPerformanceTab({
  hasPeakAnalysis,
  hasTrends,
  advancedData,
  hasViralRank,
  viralRankByDay,
}: TemporalPerformanceTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Stack spacing={2}>
      {hasPeakAnalysis && advancedData?.peak_analysis ? (
        <PeakAnalysisCard
          peakAnalysis={advancedData.peak_analysis}
          viralRankByDay={viralRankByDay}
        />
      ) : null}
      {hasTrends && advancedData ? (
        <TemporalTrendsChart
          weeklyTrends={advancedData.weekly_trends || []}
          monthlyTrends={advancedData.monthly_trends || []}
        />
      ) : null}
      {!hasPeakAnalysis && !hasTrends && !hasViralRank ? (
        <Alert severity="info">
          <Typography variant="body2">{t("temporal.chart.noData")}</Typography>
        </Alert>
      ) : null}
    </Stack>
  );
}
