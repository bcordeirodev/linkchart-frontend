"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { subdomainService } from "@/services/subdomain.service";

import { MAX_SUBDOMAINS_PER_USER } from "../constants";

import type { SubdomainAvailabilityResult, SubdomainItem } from "../types";

/** Debounce delay (ms) for availability checks while the user types. */
const AVAILABILITY_DEBOUNCE_MS = 300;

/**
 * Manages the authenticated user's subdomains (plural — up to
 * `MAX_SUBDOMAINS_PER_USER`).
 *
 * The underlying query is gated on `NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true"`
 * (`enabled` option below): when the flag is off, `GET /api/subdomains` never
 * fires, `subdomains` stays `[]`, and `isLoading` reads `false` immediately
 * (there's nothing to wait for).
 *
 * Provides:
 * - `subdomains` — active subdomains, oldest first (mirrors the backend's
 *   default-pick order for link creation)
 * - `isLoading` — true while fetching the initial list
 * - `claim(name)` — mutation to claim an additional label
 * - `release(id)` — mutation to release one specific subdomain by id
 * - `checkAvailability(name)` — debounced availability check (shared with the
 *   legacy single-subdomain endpoint)
 * - `availability` / `isCheckingAvailability` — result of the last check
 * - `limitReached` — true once the account holds `MAX_SUBDOMAINS_PER_USER`
 *   active subdomains (hides the claim form pre-emptively; the backend still
 *   enforces the real limit on `POST /api/subdomains`)
 *
 * Cache key: `queryKeys.subdomains.all()` — invalidated on claim/release
 * success so every consumer (the `/subdomains` page, `SubdomainSelect`) stays
 * in sync without an extra round trip.
 */
export function useSubdomains() {
  const queryClient = useQueryClient();

  const { data: subdomains = [], isLoading } = useQuery({
    queryKey: queryKeys.subdomains.all(),
    queryFn: () => subdomainService.list(),
    staleTime: 60 * 1000,
    // Skip the request entirely when the feature is off — matches how every
    // other consumer (`SubdomainSelect`, `LinkFormFields`, `ProfilePage`)
    // gates on this same flag, so a disabled build never fires `GET
    // /api/subdomains` just to render nothing.
    enabled: process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true",
  });

  const [availability, setAvailability] =
    useState<SubdomainAvailabilityResult | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Debounced availability check: fires 300ms after the last call. Clears
   * the result immediately for inputs shorter than the minimum label length.
   */
  const checkAvailability = useCallback((name: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!name || name.length < 3) {
      setAvailability(null);
      setIsCheckingAvailability(false);
      return;
    }

    setIsCheckingAvailability(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await subdomainService.checkAvailability(name);
        setAvailability(result);
      } catch {
        setAvailability(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    }, AVAILABILITY_DEBOUNCE_MS);
  }, []);

  // Clean up the debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const claimMutation = useMutation({
    mutationFn: (name: string) => subdomainService.claimNew(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subdomains.all() });
      setAvailability(null);
    },
  });

  const [releasingId, setReleasingId] = useState<number | null>(null);

  const releaseMutation = useMutation({
    mutationFn: (id: number) => subdomainService.releaseById(id),
    onMutate: (id: number) => setReleasingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subdomains.all() });
    },
    onSettled: () => setReleasingId(null),
  });

  return {
    subdomains,
    isLoading,
    claim: claimMutation.mutateAsync,
    isClaiming: claimMutation.isPending,
    claimError: claimMutation.error,
    release: releaseMutation.mutateAsync,
    isReleasing: releaseMutation.isPending,
    /** id of the subdomain currently being released, or null when idle. */
    releasingId,
    releaseError: releaseMutation.error,
    checkAvailability,
    availability,
    isCheckingAvailability,
    /** True once the account is at `MAX_SUBDOMAINS_PER_USER` active subdomains. */
    limitReached: subdomains.length >= MAX_SUBDOMAINS_PER_USER,
    maxSubdomains: MAX_SUBDOMAINS_PER_USER,
  };
}

export type { SubdomainItem };
