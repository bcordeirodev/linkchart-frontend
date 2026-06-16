"use client";

import { useQuery } from "@tanstack/react-query";

import { profileService } from "@/services/profile.service";
import type { ProfileStats } from "@/services/profile.service";

export type { ProfileStats };

/** Query key for the authenticated user's profile stats. */
const PROFILE_STATS_QUERY_KEY = ["profile", "stats"] as const;

/**
 * Returns total link and click counts for the authenticated user.
 *
 * Data is considered fresh for 2 minutes — stats do not need real-time accuracy
 * on the profile page.
 */
export function useProfileStats() {
  return useQuery({
    queryKey: PROFILE_STATS_QUERY_KEY,
    queryFn: () => profileService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}
