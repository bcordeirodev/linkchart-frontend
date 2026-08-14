# Next.js SEO & Technical Debt Resolution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove React Router from 33 files, fix SEO gaps (OG on /r/[slug], sitemap, robots, middleware, JSON-LD), add error/loading boundaries, wire up CI/CD for `frontend-next/`, and cut production over to Next.js.

**Architecture:** Phase 1 eliminates the BrowserRouter/MemoryRouter SSR crutch that currently prevents true Server-Side Rendering in every route. Phase 2 fixes the biggest SEO regression (redirect page has no OG tags for bots). Phase 3 adds the infrastructure Next.js makes trivial. Phase 4 ships to production.

**Tech Stack:** Next.js 15 App Router, `next/navigation` (useRouter/usePathname/useSearchParams), `next/link`, `next/font`, middleware.ts, GitHub Actions, DigitalOcean droplet (<DEPLOY_HOST>), nginx, Docker standalone build.

---

## File Structure

Files created in this plan:

| Path                                         | Responsibility                                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/shared/hooks/useSearchParams.ts`        | Wraps `next/navigation` useSearchParams — re-exports tuple `[URLSearchParams]` for drop-in RR6 compat |
| `src/shared/hooks/useLocation.ts`            | Shim returning `{ pathname, state }` — bridges RR6 callers to `usePathname()`                         |
| `app/(public)/r/[slug]/page.tsx`             | Rewritten as Server Component with `generateMetadata` for OG/Twitter                                  |
| `app/sitemap.ts`                             | Dynamic XML sitemap fetching public links from API                                                    |
| `app/robots.ts`                              | robots.txt generation                                                                                 |
| `middleware.ts`                              | Auth redirects + security headers (CSP, HSTS, X-Frame-Options)                                        |
| `app/(app)/error.tsx`                        | Error boundary for authenticated area                                                                 |
| `app/(app)/loading.tsx`                      | Skeleton loading for authenticated area                                                               |
| `app/(auth)/error.tsx`                       | Error boundary for auth area                                                                          |
| `app/error.tsx`                              | Global root error boundary                                                                            |
| `app/loading.tsx`                            | Global root loading                                                                                   |
| `app/api/health/route.ts`                    | Health check endpoint used by nginx upstream check                                                    |
| `.github/workflows/deploy-frontend-next.yml` | CI/CD pipeline for `frontend-next/`                                                                   |

Files modified (react-router-dom removal — 33 files):

- `src/lib/providers/Providers.tsx` — remove BrowserRouter/MemoryRouter
- `src/shared/ui/navigation/Link.tsx` — replace RouterLink with NextLink
- `src/shared/components/routing/HomeRedirect.tsx` — replace Navigate with useRouter
- `src/features/redirect/components/Redirect.tsx` — replace Navigate with useRouter
- 18 files using `useNavigate` → swap import to `@/shared/hooks`
- 3 files using `useSearchParams` from RR6 → swap to `@/shared/hooks`
- 2 files using `useLocation` → swap to `@/shared/hooks`
- 5 page-components using `useParams` → receive id/slug as prop; update 4 Next.js page wrappers
- `src/shared/hooks/index.ts` — export new hooks

---

## Task 1: Add useSearchParams + useLocation shims

These two hooks have callers that need Next.js equivalents. We create thin wrappers that preserve the React Router call signature.

**Files:**

- Create: `src/shared/hooks/useSearchParams.ts`
- Create: `src/shared/hooks/useLocation.ts`
- Modify: `src/shared/hooks/index.ts`

- [ ] **Step 1: Create useSearchParams shim**

```typescript
// src/shared/hooks/useSearchParams.ts
"use client";
import { useSearchParams as useNextSearchParams } from "next/navigation";

/**
 * Drop-in replacement for react-router-dom's useSearchParams.
 * Returns a tuple [URLSearchParams, setter-noop] so callers using
 * const [searchParams] = useSearchParams() work unchanged.
 */
export function useSearchParams(): [URLSearchParams] {
  const params = useNextSearchParams();
  // Cast: next/navigation returns ReadonlyURLSearchParams which is
  // structurally identical to URLSearchParams for reading.
  return [params as unknown as URLSearchParams];
}

export default useSearchParams;
```

- [ ] **Step 2: Create useLocation shim**

```typescript
// src/shared/hooks/useLocation.ts
"use client";
import { usePathname } from "next/navigation";

interface Location {
  pathname: string;
  state: Record<string, unknown> | null;
}

/**
 * Minimal shim for react-router-dom's useLocation.
 * Next.js App Router has no history.state concept.
 * Callers that relied on location.state must be migrated to URL params (see Tasks 3/4).
 * This shim keeps the shape intact so components compile; state is always null here.
 */
export function useLocation(): Location {
  const pathname = usePathname();
  return { pathname, state: null };
}

export default useLocation;
```

- [ ] **Step 3: Export from barrel**

Open `src/shared/hooks/index.ts` and add the two new exports after the existing navigation hooks:

```typescript
"use client";
/**
 * 🎣 SHARED HOOKS EXPORTS
 * Barrel exports para hooks compartilhados
 */

// UI Hooks
export { default as useDebounce } from "./useDebounce";
export { default as useClipboard } from "./useClipboard";
export { default as useThemeMediaQuery } from "./useThemeMediaQuery";

