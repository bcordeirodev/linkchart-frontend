"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { subdomainService } from "@/services/subdomain.service";
import type { SubdomainAvailability } from "../types/subdomain";

/** Query key used across the app to identify the subdomain cache entry. */
export const SUBDOMAIN_QUERY_KEY = ["subdomain"] as const;

/** Debounce delay (ms) for availability checks while the user types. */
const AVAILABILITY_DEBOUNCE_MS = 300;

/**
 * Manages subdomain state for the authenticated user.
 *
 * Provides:
 * - `subdomain` — current active subdomain or null
 * - `isLoading` — true while fetching initial data
 * - `claim(name)` — mutation to claim a label
 * - `release()` — mutation to release the current subdomain
 * - `checkAvailability(name)` — debounced availability check
 * - `availability` — result of the last availability check
 * - `isCheckingAvailability` — true while the debounced check is in flight
 */
export function useSubdomain() {
  const queryClient = useQueryClient();

  const { data: subdomain, isLoading } = useQuery({
    queryKey: SUBDOMAIN_QUERY_KEY,
    queryFn: () => subdomainService.getCurrent(),
    staleTime: 5 * 60 * 1000,
  });

  const [availability, setAvailability] =
    useState<SubdomainAvailability | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Debounced availability check: fires 300ms after the last call.
   * Clears the result immediately when called with an empty string.
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

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const claimMutation = useMutation({
    mutationFn: (name: string) => subdomainService.claim(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBDOMAIN_QUERY_KEY });
      setAvailability(null);
    },
  });

  const releaseMutation = useMutation({
    mutationFn: () => subdomainService.release(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBDOMAIN_QUERY_KEY });
    },
  });

  return {
    subdomain: subdomain ?? null,
    isLoading,
    claim: claimMutation.mutateAsync,
    isClaiming: claimMutation.isPending,
    claimError: claimMutation.error,
    release: releaseMutation.mutateAsync,
    isReleasing: releaseMutation.isPending,
    releaseError: releaseMutation.error,
    checkAvailability,
    availability,
    isCheckingAvailability,
  };
}
