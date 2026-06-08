// src/features/analytics/components/insights/InsightsFilterBar.tsx
"use client";

import { Stack, Switch, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { TabFilterBar } from "@/shared/ui/base/TabFilterBar";
import type { InsightPriority } from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Insights tab filter bar. */
interface InsightsFilterBarProps {
  priority: InsightPriority;
  insightCategories: string[];
  actionableOnly: boolean;
  onPriorityChange: (v: InsightPriority) => void;
  onCategoriesChange: (v: string[]) => void;
  onActionableOnlyChange: (v: boolean) => void;
}

const PRIORITY_OPTIONS: InsightPriority[] = ["all", "high", "medium", "low"];

const CATEGORY_OPTIONS = [
  "geographic",
  "temporal",
  "audience",
  "performance",
  "security",
  "retention",
  "engagement",
] as const;

/**
 * Filter bar for the Insights analytics tab.
 *
 * Controls three dimensions (all client-side post-filters):
 * - `priority`: "all" | "high" | "medium" — single-select
 * - `insightCategories`: multi-select array of type strings
 * - `actionableOnly`: boolean toggle rendered as a Switch inline with priority chips
 *
 * Delegates rendering to {@link TabFilterBar}. Provides a clear-all (×) button
 * when any filter differs from its default value.
 */
export function InsightsFilterBar({
  priority,
  insightCategories,
  actionableOnly,
  onPriorityChange,
  onCategoriesChange,
  onActionableOnlyChange,
}: InsightsFilterBarProps) {
  const { t } = useTranslation("analytics");

  /** Toggles a single category in/out of the selected array. */
  const toggleCategory = (cat: string) => {
    if (insightCategories.includes(cat)) {
      onCategoriesChange(insightCategories.filter((c) => c !== cat));
    } else {
      onCategoriesChange([...insightCategories, cat]);
    }
  };

  const hasActiveFilters =
    priority !== "all" || insightCategories.length > 0 || actionableOnly;

  const handleClearAll = () => {
    onPriorityChange("all");
    onCategoriesChange([]);
    onActionableOnlyChange(false);
  };

  return (
    <TabFilterBar
      attached
      groups={[
        {
          label: t("filters.priority"),
          type: "single",
          items: PRIORITY_OPTIONS.map((opt) => ({
            value: opt,
            label: t(`filters.priorityOptions.${opt}`),
            selected: priority === opt,
            onSelect: () => onPriorityChange(opt),
          })),
          addon: (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ ml: 1 }}
            >
              <Switch
                size="small"
                checked={actionableOnly}
                onChange={(e) => onActionableOnlyChange(e.target.checked)}
                inputProps={{ "aria-label": t("filters.actionableOnly") }}
              />
              <Typography variant="caption" color="text.secondary">
                {t("filters.actionableOnly")}
              </Typography>
            </Stack>
          ),
        },
        {
          label: t("filters.insightType"),
          type: "multi",
          items: CATEGORY_OPTIONS.map((cat) => ({
            value: cat,
            label: t(`filters.insightTypeOptions.${cat}`),
            selected: insightCategories.includes(cat),
            onSelect: () => toggleCategory(cat),
          })),
        },
      ]}
      onClearAll={hasActiveFilters ? handleClearAll : undefined}
    />
  );
}

export default InsightsFilterBar;
