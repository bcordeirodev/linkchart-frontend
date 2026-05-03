import { QueryClient } from "@tanstack/react-query";

import { API_CONFIG } from "@/lib/api/endpoints";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
