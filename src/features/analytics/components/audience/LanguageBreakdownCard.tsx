"use client";
import { Alert } from "@mui/material";
import { Info } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type { LanguageBreakdown } from "@/types/analytics/audience";

import { normaliseBreakdown } from "./normaliseBreakdown";

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
 * Resolves a human-readable language name for a base language code
 * (`"en"` → "English" / "inglês") in the UI locale. Falls back to the
 * uppercased code when `Intl.DisplayNames` cannot resolve it.
 *
 * @param code - ISO 639-1 base language code (e.g. `"pt"`).
 * @param locale - BCP 47 locale of the current UI language.
 */
function languageDisplayName(code: string, locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(code);
    if (name && name !== code) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch {
    // Unknown/invalid code — fall through to the raw code below.
  }
  return code.toUpperCase();
}

/**
 * Donut chart of visitor languages with regional variants grouped under
 * their base language (en-US + en-GB → English), using the Phase-1
 * pre-parsed `primary_language` column. Complements the per-variant
 * distribution chart above it in the Languages sub-tab — the card
 * description explains why totals may differ between the two.
 */
export function LanguageBreakdownCard({
  breakdown,
}: LanguageBreakdownCardProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

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
        type="donut"
        size="compact"
        {...formatPieChart(chartData, "name", "value", isDark)}
      />
    </ChartCard>
  );
}

export default LanguageBreakdownCard;