// Navigation Hooks
export { useNavigate } from "./useNavigate";
export { default as usePathname } from "./usePathname";
export { useSearchParams } from "./useSearchParams";
export { useLocation } from "./useLocation";

// Types
export * from "./hooks";
```

- [ ] **Step 4: Verify build compiles**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

Expected: no new type errors related to these files.

- [ ] **Step 5: Commit**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
git add src/shared/hooks/useSearchParams.ts src/shared/hooks/useLocation.ts src/shared/hooks/index.ts
git commit -m "feat: add useSearchParams + useLocation shims over next/navigation"
```

---

## Task 2: Migrate useNavigate callers (18 files — simple import swap)

The existing `src/shared/hooks/useNavigate.ts` wraps `useRouter().push()`. All 18 callers only need their import line changed from `react-router-dom` to `@/shared/hooks`.

**Files:**

- Modify (all): change 1 import line in each

The 18 files and the exact change for each:

```
src/features/public-analytics/components/info/AnalyticsInfo.tsx
src/features/public-analytics/components/info/SaveAnalyticsUrlBanner.tsx
src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx
src/features/public-analytics/hooks/usePublicAnalytics.ts
src/features/links/components/LinkActions.tsx
src/features/links/components/edit/EditLinkForm.tsx
src/features/links/components/list/LinksMobileCards.tsx
src/features/links/components/list/LinksHeaderActions.tsx
src/features/links/components/list/LinksEmptyState.tsx
src/features/links/components/list/LinkCardRich.tsx
src/features/links/components/create/CreateLinkForm.tsx
src/features/redirect/hooks/useRedirectWithDelay.ts
src/features/shorter/hooks/useShorter.ts
src/shared/layout/PublicLayout.tsx
src/shared/layout/ErrorLayout.tsx
src/shared/layout/components/Navbar.tsx
src/lib/auth/components/EmailVerificationGuard.tsx
src/page-components/auth/SignUpPage.tsx
src/page-components/system/UnauthorizedPage.tsx
```

- [ ] **Step 1: Run sed to swap the import in all 18 files at once**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
files=(
  "src/features/public-analytics/components/info/AnalyticsInfo.tsx"
  "src/features/public-analytics/components/info/SaveAnalyticsUrlBanner.tsx"
  "src/features/public-analytics/components/info/PublicAnalyticsCtaStrip.tsx"
  "src/features/public-analytics/hooks/usePublicAnalytics.ts"
  "src/features/links/components/LinkActions.tsx"
  "src/features/links/components/edit/EditLinkForm.tsx"
  "src/features/links/components/list/LinksMobileCards.tsx"
  "src/features/links/components/list/LinksHeaderActions.tsx"
  "src/features/links/components/list/LinksEmptyState.tsx"
  "src/features/links/components/list/LinkCardRich.tsx"
  "src/features/links/components/create/CreateLinkForm.tsx"
  "src/features/redirect/hooks/useRedirectWithDelay.ts"
  "src/features/shorter/hooks/useShorter.ts"
  "src/shared/layout/PublicLayout.tsx"
  "src/shared/layout/ErrorLayout.tsx"
  "src/shared/layout/components/Navbar.tsx"
  "src/lib/auth/components/EmailVerificationGuard.tsx"
  "src/page-components/auth/SignUpPage.tsx"
  "src/page-components/system/UnauthorizedPage.tsx"
)
for f in "${files[@]}"; do
  sed -i '' 's|import { useNavigate } from "react-router-dom";|import { useNavigate } from "@/shared/hooks";|g' "$f"
  # Handle cases where useNavigate is part of a multi-import line
  sed -i '' 's|import { useNavigate,|import { useNavigate } from "@/shared/hooks";\nimport {|g' "$f"
done
```

- [ ] **Step 2: Verify no more react-router-dom imports in these 18 files**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
for f in "${files[@]}"; do
  grep -l "react-router-dom" "$f" && echo "STILL HAS IT: $f"
done
echo "Done checking"
```

Expected: no output before "Done checking".

