// src/features/analytics/components/geographic/GeographicFilterBar.tsx
"use client";

import { useTranslation } from "react-i18next";

import { TabFilterBar } from "@/shared/ui/base/TabFilterBar";

/** Props for the Geographic tab filter bar. */
interface GeographicFilterBarProps {
  continent: string | null;
  onContinentChange: (v: string | null) => void;
}

const CONTINENT_OPTIONS = [
  { code: null, key: "all" as const },
  { code: "NA", key: "NA" as const },
  { code: "EU", key: "EU" as const },
  { code: "AS", key: "AS" as const },
  { code: "AF", key: "AF" as const },
  { code: "OC", key: "OC" as const },
] as const;

/**
 * Filter bar for the Geographic analytics tab.
 *
 * Controls one dimension: `continent` — backend filter that limits data to
 * clicks from a specific continent. `null` means all continents.
 *
 * Delegates rendering to {@link TabFilterBar} in its `"filter"` (level-3)
 * grammar — trackless outlined segments with a primary border/tint on the
 * active one. Critical here: this row sits directly beside the level-2
 * heat-map/world sub-tabs, and in the tracked-pill styling both were two
 * adjacent, near-identical pill rows with nothing to say which one navigated
 * and which one filtered.
 *
 * Renders a clear-all (×) button when a continent is selected.
 */
export function GeographicFilterBar({
  continent,
  onContinentChange,
}: GeographicFilterBarProps) {
  const { t } = useTranslation("analytics");

  return (
    <TabFilterBar
      attached
      variant="filter"
      groups={[
        {
          label: t("filters.continent"),
          type: "single",
          items: CONTINENT_OPTIONS.map(({ code, key }) => ({
            value: String(code),
            label: t(`filters.continentOptions.${key}`),
            selected: continent === code,
            onSelect: () => onContinentChange(code),
          })),
        },
      ]}
      onClearAll={
        continent !== null ? () => onContinentChange(null) : undefined
      }
    />
  );
}

export default GeographicFilterBar;
