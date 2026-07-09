/**
 * Canonical number/percentage formatters — the single source of truth for
 * rendering numeric values across the UI so the same value never appears with
 * different separators or precision on the same screen.
 *
 * Prefer these over inline `.toLocaleString()` / `.toFixed()` in new code and
 * when touching an existing formatting site. Pass the active UI locale
 * (`i18n.language`) so output respects pt-BR vs en conventions.
 */

/**
 * Formats an integer count using the given UI locale (thousands separators).
 *
 * @param value - the count (null/undefined treated as 0)
 * @param locale - BCP-47 locale, e.g. i18n.language ("pt-BR" | "en")
 */
export function formatCount(
  value: number | null | undefined,
  locale: string,
): string {
  return (value ?? 0).toLocaleString(locale);
}

/**
 * Formats a percentage value with a fixed number of decimals and a trailing
 * `%`. The input is the already-computed percentage (e.g. `25.6`), not a ratio.
 *
 * @param value - the percentage number (null/undefined treated as 0)
 * @param decimals - decimal places (default 1)
 */
export function formatPercent(
  value: number | null | undefined,
  decimals = 1,
): string {
  return `${(value ?? 0).toFixed(decimals)}%`;
}

/**
 * Formats a large count in compact notation (e.g. 1.2k, 3.4M) using the given
 * UI locale. Falls back to `formatCount` on runtimes without `Intl` compact
 * support.
 *
 * @param value - the count (null/undefined treated as 0)
 * @param locale - BCP-47 locale
 */
export function formatCompact(
  value: number | null | undefined,
  locale: string,
): string {
  const n = value ?? 0;
  try {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    return formatCount(n, locale);
  }
}