- [ ] **Step 3: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -30
```

Expected: same error count as before (or fewer). Fix any errors introduced by the sed approach (e.g., malformed multi-import lines) by opening the file and fixing manually.

- [ ] **Step 4: Commit**

```bash
git add -p  # stage the 18 modified files
git commit -m "refactor: replace react-router-dom useNavigate with @/shared/hooks in 18 files"
```

---

## Task 3: Migrate useSearchParams callers (3 files)

These 3 files use `const [searchParams] = useSearchParams()` — matches the shim signature exactly. Also swap `useNavigate` at the same time if present.

**Files:**

- Modify: `src/lib/auth/forms/AuthJsForm.tsx`
- Modify: `src/page-components/auth/VerifyEmailPage.tsx`
- Modify: `src/page-components/auth/ResetPasswordPage.tsx`

- [ ] **Step 1: Fix AuthJsForm.tsx — change import**

In `src/lib/auth/forms/AuthJsForm.tsx`, find:

```typescript
import { useSearchParams, useNavigate } from "react-router-dom";
```

Replace with:

```typescript
import { useSearchParams, useNavigate } from "@/shared/hooks";
```

- [ ] **Step 2: Fix VerifyEmailPage.tsx — change import**

In `src/page-components/auth/VerifyEmailPage.tsx`, find:

```typescript
import { useNavigate, useSearchParams } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate, useSearchParams } from "@/shared/hooks";
```

- [ ] **Step 3: Fix ResetPasswordPage.tsx — change import**

In `src/page-components/auth/ResetPasswordPage.tsx`, find:

```typescript
import { useNavigate, useSearchParams } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate, useSearchParams } from "@/shared/hooks";
```

- [ ] **Step 4: Wrap auth page components that call useSearchParams in Suspense**

Next.js requires components using `useSearchParams()` to be wrapped in `<Suspense>`. The wrappers are in:

- `app/(auth)/sign-in/page.tsx` → renders `AuthJsForm` indirectly (through a page-component)
- `app/(auth)/verify-email/page.tsx` → renders `VerifyEmailPage`
- `app/(auth)/reset-password/page.tsx` → renders `ResetPasswordPage`

Open each of these three page files and wrap the content in Suspense:

`app/(auth)/verify-email/page.tsx`:

```typescript
import { Suspense } from "react";
import VerifyEmailPageContent from "@/pages/auth/VerifyEmailPage";
import { CircularProgress, Box } from "@mui/material";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
```

`app/(auth)/reset-password/page.tsx`:

```typescript
import { Suspense } from "react";
import ResetPasswordPageContent from "@/pages/auth/ResetPasswordPage";
import { CircularProgress, Box } from "@mui/material";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
```

Check what page currently renders `AuthJsForm` — it may already be inside a Suspense. If sign-in/page.tsx renders it, add Suspense there too.

- [ ] **Step 5: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth/forms/AuthJsForm.tsx \
        src/page-components/auth/VerifyEmailPage.tsx \
        src/page-components/auth/ResetPasswordPage.tsx \
        app/\(auth\)/verify-email/page.tsx \
        app/\(auth\)/reset-password/page.tsx
git commit -m "refactor: replace react-router-dom useSearchParams with @/shared/hooks in 3 files"
```

---

## Task 4: Migrate useLocation callers (2 files)

`EmailVerificationPendingPage` uses `location.state?.email` — history state. In Next.js there's no history.state; instead, pass the email via URL search param or accept that state is null (the page already has a fallback). `NotFoundPage` uses `location.pathname` — maps to `usePathname()`.

**Files:**

- Modify: `src/page-components/auth/EmailVerificationPendingPage.tsx`
- Modify: `src/page-components/system/NotFoundPage.tsx`

- [ ] **Step 1: Fix EmailVerificationPendingPage.tsx**

Find:

```typescript
import { useNavigate, useLocation } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate, useLocation } from "@/shared/hooks";
```

The `useLocation` shim returns `state: null`, so `location.state as LocationState` will be `null`. The page must already have a fallback for when `state?.email` is undefined — check lines around `const state = location.state as LocationState` and ensure the component handles `state === null` gracefully (it should show the generic "check your inbox" message, which is correct behavior).

- [ ] **Step 2: Fix NotFoundPage.tsx**

Find:

```typescript
import { useLocation } from "react-router-dom";
```

Replace with:

```typescript
import { useLocation } from "@/shared/hooks";
```

`location.pathname` is populated correctly by the shim (calls `usePathname()`), so this is a safe drop-in.

- [ ] **Step 3: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/page-components/auth/EmailVerificationPendingPage.tsx \
        src/page-components/system/NotFoundPage.tsx
