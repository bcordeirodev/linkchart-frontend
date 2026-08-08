"use client";
import { Alert } from "@mui/material";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type { LanguageBreakdown } from "@/types/analytics/audience";

import { languageDisplayName } from "./aggregateFamily";
import { normaliseBreakdown } from "./normaliseBreakdown";

/**
 * Height cap for the single-row stacked bar below — a horizontal stacked
 * bar is one line of segments plus its legend, not a chart that needs
 * hundreds of pixels of vertical room (spec: "barra horizontal empilhada
 * única … altura do chart ≤ 120px").
 */
const STACKED_BAR_HEIGHT = 110;

/** Entry in the language breakdown array returned by the audience API. */
interface LanguageEntry {
  language: string;
  region: string | null;
  clicks: number;
  percentage: number;
}

interface LanguageBreakdownCardProps {
  /**
   * Language distribution data from `audience.language_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  breakdown: LanguageBreakdown | LanguageEntry[];
}

/**
 * Horizontal stacked bar of visitor languages with regional variants grouped
 * under their base language (en-US + en-GB → English), using the Phase-1
 * pre-parsed `primary_language` column. Complements the per-variant
 * distribution chart above it in the Languages sub-tab — the card
 * description explains why totals may differ between the two.
 */
export function LanguageBreakdownCard({
  breakdown,
}: LanguageBreakdownCardProps) {
  const { t, i18n } = useTranslation("analytics");

  const lang = normaliseBreakdown<LanguageEntry>(breakdown);
  if (lang.data.length === 0) return null;

  // Group regional variants under their base language code.
  const byBaseLanguage = new Map<string, number>();
  for (const entry of lang.data) {
    const base = entry.language.toLowerCase();
    byBaseLanguage.set(base, (byBaseLanguage.get(base) ?? 0) + entry.clicks);
  }
  const sorted = [...byBaseLanguage.entries()].sort((a, b) => b[1] - a[1]);

  const top7 = sorted.slice(0, 7);
  const othersClicks = sorted
    .slice(7)
    .reduce((sum, [, clicks]) => sum + clicks, 0);
  const chartData = [
    ...top7.map(([code, clicks]) => ({
      name: languageDisplayName(code, i18n.language),
      value: clicks,
    })),
    ...(othersClicks > 0
      ? [{ name: t("audience.extraCharts.others"), value: othersClicks }]
      : []),
  ];

  return (
    <ChartCard
      title={t("audience.extraCharts.language")}
      subtitle={t("audience.extraCharts.languageDescription")}
    >
      {!lang.phaseAvailable && (
        <Alert
          severity="info"
          icon={<Info {...ICON_MD} />}
          sx={{ mb: 1.5, borderRadius: `${radiusTokens.md}px` }}
        >
          {t("audience.phaseData.unavailable")}
        </Alert>
      )}
      <ApexChartWrapper
        type="bar"
        height={STACKED_BAR_HEIGHT}
        {...formatHorizontalStackedBar(chartData, "name", "value")}
      />
    </ChartCard>
  );
}

export default LanguageBreakdownCard;
