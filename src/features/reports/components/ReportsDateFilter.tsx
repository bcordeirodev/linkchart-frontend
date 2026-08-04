"use client";
/**
 * Period filter for the `/reports` page — 7/30/90-day presets plus a
 * "custom" preset that reveals two native date inputs. Native
 * `<input type="date">` (via `TextField`) on purpose: the project has no
 * global MUI X `LocalizationProvider`, and the native control gives the
 * best mobile pickers for free.
 */

import { Stack, TextField, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { EnhancedPaper, getCardSurfaceSx } from "@/shared/ui/base";
import { TabFilterBar } from "@/shared/ui/base/TabFilterBar";

import type {
  ReportsCustomRange,
  ReportsPeriod,
} from "@/features/reports/types";

/** Props accepted by {@link ReportsDateFilter}. */
interface ReportsDateFilterProps {
  /** Currently active period preset. */
  period: ReportsPeriod;
  /** Called when the user picks a different preset. */
  onPeriodChange: (period: ReportsPeriod) => void;
  /** Current custom range (only rendered/used when `period === "custom"`). */
  customRange: ReportsCustomRange;
  /** Called on every change of either bound of the custom range. */
  onCustomRangeChange: (range: ReportsCustomRange) => void;
}

/** Ordered list of the presets this filter offers. */
const PERIODS: readonly ReportsPeriod[] = ["7d", "30d", "90d", "custom"];

/** Maps each preset to its full i18n label key. */
const PERIOD_LABEL_KEY: Record<
  ReportsPeriod,
  "filters.last7" | "filters.last30" | "filters.last90" | "filters.custom"
> = {
  "7d": "filters.last7",
  "30d": "filters.last30",
  "90d": "filters.last90",
  custom: "filters.custom",
};

/**
 * Renders the preset chip row (via the shared `TabFilterBar` in `attached`
 * mode) and, when the custom preset is active, a from/to date-input pair.
 * All state is owned by `ReportsPage` and passed down.
 *
 * Wrapped in the same level-0 card as `/links/analytics/[id]`'s period strip
 * (`EnhancedPaper` + {@link getCardSurfaceSx}): both screens open with a
 * period control, and before this they were the same control in two different
 * containers — a defined card there, a bare row floating on the page
 * background here. The card is what marks "global scope for everything below",
 * which is precisely this row's job on both screens.
 */
export function ReportsDateFilter({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
}: ReportsDateFilterProps) {
  const { t } = useTranslation("reports");
  const theme = useTheme();

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ p: 2, ...getCardSurfaceSx(theme) }}
    >
      <Stack spacing={1.5}>
        <TabFilterBar
          attached
          // The card supplies the spacing; the bar's own bottom gutter would
          // only unbalance it against the card's padding.
          sx={{ mb: 0 }}
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
        {period === "custom" ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              type="date"
              size="small"
              label={t("filters.from")}
              value={customRange.from ?? ""}
              onChange={(e) =>
                onCustomRangeChange({
                  ...customRange,
                  from: e.target.value || null,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: customRange.to ? { max: customRange.to } : undefined,
              }}
            />
            <TextField
              type="date"
              size="small"
              label={t("filters.to")}
              value={customRange.to ?? ""}
              onChange={(e) =>
                onCustomRangeChange({
                  ...customRange,
                  to: e.target.value || null,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: customRange.from
                  ? { min: customRange.from }
                  : undefined,
              }}
            />
          </Stack>
        ) : null}
      </Stack>
    </EnhancedPaper>
  );
}

export default ReportsDateFilter;
