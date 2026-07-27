"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { i18n } from "@/lib/i18n";
import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";
import { bioService } from "@/services/bio.service";

import type { BioPage, BioPageUpsertInput } from "../types";

/**
 * Fetches the authenticated user's bio page (`GET /api/bio`).
 *
 * @returns `page` — the page, or `null` when the user hasn't created one
 * yet (this is the sole signal the editor uses to switch between its
 * "create" and "edit" states); plus the raw query's loading/error flags.
 *
 * @remarks
 * Cache key: `queryKeys.bio.page()`. Every item mutation in `useBioItems`
 * invalidates this same key — the API has no separate items list endpoint.
 */
export function useBioPage() {
  const { data, isLoading, isError, isFetching } = useQuery<BioPage | null>({
    queryKey: queryKeys.bio.page(),
    queryFn: () => bioService.getPage(),
    staleTime: 30 * 1000,
  });

  return {
    page: data ?? null,
    isLoading,
    isError,
    isFetching,
  };
}

/**
 * Mutation: create or update the authenticated user's bio page
 * (`PUT /api/bio` — upsert; the same request handles both the first save
 * and every edit after).
 *
 * @endpoint `PUT /api/bio` (via `bioService.upsertPage()`)
 *
 * @remarks
 * On success, seeds `queryKeys.bio.page()` directly with the server's
 * response (server-normalized handle, canonical `items`) instead of just
 * invalidating — avoids an extra round trip on every save. On error,
 * dispatches a generic toast; callers should still `catch` the rejected
 * `mutateAsync` to map 422 field errors via `applyBioFieldErrors`.
 */
export function useUpsertBioPage() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BioPageUpsertInput) => bioService.upsertPage(input),
    onSuccess: (page) => {
      queryClient.setQueryData(queryKeys.bio.page(), page);
    },
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "form.errors.saveGeneric",
        { ns: "bio" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}
