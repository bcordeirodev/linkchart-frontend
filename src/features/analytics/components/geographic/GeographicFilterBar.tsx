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
 * Delegates rendering to {@link TabFilterBar} for consistent styling across tabs.
 * Renders a clear-all (×) button when a continent is selected.
 */
export function GeographicFilterBar({
  continent,
  onContinentChange,
}: GeographicFilterBarProps) {
  const { t } = useTranslation("analytics");

  return (
    <TabFilterBar
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
