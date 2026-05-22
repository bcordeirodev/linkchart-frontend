"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format, startOfDay, subDays, subHours } from "date-fns";

/** Named identifier for each analytics tab — used in URL params instead of numeric indices. */
export type TabId =
  | "overview"
  | "temporal"
  | "geographic"
  | "audience"
  | "insights"
  | "clicks";

/** Ordered list of TabIds — index matches the numeric position expected by MUI Tabs. */
export const TAB_IDS: readonly TabId[] = [
  "overview",
  "temporal",
  "geographic",
  "audience",
  "insights",
  "clicks",
];

/** Period preset identifiers for the global date filter. */
export type Period = "1h" | "24h" | "7d" | "30d" | "90d" | "all" | "custom";

/** Segment options for the Temporal tab filter. */
export type Segment = "all" | "weekday" | "weekend" | "business";

/** GroupBy options for the Temporal tab (frontend-only display control). */
export type GroupBy = "hour" | "day" | "month";

/** Level options for the Geographic tab (frontend-only display control). */
export type GeoLevel = "country" | "state" | "city";

/** Priority options for the Insights tab filter. */
export type InsightPriority = "all" | "high" | "medium";

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
  groupBy: GroupBy;
  segment: Segment;

  // Geographic
  continent: string | null;
  minClicks: number;
  geoLevel: GeoLevel;
  /** Index of the active geographic sub-tab (0=Overview, 1=Heatmap, 2=Rankings). URL-persisted so it survives RSC remounts triggered by filter changes. */
  geoSubTab: number;

  // Insights
  priority: InsightPriority;
  insightCategories: string[];
  actionableOnly: boolean;

  // Setters
  setPeriod: (v: Period) => void;
  setDateRange: (from: string, to: string) => void;
  setExcludeBots: (v: boolean) => void;
  setTab: (v: TabId) => void;
  setGroupBy: (v: GroupBy) => void;
  setSegment: (v: Segment) => void;
  setContinent: (v: string | null) => void;
  setMinClicks: (v: number) => void;
  setGeoLevel: (v: GeoLevel) => void;
  setGeoSubTab: (v: number) => void;
  setPriority: (v: InsightPriority) => void;
  setInsightCategories: (v: string[]) => void;
  setActionableOnly: (v: boolean) => void;
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
 * Defaults: period=all, excludeBots=true, groupBy=hour, segment=all,
 *   minClicks=1, geoLevel=country, priority=all, actionableOnly=false.
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
  const GROUP_BYS: readonly GroupBy[] = ["hour", "day", "month"];
  const SEGMENTS: readonly Segment[] = [
    "all",
    "weekday",
    "weekend",
    "business",
  ];
  const GEO_LEVELS: readonly GeoLevel[] = ["country", "state", "city"];
  const PRIORITIES: readonly InsightPriority[] = ["all", "high", "medium"];

  const period = parseEnum<Period>(searchParams.get("period"), PERIODS, "all");
  // Default is true; "false" in URL explicitly disables it.
  const excludeBots = searchParams.get("bots") !== "false";
  const groupBy = parseEnum<GroupBy>(
    searchParams.get("groupBy"),
    GROUP_BYS,
    "hour",
  );
  const segment = parseEnum<Segment>(
    searchParams.get("segment"),
    SEGMENTS,
    "all",
  );
  const continent = searchParams.get("continent") || null;
  const rawMinClicks = parseInt(searchParams.get("minClicks") ?? "1", 10);
  const minClicks =
    Number.isFinite(rawMinClicks) && rawMinClicks >= 1 ? rawMinClicks : 1;
  const geoLevel = parseEnum<GeoLevel>(
    searchParams.get("geoLevel"),
    GEO_LEVELS,
    "country",
  );
  const priority = parseEnum<InsightPriority>(
    searchParams.get("priority"),
    PRIORITIES,
    "all",
  );
  const insightCategories = searchParams.get("categories")
    ? searchParams.get("categories")!.split(",").filter(Boolean)
    : [];
  const actionableOnly = searchParams.get("actionable") === "true";

  const tab = parseEnum<TabId>(searchParams.get("tab"), TAB_IDS, "overview");

  const rawGeoSubTab = parseInt(searchParams.get("geoSubTab") ?? "0", 10);
  const geoSubTab =
    Number.isFinite(rawGeoSubTab) && rawGeoSubTab >= 0 && rawGeoSubTab <= 2
      ? rawGeoSubTab
      : 0;

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

  const setGroupBy = useCallback(
    (v: GroupBy) => setParam({ groupBy: v === "hour" ? null : v }),
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

  const setMinClicks = useCallback(
    (v: number) => setParam({ minClicks: v <= 1 ? null : String(v) }),
    [setParam],
  );

  const setGeoLevel = useCallback(
    (v: GeoLevel) => setParam({ geoLevel: v === "country" ? null : v }),
    [setParam],
  );

  const setGeoSubTab = useCallback(
    (v: number) => setParam({ geoSubTab: v === 0 ? null : String(v) }),
    [setParam],
  );

  const setPriority = useCallback(
    (v: InsightPriority) => setParam({ priority: v === "all" ? null : v }),
    [setParam],
  );

  const setInsightCategories = useCallback(
    (v: string[]) =>
      setParam({ categories: v.length > 0 ? v.join(",") : null }),
    [setParam],
  );

  const setActionableOnly = useCallback(
    (v: boolean) => setParam({ actionable: v ? "true" : null }),
    [setParam],
  );

  return {
    period,
    dateFrom,
    dateTo,
    excludeBots,
    tab,
    groupBy,
    segment,
    continent,
    minClicks,
    geoLevel,
    priority,
    insightCategories,
    actionableOnly,
    setPeriod,
    setDateRange,
    setExcludeBots,
    setTab,
    setGroupBy,
    setSegment,
    setContinent,
    setMinClicks,
    setGeoLevel,
    geoSubTab,
    setGeoSubTab,
    setPriority,
    setInsightCategories,
    setActionableOnly,
  };
}

export default useAnalyticsFilters;
