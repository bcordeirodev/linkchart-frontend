# Frontend Inventory — `frontend-next/`

> Snapshot date: 2026-05-10. Source: read-only inspection of `src/`, `app/`, and config files.
> Purpose: capture every domain unit exposed by the codebase, name what consumes it, and surface refactor opportunities. **No code changes are made by this document.**

## Conventions

- Path aliases (from `tsconfig.json`): `@/`, `@/pages/*`, `@/shared/*`, `@/features/*`, `@/lib/*`, `@/auth/*`, `@/analytics/*`, `@/links/*`, `@/ui/*`, `@/layout/*`, `@/hooks/*`, `@/api/*`, `@/theme/*`, `@/store/*`, `@/utils/*`, `@/i18n/*`.
- Backend domains are mapped via the `/api/*` proxy to `process.env.API_URL` (see `next.config.ts`).
- Query keys live in `src/lib/query/keys.ts`.
- Endpoints live in `src/lib/api/endpoints.ts` (`API_CONFIG.ENDPOINTS`).

## 1. Features (`src/features/`)

### 1.1 `src/features/analytics/`

**Index/barrel exports:** (from `analytics/index.ts`)

- Re-exports of `./components/dashboard`, `./components/geographic`, `./components/temporal`, `./components/insights`, `./components/audience`
- `useDashboardData` (from `./hooks/useDashboardData`)
- Re-exports of `@/services/analytics.service`
- Types: `ChartsProps`, `MetricsProps` (from `@/types/analytics`)
- `./utils/chartFormatters`

**Components:**

- `components/audience/AudienceAnalysis.tsx` — top-level audience tab, wires `useAudienceData` to charts/metrics/insights with state manager.
- `components/audience/AudienceChart.tsx` — bar/donut composition for device + browser breakdowns.
- `components/audience/AudienceInsights.tsx` — insight cards (highlights and recommendations) for audience data.
- `components/audience/AudienceMetrics.tsx` — KPI tiles (devices, locales, sessions) for audience tab.
- `components/audience/BehaviorSection.tsx` — engagement bars (interactions, session depth).
- `components/audience/LanguageBreakdownChart.tsx` — locale list with progress bars.
- `components/audience/QualitySection.tsx` — quality tier breakdown (organic vs. suspect).
- `components/dashboard/LinkDashboard.tsx` — single-link analytics dashboard composer (cards, charts, sections).
- `components/dashboard/cards/LinkInfoCard.tsx` — header card with link info + active/expired badge.
- `components/dashboard/cards/TimeframeSelector.tsx` — time range chip group (1h/24h/7d/30d/all).
- `components/dashboard/cards/TrafficQualityCard.tsx` — KPI card for traffic quality score.
- `components/dashboard/cards/ViralityCard.tsx` — KPI card for virality coefficient.
- `components/dashboard/charts/DayOfWeekChart.tsx` — weekday clicks bar chart.
- `components/dashboard/charts/DeviceBreakdownChart.tsx` — donut chart for device split.
- `components/dashboard/charts/HourlyClicksChart.tsx` — area chart of hourly clicks.
- `components/dashboard/charts/TopCountriesChart.tsx` — horizontal bar of top countries by clicks.
- `components/geographic/ContinentBreakdown.tsx` — continent-level donut + table.
- `components/geographic/CountryDistributionChart.tsx` — country distribution chart card.
- `components/geographic/GeographicAnalysis.tsx` — geographic tab composer (tabs + charts).
- `components/geographic/GeographicChart.tsx` — combined country/state/city chart panel.
- `components/geographic/GeographicChoropleth.tsx` — world choropleth using `react-simple-maps`.
- `components/geographic/GeographicInsights.tsx` — insight cards for geographic patterns.
- `components/geographic/GeographicMetrics.tsx` — KPI tiles (countries, continents, top city).
- `components/geographic/HeatmapControls.tsx` — refresh/maximize toolbar for heatmap.
- `components/geographic/HeatmapMap.tsx` — Leaflet-style heatmap renderer wrapper.
- `components/geographic/RealTimeHeatmapChart.tsx` — interactive heatmap container.
- `components/insights/BusinessInsights.tsx` — list of business-priority insights.
- `components/insights/InsightsAnalysis.tsx` — insights tab composer.
- `components/insights/RetentionAnalysisChart.tsx` — returning-visitor retention chart.
- `components/insights/SessionDepthChart.tsx` — session depth distribution chart.
- `components/insights/TrafficQualityChart.tsx` — quality score distribution.
- `components/insights/TrafficSourceChart.tsx` — traffic source breakdown chart.
- `components/temporal/DailyTimelineChart.tsx` — daily clicks timeline with trend chips.
- `components/temporal/DeviceByPeriodChart.tsx` — device share segmented by period.
- `components/temporal/HolidayImpactCard.tsx` — card highlighting holiday-day impact.
- `components/temporal/HourDayHeatmapChart.tsx` — hour×day heatmap cells.
- `components/temporal/PeakAnalysisCard.tsx` — peak hours/days summary card.
- `components/temporal/SeasonalDistributionChart.tsx` — season distribution bars (verão/outono/...).
- `components/temporal/TemporalAnalysis.tsx` — temporal tab composer.
- `components/temporal/TemporalChart.tsx` — multi-section temporal charts (weekend, business hours).
- `components/temporal/TemporalInsights.tsx` — insight cards for temporal patterns.
- `components/temporal/TemporalTrendsChart.tsx` — trend lines comparing periods.
- `components/temporal/TimezoneDistributionChart.tsx` — timezone distribution display.

**Hooks (`hooks/`):**

| Hook                | Type     | Endpoint(s) consumed                                                | Query key                                | Notes                                                                                                                      |
| ------------------- | -------- | ------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `useAudienceData`   | useQuery | `GET /api/analytics/link/{id}/audience`                             | `queryKeys.analytics.audience(linkId)`   | Endpoint string is inlined (not from `API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE`); refactor candidate.                       |
| `useDashboardData`  | manual   | `GET /api/analytics/link/{id}/dashboard?hours=&include_charts=true` | (none — uses `useState`/`useEffect`)     | Not migrated to TanStack Query yet; cache key not in `keys.ts`. Endpoint inlined (no `API_CONFIG` constant for dashboard). |
| `useGeographicData` | useQuery | `GET /api/analytics/link/{id}/geographic`                           | `queryKeys.analytics.geographic(linkId)` | Endpoint string is inlined (not from `API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC`); uses `rawEnvelope: true`.               |
| `useInsightsData`   | useQuery | `GET /api/analytics/link/{id}/insights`                             | `queryKeys.analytics.insights(linkId)`   | Endpoint string is inlined (not from `API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS`).                                           |
| `useTemporalData`   | useQuery | `GET /api/analytics/link/{id}/temporal`                             | `queryKeys.analytics.temporal(linkId)`   | Endpoint string is inlined (not from `API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL`).                                           |

**Services consumed:**

- `analyticsService` (re-exported via barrel) from `src/services/analytics.service.ts`.

**Types (`types/`):** none locally; uses `@/types/analytics/*` (`AudienceData`, `DashboardData`, `GeographicData`, `InsightsData`, `TemporalData`, `ChartsProps`, `MetricsProps`).

**Utils (`utils/`):**

- `chartFormatters.ts` — formatters/series builders for ApexCharts (`@/types`).
- `dataMappers.ts` — back-end → front-end shape mappers for analytics responses.
- `dataValidation.ts` — guards/validators for analytics data availability.

