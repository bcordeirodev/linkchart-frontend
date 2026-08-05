"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

import { bioService } from "@/services/bio.service";

import type { BioPerformance, BioPerformancePeriod } from "../types";

/**
 * Fetches the authenticated user's click ranking across their bio page's
 * items for one period (`GET /api/bio/performance?period=`), consumed by
 * {@link BioPerformancePanel}.
 *
 * @param period - the panel's currently-selected segmented-control value;
 * changing it swaps the query key (`queryKeys.bio.performance(period)`), so
 * each window has its own cache entry rather than one shared/clobbered one.
 *
 * @returns `performance` — `null` while loading or on error (never a
 * meaningful "empty" value; see below); `isLoading` — true only on the very
 * first fetch with no cached data yet, the signal `BioPerformancePanel` uses
 * for its skeleton; `isError` — true on any failure, including this endpoint
 * 404ing (e.g. while its backend branch is still unmerged) — the panel
 * renders a quiet fallback rather than surfacing a hard error, and never
 * confuses this state with a legitimate zero-clicks response.
 *
 * @remarks
 * Unlike `useBioPage`, the underlying `bioService.getPerformance` does not
 * swallow errors into a fallback value — `BioPerformancePanel` needs the ability
 * to tell "genuinely zero clicks" (a successful `{totalClicks: 0, items: []}`)
 * apart from "could not load" (a rejected query), which a swallowed `null`
 * would erase.
 */
export function useBioPerformance(period: BioPerformancePeriod) {
  const { data, isLoading, isError } = useQuery<BioPerformance>({
    queryKey: queryKeys.bio.performance(period),
    queryFn: () => bioService.getPerformance(period),
    staleTime: 30 * 1000,
  });

  return {
    performance: data ?? null,
    isLoading,
    isError,
  };
}