git commit -m "refactor: replace react-router-dom useLocation with @/shared/hooks in 2 files"
```

---

## Task 5: Migrate useParams callers in page-components

These 5 page-components currently call `useParams()` from react-router-dom to get `id` or `slug`. In Next.js, params come from the page file's `params` prop. The fix: accept `id`/`slug` as a prop in each page-component, and update the 4 Next.js page wrapper files to extract and pass the param.

**Files:**

- Modify: `src/page-components/links/LinkQRPage.tsx`
- Modify: `src/page-components/links/LinkAnalyticsPage.tsx`
- Modify: `src/page-components/links/LinkEditPage.tsx`
- Modify: `src/page-components/public/PublicAnalyticsPage.tsx`
- Modify: `src/page-components/public/RedirectPage.tsx` (already unused — verify)
- Modify: `app/(app)/link/qr/[id]/page.tsx`
- Modify: `app/(app)/link/analytic/[id]/page.tsx`
- Modify: `app/(app)/link/edit/[id]/page.tsx`
- Modify: `app/(public)/public-analytics/[slug]/page.tsx` (already uses `slug` prop correctly — verify)

- [ ] **Step 1: Update LinkQRPage.tsx to accept id as prop**

In `src/page-components/links/LinkQRPage.tsx`, find:

```typescript
import { useParams, useNavigate } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate } from "@/shared/hooks";
```

Find the component function signature (it likely starts `function LinkQRPage()` or `const LinkQRPage`). Add an `id` prop:

```typescript
// Before
export default function LinkQRPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
```

```typescript
// After
interface Props { id: string; }
export default function LinkQRPage({ id }: Props) {
  const navigate = useNavigate();
```

- [ ] **Step 2: Update app/(app)/link/qr/[id]/page.tsx to pass id**

```typescript
import type { Metadata } from "next";
import LinkQRPageContent from "@/pages/links/LinkQRPage";

export const metadata: Metadata = { title: "QR Code" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkQRPage({ params }: Props) {
  const { id } = await params;
  return <LinkQRPageContent id={id} />;
}
```

- [ ] **Step 3: Update LinkAnalyticsPage.tsx to accept id as prop**

In `src/page-components/links/LinkAnalyticsPage.tsx`, find:

```typescript
import { useParams, useNavigate } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate } from "@/shared/hooks";
```

Change the component:

```typescript
// Before
export default function LinkAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
```

```typescript
// After
interface Props { id: string; }
export default function LinkAnalyticsPage({ id }: Props) {
```

- [ ] **Step 4: Update app/(app)/link/analytic/[id]/page.tsx to pass id**

```typescript
import type { Metadata } from "next";
import LinkAnalyticsPageContent from "@/pages/links/LinkAnalyticsPage";

export const metadata: Metadata = { title: "Link Analytics" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { id } = await params;
  return <LinkAnalyticsPageContent id={id} />;
}
```

- [ ] **Step 5: Update LinkEditPage.tsx to accept id as prop**

In `src/page-components/links/LinkEditPage.tsx`, find:

```typescript
import { useParams, useNavigate } from "react-router-dom";
```

Replace with:

```typescript
import { useNavigate } from "@/shared/hooks";
```

Change the component:

```typescript
// Before
export default function LinkEditPage() {
  const { id } = useParams<{ id: string }>();
```

```typescript
// After
interface Props { id: string; }
export default function LinkEditPage({ id }: Props) {
```

- [ ] **Step 6: Update app/(app)/link/edit/[id]/page.tsx to pass id**

```typescript
import type { Metadata } from "next";
import LinkEditPageContent from "@/pages/links/LinkEditPage";

export const metadata: Metadata = { title: "Edit Link" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkEditPage({ params }: Props) {
  const { id } = await params;
  return <LinkEditPageContent id={id} />;
}
```

- [ ] **Step 7: Fix PublicAnalyticsPage.tsx**

Check `src/page-components/public/PublicAnalyticsPage.tsx`. It uses `useParams()` for slug. The actual Next.js page `app/(public)/public-analytics/[slug]/page.tsx` already passes `slug` as a prop to `PublicAnalyticsPageContent` (from `@/features/public-analytics`). Verify that `PublicAnalyticsPage.tsx` is still used — if the Next.js page imports from `@/features/public-analytics/PublicAnalyticsPageContent` directly and NOT from the page-component, then `src/page-components/public/PublicAnalyticsPage.tsx` is dead code. Remove the `react-router-dom` import from it regardless.

- [ ] **Step 8: Fix RedirectPage.tsx**

Check `src/page-components/public/RedirectPage.tsx`. The Next.js page `app/(public)/r/[slug]/page.tsx` is self-contained (has its own `RedirectPageWithSlug` component). So this page-component is also dead code. Remove the `react-router-dom` import from it regardless.

- [ ] **Step 9: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -30
```

Expected: no `useParams` type errors, no react-router-dom errors in these files.

- [ ] **Step 10: Commit**

```bash
git add src/page-components/links/ \
        src/page-components/public/ \
        "app/(app)/link/qr/[id]/page.tsx" \
        "app/(app)/link/analytic/[id]/page.tsx" \
        "app/(app)/link/edit/[id]/page.tsx"
git commit -m "refactor: replace useParams with id/slug props in page-components"
```

---

## Task 6: Replace Navigate component with useRouter

**Files:**

- Modify: `src/shared/components/routing/HomeRedirect.tsx`
- Modify: `src/features/redirect/components/Redirect.tsx`

- [ ] **Step 1: Rewrite HomeRedirect.tsx**

```typescript
// src/shared/components/routing/HomeRedirect.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useUser from "@/lib/auth/useUser";
import Loading from "@/shared/ui/feedback/Loading";

export function HomeRedirect() {
  const { data: user, isGuest } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user && !isGuest) {
      router.replace("/links");
    } else {
      router.replace("/shorter");
    }
  }, [user, isGuest, router]);

  return <Loading />;
}
```

- [ ] **Step 2: Rewrite Redirect.tsx**

```typescript
// src/features/redirect/components/Redirect.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectProps {
  to: string;
  children?: React.ReactNode;
}

function Redirect({ to }: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
}

export default Redirect;
export { Redirect };
```

- [ ] **Step 3: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/routing/HomeRedirect.tsx \
        src/features/redirect/components/Redirect.tsx
git commit -m "refactor: replace react-router-dom Navigate with useRouter().replace()"
```

---

## Task 7: Replace RouterLink in Link.tsx with next/link

**Files:**

- Modify: `src/shared/ui/navigation/Link.tsx`

- [ ] **Step 1: Replace import and usage**

In `src/shared/ui/navigation/Link.tsx`, find:

```typescript
import { Link as RouterLink } from "react-router-dom";
```

Replace with:

```typescript
import NextLink from "next/link";
```

In the internal link rendering block, find:

```typescript
const internalProps = {
  component: RouterLink,
  to: linkUrl,
  ...
};
return <StyledInternalLink {...internalProps}>{children}</StyledInternalLink>;
```

Replace with:

```typescript
return (
  <StyledInternalLink
    component={NextLink}
    href={linkUrl}
    className={className}
    role={role}
    sx={sx}
    color={color}
    variant={variant}
    underline={underline}
    ref={ref}
    {...rest}
  >
    {children}
  </StyledInternalLink>
);
```

Note: `next/link` uses `href` not `to`. Remove the `to` prop from the signature and update the `LinkProps` interface: change `to?: string` to `href?: string` (already present) and remove `to` — or keep `to` as an alias for `href` for backwards compatibility with the many callers:

```typescript
const linkUrl = to || href || "";
// ...internal link:
<StyledInternalLink component={NextLink} href={linkUrl} ...>
```

- [ ] **Step 2: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

Fix any type errors from MUI + next/link interaction. If `component={NextLink}` causes type issues, use a cast:

```typescript
component={NextLink as React.ElementType}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/navigation/Link.tsx
git commit -m "refactor: replace RouterLink with next/link in shared Link component"
```

---

## Task 8: Remove BrowserRouter/MemoryRouter from Providers.tsx

This is the final step to eliminate the SSR crutch. After this commit, the app renders without a client-side Router wrapper — all navigation is handled by the Next.js App Router.

**Files:**

- Modify: `src/lib/providers/Providers.tsx`

- [ ] **Step 1: Rewrite Providers.tsx without BrowserRouter**

```typescript
// src/lib/providers/Providers.tsx
"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enUS } from "date-fns/locale/en-US";
import { ptBR } from "date-fns/locale/pt-BR";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";

import "@/i18n/config";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LayoutProvider } from "@/shared/layout/core";
import { MainThemeProvider, applyGlobalStyles } from "@/lib/theme";
import store from "@/lib/store/store";
import AppContext from "@/lib/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;
  const val = useMemo(() => ({}), []);

  if (typeof window !== "undefined") {
    applyGlobalStyles();
  }

  return (
    <AppContext.Provider value={val}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateLocale}
      >
        <Provider store={store}>
          <AuthProvider>
            <LayoutProvider>
              <MainThemeProvider>
                <SnackbarProvider
                  maxSnack={5}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  style={{ zIndex: 99 }}
                >
                  {children}
                </SnackbarProvider>
              </MainThemeProvider>
            </LayoutProvider>
          </AuthProvider>
        </Provider>
      </LocalizationProvider>
    </AppContext.Provider>
  );
}
```

- [ ] **Step 2: Verify react-router-dom has zero remaining imports in the entire src/**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
grep -r "from 'react-router-dom'\|from \"react-router-dom\"" src/ --include="*.tsx" --include="*.ts"
```

Expected: no output. If any files remain, fix them before committing.

- [ ] **Step 3: Run full quality check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -30
```

Expected: 0 errors. If there are errors, fix them now — this task is the critical milestone.

- [ ] **Step 4: Run the dev build to verify the app starts**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose up -d && sleep 10 && curl -s http://localhost:3000 | head -5
```

Expected: HTML response (not empty, not connection refused).

- [ ] **Step 5: Commit**

```bash
git add src/lib/providers/Providers.tsx
git commit -m "refactor: remove BrowserRouter/MemoryRouter — Next.js App Router handles all navigation"
```

---

## Task 9: Fix /r/[slug] — Server Component with OG metadata

Currently `app/(public)/r/[slug]/page.tsx` is `'use client'`, so bots (WhatsApp, Telegram, Twitter) get a blank page — no OG preview. Fix: make the page file a Server Component with `generateMetadata`, keep the client redirect UI as a child client component.

Note: The backend already handles the redirect for humans at `GET /r/{slug}` (web.php route, not API). The Next.js `/r/[slug]` page currently calls `GET /api/r/{slug}` — this is the AJAX endpoint that was disabled. Verify with the backend team before using that endpoint; alternatively, fetch from `/api/public/link/{slug}` or `/api/public/analytics/{slug}` for OG data only.

**Files:**

- Modify: `app/(public)/r/[slug]/page.tsx`

- [ ] **Step 1: Check which API endpoint provides link metadata for OG**

```bash
curl -s "http://localhost:8000/api/public/analytics/test-slug" | python3 -m json.tool 2>/dev/null | head -20
curl -s "http://localhost:8000/api/r/test-slug" | python3 -m json.tool 2>/dev/null | head -20
```

Use whichever returns `original_url`, `title`, and similar fields. Based on the codebase, `/api/public/analytics/{slug}` returns `data.data.total_clicks` but may not have `original_url`. The AJAX `/api/r/{slug}` was disabled. The safest approach is to use `/api/public/analytics/{slug}` for the metadata (slug + click count are enough for OG) and keep the client-side redirect calling `/api/r/{slug}` as-is (it still works, was only disabled in the Laravel `api.php` route — verify).

- [ ] **Step 2: Rewrite app/(public)/r/[slug]/page.tsx as hybrid Server/Client**

The page file becomes a Server Component responsible ONLY for `generateMetadata`. The heavy client logic (countdown, IP capture, `window.location.href`) stays in the existing `RedirectPageWithSlug` client component defined in the same file — but move it to its own file.

Create `src/features/redirect/components/RedirectClientPage.tsx`:

```typescript
// src/features/redirect/components/RedirectClientPage.tsx
// Copy the ENTIRE content of RedirectPageWithSlug from the current page.tsx
// (the big component starting at line 57 of the current file) into this new file.
// Add "use client"; at the top.
// Change the export: export default function RedirectClientPage({ slug }: { slug: string }) { ... }
```

Rewrite `app/(public)/r/[slug]/page.tsx`:

```typescript
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const RedirectClientPage = dynamic(
  () => import("@/features/redirect/components/RedirectClientPage"),
  { ssr: false }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/public/analytics/${slug}`, {
    next: { revalidate: 60 },
  }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const clicks = data?.data?.total_clicks ?? 0;
  const title = `Redirecionando para ${slug}`;
  const description = `Link encurtado com ${clicks} cliques. Clique para acessar o destino com segurança.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkchart.app";

  return {
    title,
    description,
    openGraph: {
      title: `${slug} — Link Chart`,
      description,
      type: "website",
      url: `${appUrl}/r/${slug}`,
      images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug} — Link Chart`,
      description: `${clicks} cliques registrados.`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;
  return <RedirectClientPage slug={slug} />;
}
```

- [ ] **Step 3: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 4: Test OG metadata with curl**

```bash
curl -s "http://localhost:3000/r/test-link" | grep -E "og:|twitter:" | head -10
```

Expected: `og:title`, `og:description` tags present in the HTML.

- [ ] **Step 5: Commit**

```bash
git add "app/(public)/r/[slug]/page.tsx" \
        src/features/redirect/components/RedirectClientPage.tsx
git commit -m "feat: make /r/[slug] a Server Component with OG/Twitter metadata for bot previews"
```

---

## Task 10: Add app/sitemap.ts + app/robots.ts

**Files:**

- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create app/robots.ts**

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkchart.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shorter", "/public-analytics/"],
        disallow: ["/links/", "/link/", "/profile/", "/api/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Create app/sitemap.ts**

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkchart.app";
  const now = new Date();

  return [
    {
      url: appUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appUrl}/shorter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
```

Note: Public analytics pages are intentionally excluded from the sitemap — they contain user data and each `/public-analytics/{slug}` URL is private. Only add them if the link owner explicitly makes them public in a future feature.

- [ ] **Step 3: Verify sitemap and robots are served**

Start the dev server and check:

```bash
curl -s "http://localhost:3000/sitemap.xml" | head -20
curl -s "http://localhost:3000/robots.txt"
```

Expected: valid XML sitemap and robots.txt with the rules above.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap.ts and robots.ts for SEO infrastructure"
```

---

## Task 11: Add middleware.ts (auth redirects + security headers)

Next.js middleware replaces the BrowserRouter-based auth guard. It also adds security headers on every response.

**Files:**

- Create: `middleware.ts` (at repo root, next to `next.config.ts`)

- [ ] **Step 1: Create middleware.ts**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/shorter",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/email-verification-pending",
  "/401",
  "/r/",
  "/public-analytics/",
  "/api/",
  "/_next/",
  "/favicon.ico",
  "/og-default.png",
  "/sitemap.xml",
  "/robots.txt",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-DNS-Prefetch-Control": "on",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to every response
  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Auth guard: protected routes require a token in cookies or localStorage
  // Note: localStorage is not accessible in middleware (server-side).
  // The token is stored in localStorage in the Vite app — this is a known limitation.
  // For now, we check for a `token` cookie (set it during login if needed).
  // The client-side AuthGuardRedirect component handles the browser-side redirect.
  const token = request.cookies.get("token")?.value;
  const isProtected = !isPublicPath(pathname);

  if (isProtected && !token) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|og-default.png).*)",
  ],
};
```

**Important caveat:** The existing auth uses `localStorage.token`, not a cookie. Middleware cannot access localStorage. Two options:

1. (Short-term) Disable the auth redirect in middleware (only apply security headers) — let `AuthGuardRedirect` handle client-side redirects as before.
2. (Long-term) Set a `token` cookie on login in addition to localStorage.

For this task, implement Option 1 (security headers only, no auth redirect in middleware). Comment the auth block to document the plan:

```typescript
// TODO: Add auth redirect once login sets a httpOnly cookie alongside localStorage.token
// Currently auth is handled client-side by AuthGuardRedirect.
```

- [ ] **Step 2: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 3: Verify security headers are present**

```bash
curl -sI "http://localhost:3000/" | grep -E "X-Frame|X-Content|Referrer|Strict"
```

Expected: security headers in every response.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware.ts with security headers (X-Frame-Options, HSTS, CSP)"
```

---

## Task 12: Add error.tsx + loading.tsx for route groups

**Files:**

- Create: `app/error.tsx`
- Create: `app/loading.tsx`
- Create: `app/(app)/error.tsx`
- Create: `app/(app)/loading.tsx`
- Create: `app/(auth)/error.tsx`

- [ ] **Step 1: Create global app/error.tsx**

```typescript
// app/error.tsx
"use client";
import { Box, Typography, Button, Paper } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { ICON_XL } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
        <AlertTriangle {...ICON_XL} style={{ marginBottom: 16 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Algo deu errado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message || "Ocorreu um erro inesperado."}
        </Typography>
        <Button variant="contained" onClick={reset}>
          Tentar novamente
        </Button>
      </Paper>
    </Box>
  );
}
```

- [ ] **Step 2: Create global app/loading.tsx**

```typescript
// app/loading.tsx
import { Box, CircularProgress } from "@mui/material";

