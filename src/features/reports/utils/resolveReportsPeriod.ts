import { format, startOfDay, subDays } from "date-fns";

import type {
  ReportsCustomRange,
  ReportsFilters,
  ReportsPeriod,
} from "@/features/reports/types";

/** Formats a `Date` as the `yyyy-MM-dd HH:mm:ss` string the backend filters expect. */
const fmtDt = (d: Date) => format(d, "yyyy-MM-dd HH:mm:ss");

/**
 * Resolves a {@link ReportsPeriod} preset into concrete `dateFrom`/`dateTo`
 * datetime strings relative to now.
 *
 * `"custom"` uses the user-picked {@link ReportsCustomRange} (whole days:
 * `from 00:00:00` → `to 23:59:59`); while the range is incomplete it falls
 * back to the 30-day default so the page never fires an unbounded query.
 *
 * @param period - one of `"7d"`, `"30d"`, `"90d"`, `"custom"`.
 * @param customRange - the picked range, only read when `period === "custom"`.
 * @returns the `dateFrom`/`dateTo` pair of {@link ReportsFilters}.
 */
export function resolveReportsPeriod(
  period: ReportsPeriod,
  customRange?: ReportsCustomRange,
): Pick<ReportsFilters, "dateFrom" | "dateTo"> {
  if (period === "custom" && customRange?.from && customRange?.to) {
    return {
      dateFrom: `${customRange.from} 00:00:00`,
      dateTo: `${customRange.to} 23:59:59`,
    };
  }

  const now = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;

  return {
    dateFrom: fmtDt(startOfDay(subDays(now, days))),
    dateTo: fmtDt(now),
  };
}
