"use client";

import { useQuery } from "@tanstack/react-query";

import { linkMetaService } from "@/services/link-meta.service";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { BatchMetaResponse } from "@/types";

/**
 * Batch-fetches lightweight metadata (title, OG image, etc.) for many links.
 *
 * @param ids - link ids; the query stays disabled when empty
 * @returns `{ meta: BatchMetaResponse, loading }`
 *
 * @remarks
 * Cache key: `queryKeys.links.meta(ids)` → `["links", "meta", sortedIds]` (ids are sorted to stabilise the key).
 * Endpoint: `POST /api/links/meta/batch` (via `linkMetaService.batchMeta()`).
 * Stale time: `API_CONFIG.CACHE.LINKS_TTL`.
 */
export function useLinksMeta(ids: string[]) {
  const { data: meta = {}, isLoading: loading } = useQuery<BatchMetaResponse>({
    queryKey: queryKeys.links.meta(ids),
    queryFn: () => linkMetaService.batchMeta(ids),
    staleTime: API_CONFIG.CACHE.LINKS_TTL,
    enabled: ids.length > 0,
  });

  return { meta, loading };
}
