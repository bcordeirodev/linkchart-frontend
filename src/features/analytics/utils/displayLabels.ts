/**
 * @file Display formatting for raw analytics values.
 *
 * The tracking pipeline stores exactly what the parsing libraries hand it —
 * `"os x"`, `"blink"`, `"document"` — because that is the stable value the
 * backend groups and compares on. None of that is fit for UI: it reads as a
 * database leak, not a label. These helpers are the single place that turns
 * those raw values into what a person expects to see (`"macOS"`, `"Blink"`,
 * `"Document"`), so every tab that lists devices/browsers/OS/engines/platform
 * formats the same string the same way instead of each component growing its
 * own ad hoc `.replace()`.
 */

/**
 * Known raw values (lowercased) mapped to their display form. Cases that
 * capitalization alone gets wrong — acronyms (`iOS`, `WebKit`) and brand
 * names with unusual casing (`macOS`) — live here; everything else falls
 * back to {@link capitalizeWords}.
 */
const KNOWN_LABELS: Record<string, string> = {
  "os x": "macOS",
  ios: "iOS",
  blink: "Blink",
  webkit: "WebKit",
  gecko: "Gecko",
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
  document: "Document",
  unknown: "Unknown",
};

/**
 * Capitalizes the first letter of every word in a string, lowercasing the
 * rest. Used as the fallback for any raw value with no entry in
 * {@link KNOWN_LABELS}.
 *
 * @param value - raw string, already trimmed of surrounding whitespace.
 * @returns the value with each word capitalized (e.g. `"windows nt"` → `"Windows Nt"`).
 */
function capitalizeWords(value: string): string {
  return value
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

/**
 * Formats a raw analytics dimension value (OS, browser engine, device type,
 * fetch destination, …) for display.
 *
 * Looks up `raw` case-insensitively against a small map of known values that
 * capitalization alone would get wrong (`"os x"` → `"macOS"`, `"ios"` →
 * `"iOS"`, `"webkit"` → `"WebKit"`, …). Anything not in the map falls back to
 * capitalizing the first letter of every word, so still-unmapped values stay
 * readable instead of showing raw lowercase.
 *
 * `"unknown"` maps to the literal string `"Unknown"` here — this function has
 * no access to `t()`. Consumers that render inside an i18n context and have a
 * translation key for "unknown" should check for that case themselves before
 * calling this helper, or translate the result when it equals `"Unknown"`.
 *
 * @param raw - raw value as stored by the tracking pipeline (e.g. `"os x"`, `"blink"`, `"document"`).
 * @returns the display label, or an empty string when `raw` is empty/whitespace-only.
 */
export function formatAnalyticsLabel(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const known = KNOWN_LABELS[trimmed.toLowerCase()];
  if (known) return known;

  return capitalizeWords(trimmed);
}

/**
 * Formats an hour-of-day as a short, locale-independent label (`13h`).
 *
 * Used everywhere a "peak hour" is displayed (KPI header, Engagement Peak
 * Analysis, …) so the format stays identical between pt-BR and en instead of
 * drifting into `"13:00"` in one place and `"13h"` in another.
 *
 * @param hour - hour of day, `0`–`23`.
 * @returns the hour suffixed with `"h"` (e.g. `13` → `"13h"`).
 */
export function formatHourShort(hour: number): string {
  return `${hour}h`;
}

/**
 * Formats a small average rate (clicks/day, clicks/hour) for KPI display.
 *
 * A link with real traffic but a long window rounds to `0`, which reads as
 * "dead link" — the honest display for anything between 0 and 0.1 is
 * `"<0.1"` (`"<0,1"` in pt-BR), not zero. Values at or above the threshold
 * render with the locale's own decimal/thousands separators.
 *
 * @param value - raw average from the analytics payload, or `null`/`undefined` when unavailable.
 * @param locale - active i18next locale, so the `<` threshold itself renders with the right decimal separator.
 * @returns the formatted string, or `null` when `value` is not available.
 */
export function formatApproxRate(
  value: number | null | undefined,
  locale: string,
): string | null {
  if (value == null) return null;
  if (value > 0 && value < 0.1) {
    return `<${(0.1).toLocaleString(locale)}`;
  }
  return value.toLocaleString(locale);
}
