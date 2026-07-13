"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format, startOfDay, subDays, subHours } from "date-fns";

/** Named identifier for each analytics tab — used in URL params instead of numeric indices. */
export type TabId =
  | "overview"
  | "origin"
  | "places"
  | "audience"
  | "when"
  | "clicks";

/** Ordered list of TabIds — index matches the numeric position expected by MUI Tabs. */
export const TAB_IDS: readonly TabId[] = [
  "overview",
  "origin",
  "places",
  "audience",
  "when",
  "clicks",
];

/** Period preset identifiers for the global date filter. */
export type Period = "1h" | "24h" | "7d" | "30d" | "90d" | "all" | "custom";

/** Segment options for the Temporal tab filter. */
export type Segment = "all" | "weekday" | "weekend" | "business";

/** Full filter state plus setters returned by `useAnalyticsFilters`. */
export interface AnalyticsFilters {
  // Global
  period: Period;
  dateFrom: string | null;
  dateTo: string | null;
  excludeBots: boolean;

  // Active tab (stored in URL so it survives filter changes)
  tab: TabId;

  // Temporal
  segment: Segment;
  /** Index of the active temporal sub-tab (0=Patterns, 1=Timeline, 2=Performance, 3=Distribution). URL-persisted so it survives RSC remounts triggered by filter changes. */
  temporalSubTab: number;

  // Geographic
  continent: string | null;
  /** Index of the active geographic sub-tab (0=Mapa e ranking, 1=Continentes e países, 2=Mapa de calor). URL-persisted so it survives RSC remounts. */
  geoSubTab: number;

  // Origin
  /** Index of the active origin sub-tab (0=Canais, 1=Redes sociais, 2=Campanhas, 3=Contexto). URL-persisted so it survives RSC remounts. */
  originSubTab: number;

  // Audience
  /** Index of the active audience sub-tab (0=Aparelhos, 1=Navegador e sistema, 2=Idioma, 3=Qualidade, 4=Detalhes técnicos). URL-persisted so it survives RSC remounts. */
  audienceSubTab: number;

  // Setters
  setPeriod: (v: Period) => void;
  setDateRange: (from: string, to: string) => void;
  setExcludeBots: (v: boolean) => void;
  setTab: (v: TabId) => void;
  setSegment: (v: Segment) => void;
  setTemporalSubTab: (v: number) => void;
  setContinent: (v: string | null) => void;
  setGeoSubTab: (v: number) => void;
  setOriginSubTab: (v: number) => void;
  setAudienceSubTab: (v: number) => void;
}

/**
 * Parses a sub-tab index URL param, clamping to `[0, maxIndex]`.
 * Mirrors the numeric-index pattern used for every sub-tab param (`geoSubTab`,
 * `temporalSubTab`, `originSubTab`, `audienceSubTab`) — out-of-range or
 * non-numeric values fall back to `0` instead of throwing.
 *
 * @param raw - Raw string value read from `URLSearchParams.get(...)`.
 * @param maxIndex - Highest valid index (inclusive) for the sub-tab's tab list.
 */
function parseSubTabIndex(raw: string | null, maxIndex: number): number {
  const parsed = parseInt(raw ?? "0", 10);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= maxIndex
    ? parsed
    : 0;
}

/**
 * Parses a URL search param against an allowed set of values.
 * Returns the fallback if the param is absent or not in the allowed set.
 */
function parseEnum<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return value !== null && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/** Formats a Date as a datetime string for URL params and API requests. */
const fmtDt = (d: Date) => format(d, "yyyy-MM-dd HH:mm:ss");

/** Derive datetime strings for a given period preset relative to now. */
function resolveDates(period: Period): {
  dateFrom: string | null;
  dateTo: string | null;
} {
  const now = new Date();

  switch (period) {
    case "1h":
      return { dateFrom: fmtDt(subHours(now, 1)), dateTo: fmtDt(now) };
    case "24h":
      return { dateFrom: fmtDt(subDays(now, 1)), dateTo: fmtDt(now) };
    case "7d":
      return {
        dateFrom: fmtDt(startOfDay(subDays(now, 7))),
        dateTo: fmtDt(now),
      };
    case "30d":
      return {
        dateFrom: fmtDt(startOfDay(subDays(now, 30))),
        dateTo: fmtDt(now),
      };
    case "90d":
      return {
        dateFrom: fmtDt(startOfDay(subDays(now, 90))),
        dateTo: fmtDt(now),
      };
    case "all":
      return { dateFrom: null, dateTo: null };
    case "custom":
      return { dateFrom: null, dateTo: null };
    default:
      return { dateFrom: null, dateTo: null };
  }
}

