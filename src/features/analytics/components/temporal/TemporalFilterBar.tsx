// src/features/analytics/components/temporal/TemporalFilterBar.tsx
"use client";

import { useTranslation } from "react-i18next";

import { TabFilterBar } from "@/shared/ui/base/TabFilterBar";
import type { Segment } from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Temporal tab filter bar. */
interface TemporalFilterBarProps {
  segment: Segment;
  onSegmentChange: (v: Segment) => void;
}

const SEGMENT_OPTIONS: Segment[] = ["all", "weekday", "weekend", "business"];

/**
 * Filter bar for the Temporal analytics tab.
 *
 * Controls the `segment` dimension — which click subset to include in charts:
 * - `weekday`  → Mon–Fri only (`is_weekend = false`)
 * - `weekend`  → Sat–Sun only (`is_weekend = true`)
 * - `business` → business-hours clicks only (`is_business_hours = true`)
 *
 * Delegates rendering to {@link TabFilterBar} for consistent styling across tabs.
 */
export function TemporalFilterBar({
  segment,
  onSegmentChange,
}: TemporalFilterBarProps) {
  const { t } = useTranslation("analytics");

  return (
    <TabFilterBar
      groups={[
        {
          label: t("filters.segment"),
          type: "single",
          items: SEGMENT_OPTIONS.map((opt) => ({
            value: opt,
            label: t(`filters.segmentOptions.${opt}`),
            selected: segment === opt,
            onSelect: () => onSegmentChange(opt),
          })),
        },
      ]}
    />
  );
}

export default TemporalFilterBar;