### 1.2 `src/features/links/`

**Index/barrel exports:** (from `links/index.ts`)

- Re-exports of `./components/list`, `./components/forms`, `./components/create`, `./components/edit`, `./components/analytics`
- `URLInput`, `URLShortenerForm`
- `LinkActions` (default re-export)
- Hooks: `useLinks`, `useCreateLink`, `useUpdateLink`, `useDeleteLink`, `useLinkById` (from `useLinks`); `useShareAPI`; `useLinkAnalyticsOptimized`
- Types: `./types/link`, `./types/shorter`, `./types/analytics`

**Components:**

- `components/LinkActions.tsx` — sticky action bar (copy / share / QR / open / edit) used on detail screens.
- `components/LinkMetrics.tsx` — KPI tile group (clicks, links, conversion, etc.) for link contexts.
- `components/URLInput.tsx` — controlled MUI text field for URLs with adornment + RHF integration.
- `components/URLShortenerForm.tsx` — anonymous shorten form (URL + safety check + slug availability).
- `components/analytics/ClicksTable.tsx` — paginated/sortable clicks list backed by `useLinkClicks`.
- `components/analytics/LinkAnalyticsTabs.tsx` — tab nav (dashboard/geo/temporal/audience/insights/clicks) for link analytics page.
- `components/create/CreateLinkForm.tsx` — RHF + Zod create-link form using `LinkFormFields`.
- `components/edit/EditLinkForm.tsx` — RHF + Zod edit-link form prefilled by `useLinkById`.
- `components/forms/LinkFormFields.tsx` — shared field set (URL, title, slug, schedule, UTM, click_limit).
- `components/forms/LinkFormSchema.ts` — Zod schema, blocked domains, reserved slugs, default values, type `LinkFormData`.
- `components/forms/UrlSafetyIndicator.tsx` — visual chip from `useUrlSafetyCheck` status (safe/unsafe/error).
- `components/list/DeleteConfirmDialog.tsx` — MUI confirm dialog for link deletion.
- `components/list/LinkActionsInline.tsx` — inline copy + analytics icon buttons used in list rows.
- `components/list/LinkActionsMenu.tsx` — kebab menu (edit/QR/delete) used in list rows.
- `components/list/LinkCardRich.tsx` — rich link card with preview thumb, sparkline, trend, health.
- `components/list/LinkHealthBadge.tsx` — colored health dot/text from `LinkHealth` payload.
- `components/list/LinkPreviewThumb.tsx` — favicon/preview image renderer with fallback.
- `components/list/LinkSparkline.tsx` — ApexCharts sparkline of recent clicks.
- `components/list/LinkTrendBadge.tsx` — up/down/flat trend chip from `LinkTrend`.
- `components/list/LinksEmptyState.tsx` — empty/filtered states with CTA.
- `components/list/LinksFilters.tsx` — search + sort/filter chips for list page.
- `components/list/LinksHeader.tsx` — page header with title + actions.
- `components/list/LinksHeaderActions.tsx` — header buttons (e.g., "Create link").
- `components/list/LinksMobileCards.tsx` — mobile card list with inline actions, status badges, deletion confirm.

**Hooks (`hooks/`):**

| Hook                        | Type        | Endpoint(s) consumed                                                  | Query key                           | Notes                                                                                                                                           |
| --------------------------- | ----------- | --------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `useLinks`                  | useQuery    | `GET /api/links` (via `linkService.all`)                              | `queryKeys.links.list()`            | —                                                                                                                                               |
| `useCreateLink`             | useMutation | `POST /api/links` (via `linkService.save`)                            | invalidates `queryKeys.links.all()` | Dispatches Redux toast on error.                                                                                                                |
| `useUpdateLink`             | useMutation | `PUT /api/links/{id}` (via `linkService.update`)                      | invalidates `queryKeys.links.all()` | —                                                                                                                                               |
| `useDeleteLink`             | useMutation | `DELETE /api/links/{id}` (via `linkService.remove`)                   | invalidates `queryKeys.links.all()` | —                                                                                                                                               |
| `useLinkById`               | useQuery    | `GET /api/links/{id}` (via `linkService.findOne`)                     | `queryKeys.links.detail(id)`        | —                                                                                                                                               |
| `useLinkAnalyticsOptimized` | manual      | `GET /api/links/{id}` (via `linkService.findOne`)                     | (none)                              | Wraps `linkService.findOne` and hydrates a stub `LinkAnalyticsData` for backwards compat; tab content is fetched by individual analytics hooks. |
| `useLinkClicks`             | manual      | `GET /api/link/{id}/clicks-list` (via `linkService.getClicksList`)    | (none)                              | Local pagination/sort/search state. No TanStack Query.                                                                                          |
| `useLinksMeta`              | useQuery    | `POST /api/links/batch-meta` (via `linkMetaService.batchMeta`)        | `queryKeys.links.meta(ids)`         | —                                                                                                                                               |
| `usePublicURLShortener`     | manual      | `POST /api/public/shorten` (via `publicLinkService.createPublicLink`) | (none)                              | Wraps validate/format + create.                                                                                                                 |
| `useShareAPI`               | manual      | (no API; Web Share + clipboard fallback)                              | (n/a)                               | —                                                                                                                                               |
| `useSlugAvailability`       | manual      | `GET /api/public/link/{slug}` (via `publicLinkService.getLinkBySlug`) | (n/a)                               | Polls 500ms after edit; uses `ApiError.status === 404` to mean available.                                                                       |
| `useUrlSafetyCheck`         | manual      | `POST /api/check-url` (Next.js internal route)                        | (n/a)                               | Internal Next.js route, server-side Google Safe Browsing check.                                                                                 |

**Services consumed:**

- `linkService` from `src/services/link.service.ts`
- `linkMetaService` from `src/services/link-meta.service.ts`
- `publicLinkService` from `src/services/link-public.service.ts` (via `useSlugAvailability`, `usePublicURLShortener`)

**Types (`types/`):**

- `analytics.ts` — `LinkAnalyticsData` and helper shapes for the per-link dashboard.
- `click.ts` — `LinkClickItem`, `LinkClicksMeta`, `LinkClicksListParams`, `LinkClicksListResponse` for the clicks-list endpoint.
- `forms.ts` — form-specific helper types (UTM groupings, status options).
- `link.ts` — re-exports core link types and adds module-specific aliases.
- `shorter.ts` — types for the anonymous shorten path.

**Utils (`utils/`):**

- `linkStatus.ts` — derives `active|inactive|scheduled|expired` from `expires_at`/`starts_in`/`is_active` with color map.

### 1.3 `src/features/profile/`

**Index/barrel exports:** (from `profile/index.ts`)

- `ProfileForm`, `ProfileSidebar`, `PasswordChangeForm` (component re-exports)
- `profileService` (from `@/services/profile.service`)
- Type `UserProfile` (from `./types/user`)
- Type `User` (from `@/types`)

**Components:**

- `components/PasswordChangeForm.tsx` — RHF + Zod form for password change with show/hide and Redux toast.
- `components/ProfileForm.tsx` — name/email form for current user with validation and PUT submit.
- `components/ProfileSidebar.tsx` — sidebar showing avatar, role, verified state, account age.
- `components/styles/Profile.styled.tsx` — styled MUI containers used by `ProfileForm`.

**Hooks (`hooks/`):** none. Profile uses `useAuth` (from `@/lib/auth/AuthContext`) and `profileService` directly.