/**
 * Reads and writes analytics filter state from/to URL search params.
 *
 * Instantiated once in `LinkAnalyticsTabs`. Tab components receive state as
 * props — no tab reads the URL directly.
 *
 * Defaults: period=all, excludeBots=true, segment=all, priority=all,
 *   actionableOnly=false.
 */
export function useAnalyticsFilters(): AnalyticsFilters {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const PERIODS: readonly Period[] = [
    "1h",
    "24h",
    "7d",
    "30d",
    "90d",
    "all",
    "custom",
  ];
  const SEGMENTS: readonly Segment[] = [
    "all",
    "weekday",
    "weekend",
    "business",
  ];

  const period = parseEnum<Period>(searchParams.get("period"), PERIODS, "all");
  // Default is true; "false" in URL explicitly disables it.
  const excludeBots = searchParams.get("bots") !== "false";
  const segment = parseEnum<Segment>(
    searchParams.get("segment"),
    SEGMENTS,
    "all",
  );
  const continent = searchParams.get("continent") || null;

  const tab = parseEnum<TabId>(searchParams.get("tab"), TAB_IDS, "overview");

  // Sub-tab indices — one per top-level tab that has its own secondary nav.
  const geoSubTab = parseSubTabIndex(searchParams.get("geoSubTab"), 2);
  const temporalSubTab = parseSubTabIndex(
    searchParams.get("temporalSubTab"),
    3,
  );
  const originSubTab = parseSubTabIndex(searchParams.get("originSubTab"), 3);
  const audienceSubTab = parseSubTabIndex(
    searchParams.get("audienceSubTab"),
    4,
  );

  const customFrom = searchParams.get("date_from");
  const customTo = searchParams.get("date_to");

  // Memoize resolved dates so that switching tabs (which re-renders the parent)
  // does not produce new Date() strings that differ by milliseconds.
  // A fresh period string or custom date already changes the URL and invalidates
  // the memo — so analytics hooks only refetch when the user actually changes
  // the filter, not on every incidental re-render.
  const { dateFrom, dateTo } = useMemo(
    () =>
      period === "custom"
        ? { dateFrom: customFrom, dateTo: customTo }
        : resolveDates(period),

    [period, customFrom, customTo],
  );

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setPeriod = useCallback(
    (v: Period) => {
      // "all" is the default — omit from URL to keep it clean
      const updates: Record<string, string | null> = {
        period: v === "all" ? null : v,
      };
      if (v !== "custom") {
        updates.date_from = null;
        updates.date_to = null;
      }
      setParam(updates);
    },
    [setParam],
  );

  const setDateRange = useCallback(
    (from: string, to: string) =>
      setParam({ period: "custom", date_from: from, date_to: to }),
    // from/to are already formatted as "yyyy-MM-dd HH:mm:ss" by AnalyticsFilterBar
    [setParam],
  );

  const setExcludeBots = useCallback(
    // Default is true, so store "false" when disabled and omit when enabled
    (v: boolean) => setParam({ bots: v ? null : "false" }),
    [setParam],
  );

  const setTab = useCallback(
    (v: TabId) => setParam({ tab: v === "overview" ? null : v }),
    [setParam],
  );

  const setSegment = useCallback(
    (v: Segment) => setParam({ segment: v === "all" ? null : v }),
    [setParam],
  );

  const setContinent = useCallback(
    (v: string | null) => setParam({ continent: v }),
    [setParam],
  );

  const setGeoSubTab = useCallback(
    (v: number) => setParam({ geoSubTab: v === 0 ? null : String(v) }),
    [setParam],
  );

  const setTemporalSubTab = useCallback(
    (v: number) => setParam({ temporalSubTab: v === 0 ? null : String(v) }),
    [setParam],
  );

  const setOriginSubTab = useCallback(
    (v: number) => setParam({ originSubTab: v === 0 ? null : String(v) }),
    [setParam],
  );

  const setAudienceSubTab = useCallback(
    (v: number) => setParam({ audienceSubTab: v === 0 ? null : String(v) }),
    [setParam],
  );

  return {
    period,
    dateFrom,
    dateTo,
    excludeBots,
    tab,
    segment,
    temporalSubTab,
    continent,
    geoSubTab,
    originSubTab,
    audienceSubTab,
    setPeriod,
    setDateRange,
    setExcludeBots,
    setTab,
    setSegment,
    setTemporalSubTab,
    setContinent,
    setGeoSubTab,
    setOriginSubTab,
    setAudienceSubTab,
  };
}

export default useAnalyticsFilters;