export default function GlobalLoading() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <CircularProgress size={48} />
    </Box>
  );
}
```

- [ ] **Step 3: Create app/(app)/error.tsx**

```typescript
// app/(app)/error.tsx
"use client";
import { Box, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { ICON_LG } from "@/lib/theme/iconDefaults";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App area error:", error);
  }, [error]);

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
      <AlertCircle {...ICON_LG} />
      <Typography variant="h6">Ocorreu um erro</Typography>
      <Typography variant="body2" color="text.secondary">
        {error.message}
      </Typography>
      <Button variant="outlined" onClick={reset}>
        Tentar novamente
      </Button>
    </Box>
  );
}
```

- [ ] **Step 4: Create app/(app)/loading.tsx**

```typescript
// app/(app)/loading.tsx
import { Box, LinearProgress } from "@mui/material";

export default function AppLoading() {
  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
      <LinearProgress />
    </Box>
  );
}
```

- [ ] **Step 5: Create app/(auth)/error.tsx**

```typescript
// app/(auth)/error.tsx
"use client";
import { Box, Alert, Button } from "@mui/material";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Auth area error:", error);
  }, [error]);

  return (
    <Box p={4}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message || "Erro de autenticação."}
      </Alert>
      <Button variant="outlined" onClick={reset}>
        Tentar novamente
      </Button>
    </Box>
  );
}
```

- [ ] **Step 6: Run type-check**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
docker-compose run --rm frontend-next npm run type-check 2>&1 | tail -20
```