**Services consumed:**

- `profileService` from `src/services/profile.service.ts` (`getCurrentUser`, `updateProfile`)
- `authService` (indirect, via `useAuth` for `changePassword`)

**Types (`types/`):**

- `UserModel.ts` — factory `UserModel(data?: PartialDeep<User>): User` filling defaults via `lodash.defaults`.
- `api.ts` — DTOs `LoginResponse`, `RegisterRequest`, `UserResponse`.
- `user.ts` — re-exports `LoginResponse`/`UserResponse`/`RegisterRequest`, adds `UserProfile`, `UserPreferences`, `UserSession`, `UserActivity`.

**Utils (`utils/`):** none.

### 1.4 `src/features/public-analytics/`

**Index/barrel exports:** (from `public-analytics/index.ts`)

- `type * from "./types"` (re-exports all types)
- `usePublicAnalytics` (hook)
- Re-exports of `./components` (charts, info, metrics, states)
- `PublicAnalyticsPageContent` (Next.js App Router adapter accepting `slug` as prop)

**Components:**

- `PublicAnalyticsPageContent.tsx` — page composer for `/public-analytics/[slug]`; orchestrates loading/error/data states.
- `components/charts/PublicCharts.tsx` — limited charts shown to anonymous visitors (devices, locations, etc.).
- `components/info/AnalyticsInfo.tsx` — informational panel with `UpgradeCTA` and navigation back to `/shorter`.
- `components/info/LinkHeroCard.tsx` — hero card showing the short URL, copy button, and CTA to original link.
- `components/info/PublicCtaBlock.tsx` — thin wrapper around `SignUpCtaCard` (translated).
- `components/metrics/PublicMetrics.tsx` — KPI tiles (total clicks, last activity, days online).
- `components/states/ErrorState.tsx` — error layout for invalid/missing slug.
- `components/states/LoadingState.tsx` — skeleton/loader state for basic analytics.

**Hooks (`hooks/`):**

| Hook                 | Type       | Endpoint(s) consumed                                                                        | Query key                                                                  | Notes                                                                                                       |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `usePublicAnalytics` | useQuery×2 | `GET /api/public/link/{slug}` and `GET /api/public/analytics/{slug}` (via inline `api.get`) | `queryKeys.analytics.publicLink(slug)`, `queryKeys.analytics.public(slug)` | Endpoint strings inlined; not in `API_CONFIG.ENDPOINTS`. Returns combined state + actions (copy, navigate). |

**Services consumed:**

- `publicLinkService.copyToClipboard` from `src/services/link-public.service.ts`.

**Types (`types/`):**

- `index.ts` — `PublicLinkData`, `PublicAnalyticsData`, `PublicAnalyticsState`, `PublicAnalyticsActions`.

**Utils (`utils/`):** none.

### 1.5 `src/features/redirect/`

**Index/barrel exports:** (from `redirect/index.ts`)

- `Redirect`, `SmartRedirect`, `RedirectStats`
- Re-exports of `./components/RedirectSettings`
- `useRedirectWithDelay` (and default)

**Components:**

- `components/Redirect.tsx` — `useEffect` + `router.push` wrapper for declarative redirects.
- `components/RedirectClientPage.tsx` — full-page redirect UI (countdown, safety badge, error/manual fallback). **FORBIDDEN ZONE-adjacent** (referenced by `/r/[slug]`).
- `components/RedirectDynamic.tsx` — `dynamic(() => import('./RedirectClientPage'), { ssr: false })` thin wrapper. **FORBIDDEN ZONE.**
- `components/RedirectLoader.tsx` — animated loading screen during slug resolution.
- `components/RedirectSettings.tsx` — admin settings card for redirect behaviour (delay, show stats).
- `components/RedirectStats.tsx` — small stats panel shown during the wait state.
- `components/SmartRedirect.tsx` — wraps `useRedirectWithDelay` + `LoadingWithRedirect` for post-auth flows.
- `components/styles/Redirect.styled.ts` — MUI styled containers shared by redirect components.

**Hooks (`hooks/`):**

| Hook                   | Type   | Endpoint(s) consumed | Query key | Notes                                                                                                                               |
| ---------------------- | ------ | -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `useRedirectWithDelay` | manual | (no API)             | (n/a)     | Returns `{ isRedirecting, countdown, startRedirect, cancelRedirect, redirectImmediately }`. Optionally clears `sessionRedirectUrl`. |

**Services consumed:** none. Uses `resetSessionRedirectUrl` from `@/lib/auth/sessionRedirectUrl`.

**Types (`types/`):** none.

**Utils (`utils/`):** none.

### 1.6 `src/features/shorter/`

**Index/barrel exports:** (from `shorter/index.ts`)

- Re-exports of `./components` (`ErrorAlert`, `RedirectingState`, `ShorterForm`, `ShorterHero`, `ShorterStats`, `ShorterSuccessState`, `UpgradeCTA`)
- `useShorter` (via `./hooks` barrel)

**Components:**

- `components/ErrorAlert.tsx` — animated MUI Alert dismissible on close.
- `components/RedirectingState.tsx` — loading state shown right before navigating to public-analytics.
- `components/ShorterForm.tsx` — wrapper around `URLShortenerForm` from `@/features/links` for the public page.
- `components/ShorterHero.tsx` — animated hero with state-aware copy.
- `components/ShorterStats.tsx` — animated stats banner (total links, clicks, countries).
- `components/ShorterSuccessState.tsx` — success card with copy + redirect CTA.
- `components/UpgradeCTA.tsx` — "create account for full analytics" CTA (used here and re-used by `public-analytics`).

**Hooks (`hooks/`):**

| Hook         | Type   | Endpoint(s) consumed               | Query key | Notes                                                                                            |
| ------------ | ------ | ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `useShorter` | manual | (no API directly; navigation only) | (n/a)     | Holds success/error state, copies short URL on success, navigates to `/public-analytics/{slug}`. |

**Services consumed:** `publicLinkService` (indirectly via `URLShortenerForm`/`usePublicURLShortener`); `publicLinkService.getPublicAnalyticsUrl` directly in `useShorter`.

**Types (`types/`):** none (uses `PublicLinkResponse` from `link-public.service`).

**Utils (`utils/`):** none.

## 2. Services (`src/services/`)

