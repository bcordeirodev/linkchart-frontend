"use client";
import { Globe } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { ContinentData } from "@/types/analytics/geographic";

import {
  categoricalBreakdownColor,
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../audience/HorizontalBreakdownBars";

/** Props for {@link ContinentBreakdown}. */
interface ContinentBreakdownProps {
  /** Continent-level click breakdown. */
  continents: ContinentData[];
  /** ISO 2-letter continent code that is currently active as a backend filter. When set, highlights the matching row. */
  activeContinentCode?: string | null;
  /**
   * Called with the clicked row's continent code (or `null` to clear) when
   * the user selects a continent. Rows render as static bars, matching every
   * other read-only breakdown, when this is omitted.
   */
  onContinentSelect?: (code: string | null) => void;
}

/**
 * Renders the "Continentes" card for the Geographic tab: a single
 * horizontal-bar breakdown of clicks by continent, replacing the previous
 * donut + legend pair (donut legends truncate long names — "América do
 * Norte" — and are one of three ways this same country/continent data used
 * to appear on this tab).
 *
 * Doubles as the continent filter: when `onContinentSelect` is provided,
 * clicking a row toggles the backend `continent` filter (clicking the
 * already-active row clears it) — the same interaction the previous
 * donut+legend implied via its `activeContinentCode` highlight but never
 * actually wired up to a click handler.
 */
export function ContinentBreakdown({
  continents,
  activeContinentCode,
  onContinentSelect,
}: ContinentBreakdownProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (!continents || continents.length === 0) {
    return (
      <ChartCard title={t("geographic.continents.title")}>
        <AnalyticsEmptyState
          icon={<Globe size={32} strokeWidth={1.5} />}
          title={t("geographic.continents.empty")}
          compact
        />
      </ChartCard>
    );
  }

  const items: HorizontalBreakdownItem[] = continents.map((c, index) => ({
    key: c.continent,
    label: tDynamic(t, `geographic.continents.${c.continent}`, {
      defaultValue: c.continent_name ?? c.continent,
    }),
    value: c.clicks,
    percentage: c.percentage ?? 0,
    // Categorical palette (blue/teal/violet/amber/slate), not the sequential
    // blue ramp — continents are true categories, not an intensity gradient,
    // and a mono-blue cycle made every row read as the same series (refinamento
    // visual 2026-08-08, §3.1).
    color: categoricalBreakdownColor(index, theme.palette.mode),
  }));

  /**
   * Toggles the continent filter: selecting the already-active continent
   * clears it back to "all", mirroring `GeographicFilterBar`'s clear-all (×)
   * behavior for the same `continent` state.
   */
  const handleItemClick = onContinentSelect
    ? (key: string) =>
        onContinentSelect(activeContinentCode === key ? null : key)
    : undefined;

  return (
    <ChartCard
      title={t("geographic.continents.title")}
      subtitle={t("geographic.continents.subtitle")}
    >
      <HorizontalBreakdownBars
        items={items}
        onItemClick={handleItemClick}
        selectedKey={activeContinentCode ?? null}
      />
    </ChartCard>
  );
}

export default ContinentBreakdown;