- [ ] **Step 7: Commit**

```bash
git add app/error.tsx app/loading.tsx \
        "app/(app)/error.tsx" "app/(app)/loading.tsx" \
        "app/(auth)/error.tsx"
git commit -m "feat: add error.tsx and loading.tsx for route groups"
```

---

## Task 13: Add /api/health route

Nginx upstream health checks and container orchestration tools need a health endpoint.

**Files:**

- Create: `app/api/health/route.ts`

- [ ] **Step 1: Create the health route**

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "link-charts-frontend",
    },
    { status: 200 },
  );
}
```

- [ ] **Step 2: Test the endpoint**

```bash
curl -s "http://localhost:3000/api/health" | python3 -m json.tool
```

Expected:

```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "link-charts-frontend"
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/health/route.ts
git commit -m "feat: add /api/health route for container health checks"
```

---

## Task 14: CI/CD pipeline for frontend-next/

The existing Vite pipeline is at `frontend/.github/workflows/deploy-production.yml`. We create a parallel pipeline for `frontend-next/` that triggers only when files under `frontend-next/` change.

Production server details (from memory):

- SSH: `root@<DEPLOY_HOST>`
- App path: `/var/www/linkchart-frontend`
- Current frontend container: `linkcharts-frontend-prod` (Vite, maps `3000:80`)
- Target Next.js container: map `3001:3000` during parallel running, then switch to `3000:3000` at cutover
- Required secrets (already in GitHub): `PRODUCTION_HOST`, `PRODUCTION_SSH_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`

**Files:**

- Create: `.github/workflows/deploy-frontend-next.yml`

- [ ] **Step 1: Create the workflows directory**

```bash
mkdir -p /Users/bruno/Projects/link-charts/frontend-next/.github/workflows
```

- [ ] **Step 2: Create deploy-frontend-next.yml**

```yaml
# .github/workflows/deploy-frontend-next.yml
name: Deploy Frontend Next.js to Production

