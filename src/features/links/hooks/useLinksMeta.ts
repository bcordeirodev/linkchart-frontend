"use client";

import { useQuery } from "@tanstack/react-query";

import { linkMetaService } from "@/services/link-meta.service";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { BatchMetaResponse } from "@/types";

export function useLinksMeta(ids: string[]) {
  const { data: meta = {}, isLoading: loading } = useQuery<BatchMetaResponse>({
    queryKey: queryKeys.links.meta(ids),
    queryFn: () => linkMetaService.batchMeta(ids),
    staleTime: API_CONFIG.CACHE.LINKS_TTL,
    enabled: ids.length > 0,
  });

  return { meta, loading };
}
