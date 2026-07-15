import { format, startOfDay, subDays } from "date-fns";

import type { ReportsFilters, ReportsPeriod } from "@/features/reports/types";

/** Formats a `Date` as the `yyyy-MM-dd HH:mm:ss` string the backend filters expect. */
const fmtDt = (d: Date) => format(d, "yyyy-MM-dd HH:mm:ss");

/**
 * Resolves a {@link ReportsPeriod} preset into concrete `dateFrom`/`dateTo`
 * datetime strings relative to now.
 *
 * Mirrors `resolveDates` in `@/features/links/hooks/useAnalyticsFilters`, but
 * scoped to the 3 presets the Reports page offers — `dateFrom` is always the
 * start of the day N days ago, `dateTo` is the current instant.
 *
 * @param period - one of `"7d"`, `"30d"`, `"90d"`.
 * @returns the `dateFrom`/`dateTo` pair of {@link ReportsFilters}.
 */
export function resolveReportsPeriod(
  period: ReportsPeriod,
): Pick<ReportsFilters, "dateFrom" | "dateTo"> {
  const now = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  return {
    dateFrom: fmtDt(startOfDay(subDays(now, days))),
    dateTo: fmtDt(now),
  };
}
