"use client";

import { useTranslation } from "react-i18next";

import { TabFilterBar } from "@/shared/ui/base/TabFilterBar";

import type { ReportsPeriod } from "@/features/reports/types";

/** Props accepted by {@link ReportsDateFilter}. */
interface ReportsDateFilterProps {
  /** Currently active period preset. */
  period: ReportsPeriod;
  /** Called when the user picks a different preset. */
  onPeriodChange: (period: ReportsPeriod) => void;
}

/** Ordered list of the presets this filter offers. */
const PERIODS: readonly ReportsPeriod[] = ["7d", "30d", "90d"];

/** Maps each preset to its full i18n label key. */
const PERIOD_LABEL_KEY: Record<
  ReportsPeriod,
  "filters.last7" | "filters.last30" | "filters.last90"
> = {
  "7d": "filters.last7",
  "30d": "filters.last30",
  "90d": "filters.last90",
};

/**
 * Period-preset filter for the `/reports` page — last 7/30/90 days.
 *
 * Renders as a single-select chip row via the shared `TabFilterBar` (in
 * `attached` mode, which skips the "Filtros" header block that belongs to the
 * per-link analytics tabs — this page only ever has one filter group).
 * State is owned by `ReportsPage` and passed down: every hook on the page
 * derives its query from the resolved `dateFrom`/`dateTo` for `period`.
 */
export function ReportsDateFilter({
  period,
  onPeriodChange,
}: ReportsDateFilterProps) {
  const { t } = useTranslation("reports");

  return (
    <TabFilterBar
      attached
      groups={[
        {
          label: t("filters.period"),
          type: "single",
          items: PERIODS.map((p) => ({
            value: p,
            label: t(PERIOD_LABEL_KEY[p]),
            selected: period === p,
            onSelect: () => onPeriodChange(p),
          })),
        },
      ]}
    />
  );
}

export default ReportsDateFilter;
