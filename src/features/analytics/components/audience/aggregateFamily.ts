import type { BrowserData, LanguageData, OSData } from "@/types";

/** A single row after grouping raw entries by family, ready for {@link HorizontalBreakdownBars}. */
export interface FamilyAggregate {
  /** Stable key — the family name or base language code. */
  key: string;
  /** Human-readable label. */
  label: string;
  /** Summed click count across every entry folded into this family. */
  clicks: number;
  /** Share of the grand total, 0–100. */
  percentage: number;
}

/**
 * Resolves a human-readable language name for a base language code
 * (`"en"` → "English" / "inglês") in the given UI locale. Falls back to the
 * uppercased code when `Intl.DisplayNames` cannot resolve it.
 *
 * Shared by {@link aggregateLanguagesByFamily} and `LanguageBreakdownCard`,
 * which both group regional variants (en-US, en-GB) under one base language.
 *
 * @param code - ISO 639-1 base language code (e.g. `"pt"`).
 * @param locale - BCP 47 locale of the current UI language.
 */
export function languageDisplayName(code: string, locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(code);
    if (name && name !== code) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch {
    // Unknown/invalid code — fall through to the raw code below.
  }
  return code.toUpperCase();
}

/**
 * Groups entries by a derived key, sums their click counts, keeps the
 * `maxGroups` largest groups and folds the remainder into a single
 * `othersLabel` row so the resulting list stays short — a long tail of
 * one-off browser/OS versions would otherwise defeat the point of a
 * "short tab" by turning three categories into thirty.
 */
function groupAndCap<T>(
  entries: T[],
  getKey: (entry: T) => string,
  getClicks: (entry: T) => number,
  getLabel: (key: string) => string,
  maxGroups: number,
  othersLabel: string,
): FamilyAggregate[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    const key = getKey(entry).trim() || "unknown";
    totals.set(key, (totals.get(key) ?? 0) + getClicks(entry));
  }

  const grandTotal = [...totals.values()].reduce((sum, n) => sum + n, 0);
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, maxGroups);
  const restClicks = sorted
    .slice(maxGroups)
    .reduce((sum, [, clicks]) => sum + clicks, 0);

  const toPercentage = (clicks: number) =>
    grandTotal > 0 ? (clicks / grandTotal) * 100 : 0;

  const rows: FamilyAggregate[] = top.map(([key, clicks]) => ({
    key,
    label: getLabel(key),
    clicks,
    percentage: toPercentage(clicks),
  }));

  if (restClicks > 0) {
    rows.push({
      key: "__others__",
      label: othersLabel,
      clicks: restClicks,
      percentage: toPercentage(restClicks),
    });
  }

  return rows;
}

/**
 * Aggregates browser entries by family, collapsing per-version rows (the
 * audience API returns "Chrome 91.0" and "Chrome 90.0" as separate entries
 * that both carry `browser: "Chrome"`) into one "Chrome" total. A visitor
 * profile doesn't need the version — only the family — so the version
 * dimension is intentionally dropped here.
 *
 * @param browsers - Raw per-version browser breakdown from the audience API.
 * @param othersLabel - Translated label for the folded "long tail" row.
 * @param maxGroups - Number of families kept individually before folding
 * the remainder into one `othersLabel` row. Defaults to 5.
 */
export function aggregateBrowsersByFamily(
  browsers: BrowserData[],
  othersLabel: string,
  maxGroups = 5,
): FamilyAggregate[] {
  return groupAndCap(
    browsers,
    (b) => b.browser,
    (b) => b.clicks,
    (key) => key,
    maxGroups,
    othersLabel,
  );
}

/**
 * Aggregates operating-system entries by family (e.g. "Android 10" and
 * "Android 11" both collapse into one "Android" total), for the same
 * reason as {@link aggregateBrowsersByFamily}.
 *
 * @param operatingSystems - Raw per-version OS breakdown from the audience API.
 * @param othersLabel - Translated label for the folded "long tail" row.
 * @param maxGroups - Number of families kept individually. Defaults to 5.
 */
