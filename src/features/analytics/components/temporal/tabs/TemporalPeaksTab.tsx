"use client";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AnalyticsEmptyState } from "@/shared/ui/base";

import type { AdvancedTemporalData, TemporalData } from "@/types";

import { ClickVelocityChart } from "../ClickVelocityChart";
import { DeviceByPeriodChart } from "../DeviceByPeriodChart";
import { HolidayImpactCard } from "../HolidayImpactCard";
import { PeakAnalysisCard } from "../PeakAnalysisCard";
import { TemporalTrendsChart } from "../TemporalTrendsChart";
import { TimezoneDistributionChart } from "../TimezoneDistributionChart";

/** Props for the "Picos e tendências" sub-tab content. */
export interface TemporalPeaksTabProps {
  /** Whether a valid peak analysis entry is present. */
  hasPeakAnalysis: boolean;
  /** Whether weekly or monthly trend data is available. */
  hasTrends: boolean;
  /** Whether viral rank data is available. */
  hasViralRank: boolean;
  /** Whether timezone analysis data is available. */
  hasTimezones: boolean;
  /** Whether device-by-period data is available. */
  hasDeviceByPeriod: boolean;
  /** Full advanced temporal payload; charts read the relevant sub-keys. */
  advancedData?: AdvancedTemporalData;
  /** Viral rank by day, rendered inside the peak analysis card. */
  viralRankByDay?: TemporalData["viral_rank_by_day"];
  /** Holiday impact analysis (Phase 2). */
  holidayImpact?: TemporalData["holiday_impact"];
  /** Click velocity distribution (time between consecutive clicks). */
  clickVelocity?: TemporalData["click_velocity"];
}

/**
 * "Picos e tendências" — the merged content of two former sub-tabs.
 *
 * The sub-tab called "Performance" was never about performance: it held viral
 * rank and engagement peaks. "Distribuição" was a bag of leftovers (timezone,
 * device-by-period, holidays, click velocity). Neither was a question a reader
 * would ask, and both answered the same one: *when does this link spike, and
 * where is it heading?* Merged, they are what they always were.
 *
 * Order matters: peaks and trends lead, because that is the question. The
 * per-dimension cuts follow, because they qualify the answer.
 *
 * `SeasonalDistributionChart` is deliberately absent — on any short period it
 * rendered a single 100% bar ("Primavera — 1.236 (100%)"), which tells the
 * reader nothing. It was deleted, not moved.
 *
 * All data arrives via props — no hooks.
 */
export function TemporalPeaksTab({
  hasPeakAnalysis,
  hasTrends,
  hasViralRank,
  hasTimezones,
  hasDeviceByPeriod,
  advancedData,
  viralRankByDay,
  holidayImpact,
  clickVelocity,
}: TemporalPeaksTabProps) {
  const { t } = useTranslation("analytics");

  const hasHolidays = (holidayImpact?.top_holidays?.length ?? 0) > 0;
  const hasVelocity = !!clickVelocity;
  const hasAny =
    hasPeakAnalysis ||
    hasTrends ||
    hasViralRank ||
    hasTimezones ||
    hasDeviceByPeriod ||
    hasHolidays ||
    hasVelocity;

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

      {hasVelocity && clickVelocity ? (
        <ClickVelocityChart data={clickVelocity} />
      ) : null}

      {hasTimezones && advancedData?.timezone_analysis ? (
        <TimezoneDistributionChart
          timezoneAnalysis={advancedData.timezone_analysis}
        />
      ) : null}

      {hasDeviceByPeriod && advancedData?.device_by_period ? (
        <DeviceByPeriodChart data={advancedData.device_by_period} />
      ) : null}

      {hasHolidays ? <HolidayImpactCard data={holidayImpact} /> : null}

      {!hasAny ? (
        <AnalyticsEmptyState title={t("temporal.chart.noData")} />
      ) : null}
    </Stack>
  );
}

export default TemporalPeaksTab;
