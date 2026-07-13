"use client";
import { Monitor } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import { getChartColor } from "@/lib/theme/colors";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { OSData } from "@/types";

import { aggregateOSByFamily } from "../aggregateFamily";
import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../HorizontalBreakdownBars";

/** Props for the Operating Systems card. */
export interface AudienceOSTabProps {
  /** Raw per-version OS breakdown from the audience API. */
  operatingSystems: OSData[];
}

/**
 * Renders the "Sistema" (Operating System) card: OS entries aggregated by
 * family — "Android 10" and "Android 11" fold into a single "Android" row —
 * as one horizontal-bar list, for the same reason browsers are aggregated.
 */
export function AudienceOSTab({ operatingSystems }: AudienceOSTabProps) {
  const { t } = useTranslation("analytics");

  const families = aggregateOSByFamily(
    operatingSystems,
    t("audience.extraCharts.others"),
  );
  const items: HorizontalBreakdownItem[] = families.map((family, index) => ({
    key: family.key,
    label: family.label,
    value: family.clicks,
    percentage: family.percentage,
    color: getChartColor(index),
  }));

  return (
    <ChartCard
      title={t("audience.chart.osDistribution")}
      subtitle={t("audience.chart.tabDescriptions.systems")}
      icon={<Monitor {...ICON_MD} />}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceOSTab;