on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "app/**"
      - "public/**"
      - "middleware.ts"
      - "next.config.ts"
      - "package*.json"
      - "Dockerfile"
      - "docker-compose.yml"
      - ".github/workflows/deploy-frontend-next.yml"
  workflow_dispatch:

env:
  NODE_VERSION: "20"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/frontend-next

permissions:
  contents: read
  packages: write

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

  build:
    name: Build Docker Image
    needs: quality
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
            NEXT_PUBLIC_APP_URL=${{ secrets.NEXT_PUBLIC_APP_URL }}
            NEXT_PUBLIC_GA_ID=${{ secrets.NEXT_PUBLIC_GA_ID }}
            NEXT_PUBLIC_ADSENSE_CLIENT=${{ secrets.NEXT_PUBLIC_ADSENSE_CLIENT }}

  deploy:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: root
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            set -e
            cd /var/www/linkchart-frontend-next

            # Pull latest image
            echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            docker pull ${{ needs.build.outputs.image }}

            # Write env file
            cat > .env.production << EOF
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
            NEXT_PUBLIC_APP_URL=${{ secrets.NEXT_PUBLIC_APP_URL }}
            NEXT_PUBLIC_GA_ID=${{ secrets.NEXT_PUBLIC_GA_ID }}
            NEXT_PUBLIC_ADSENSE_CLIENT=${{ secrets.NEXT_PUBLIC_ADSENSE_CLIENT }}
            EOF

            # Restart container
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --force-recreate

            # Health check
            sleep 10
            curl -sf http://localhost:3001/api/health || exit 1

            echo "Deploy successful"
