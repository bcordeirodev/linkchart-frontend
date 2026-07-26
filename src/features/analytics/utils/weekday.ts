/**
 * @file One place that knows what a weekday number means.
 *
 * The analytics API emits **ISO weekday numbers: 1 = Monday … 7 = Sunday**
 * (`TemporalAnalyticsService::getClicksByDayOfWeek`). It also emits a
 * `day_name`, but that name is hardcoded Portuguese on the server — rendering
 * it directly is how the charts ended up showing "Segunda, Terça, Quarta" to
 * English users. Always label from the number, never from `day_name`.
 *
 * Getting the convention wrong is not hypothetical: the weekend insight used to
 * read `day === 5 || day === 6`, which is Friday + Saturday — it counted Friday
 * and never counted Sunday.
 */

import type { TFunction } from "i18next";

/** Lowest ISO weekday number (Monday). */
const ISO_MONDAY = 1;

/** Highest ISO weekday number (Sunday). */
const ISO_SUNDAY = 7;

/** ISO number of Saturday — the first day of the weekend. */
const ISO_SATURDAY = 6;

/**
 * Translation key per ISO weekday. Spelled out rather than built with a
 * template string because the project types translation keys as a literal
 * union — a `temporal.weekdayNames.${number}` template does not narrow to it.
 */
const WEEKDAY_KEYS = {
  1: "temporal.weekdayNames.1",
  2: "temporal.weekdayNames.2",
  3: "temporal.weekdayNames.3",
  4: "temporal.weekdayNames.4",
  5: "temporal.weekdayNames.5",
  6: "temporal.weekdayNames.6",
  7: "temporal.weekdayNames.7",
} as const;

/**
 * Whether an ISO weekday number falls on the weekend (Saturday or Sunday).
 *
 * @param day - ISO weekday number (1 = Monday … 7 = Sunday).
 * @returns `true` for Saturday and Sunday.
 */
export function isWeekendDay(day: number): boolean {
  return day >= ISO_SATURDAY;
}

/**
 * Translated name of an ISO weekday.
 *
 * @param day - ISO weekday number (1 = Monday … 7 = Sunday); out-of-range,
 *   `null` and `undefined` all yield `fallback`.
 * @param t - `analytics` namespace translator.
 * @param fallback - shown when the day is unknown.
 * @returns the localized weekday name.
 */
export function getWeekdayLabel(
  day: number | null | undefined,
  t: TFunction<"analytics">,
  fallback = "—",
): string {
  if (
    day == null ||
    !Number.isInteger(day) ||
    day < ISO_MONDAY ||
    day > ISO_SUNDAY
  ) {
    return fallback;
  }
  return t(WEEKDAY_KEYS[day as keyof typeof WEEKDAY_KEYS]);
}

/**
 * Re-labels weekday rows with translated names, ready for the chart formatters
 * (which read the `day_name` field).
 *
 * @param rows - weekday rows from the analytics API.
 * @param t - `analytics` namespace translator.
 * @returns the same rows with a localized `day_name`.
 */
export function localizeWeekdayRows<
  T extends { day: number; day_name: string },
>(rows: readonly T[], t: TFunction<"analytics">): T[] {
  return rows.map((row) => ({
    ...row,
    day_name: getWeekdayLabel(row.day, t, row.day_name),
  }));
}
