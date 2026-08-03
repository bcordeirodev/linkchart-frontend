"use client";
import { useTranslation } from "react-i18next";

import { dataVizPalette } from "@/lib/theme/dataViz";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { BrowserData } from "@/types";

import { aggregateBrowsersByFamily } from "../aggregateFamily";
import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../HorizontalBreakdownBars";

/** Props for the Browsers card. */
export interface AudienceBrowsersTabProps {
  /** Raw per-version browser breakdown from the audience API. */
  browsers: BrowserData[];
}

/**
 * Renders the "Navegador" (Browser) card: browser entries aggregated by
 * family — "Chrome 91.0" and "Chrome 90.0" fold into a single "Chrome" row —
 * as one horizontal-bar list. End users care about the browser, not the
 * point release, so the version dimension is intentionally dropped here.
 */
export function AudienceBrowsersTab({ browsers }: AudienceBrowsersTabProps) {
  const { t } = useTranslation("analytics");

  const paletteTones = Object.values(dataVizPalette);
  const families = aggregateBrowsersByFamily(
    browsers,
    t("audience.extraCharts.others"),
  );
  const items: HorizontalBreakdownItem[] = families.map((family, index) => ({
    key: family.key,
    label: family.label,
    value: family.clicks,
    percentage: family.percentage,
    color: paletteTones[index % paletteTones.length],
  }));

  return (
    <ChartCard
      title={t("audience.chart.browserMarketShare")}
      subtitle={t("audience.chart.tabDescriptions.browsers")}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default AudienceBrowsersTab;