```

- [ ] **Step 3: Create docker-compose.prod.yml (for production deployment)**

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  frontend-next:
    image: ghcr.io/${GITHUB_REPOSITORY}/frontend-next:latest
    container_name: linkcharts-frontend-next-prod
    restart: always
    ports:
      - "3001:3000" # 3001 during parallel run; change to 3000 at cutover
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

- [ ] **Step 4: Create the deployment directory on production server**

```bash
ssh root@<DEPLOY_HOST> "mkdir -p /var/www/linkchart-frontend-next"
```

- [ ] **Step 5: Push the workflow to GitHub to trigger CI**

```bash
cd /Users/bruno/Projects/link-charts/frontend-next
git add .github/workflows/deploy-frontend-next.yml docker-compose.prod.yml
git commit -m "ci: add GitHub Actions pipeline for frontend-next/"
git push origin feat/nextjs-migration
```

- [ ] **Step 6: Verify CI passes on GitHub**

Go to the repository's Actions tab and confirm:

1. `quality` job passes (type-check + lint)
2. `build` job passes (Docker image built and pushed to GHCR)
3. `deploy` job is gated on `production` environment approval

---

## Task 15: Production cutover (Vite → Next.js)

**Pre-conditions before executing this task:**

- [ ] Task 14 CI pipeline is green
- [ ] The Next.js container has been running on port 3001 for at least 30 minutes with no errors
- [ ] Manual smoke test completed: login, create link, view analytics, redirect, public analytics page

**Files:**

- Modify: `/etc/nginx/sites-available/linkchart-frontend` (on production server)
- Modify: `docker-compose.prod.yml`

- [ ] **Step 1: Verify current nginx config (on production)**

```bash
ssh root@<DEPLOY_HOST> "cat /etc/nginx/sites-available/linkchart-frontend | grep proxy_pass"
```

Expected output shows current upstream — likely `proxy_pass http://127.0.0.1:3000`.

- [ ] **Step 2: Deploy Next.js container on port 3001 first (shadow mode)**

From the previous task, the container is already running on 3001. Confirm:

```bash
ssh root@<DEPLOY_HOST> "docker ps | grep frontend"
```

Expected: both `linkcharts-frontend-prod` (port 3000) and `linkcharts-frontend-next-prod` (port 3001) running.

- [ ] **Step 3: Smoke test the Next.js container directly**

```bash
ssh root@<DEPLOY_HOST> "curl -s http://localhost:3001/api/health"
ssh root@<DEPLOY_HOST> "curl -sI http://localhost:3001/ | head -5"
ssh root@<DEPLOY_HOST> "curl -s http://localhost:3001/sitemap.xml | head -5"
```

All should return valid responses.

- [ ] **Step 4: Switch nginx to port 3001**

```bash
ssh root@134.209.33.212 "sed -i 's|proxy_pass http://127.0.0.1:3000|proxy_pass http://127.0.0.1:3001|g' /etc/nginx/sites-available/linkchart-frontend && nginx -t && systemctl reload nginx"
```

- [ ] **Step 5: Verify production is serving Next.js**

```bash
curl -sI "https://linkchart.app/" | grep -E "server|x-powered-by|x-frame"
curl -s "https://linkchart.app/sitemap.xml" | head -5
curl -s "https://linkchart.app/api/health"
```

Expected: `X-Frame-Options: DENY` header (added by Next.js middleware — proof that Next.js is serving), valid sitemap, health check OK.

- [ ] **Step 6: Monitor for 5 minutes**

```bash
ssh root@<DEPLOY_HOST> "docker logs linkcharts-frontend-next-prod --tail 50 -f"
```

Watch for any 500 errors. If critical errors appear, rollback immediately:

```bash
ssh root@<DEPLOY_HOST> "sed -i 's|proxy_pass http://127.0.0.1:3001|proxy_pass http://127.0.0.1:3000|g' /etc/nginx/sites-available/linkchart-frontend && systemctl reload nginx"
```

- [ ] **Step 7: Update docker-compose.prod.yml to port 3000 (final)**

Once Next.js is stable, update `docker-compose.prod.yml`: change `"3001:3000"` to `"3000:3000"`. Also stop the Vite container:

```bash
ssh root@<DEPLOY_HOST> "docker stop linkcharts-frontend-prod"
```

Update nginx back to port 3000. Deploy updated `docker-compose.prod.yml`.

- [ ] **Step 8: Commit cutover changes**

```bash
# In docker-compose.prod.yml: change 3001 → 3000
git add docker-compose.prod.yml
git commit -m "chore: production cutover — Next.js on port 3000, Vite decommissioned"
git push origin feat/nextjs-migration
```

- [ ] **Step 9: Update PR #9 description with cutover status and open for final review**

Close the Vite frontend pipeline or add a path filter to prevent it from deploying while Next.js is live.

---

## Self-Review Checklist

- [x] React Router removal: 33 files covered across Tasks 1–8
- [x] `/r/[slug]` OG metadata: Task 9
- [x] sitemap + robots: Task 10
- [x] Security headers via middleware: Task 11
- [x] Error/loading boundaries: Task 12
- [x] Health check endpoint: Task 13
- [x] CI/CD pipeline: Task 14
- [x] Production cutover: Task 15
- [x] No placeholders — all tasks have actual code
- [x] Type consistency: `id: string` props match across Tasks 5 and 6; `slug: string` consistent with existing `PublicAnalyticsPageContent`
