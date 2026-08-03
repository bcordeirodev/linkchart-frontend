/**
 * Single source of truth for API paths, base URLs, and HTTP-level config.
 *
 * Every service in `src/services/` and every TanStack Query hook should reach
 * for `API_CONFIG.ENDPOINTS.*` (or the legacy `API_ENDPOINTS` / per-feature
 * re-exports) instead of inlining strings — that way the proxy rewrites,
 * cache TTLs, and timeouts stay centralised.
 *
 * Sections under `ENDPOINTS`:
 * - Top-level: global analytics + link CRUD + link-meta batch.
 * - `ENDPOINTS.AUTH`: identity (login, register, profile, password, email verification).
 * - `ENDPOINTS.PUBLIC`: unauthenticated `/api/public/*` endpoints used by `/shorter`.
 *
 * Paths are relative (`/api/...`) — Next.js rewrites in `next.config.ts` proxy
 * them to `process.env.API_URL`, so CORS never fires in development.
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "", // Empty string uses Next.js rewrites proxy

  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,

  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  ENDPOINTS: {
    // --- Analytics (per-link only — global /api/analytics never existed on backend) ---
    LINK_ANALYTICS: (id: string) => `/api/links/${id}/analytics`,

    // --- Links (authenticated CRUD) ---
    LINKS: "/api/links",
    LINK: (id: string) => `/api/links/${id}`,
    CREATE_LINK: "/api/links",
    UPDATE_LINK: (id: string) => `/api/links/${id}`,
    DELETE_LINK: (id: string) => `/api/links/${id}`,
    LINKS_BULK_ACTION: "/api/links/bulk-action",

    // --- Tags (authenticated CRUD) ---
    TAGS: "/api/tags",
    TAG: (id: string) => `/api/tags/${id}`,

    // --- Link meta (sparkline, trend, preview, health, url-meta) ---
    LINKS_BATCH_META: "/api/links/batch-meta",
    LINK_URL_META: "/api/links/url-meta",
    LINK_SPARKLINE: (id: string) => `/api/links/${id}/sparkline`,
    LINK_TREND: (id: string) => `/api/links/${id}/trend`,
    LINK_PREVIEW: (id: string) => `/api/links/${id}/preview`,
    LINK_HEALTH: (id: string) => `/api/links/${id}/health`,

    // --- Per-link clicks list (paginated; powers the "Cliques" tab) ---
    LINK_CLICKS_LIST: (id: string) => `/api/link/${id}/clicks-list`,

    // --- AUTH: identity, profile, password, email verification ---
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/logout",
      REGISTER: "/api/auth/register",
      PROFILE: "/api/profile",
      ME: "/api/me",
      UPDATE_PROFILE: "/api/profile",
      CHANGE_PASSWORD: "/api/change-password",
      PROFILE_STATS: "/api/profile/stats",
      VERIFY_EMAIL: "/api/auth/verify-email",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
      EMAIL_VERIFICATION_STATUS: "/api/email-verification-status",
      RESEND_VERIFICATION_EMAIL: "/api/resend-verification-email",
      AUTH0_EXCHANGE: "/api/auth/auth0-exchange",
      ONBOARDING_SEEN: "/api/onboarding/seen",
      ACCOUNT: "/api/account",
    },

    // --- Per-link analytics dashboards (one endpoint per tab) ---
    ANALYTICS_DASHBOARD: (linkId: string) =>
      `/api/analytics/link/${linkId}/dashboard`,
    ANALYTICS_GEOGRAPHIC: (linkId: string) =>
      `/api/analytics/link/${linkId}/geographic`,
    ANALYTICS_TEMPORAL: (linkId: string) =>
      `/api/analytics/link/${linkId}/temporal`,
    ANALYTICS_AUDIENCE: (linkId: string) =>
      `/api/analytics/link/${linkId}/audience`,
    ANALYTICS_INSIGHTS: (linkId: string) =>
      `/api/analytics/link/${linkId}/insights`,

    // --- PUBLIC: unauthenticated `/api/public/*` (used by `/shorter`) ---
    PUBLIC: {
      SHORTEN: "/api/public/shorten",
      LINK_BY_SLUG: (slug: string) => `/api/public/link/${slug}`,
      SUGGEST_SLUG: "/api/public/links/suggest-slug",
      ANALYTICS: (slug: string) => `/api/public/analytics/${slug}`,
    },

    // --- REPORTS: aggregated multi-link reports (`/reports` page) ---
    REPORTS: {
      SUMMARY: "/api/reports/summary",
      TIMESERIES: "/api/reports/timeseries",
      BREAKDOWN: "/api/reports/breakdown",
      LINK_PERFORMANCE: "/api/reports/link-performance",
      INSIGHTS: "/api/reports/insights",
      EXPORT_CLICKS: "/api/reports/export/clicks",
    },
  },

  CACHE: {
    ANALYTICS_TTL: 5 * 60 * 1000, // 5 minutos
    LINKS_TTL: 2 * 60 * 1000, // 2 minutos
    USER_TTL: 10 * 60 * 1000, // 10 minutos
  },

  FALLBACK: {
    ENABLED: true,
    RETRY_DELAY: 1000,
    MAX_RETRIES: 2,
  },
};

/**
 * Prefixes an API endpoint path with the configured base URL.
 * Returns the path unchanged when `API_CONFIG.BASE_URL` is empty (dev with Next.js rewrites).
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Returns `true` when `process.env.NODE_ENV === "development"`.
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Returns `true` when `process.env.NODE_ENV === "production"`.
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

/**
 * Returns the HTTP timeout in ms, doubling the default in production
 * to absorb cold-start / network variance.
 */
export const getTimeout = (): number => {
  return isProduction() ? API_CONFIG.TIMEOUT * 2 : API_CONFIG.TIMEOUT;
};

// Exports para compatibilidade com código antigo
export const API_BASE_URL = API_CONFIG.BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    REGISTER: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    LOGOUT: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
    PROFILE: API_CONFIG.ENDPOINTS.AUTH.PROFILE,
    ME: API_CONFIG.ENDPOINTS.AUTH.ME,
    UPDATE_PROFILE: API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE,
    CHANGE_PASSWORD: API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
    VERIFY_EMAIL: API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
    FORGOT_PASSWORD: API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
    RESET_PASSWORD: API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
    EMAIL_VERIFICATION_STATUS:
      API_CONFIG.ENDPOINTS.AUTH.EMAIL_VERIFICATION_STATUS,
    RESEND_VERIFICATION_EMAIL:
      API_CONFIG.ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL,
    AUTH0_EXCHANGE: API_CONFIG.ENDPOINTS.AUTH.AUTH0_EXCHANGE,
    ONBOARDING_SEEN: API_CONFIG.ENDPOINTS.AUTH.ONBOARDING_SEEN,
    PROFILE_STATS: API_CONFIG.ENDPOINTS.AUTH.PROFILE_STATS,
    ACCOUNT: API_CONFIG.ENDPOINTS.AUTH.ACCOUNT,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const REQUEST_TIMEOUT = 30000; // 30 segundos
