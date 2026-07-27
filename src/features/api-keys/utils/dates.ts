/**
 * Date formatting helpers for the API keys module. Pure functions over
 * `Intl` so pt-BR and en come out right without extra i18n keys.
 */

/**
 * Ordered unit thresholds for {@link formatRelativeTime}, largest first.
 * Month/year use calendar-ish approximations (30/365 days) — fine for a
 * "last used" caption where precision beyond the unit doesn't matter.
 */
const RELATIVE_UNITS: ReadonlyArray<{
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
}> = [
  { unit: "year", seconds: 365 * 24 * 3600 },
  { unit: "month", seconds: 30 * 24 * 3600 },
  { unit: "week", seconds: 7 * 24 * 3600 },
  { unit: "day", seconds: 24 * 3600 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

/**
 * Formats an ISO timestamp as a localized relative phrase (e.g. pt-BR
 * "há 2 dias", en "2 days ago"). Falls back to the raw string when the
 * timestamp doesn't parse.
 *
 * @param iso - ISO-8601 timestamp (past or present).
 * @param locale - BCP-47 tag from `i18n.language` (e.g. "pt-BR").
 * @param now - reference instant, injectable for tests; defaults to `new Date()`.
 * @returns the localized relative phrase.
 */
export function formatRelativeTime(
  iso: string,
  locale: string,
  now: Date = new Date(),
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return iso;
  }

  try {
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const diffSeconds = Math.round((then - now.getTime()) / 1000);
    const magnitude = Math.abs(diffSeconds);

    for (const { unit, seconds } of RELATIVE_UNITS) {
      if (magnitude >= seconds) {
        return formatter.format(Math.trunc(diffSeconds / seconds), unit);
      }
    }
    // Under a minute: "agora" / "now" via numeric:"auto" on the second unit.
    return formatter.format(0, "second");
  } catch {
    return iso;
  }
}

/**
 * Formats an ISO timestamp as a short localized date (e.g. "12 jul 2026").
 * Falls back to the raw string when the timestamp doesn't parse.
 *
 * @param iso - ISO-8601 timestamp.
 * @param locale - BCP-47 tag from `i18n.language` (e.g. "pt-BR").
 * @returns the localized short date.
 */
export function formatShortDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
