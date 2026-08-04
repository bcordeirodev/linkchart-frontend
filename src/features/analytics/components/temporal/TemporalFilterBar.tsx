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
 * Delegates rendering to {@link TabFilterBar} in its `"filter"` (level-3)
 * grammar: trackless outlined segments, active one marked by a primary border
 * and tint. That is deliberately *not* the tracked-pill look of the level-0
 * period strip or the level-2 sub-tabs — this row narrows the data, it does
 * not navigate, and before the three grammars were split apart a user reading
 * down the Momento tab met three consecutive pill rows that all looked like
 * navigation.
 *
 * Stays above the metric row because `segment` is sent to the backend query:
 * it scopes the whole tab, KPIs included, not just the charts below it.
 */
export function TemporalFilterBar({
  segment,
  onSegmentChange,
}: TemporalFilterBarProps) {
  const { t } = useTranslation("analytics");

  return (
    <TabFilterBar
      attached
      variant="filter"
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
