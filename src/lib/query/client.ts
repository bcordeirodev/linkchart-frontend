import { QueryClient } from "@tanstack/react-query";

import { API_CONFIG } from "@/lib/api/endpoints";

/**
 * Singleton TanStack Query client used by the React tree (mounted in the root layout).
 *
 * Defaults:
 * - `staleTime` = `API_CONFIG.CACHE.ANALYTICS_TTL` (5 minutes) — analytics-heavy app
 *   reuses cached data aggressively before refetching.
 * - `retry: 1` — one retry on transient failures, then surface the error to the UI.
 * - `refetchOnWindowFocus: false` — avoid noisy refetches when users alt-tab.
 *
 * Per-query overrides are encouraged for non-analytics flows (mutations, link CRUD).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