export function aggregateOSByFamily(
  operatingSystems: OSData[],
  othersLabel: string,
  maxGroups = 5,
): FamilyAggregate[] {
  return groupAndCap(
    operatingSystems,
    (o) => o.os,
    (o) => o.clicks,
    (key) => key,
    maxGroups,
    othersLabel,
  );
}

/**
 * Reverse lookup for the fixed set of native-script names the backend's
 * `UserAgentParser::extractPrimaryLanguage` substitutes for a handful of
 * known tags (`en` → "English", `en-US` → "English (US)", `pt-BR` →
 * "Português (Brasil)", …). Every other tag passes through the backend
 * unchanged as a raw BCP-47 code (`en-GB`, `de-DE`, `ja-JP`, …), so the
 * `languages` array is a genuine mix of both formats — this table lets
 * {@link normalizeLanguageKey} fold a mapped name back to the same ISO code
 * a raw tag for the same language would produce, so "English (US)" and
 * "en-GB" end up in the same "English"/"Inglês" bucket instead of two.
 */
const NATIVE_NAME_TO_ISO_CODE: Record<string, string> = {
  english: "en",
  português: "pt",
  portugues: "pt",
  español: "es",
  espanol: "es",
  français: "fr",
  francais: "fr",
  deutsch: "de",
  italiano: "it",
  中文: "zh",
  日本語: "ja",
  한국어: "ko",
  العربية: "ar",
  русский: "ru",
};

/** Matches a bare BCP-47-ish tag (`en`, `en-GB`, `zh-Hant-TW`) — no spaces or parentheses. */
const BCP47_TAG_PATTERN = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;

/**
 * Normalizes one `languages[].language` entry to a canonical ISO 639-1 key,
 * regardless of which of the two shapes the backend returned it in: a raw
 * BCP-47 tag, or one of the fixed native-script names substituted for a
 * handful of known tags (see {@link NATIVE_NAME_TO_ISO_CODE}). Falls back to
 * the lowercased, region-stripped input for anything unrecognised, so at
 * least exact duplicates still merge.
 *
 * @param raw - Raw `language` field value from the audience API.
 */
function normalizeLanguageKey(raw: string): string {
  // Strip a trailing region qualifier in parentheses: "English (US)" → "English".
  const withoutRegion = raw.trim().replace(/\s*\([^)]*\)\s*$/, "");

  if (BCP47_TAG_PATTERN.test(withoutRegion)) {
    return withoutRegion.split("-")[0]!.toLowerCase();
  }

  const lower = withoutRegion.toLowerCase();
  return NATIVE_NAME_TO_ISO_CODE[lower] ?? lower;
}

/**
 * Aggregates language entries by family, regardless of which of the
 * backend's two output shapes each entry happens to be in: `en-US`, `en-GB`,
 * `en-CA` (raw tags) and `"English (US)"` (the backend's own substituted
 * name for `en-US`) all collapse into one "English"/"Inglês" total. Mirrors
 * the grouping `LanguageBreakdownCard` already applies to the phase-aware
 * Accept-Language breakdown.
 *
 * @param languages - Raw per-region language breakdown from the audience API.
 * @param locale - BCP 47 locale used to resolve the display name.
 * @param othersLabel - Translated label for the folded "long tail" row.
 * @param maxGroups - Number of families kept individually. Defaults to 5.
 */
export function aggregateLanguagesByFamily(
  languages: LanguageData[],
  locale: string,
  othersLabel: string,
  maxGroups = 5,
): FamilyAggregate[] {
  return groupAndCap(
    languages,
    (l) => normalizeLanguageKey(l.language),
    (l) => l.clicks,
    (code) => languageDisplayName(code, locale),
    maxGroups,
    othersLabel,
  );
}
