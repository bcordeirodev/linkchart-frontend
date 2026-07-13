"use client";
import { Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { chartByType, getChartColor } from "@/lib/theme/colors";
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
 * Maps a device-type label to its semantic palette color (mirrors the
 * mapping already used by `DeviceBreakdownChart`), falling back to the
 * generic chart palette for unrecognised device names.
 *
 * @param device - Raw device label (e.g. `"Mobile"`).
 * @param fallbackIndex - Palette index used when the label isn't recognised.
 */
function resolveDeviceColor(device: string, fallbackIndex: number): string {
  const key = device?.toLowerCase().trim() as keyof typeof chartByType.devices;
  return chartByType.devices[key] ?? getChartColor(fallbackIndex);
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

  const items: HorizontalBreakdownItem[] = deviceBreakdown.map(
    (device, index) => ({
      key: device.device,
      label: device.device,
      value: device.clicks,
      percentage: totalClicks > 0 ? (device.clicks / totalClicks) * 100 : 0,
      color: resolveDeviceColor(device.device, index),
    }),
  );

  return (
    <ChartCard
      title={t("audience.chart.deviceDistribution")}
      subtitle={t("audience.chart.deviceDistributionDesc")}
      icon={<Smartphone {...ICON_MD} />}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceDevicesTab;
