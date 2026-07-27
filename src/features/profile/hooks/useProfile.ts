"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_CONFIG } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/keys";
import { profileService } from "@/services/profile.service";

import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfile,
} from "@/services/profile.service";

/**
 * Loads the authenticated user's profile into the TanStack Query cache.
 *
 * @param options.enabled - gates the fetch (e.g. on auth state); defaults to `true`.
 * @returns TanStack Query result with `data: UserProfile | undefined`.
 *
 * @remarks
 * Cache key: `queryKeys.profile.me()` → `["profile", "me"]`.
 * Endpoint: `GET /api/me` (via `profileService.getCurrentUser()`).
 * Stale time: `API_CONFIG.CACHE.USER_TTL` (10 minutes).
 *
 * This key is the single source of truth for the profile entity —
 * `useUpdateProfile` writes back into it on success, so components no longer
 * hold their own `useState` copy of the user.
 */
export function useProfile(options?: { enabled?: boolean }) {
  return useQuery<UserProfile>({
    queryKey: queryKeys.profile.me(),
    queryFn: async () => {
      const response = await profileService.getCurrentUser();
      return response.user;
    },
    staleTime: API_CONFIG.CACHE.USER_TTL,
    enabled: options?.enabled ?? true,
  });
}

/**
 * Mutation: update the authenticated user's profile.
 *
 * @returns TanStack mutation; call `mutateAsync({name, email})` to save.
 *
 * @remarks
 * Endpoint: `PUT /api/profile` (via `profileService.updateProfile()`).
 * On success, seeds `queryKeys.profile.me()` with the returned user (instant
 * UI, no refetch flash) and then invalidates the key so consumers reconcile
 * with the server. Profile edits MUST go through this hook — calling
 * `profileService.updateProfile()` directly bypasses the invalidation and
 * leaves `useProfile` consumers serving stale data.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData<UserProfile>(
        queryKeys.profile.me(),
        response.user,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.profile.me(),
      });
    },
  });
}
