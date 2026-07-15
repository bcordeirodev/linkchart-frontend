/**
 * Canonical TanStack Query key factories.
 *
 * Convention: keys are `as const` arrays so TanStack Query infers a stable
 * structural identity. Always import from this file — never inline a string.
 *
 * Invalidation patterns:
 * - `queryClient.invalidateQueries({ queryKey: queryKeys.links.all() })` invalidates every `links.*` cache.
 * - `queryClient.invalidateQueries({ queryKey: queryKeys.analytics.geographic(linkId) })` invalidates only that link's geographic chart.
 *
 * Sections:
 * - `links` — link CRUD + batch metadata.
 * - `tags` — tag CRUD (mutations also invalidate `links.*` since link cards
 *   embed the tag objects they're tagged with).
 * - `analytics` — per-link analytics tabs and the public analytics page.
 * - `subdomains` — the authenticated user's custom subdomains (plural, N per
 *   user); claim/release mutations invalidate `subdomains.all()`.
 */

/**
 * Filters that participate in a cached analytics payload's identity.
 *
 * Every filter the server honours MUST appear here — one missing filter makes
 * TanStack Query serve the previous filter's payload when the user switches,
 * which surfaces as silently wrong numbers. Phase 3 adds `country`, `device`
 * and `channel` to this shape.
 */
export interface AnalyticsQueryFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  excludeBots?: boolean;
  segment?: string;
  continent?: string | null;
}

/**
 * Filters shared by every `/api/reports/*` endpoint (aggregated, multi-link).
 * Narrower than {@link AnalyticsQueryFilters} — reports have no `segment`/`continent`.
 */
export interface ReportsQueryFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  excludeBots?: boolean;
}

/**
 * Server-side search/filter/sort/pagination params for `GET /api/links`.
 *
 * Every field the backend honours MUST appear here — the same reasoning as
 * {@link AnalyticsQueryFilters}: a filter missing from this shape would make
 * TanStack Query treat two different requests as the same cache entry.
 */
export interface LinksSearchParams {
  page: number;
  perPage: number;
  /** Free-text search over title, original URL and slug (case-insensitive). */
  q?: string;
  /** Omit (or leave `undefined`) for "all statuses". */
  status?: "active" | "inactive" | "expired";
  sort?: "created_at" | "clicks" | "title";
  order?: "asc" | "desc";
}

/** Pagination metadata returned alongside `data` by the paginated links search. */
export interface LinksMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export const queryKeys = {
  links: {
    all: () => ["links"] as const,
    list: () => ["links", "list"] as const,
    /**
     * Server-side paginated/filtered links search.
     *
     * Keeps the `["links", "list", ...]` prefix so `queryClient.invalidateQueries({
     * queryKey: queryKeys.links.all() })` (used by `useCreateLink`/`useUpdateLink`/
     * `useDeleteLink`) still matches every cached page/filter combination.
     */
    search: (params: LinksSearchParams) => ["links", "list", params] as const,
    detail: (id: string) => ["links", "detail", id] as const,
    meta: (ids: string[]) => ["links", "meta", [...ids].sort()] as const,
  },
  tags: {
    all: () => ["tags"] as const,
    list: () => ["tags", "list"] as const,
  },
  analytics: {
    dashboard: (id: string, f?: AnalyticsQueryFilters) =>
      ["analytics", id, "dashboard", f ?? {}] as const,
    temporal: (id: string, f?: AnalyticsQueryFilters) =>
      ["analytics", id, "temporal", f ?? {}] as const,
    geographic: (id: string, f?: AnalyticsQueryFilters) =>
      ["analytics", id, "geographic", f ?? {}] as const,
    audience: (id: string, f?: AnalyticsQueryFilters) =>
      ["analytics", id, "audience", f ?? {}] as const,
    insights: (id: string, f?: AnalyticsQueryFilters) =>
      ["analytics", id, "insights", f ?? {}] as const,
    public: (slug: string) => ["analytics", "public", slug] as const,
    publicLink: (slug: string) => ["link", "public", slug] as const,
  },
  reports: {
    summary: (f?: ReportsQueryFilters) =>
      ["reports", "summary", f ?? {}] as const,
    timeseries: (f?: ReportsQueryFilters) =>
      ["reports", "timeseries", f ?? {}] as const,
    topLinks: (f?: ReportsQueryFilters, limit?: number) =>
      ["reports", "top-links", f ?? {}, limit ?? 10] as const,
    breakdown: (dimension: string, f?: ReportsQueryFilters) =>
      ["reports", "breakdown", dimension, f ?? {}] as const,
  },
  subdomains: {
    all: () => ["subdomains"] as const,
  },
};