| File                     | Class               | Methods                                                                                                                                                                              | Endpoints (REST)                                                                                                                                                                                                                                                                                                                      | Backend domain (Laravel)                                                                                  |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `base.service.ts`        | `BaseService`       | `get/post/put/delete` (protected); `validateId/validateRequired/createErrorMessage` (helpers)                                                                                        | (uses `api` ApiClient — no direct paths)                                                                                                                                                                                                                                                                                              | (n/a — abstract base)                                                                                     |
| `auth.service.ts`        | `AuthService`       | `signIn`, `signUp`, `getMe`, `signOut`, `updateProfile`, `verifyEmail`, `forgotPassword`, `resetPassword`, `getEmailVerificationStatus`, `resendVerificationEmail`, `changePassword` | `POST /api/auth/login` (form-urlencoded), `POST /api/auth/register`, `GET /api/me`, `POST /api/logout`, `PUT /api/profile`, `POST /api/auth/verify-email`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET /api/email-verification-status`, `POST /api/resend-verification-email`, `PUT /api/change-password` | `Http/Controllers/Auth/AuthController`                                                                    |
| `link.service.ts`        | `LinkService`       | `save`, `update`, `all`, `findOne`, `remove`, `getAnalytics`, `getClicksList`                                                                                                        | `POST /api/links`, `PUT /api/links/{id}`, `GET /api/links`, `GET /api/links/{id}`, `DELETE /api/links/{id}`, `GET /api/links/{id}/analytics`, `GET /api/link/{id}/clicks-list` (rawEnvelope, query params)                                                                                                                            | `Http/Controllers/Links/LinkController`                                                                   |
| `link-meta.service.ts`   | `LinkMetaService`   | `batchMeta(ids, days=7)`                                                                                                                                                             | `POST /api/links/batch-meta`                                                                                                                                                                                                                                                                                                          | `Http/Controllers/Links/LinkController` (or sibling `LinkMetaController`)                                 |
| `link-public.service.ts` | `PublicLinkService` | `createPublicLink`, `getLinkBySlug`, `getPublicAnalytics`, `validateUrl`, `formatUrl`, `getPublicAnalyticsUrl`, `copyToClipboard`                                                    | `POST /api/public/shorten`, `GET /api/public/link/{slug}`, `GET /api/public/analytics/{slug}` (paths inlined as string literals — **not in `API_CONFIG.ENDPOINTS`**)                                                                                                                                                                  | `Http/Controllers/Links/PublicLinkController` + `Http/Controllers/Analytics/AnalyticsController` (public) |
| `analytics.service.ts`   | `AnalyticsService`  | `getAnalytics`, `getLinkAnalytics`, `getLinkGeographicData`, `getLinkInsights`                                                                                                       | `GET /api/analytics`, `GET /api/links/{id}/analytics`, `GET /api/analytics/link/{id}/geographic`, `GET /api/analytics/link/{id}/insights`                                                                                                                                                                                             | `Http/Controllers/Analytics/AnalyticsController`                                                          |
| `profile.service.ts`     | `ProfileService`    | `getCurrentUser`, `updateProfile`                                                                                                                                                    | `GET /api/me`, `PUT /api/profile`                                                                                                                                                                                                                                                                                                     | `Http/Controllers/Auth/AuthController`                                                                    |
| `index.ts`               | (barrel)            | (n/a) — re-exports `BaseService`, classes, and singleton instances `authService/linkService/profileService/analyticsService`; re-exports `UserProfile` type                          | (n/a)                                                                                                                                                                                                                                                                                                                                 | (n/a)                                                                                                     |

Cross-check vs. `src/lib/api/endpoints.ts`:

- **Missing from `API_CONFIG.ENDPOINTS`** (used as inline string literals): `/api/public/shorten`, `/api/public/link/{slug}`, `/api/public/analytics/{slug}` (in `link-public.service.ts`); `/api/analytics/link/{id}/audience`, `/api/analytics/link/{id}/temporal`, `/api/analytics/link/{id}/insights`, `/api/analytics/link/{id}/geographic`, `/api/analytics/link/{id}/dashboard` (in analytics hooks). The constants `ANALYTICS_GEOGRAPHIC/TEMPORAL/AUDIENCE/INSIGHTS/COMPREHENSIVE` exist but are only consumed by `analyticsService`, not by the React hooks. See § 7.
- **Defined in `endpoints.ts` but unused**: `TEST_ANALYTICS`, `TEST_LINK_ANALYTICS`, `LOGS*`, `REPORTS_DASHBOARD`, `REPORTS_EXECUTIVE`, `ANALYTICS_COMPREHENSIVE` (no consumer found). See § 8.

## 3. Shared hooks (`src/shared/hooks/`)

| Hook file               | Purpose                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `useClipboard.ts`       | Default-export `useClipboard({ timeout, onSuccess, onError })` returning `{ copied, copy, reset }`.                                            |
| `useDebounce.ts`        | Returns a debounced version of a callback (simple `setTimeout` debounce, single trailing edge).                                                |
| `useLocation.ts`        | App-Router shim of `react-router-dom`'s `useLocation`; returns `{ pathname, state: null }`.                                                    |
| `useNavigate.ts`        | App-Router shim of `react-router-dom`'s `useNavigate`; supports `(path, { replace, state })` and `back()` on `-1`.                             |
| `usePathname.ts`        | Default-export wrapper around Next.js `usePathname()`.                                                                                         |
| `useSearchParams.ts`    | Tuple-returning shim of `react-router-dom`'s `useSearchParams` for App Router compatibility.                                                   |
| `useThemeMediaQuery.ts` | Convenience wrapper combining MUI `useTheme` + `useMediaQuery((theme) => string)`.                                                             |
| `hooks.ts`              | Type definitions only (UseAsync*, UseLinks*, UseAuth*, UseForm*, etc.); none of these types are imported anywhere outside this file — see § 8. |
| `index.ts`              | Barrel that re-exports the hooks above and the types from `hooks.ts`.                                                                          |

## 4. Shared UI

### `src/shared/ui/base/`

| File                        | Purpose                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `AnalyticsStateManager.tsx` | Wraps analytics children with loading spinner / empty / error states + retry button.                      |
| `AppLogo.tsx`               | Brand logo + optional text; configurable size and `sx` for the text label.                                |
| `ChartCard.tsx`             | Title + body Card wrapper for charts ("base" variant; **same name as data-display ChartCard — see § 7**). |
| `EmptyState.tsx`            | Generic empty-state panel with icon, title, description, optional action button.                          |
| `EnhancedPaper.tsx`         | MUI `Paper` with glass effect + theme-aware elevation tokens.                                             |
| `GradientButton.tsx`        | Themed `Button` rendering with the design-system gradient palette.                                        |
| `MetricCardOptimized.tsx`   | KPI card (icon, value, label, delta) tuned for elevation tokens; used heavily by dashboard.               |
| `PageHeader.tsx`            | Standardized page header with title, breadcrumbs, and optional action area.                               |
| `ResponsiveContainer.tsx`   | Container with responsive spacing variants (`page`, `section`); reads from `responsiveSpacing`.           |
| `SafeTypography.tsx`        | `Typography` wrapper that sanitizes potentially user-supplied content.                                    |
| `TabDescription.tsx`        | Inline tab-level explainer with icon + optional secondary line.                                           |
| `TabPanel.tsx`              | Accessible MUI tab panel wrapper with fade transition.                                                    |
| `index.ts`                  | Barrel for the above.                                                                                     |
| `styles/UI.styled.ts`       | Shared styled-component primitives used by base components.                                               |

### `src/shared/ui/data-display/`

| File                             | Purpose                                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `ApexChartWrapper.tsx`           | Dynamic-imported `react-apexcharts` wrapper with theme-aware palette and i18n no-data text.                            |
| `ApexChartWrapper.styled.tsx`    | Styled `Box`/`Paper`/`Typography` primitives consumed by `ApexChartWrapper`.                                           |
| `ChartCard.tsx`                  | Title + icon + body Card wrapper for charts ("data-display" variant; **overlap with `base/ChartCard.tsx` — see § 7**). |
| `DataTable.tsx`                  | `MaterialReactTable`-based table with shared defaults (toolbar, density, pagination).                                  |
| `DataTableTopToolbar.tsx`        | Custom MRT top toolbar (search, density, columns) responsive to mobile.                                                |
| `utils/parseFromValuesOrFunc.ts` | MRT helper that resolves `T                                                                                            | (arg: U) => T`to`T`; also exports `getValueAndLabel`. |
| `index.ts`                       | Barrel for the above.                                                                                                  |

### `src/shared/ui/feedback/`

| File                                    | Purpose                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| `EmailVerificationBanner.tsx`           | Top-of-page banner alerting unverified users with resend-email action.                  |
| `Loading.tsx`                           | Global loading component with theme-aware variants (replacing FuseLoading).             |
| `Message.tsx`                           | Notistack-bridged toast component using design-system tokens (accent stripe, progress). |
| `index.ts`                              | Barrel for the feedback group + skeletons.                                              |
| `skeletons/LinkFormSkeleton.tsx`        | Skeleton for create/edit link forms (supports `isEdit` mode).                           |
| `skeletons/LinkListSkeleton.tsx`        | Skeleton for the links list page (configurable count, mobile vs. desktop).              |
| `skeletons/PageLoadingSkeleton.tsx`     | Generic page-level Suspense fallback with `MainLayout` chrome.                          |
| `skeletons/ProfileSkeleton.tsx`         | Skeleton for the profile page.                                                          |
| `skeletons/PublicAnalyticsSkeleton.tsx` | Skeleton for the public-analytics page (uses `PublicLayout`).                           |
| `skeletons/QRCodeSkeleton.tsx`          | Skeleton for the QR code page.                                                          |
| `skeletons/index.ts`                    | Barrel for the skeleton group.                                                          |

### `src/shared/ui/icons/`

| File          | Purpose                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `AppIcon.tsx` | `forwardRef` icon dispatcher resolving names from `AppIcons`/`FlatAppIcons` and applying intent colors. |
| `AppIcons.ts` | Centralized re-export map of curated Lucide icons grouped by category, plus `IconIntents`.              |
| `SvgIcon.tsx` | Themed SVG renderer with size/color props and MUI integration.                                          |
| `index.ts`    | Barrel + legacy aliases.                                                                                |

### `src/shared/ui/navigation/`

| File                 | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `Link.tsx`           | Smart link: chooses Next `Link` vs. anchor based on `href`, fully MUI-styled. |
| `PageBreadcrumb.tsx` | MUI `Breadcrumbs` rendered from the current pathname segments.                |
| `index.ts`           | Barrel for the navigation group.                                              |

### `src/shared/ui/patterns/`

| File               | Purpose                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `FormActions.tsx`  | Standardized form footer (submit + cancel) with loading spinner and consistent layout. |
| `TableActions.tsx` | Standardized icon-button row (analytics, edit, copy, etc.) for table cells.            |
| `index.ts`         | Barrel for the patterns group.                                                         |

### `src/shared/components/`

| File                       | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `CookieConsentInit.tsx`    | Mounts vanilla-cookieconsent on first render using the project config.                 |
| `ads/AdSlot.tsx`           | Renders a Google AdSense slot via `<ins>` + push to `adsbygoogle`.                     |
| `cta/SignUpCtaCard.tsx`    | Reusable CTA card pushing visitors to `/sign-up` (consumed by public-analytics).       |
| `routing/HomeRedirect.tsx` | Auth-aware home redirect: pushes to `/links` when authenticated, `/shorter` otherwise. |
| `index.ts`                 | Barrel for the above.                                                                  |

### `src/shared/layout/`

| File                             | Purpose                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `AuthLayout.tsx`                 | Layout for auth screens (sign-in/up/etc.) with logo, gradient panel, language selector. |
| `BenefitsSection.tsx`            | Feature-benefits grid used on auth/landing screens (icons + copy).                      |
| `ErrorLayout.tsx`                | Standardized error page layout with status code chip, message, and home/back actions.   |
| `HeroSection.tsx`                | Animated hero section used on the public landing variant.                               |
| `LoadingWithRedirect.tsx`        | Loader screen with progress bar and message — used during cross-page redirects.         |
| `MainLayout.tsx`                 | Authenticated app shell (Navbar + Footer + content) with theme-aware spacing.           |
| `PublicLayout.tsx`               | Public chrome with optional minimal variant (used by shorter, public-analytics).        |
| `components/Footer.tsx`          | App footer with links, copyright, and language selector.                                |
| `components/Navbar.tsx`          | Top navigation bar with logo, profile menu, and routing.                                |
| `components/index.ts`            | Barrel for `Navbar` + `Footer`.                                                         |
| `core/Layout.tsx`                | Layout dispatcher choosing the layout style (Fuse-derived; currently always `layout1`). |
| `core/LayoutProvider.tsx`        | Provides layout settings context, merging defaults with `lib/settingsConfig`.           |
| `core/LayoutSettingsContext.tsx` | React context for layout settings (theme/navbar/toolbar/footer).                        |
| `core/index.ts`                  | Barrel for the layout core (provider, context, hook, types).                            |
| `core/types.ts`                  | TypeScript types for layout settings (`LayoutSettingsConfigType`, etc.).                |
| `core/useLayoutSettings.tsx`     | Typed hook to read/write layout settings (persists to localStorage).                    |
| `index.ts`                       | Barrel for the layout group.                                                            |
| `styles/Navbar.styled.ts`        | Styled MUI primitives for the navbar (logo, brand text, mobile drawer).                 |

## 5. Lib (`src/lib/`)

### 5.1 `lib/api/`

- `client.ts` — `ApiClient` class. Public surface: `get/post/put/patch/delete/postForm/upload`. Handles JWT injection from `localStorage.token`, envelope unwrap (`{data, meta?, message?}`), error normalization (`{error: {code, message, details?}}`). Exports `api` singleton and `ApiError` class.
- `endpoints.ts` — `API_CONFIG.ENDPOINTS` constant: canonical list of REST paths and `HTTP_STATUS` codes; also exports `API_BASE_URL`, `API_ENDPOINTS` (compat alias), `buildApiUrl`, `buildTestUrl`, `isDevelopment`, `isProduction`, `getTimeout`.

### 5.2 `lib/query/`

- `client.ts` — TanStack Query `QueryClient` factory with `staleTime: ANALYTICS_TTL`, `retry: 1`, `refetchOnWindowFocus: false`.
- `keys.ts` — `queryKeys` factory: `links.{all,list,detail,meta}`, `analytics.{temporal,geographic,audience,insights,public,publicLink}`. **No `dashboard` key** despite `useDashboardData` consuming `/api/analytics/link/{id}/dashboard`; that hook is also still using bespoke `useState`/`useEffect` rather than TanStack Query.

### 5.3 `lib/store/` (Redux Toolkit)

- `store.ts` — `makeStore(preloadedState?)` factory; exports `RootState`, `AppDispatch`, `AppStore`.
- `rootReducer.ts` — `combineSlices({}).withLazyLoadedSlices<LazyLoadedSlices>()`; `LazyLoadedSlices` is an empty interface for module augmentation.
- `messageSlice.ts` — Mobile-first global toast slice with multiple variants (`success/error/warning/info`), auto-hide config, custom actions.
- `middleware.ts` — `createDynamicMiddleware()` instance + typed `addAppMiddleware`/`withAppMiddleware`/`createAppDispatchWithMiddlewareHook`.
- `hooks.ts` — Typed `useAppDispatch`, `useAppSelector`, `useAppStore` (via `withTypes`).

### 5.4 `lib/auth/`

- `AuthContext.tsx` — `AuthProvider` + `useAuth` (user, isAuthenticated, login, logout, updateUser, refreshUser).
- `useUser.tsx` — `useUser` wrapper exposing `data`, `isGuest`, `signOut`, `refreshUser`.
- `AuthGuardRedirect.tsx` — Guard component validating roles and redirecting unauthorized users; uses `FuseUtils.hasPermission` and `sessionRedirectUrl`.
- `authApi.ts` — Functions to fetch/create/update users via `api`; uses `UserModel` to populate defaults.
- `authRoles.ts` — Role constants `admin`, `staff`, `user`, `onlyGuest` (Fuse-derived).
- `components/EmailVerificationGuard.tsx` — Guards `(app)/*` layout — REDIRECTS unverified users to `/email-verification-pending`. **FORBIDDEN ZONE.**
- `forms/AuthJsForm.tsx` — Generic auth form scaffolding (used by SignIn/SignUp/etc.).
- `forms/authFieldStyles.ts` — Shared MUI `sx` for auth form fields.
- `forms/signinErrors.ts` — Maps backend error codes to user-facing messages.
- `sessionRedirectUrl.ts` — Helpers `setSessionRedirectUrl/getSessionRedirectUrl/resetSessionRedirectUrl` for post-login routing.

### 5.5 `lib/i18n/`

- `config.ts` — `initI18n()` and `detectAndApplyLanguage()`; bootstraps i18next with imported JSON namespaces.
- `index.ts` — Barrel re-exporting `i18n`, `useLanguage`, `LanguageSelector`, types.
- `types.ts` — Module augmentation declaring typed translation namespaces for i18next.
- `components/LanguageSelector.tsx` — Compact pill button group switching between EN/PT-BR.
- `hooks/useLanguage.ts` — Returns `{ currentLanguage, switchLanguage, isEnglish, isPortuguese }`.
- `locales/{en,pt-BR}/{analytics,auth,common,links,profile,public}.json` — Translation files (12 total).

### 5.6 `lib/theme/`

(Tree summary — full per-file purpose deferred to Phase 4 README; here just structure.)

- `MainThemeProvider.tsx`, `index.ts`, `themes.ts`, `designSystem.ts`, `globalStyles.ts`, `iconDefaults.ts`, `colors/{chart,dark,light,semantic,index}.ts`, `config/{index,muiComponents,optimizedSettings}.ts`, `hooks/{fuseThemeHooks,useChartHeight,useResponsive,index}.ts`, `types/{index,theme}.ts`, `utils/{animationUtils,chartColorUtils,colorUtils,gradientUtils,responsiveUtils,shadowUtils,spacingUtils,index}.ts`.

### 5.7 `lib/utils/`

- `ErrorBoundary.tsx` — Class-component error boundary with collapsible details, retry/back actions, dev-only stack trace.
- `authUtils.ts` — `FuseUtils` class with static `hasPermission(authArr, userRole)`; exported as default.
- `shortUrl.ts` — `getShortUrl(slug)` builds `${NEXT_PUBLIC_REDIRECT_URL}/{slug}` (defaults to `http://localhost:8000/r`).
- `index.ts` — Barrel re-exporting `ErrorBoundary` and auth utils.

### 5.8 `lib/providers/`

- `Providers.tsx` — Composes `LocalizationProvider` (date-fns), `QueryClientProvider`, Redux `Provider`, `AuthProvider`, `LayoutProvider`, `MainThemeProvider`, `SnackbarProvider`, `AppContext.Provider`; also calls `initI18n()`/`detectAndApplyLanguage()`.

### 5.9 `lib/seo/`

- `structuredData.ts` — Schema.org JSON-LD helpers: `buildWebApplicationSchema`, `buildOrganizationSchema`, etc., consumed by `app/layout.tsx`.

### 5.10 `lib/ads/`

- `components/GoogleAd.tsx` — Renders a single AdSense unit using `<ins>` + `adsbygoogle.push`.
- `components/GoogleAdsSpace.tsx` — Wrapper sizing/centering an `AdSlot` with optional caption.
- `components/index.ts` — Barrel.
- `config/adsConfig.ts` — Slot IDs, sizes, and feature flags.
- `hooks/useGoogleAds.ts` — Loads the AdSense script once and exposes ready/refresh state.
- `index.ts` — Barrel.

### 5.11 `lib/consent/`

- `cookie-consent.ts` — `cookieConsentConfig` with consent-mode bridging to `gtag('consent', 'update', ...)`.
- `cookieconsent.esm.js` — Vendored vanilla-cookieconsent (excluded from ESLint).

### 5.12 `lib/AppContext.ts` and `lib/settingsConfig.ts`

- `AppContext.ts` — Empty `Record<string, never>` context exported as default; used by `lib/providers/Providers.tsx` only. Effectively a no-op placeholder kept for layout-provider compatibility.
- `settingsConfig.ts` — Default `LayoutSettingsConfigType` (layout1, navbar/toolbar/footer flags); imported only by `shared/layout/core/LayoutProvider.tsx`.

## 6. App routes (`app/`)

### 6.1 Root

- `app/layout.tsx` — Root HTML, `Inter` font, metadata, providers (`Providers`), JSON-LD organization schema, `CookieConsentInit`, and global stylesheet imports.
- `app/page.tsx` — `'use client'` page that renders `HomeRedirect` (auth-aware redirect to `/links` or `/shorter`).
- `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx` — Root loading and error boundaries.
- `app/not-found.tsx` — 404 (renders `page-components/system/NotFoundPage.tsx`).
- `app/401/page.tsx` — 401 (renders `page-components/system/UnauthorizedPage.tsx`).
- `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts` — Next.js metadata routes.
- `app/api/health/route.ts` — Health-check API route (frontend-internal, takes precedence over rewrites).
- `app/api/check-url/route.ts` — Server-side URL safety check (uses `GOOGLE_SAFE_BROWSING_KEY`).

### 6.2 `(app)` group — authenticated

**Layout:** `app/(app)/layout.tsx` wraps with `MainLayout` + `EmailVerificationGuard`.
**Guard:** `EmailVerificationGuard` (client-side; **FORBIDDEN ZONE**). Layout-level loading/error: `loading.tsx`, `error.tsx`.

| Route                   | Page component                            | Feature consumed                                                     |
| ----------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| `/analytics`            | `app/(app)/analytics/page.tsx`            | (server `redirect('/links')` — placeholder)                          |
| `/links`                | `app/(app)/links/page.tsx`                | `features/links` (list, via `pages/links/LinkListPage`)              |
| `/links/create`         | `app/(app)/links/create/page.tsx`         | `features/links` (create)                                            |
| `/links/edit/[id]`      | `app/(app)/links/edit/[id]/page.tsx`      | `features/links` (edit)                                              |
| `/links/analytics/[id]` | `app/(app)/links/analytics/[id]/page.tsx` | `features/analytics` (single-link dashboard via `LinkAnalyticsTabs`) |
| `/links/qr/[id]`        | `app/(app)/links/qr/[id]/page.tsx`        | `features/links` (QR rendering)                                      |
| `/profile`              | `app/(app)/profile/page.tsx`              | `features/profile`                                                   |

### 6.3 `(auth)` group — unauthenticated forms

**Layout:** `app/(auth)/layout.tsx` (no `MainLayout` chrome; sets `robots: { index: false, follow: true }` metadata). Has `error.tsx` boundary.

| Route                         | Page component                                   | Feature consumed                                              |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| `/sign-in`                    | `app/(auth)/sign-in/page.tsx`                    | `page-components/auth/SignInPage.tsx` (uses `lib/auth/forms`) |
| `/sign-up`                    | `app/(auth)/sign-up/page.tsx`                    | `page-components/auth/SignUpPage.tsx`                         |
| `/sign-out`                   | `app/(auth)/sign-out/page.tsx`                   | `page-components/auth/SignOutPage.tsx`                        |
| `/forgot-password`            | `app/(auth)/forgot-password/page.tsx`            | `page-components/auth/ForgotPasswordPage.tsx`                 |
| `/reset-password`             | `app/(auth)/reset-password/page.tsx`             | `page-components/auth/ResetPasswordPage.tsx`                  |
| `/verify-email`               | `app/(auth)/verify-email/page.tsx`               | `page-components/auth/VerifyEmailPage.tsx`                    |
| `/email-verification-pending` | `app/(auth)/email-verification-pending/page.tsx` | `page-components/auth/EmailVerificationPendingPage.tsx`       |

### 6.4 `(public)` group — anonymous-accessible

**Layout:** `app/(public)/layout.tsx` (pass-through; pages set their own chrome via `PublicLayout`).

| Route                      | Page component                                                                         | Feature consumed                         |
| -------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/shorter`                 | `app/(public)/shorter/page.tsx` + `ShorterClientPage.tsx`                              | `features/shorter`                       |
| `/r/[slug]`                | `app/(public)/r/[slug]/page.tsx` (`generateMetadata` server fetch + `RedirectDynamic`) | `features/redirect` — **FORBIDDEN ZONE** |
| `/public-analytics/[slug]` | `app/(public)/public-analytics/[slug]/page.tsx`                                        | `features/public-analytics`              |
| `/privacy`                 | `app/(public)/privacy/page.tsx`                                                        | (static)                                 |
| `/support`                 | `app/(public)/support/page.tsx`                                                        | (static)                                 |
| `/terms`                   | `app/(public)/terms/page.tsx`                                                          | (static)                                 |

### 6.5 Middleware

- `middleware.ts` — Sets security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `X-DNS-Prefetch-Control`); matcher excludes `_next/static`, `_next/image`, `favicon.ico`, `og-default.png`. **FORBIDDEN ZONE — do not extend.**

## 7. Refactor opportunities

### 7.1 Risk: low (rename/move local helpers, no public API impact)

- [ ] **R-LOW-1:** Rename `src/shared/hooks/hooks.ts` → `src/shared/hooks/types.ts` — _Why:_ file is types-only; the generic name "hooks" inside `hooks/` is confusing and currently 0 of its exported types are imported anywhere outside the file. _Call-site count:_ 0 external imports of the type symbols (verified by grep on `UseAsyncState|UseLinks|UseAuth|UseAnalytics|UseMetrics|UsePerformance|UseClipboardState|UseDebounceOptions|UseLocalStorage|UseApi|UseBreakpoint|UseMediaQueryState|UseRedirect|UseLinkForm|UseFormState|UseForm|UseFormOptions|LinkFormValues|ValidationSchema|ValidationRule`).
- [ ] **R-LOW-2:** Drop `src/features/shorter/hooks/index.ts` barrel and import `useShorter` directly from `./useShorter` — _Why:_ the barrel adds nothing; only consumer is `src/page-components/public/ShorterPage.tsx` which already imports from `@/features/shorter/hooks`. _Call-site count:_ 1 import site.
- [ ] **R-LOW-3:** Move `src/features/profile/components/styles/Profile.styled.tsx` up to `src/features/profile/components/Profile.styled.tsx` — _Why:_ single styled file in a `styles/` subfolder is inconsistent with sibling features (e.g. `redirect/components/styles/Redirect.styled.ts` is the only other case; `links/`/`analytics/`/`shorter/` keep styled inline). _Call-site count:_ 1 import site (`ProfileForm.tsx`).
- [ ] **R-LOW-4:** Inline the `analyticsService` re-export in `src/features/analytics/index.ts` (currently `export * from "@/services/analytics.service"`) — _Why:_ services should be imported from `@/services`, not from a feature barrel; this re-export creates two ways to reach the same singleton and complicates discovery. _Call-site count:_ 0 known consumers using the analytics-feature path for the service (verified by grep — all current users go through `@/services`).

### 7.2 Risk: medium (file move between folders, multiple call-site updates)

- [x] **R-MED-1:** Consolidate `src/shared/ui/base/ChartCard.tsx` and `src/shared/ui/data-display/ChartCard.tsx` — _Why:_ identical name, similar responsibility (title + body Card wrapper for charts); two siblings cause import-site confusion (`@/shared/ui/base/ChartCard` vs. `@/shared/ui/data-display/ChartCard`). Pick one canonical location (likely `data-display`) and re-export from the other for backward compatibility, or hard-migrate. _Call-site count:_ 13 imports total — 5 for `data-display/ChartCard` (all in `public-analytics`), 8 for `base/ChartCard` (analytics/temporal). Diff size will be moderate. **RESOLVED** in commit `cc6a947` — Strategy 2 (additive prop merge): `subtitle`, `action`, `loading`, optional `title`, and the body `Fade` wrap from the base variant were merged into `data-display/ChartCard`; `base/ChartCard.tsx` deleted, all 11 actual import sites repointed to `@/shared/ui/data-display/ChartCard`.
- [ ] **R-MED-2:** Consolidate `src/features/profile/types/{UserModel.ts, user.ts, api.ts}` into a single `types/index.ts` with named exports — _Why:_ three type files for one feature with overlapping responsibility (auth DTOs + UI shapes + `UserModel` factory). The cross-references (`api.ts` ← `user.ts`, `UserModel.ts` ← `@/types/User`) hide the dependency graph. _Call-site count:_ 3 external import sites (`src/lib/auth/authApi.ts`, `src/services/index.ts`, plus `src/features/profile/index.ts` re-export), all easy to update.
- [ ] **R-MED-3:** Move endpoints currently inlined in feature hooks (`/api/analytics/link/{id}/{audience,temporal,insights,geographic,dashboard}`) into `API_CONFIG.ENDPOINTS.*` — _Why:_ five out of five analytics hooks bypass the canonical `endpoints.ts` despite the constants `ANALYTICS_GEOGRAPHIC/TEMPORAL/AUDIENCE/INSIGHTS` already existing (and a missing `ANALYTICS_DASHBOARD` to be added). Improves discoverability and prevents path drift between `analyticsService` and the hooks. _Call-site count:_ 5 hooks (`useAudienceData`, `useGeographicData`, `useInsightsData`, `useTemporalData`, `useDashboardData`).
- [ ] **R-MED-4:** Move public-link endpoints (`/api/public/shorten`, `/api/public/link/{slug}`, `/api/public/analytics/{slug}`) into `API_CONFIG.ENDPOINTS.PUBLIC` — _Why:_ `link-public.service.ts` and `usePublicAnalytics` hard-code the strings; promoting them aligns with the rest of the codebase. _Call-site count:_ 3 string literals in `link-public.service.ts` + 2 inline `api.get` calls in `usePublicAnalytics.ts`.
- [ ] **R-MED-5:** Migrate `useDashboardData` from bespoke `useState/useEffect` to TanStack Query, add `queryKeys.analytics.dashboard(linkId)` to `keys.ts` — _Why:_ only analytics hook still on the manual-fetch pattern; lacks staleness/dedup the others get for free, and its abort/dedup logic re-implements what TanStack provides. _Call-site count:_ used by `LinkDashboard.tsx` (single composer); ~1 caller, but the hook itself is ~320 lines.
- [ ] **R-MED-6:** Move `src/lib/AppContext.ts` and `src/lib/settingsConfig.ts` out of the bare `lib/` root into appropriate subfolders (`lib/providers/AppContext.ts`, `lib/layout/settingsConfig.ts` or under `shared/layout/core/`) — _Why:_ they are the only two loose files at `src/lib/` root. `AppContext` is consumed only by `Providers.tsx`; `settingsConfig` only by `LayoutProvider`. Coupling each to its consumer's folder makes structure cleaner. _Call-site count:_ `AppContext` 1 importer, `settingsConfig` 1 importer.

### 7.3 Risk: high (touches a forbidden zone or critical path)

> Items here are **not eligible** for Phase 2 in this work. They are documented for future planning.

- [ ] **R-HIGH-1:** Re-organize `src/features/redirect/components/RedirectClientPage.tsx` and its `RedirectDynamic.tsx` wrapper — touches `app/(public)/r/[slug]/page.tsx` which is a **FORBIDDEN ZONE** (Open Graph + tracking critical path). Any change risks regressing the bot/human split documented in the root `CLAUDE.md`. **Ineligible for Phase 2.**
- [ ] **R-HIGH-2:** Move `src/lib/auth/components/EmailVerificationGuard.tsx` out of `lib/auth/components/` (e.g., into `shared/components/guards/`) — touches a **FORBIDDEN ZONE** guard wrapping `app/(app)/layout.tsx`. Any move ripples through every authenticated route. **Ineligible for Phase 2.**
- [ ] **R-HIGH-3:** Add or reactivate the `/api/r/{slug}` AJAX redirect path — explicitly retired in `routes/api.php` (04/11/2025) and called out in root `CLAUDE.md` ("Não reabrir sem justificativa"). **Ineligible for Phase 2.**
- [ ] **R-HIGH-4:** Modify `middleware.ts` — explicit **FORBIDDEN ZONE** (security headers only). **Ineligible for Phase 2.**

## 8. Orphan suspects

> These exports have **no detected import sites in `src/` or `app/`**. They may still be referenced indirectly (dynamic imports, JSON-driven dispatch, test fixtures). DO NOT remove. Mark with `// TODO(orphan?):` only if you are 100% sure they are unused.

> **Resolution log (2026-05-11):** Tier 1 and Tier 2 orphans verified and removed. See the `Status` column for each entry. Tier 3 (ChartCard consolidation) intentionally deferred.

| Symbol                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | File                        | Detection method                                                                                                                                                                                                                                                                                                                                                                                                                                | Status                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~All exported `interface`s in `hooks.ts` (`UseAsyncState/Actions`, `UseAsync`, `UseLinksState/Actions/UseLinks`, `LinkCreateData`, `LinkUpdateData`, `UseAnalyticsState/Actions/UseAnalytics`, `UseAnalyticsOptions`, `UseMetricsState/Actions/UseMetrics`, `UsePerformanceState/Actions/UsePerformance`, `UseAuthState/Actions/UseAuth`, `AuthUser`, `RegisterData`, `UseFormState/Actions/UseForm`, `UseFormOptions`, `UseLinkFormState/Actions/UseLinkForm`, `LinkFormValues`, `ValidationSchema`, `ValidationRule`, `UseClipboardState/Actions/UseClipboard`, `UseDebounceOptions`, `UseLocalStorageOptions/UseLocalStorage`, `UseApiOptions/UseApiState/UseApiActions/UseApi`, `RequestOptions`, `UseBreakpointState`, `UseMediaQueryState`, `UseRedirectOptions/UseRedirectState/UseRedirectActions/UseRedirect`)~~ | `src/shared/hooks/types.ts` | `grep -rn 'UseAsyncState\|UseLinksState\|UseAuth\b\|UseAnalytics\b\|UseMetrics\b\|UsePerformance\b\|UseClipboardState\|UseDebounceOptions\|UseLocalStorage\|UseApi\b\|UseBreakpoint\|UseMediaQueryState\|UseRedirect\b\|UseLinkForm\b\|UseLinkFormState\|UseFormState\|UseForm\b\|LinkFormValues\|ValidationSchema\|ValidationRule' src app --include='*.ts' --include='*.tsx' \| grep -v 'shared/hooks/types.ts'` returned 0 external matches. | REMOVED in commit `c3a89f6` (file `src/shared/hooks/types.ts` deleted; barrel re-export removed from `src/shared/hooks/index.ts`).                                   |
| ~~`API_CONFIG.ENDPOINTS.TEST_ANALYTICS`, `TEST_LINK_ANALYTICS`, `LOGS`, `LOGS_DIAGNOSTIC`, `LOGS_RECENT_ERRORS`, `LOGS_TEST`, `LOGS_FILE`, `REPORTS_DASHBOARD`, `REPORTS_EXECUTIVE`, `ANALYTICS_COMPREHENSIVE`~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `src/lib/api/endpoints.ts`  | `grep -rn 'TEST_ANALYTICS\|TEST_LINK_ANALYTICS\|API_CONFIG.ENDPOINTS.LOGS\|REPORTS_DASHBOARD\|REPORTS_EXECUTIVE\|ANALYTICS_COMPREHENSIVE' src app --include='*.ts' --include='*.tsx'` returned 0 matches outside `endpoints.ts`.                                                                                                                                                                                                                | REMOVED in commit `53e06a7` (also removed `TEST_URL` field consumed only by `buildTestUrl`).                                                                         |
| ~~`buildTestUrl`~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `src/lib/api/endpoints.ts`  | `grep -rn 'buildTestUrl' src app --include='*.ts' --include='*.tsx'` returned 0 matches outside the definition.                                                                                                                                                                                                                                                                                                                                 | REMOVED in commit `53e06a7`.                                                                                                                                         |
| `getShortUrl`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `src/lib/utils/shortUrl.ts` | `grep -rn 'getShortUrl\|shortUrl' src app --include='*.ts' --include='*.tsx'` — needs human verification; only the definition file appears in grep output. Do not remove without runtime trace.                                                                                                                                                                                                                                                 | KEPT — re-verification on 2026-05-11 found live call sites in `LinksMobileCards.tsx`, `LinkCardRich.tsx`, and `LinkQRPage.tsx`. Original audit grep was incomplete.  |
| ~~`authGetDbUserByEmail`~~ (other helpers retained)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `src/lib/auth/authApi.ts`   | `grep -rn 'authGetDbUserByEmail\|authCreateDbUser\|authUpdateDbUser' src app --include='*.ts' --include='*.tsx'` — only definition file matches; symbols throw `Error("...")` runtime. Verify before deletion.                                                                                                                                                                                                                                  | PARTIALLY REMOVED in commit `0ef7e27`: throw-only `authGetDbUserByEmail` deleted. `authGetDbUser`/`authCreateDbUser`/`authUpdateDbUser` kept (real implementations). |
| `authRoles` (`admin`, `staff`, `user`, `onlyGuest`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `src/lib/auth/authRoles.ts` | `grep -rn 'authRoles\|onlyGuest' src app --include='*.ts' --include='*.tsx'` — only definition file matches. Likely vestige from Fuse template.                                                                                                                                                                                                                                                                                                 | KEPT — re-verification on 2026-05-11 found imports in `SignInPage.tsx` and `SignUpPage.tsx` (`authRoles.onlyGuest` passed to `AuthGuardRedirect`).                   |
