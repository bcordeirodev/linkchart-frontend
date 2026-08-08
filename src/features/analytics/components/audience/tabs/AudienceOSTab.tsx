"use client";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { OSData } from "@/types";

import { aggregateOSByFamily } from "../aggregateFamily";
import {
  HorizontalBreakdownBars,
  categoricalBreakdownColor,
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
  const theme = useTheme();

  const families = aggregateOSByFamily(
    operatingSystems,
    t("audience.extraCharts.others"),
  );
  const items: HorizontalBreakdownItem[] = families.map((family, index) => ({
    key: family.key,
    label: formatAnalyticsLabel(family.label),
    value: family.clicks,
    percentage: family.percentage,
    color: categoricalBreakdownColor(index, theme.palette.mode),
  }));

  return (
    <ChartCard
      title={t("audience.chart.osDistribution")}
      subtitle={t("audience.chart.tabDescriptions.systems")}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceOSTab;
