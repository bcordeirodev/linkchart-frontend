"use client";
import { useTranslation } from "react-i18next";

import { dataVizPalette } from "@/lib/theme/dataViz";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { DeviceData } from "@/types";

import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../HorizontalBreakdownBars";

/** Props for the Devices card. */
export interface AudienceDevicesTabProps {
  /** Raw device breakdown entries (mobile / desktop / tablet). */
  deviceBreakdown: DeviceData[];
  /** Total clicks across all devices, used to compute each row's share. */
  totalClicks: number;
}

/**
 * Renders the "Aparelhos" (Devices) card for the Audience tab: a single
 * horizontal-bar breakdown of mobile / desktop / tablet share, with value
 * and percentage on every row.
 *
 * Replaces the previous pie chart + bar chart + ranked list + insight-chip
 * quadruplication of the same three numbers — this is the only
 * representation of device share in the tab now.
 */
export function AudienceDevicesTab({
  deviceBreakdown,
  totalClicks,
}: AudienceDevicesTabProps) {
  const { t } = useTranslation("analytics");

  const paletteTones = Object.values(dataVizPalette);
  const items: HorizontalBreakdownItem[] = deviceBreakdown.map(
    (device, index) => ({
      key: device.device,
      label: device.device,
      value: device.clicks,
      percentage: totalClicks > 0 ? (device.clicks / totalClicks) * 100 : 0,
      color: paletteTones[index % paletteTones.length],
    }),
  );

  return (
    <ChartCard
      title={t("audience.chart.deviceDistribution")}
      subtitle={t("audience.chart.deviceDistributionDesc")}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceDevicesTab;
