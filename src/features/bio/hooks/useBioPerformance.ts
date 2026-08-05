"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { bioService } from "@/services/bio.service";

import type { BioPerformance, BioPerformancePeriod } from "../types";

/**
 * Fetches the authenticated user's click counts across their bio page's
 * items for one period (`GET /api/bio/performance?period=`), consumed by
 * {@link BioItemsSection} — the strip's total metric and every row chip's
 * period-scoped count both come from here.
 *
 * @param period - the section's currently-selected segmented-control value;
 * changing it swaps the query key (`queryKeys.bio.performance(period)`), so
 * each window has its own cache entry rather than one shared/clobbered one.
 *
 * @returns `performance` — `null` while loading or on error (never a
 * meaningful "empty" value; see below); `isLoading` — true only on the very
 * first fetch with no cached data yet; `isError` — true on any failure — the
 * section hides its metric/period strip and lets the row chips fall back to
 * their all-time counts, and never confuses this state with a legitimate
 * zero-clicks response.
 *
 * @remarks
 * `placeholderData: keepPreviousData` keeps the previous period's numbers on
 * screen while a newly-selected period fetches — the row chips would
 * otherwise all snap to their all-time fallback for a beat and snap back,
 * on every segmented-control click.
 *
 * Unlike `useBioPage`, the underlying `bioService.getPerformance` does not
 * swallow errors into a fallback value — `BioItemsSection` needs the ability
 * to tell "genuinely zero clicks" (a successful `{totalClicks: 0, items: []}`)
 * apart from "could not load" (a rejected query), which a swallowed `null`
 * would erase.
 */
export function useBioPerformance(period: BioPerformancePeriod) {
  const { data, isLoading, isError } = useQuery<BioPerformance>({
    queryKey: queryKeys.bio.performance(period),
    queryFn: () => bioService.getPerformance(period),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    performance: data ?? null,
    isLoading,
    isError,
  };
}
