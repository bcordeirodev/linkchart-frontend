"use client";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { AdvancedTemporalData, TemporalData } from "@/types";

import { TimezoneDistributionChart } from "../TimezoneDistributionChart";
import { DeviceByPeriodChart } from "../DeviceByPeriodChart";
import { HolidayImpactCard } from "../HolidayImpactCard";
import { SeasonalDistributionChart } from "../SeasonalDistributionChart";
import { ClickVelocityChart } from "../ClickVelocityChart";

/** Props for the Distribution tab content. */
export interface TemporalDistributionTabProps {
  /** Whether timezone analysis data is available. */
  hasTimezones: boolean;
  /** Whether device-by-period data is available. */
  hasDeviceByPeriod: boolean;
  /** Full advanced temporal payload; charts read the relevant sub-keys. */
  advancedData?: AdvancedTemporalData;
  /** Holiday impact analysis (Phase 2). */
  holidayImpact?: TemporalData["holiday_impact"];
  /** Seasonal click distribution (Phase 2). */
  seasonalDistribution?: TemporalData["seasonal_distribution"];
  /** Click velocity distribution (time between consecutive clicks). */
  clickVelocity?: TemporalData["click_velocity"];
}

/**
 * Renders the Distribution tab content for the TemporalChart.
 *
 * Groups every distribution-shaped chart of the temporal domain: timezone,
 * device-by-period, holiday impact, seasonal split and click velocity.
 * Shows a friendly empty-state alert when no dataset is available.
 * All data is received via props — no hooks.
 */
export function TemporalDistributionTab({
  hasTimezones,
  hasDeviceByPeriod,
  advancedData,
  holidayImpact,
  seasonalDistribution,
  clickVelocity,
}: TemporalDistributionTabProps) {
  const { t } = useTranslation("analytics");

  const hasHolidays = (holidayImpact?.top_holidays?.length ?? 0) > 0;
  const hasSeasons = (seasonalDistribution?.length ?? 0) > 0;
  const hasVelocity = !!clickVelocity;
  const hasAny =
    hasTimezones ||
    hasDeviceByPeriod ||
    hasHolidays ||
    hasSeasons ||
    hasVelocity;

  return (
    <Stack spacing={2}>
      {hasTimezones && advancedData?.timezone_analysis ? (
        <TimezoneDistributionChart
          timezoneAnalysis={advancedData.timezone_analysis}
        />
      ) : null}
      {hasDeviceByPeriod && advancedData?.device_by_period ? (
        <DeviceByPeriodChart data={advancedData.device_by_period} />
      ) : null}
      {hasHolidays || hasSeasons ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: hasHolidays && hasSeasons ? "1fr 1fr" : "1fr",
            },
            gap: 2,
          }}
        >
          {hasHolidays ? <HolidayImpactCard data={holidayImpact} /> : null}
          {hasSeasons ? (
            <SeasonalDistributionChart data={seasonalDistribution} />
          ) : null}
        </Box>
      ) : null}
      {hasVelocity && clickVelocity ? (
        <ClickVelocityChart data={clickVelocity} />
      ) : null}
      {!hasAny ? (
        <Alert severity="info">
          <Typography variant="body2">{t("temporal.chart.noData")}</Typography>
        </Alert>
      ) : null}
    </Stack>
  );
}
