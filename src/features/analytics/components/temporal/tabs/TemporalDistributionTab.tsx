"use client";
import { Alert, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { AdvancedTemporalData } from "@/types";

import { TimezoneDistributionChart } from "../TimezoneDistributionChart";
import { DeviceByPeriodChart } from "../DeviceByPeriodChart";

/** Props for the Distribution tab content. */
export interface TemporalDistributionTabProps {
  /** Whether timezone analysis data is available. */
  hasTimezones: boolean;
  /** Whether device-by-period data is available. */
  hasDeviceByPeriod: boolean;
  /** Full advanced temporal payload; charts read the relevant sub-keys. */
  advancedData?: AdvancedTemporalData;
}

/**
 * Renders the Distribution tab content for the TemporalChart.
 *
 * Shows the timezone distribution and device-by-period charts when data
 * is available, or a friendly empty-state alert otherwise.
 * All data is received via props — no hooks.
 */
export function TemporalDistributionTab({
  hasTimezones,
  hasDeviceByPeriod,
  advancedData,
}: TemporalDistributionTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Stack spacing={4}>
      {hasTimezones && advancedData?.timezone_analysis ? (
        <TimezoneDistributionChart
          timezoneAnalysis={advancedData.timezone_analysis}
        />
      ) : null}
      {hasDeviceByPeriod && advancedData?.device_by_period ? (
        <DeviceByPeriodChart data={advancedData.device_by_period} />
      ) : null}
      {!hasTimezones && !hasDeviceByPeriod ? (
        <Alert severity="info">
          <Typography variant="body2">{t("temporal.chart.noData")}</Typography>
        </Alert>
      ) : null}
    </Stack>
  );
}
