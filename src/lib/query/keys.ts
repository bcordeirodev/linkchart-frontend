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
 * - `apiKeys` — the authenticated user's API keys (masked previews only —
 *   full tokens never enter the cache); create/revoke mutations invalidate
 *   `apiKeys.all()`.
 * - `bio` — the authenticated user's link-in-bio page. The API nests items
 *   inside the page payload (no separate items list endpoint), so every item
 *   mutation (add/update/remove/reorder) invalidates the same `bio.page()`
 *   key as the page form itself. Add/update/remove additionally invalidate
 *   `bio.performanceAll()` (every `performance(period)` entry) since each
 *   can change the items ranked by `GET /api/bio/performance`; reorder does
 *   not, since that endpoint ranks by clicks, never by position.
 * - `admin` — read-only aggregates for the `/admin` panel (requires
 *   `is_admin`); `users` is keyed by the full `AdminUsersParams` so each
 *   page/search/sort combination caches independently.
 */

import type { AdminUsersParams } from "@/features/admin/types";
import type { BioPerformancePeriod } from "@/features/bio/types";

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
    breakdown: (dimension: string, f?: ReportsQueryFilters) =>
      ["reports", "breakdown", dimension, f ?? {}] as const,
    linkPerformance: (f?: ReportsQueryFilters, limit?: number) =>
      ["reports", "link-performance", f ?? {}, limit ?? 10] as const,
    insights: (f?: ReportsQueryFilters) =>
      ["reports", "insights", f ?? {}] as const,
  },
  subdomains: {
    all: () => ["subdomains"] as const,
  },
  apiKeys: {
    all: () => ["api-keys"] as const,
  },
  profile: {
    /**
     * Authenticated user's profile entity (`GET /api/me`). Single source of
     * truth for the profile — `useUpdateProfile` seeds/invalidates this key so
     * every consumer re-renders with fresh data after a save.
     */
    me: () => ["profile", "me"] as const,
  },
  bio: {
    /**
     * The authenticated user's bio page, including its items
     * (`GET /api/bio` → `{data: null | BioPage}`). `null` data means the user
     * has not created a page yet.
     */
    page: () => ["bio", "page"] as const,
    /**
     * Click ranking across every item on the authenticated user's bio page
     * for one period (`GET /api/bio/performance?period=`). Keyed by period
     * so switching the panel's segmented control reads/refetches a distinct
     * cache entry per window instead of clobbering the previous one.
     */
    performance: (period: BioPerformancePeriod) =>
      ["bio", "performance", period] as const,
    /**
     * Prefix shared by every `performance(period)` key — invalidate this
     * (not one specific period) from item mutations that add/remove/relabel
     * an item, since any of the 4 period caches could now show a stale
     * title/display/platform or be missing a brand-new item entirely.
     * Reordering items does NOT invalidate this: `GET /api/bio/performance`
     * ranks by clicks, never by position, so a reorder has nothing in this
     * response to go stale.
     */
    performanceAll: () => ["bio", "performance"] as const,
  },
  admin: {
    /** Prefixo de invalidação de todo o módulo admin. */
    all: () => ["admin"] as const,
    overview: (range: string) => ["admin", "overview", range] as const,
    users: (params: AdminUsersParams) => ["admin", "users", params] as const,
    engagement: (range: string) => ["admin", "engagement", range] as const,
    health: () => ["admin", "health"] as const,
  },
};
