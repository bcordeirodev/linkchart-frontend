/**
 * Formats an integer count using the active UI locale (thousands separators).
 * Single source of truth for count rendering across the links UI so the same
 * value never appears with different separators on the same screen.
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
