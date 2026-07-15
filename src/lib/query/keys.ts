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

export const queryKeys = {
  links: {
    all: () => ["links"] as const,
    list: () => ["links", "list"] as const,
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
  subdomains: {
    all: () => ["subdomains"] as const,
  },
};
