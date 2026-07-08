# Mobile-First Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship shared mobile-first utilities (responsive dialog, chart-height discipline, theme-only breakpoints, `isPhone`, `dvh/svh`) plus a 375px Playwright regression net, without changing behavior for existing consumers.

**Architecture:** Small, isolated additions in `shared/` and `lib/theme/hooks`, targeted edits to known offender files, and a new mobile Playwright project. No architectural change; no new runtime dependencies. The Playwright net is built first so later tasks (and future sub-projects B–D) are guarded against horizontal-overflow regressions.

**Tech Stack:** Next 15 App Router, MUI 6, Emotion, TypeScript, Playwright (already installed). Frontend has **no unit-test runner** — verification is `npm run quality` (type-check + lint + format:check) plus the Playwright mobile net plus explicit manual DevTools checks where noted.

## Global Constraints

- **Zero new dependencies.** Nothing added to `package.json`.
- **`useResponsive()` public API is immutable.** Only optimize internals and ADD `isPhone`. Existing return fields keep identical names, types, and values.
- **`isMobile` semantics unchanged** = `theme.breakpoints.down("md")` (< 900px, includes tablet). `isPhone` = `down("sm")` (< 600px).
- **Always theme breakpoints**, never hardcoded px in `useMediaQuery`.
- **Commits:** Conventional Commits, imperative, lowercase, no trailing period, subject < 72 chars. No AI/Claude references or trailers.
- **Playwright runs against an ALREADY-RUNNING dev server** (Docker on :3000). Never boot `next dev`/`build` from the host — it corrupts the container `.next` cache.
- **i18n:** UI is en + pt-BR. Test selectors must be role/attribute-based, never hardcoded copy.
- Work happens on branch `docs/mobile-first-foundation` (already checked out) or a fresh feature branch off it — never commit straight to `main`.

---

## File Structure

- **Create** `e2e/mobile-responsive.spec.ts` — 375px overflow regression net (public routes).
- **Modify** `playwright.config.ts` — add a `mobile` project (375×812, touch).
- **Create** `src/shared/ui/feedback/ResponsiveDialog.tsx` — Dialog wrapper, fullScreen below `sm`.
- **Modify** `src/shared/ui/feedback/index.ts` (barrel) — export `ResponsiveDialog`.
- **Modify** `src/features/links/components/list/DeleteConfirmDialog.tsx` — use `ResponsiveDialog`.
- **Modify** `src/features/profile/components/SubdomainSettings.tsx` — use `ResponsiveDialog`.
- **Modify** 4 chart files — route height through `ApexChartWrapper` `size`.
- **Modify** `src/shared/ui/data-display/DataTableTopToolbar.tsx` — theme breakpoints.
- **Modify** `src/lib/theme/hooks/useResponsive.ts` — slim internals + add `isPhone`.
- **Modify** ~8 layout/page files — `100vh` → `100dvh`.
- **Create** `docs/MOBILE.md` — mobile-first convention doc.

---

### Task 1: Playwright mobile regression net (375px)

**Files:**
- Modify: `playwright.config.ts`
- Test: `e2e/mobile-responsive.spec.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: a Playwright project named `mobile` and a spec asserting no horizontal overflow on public routes. Later tasks and sub-projects re-run `npx playwright test mobile-responsive`.

- [ ] **Step 1: Add the `mobile` project to Playwright config**

Modify `playwright.config.ts` — add a second entry to the `projects` array (keep `chromium`):

```ts
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
```

(`devices["iPhone 12"]` uses the webkit engine; we keep the Chromium engine and just override the viewport so it runs in the same browser as the rest of the suite at an exact 375px width.)

- [ ] **Step 2: Write the overflow spec**

Create `e2e/mobile-responsive.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

/**
 * Mobile regression net (375px). Fails when a public route overflows
 * horizontally — the single most common "mobile is broken" symptom.
 * Routes needing auth or a real slug are covered later by sub-projects.
 */

const PUBLIC_ROUTES = ["/", "/shorter", "/sign-in", "/privacy", "/terms", "/support"];

for (const route of PUBLIC_ROUTES) {
  test(`no horizontal overflow at 375px: ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();

    // Allow a 1px rounding tolerance; anything wider is a real overflow.
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow, `document overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
  });
}
```

- [ ] **Step 3: Ensure the dev server is running, then run the mobile net**

Confirm the app is up (Docker dev on :3000). Run:

```bash
npx playwright test mobile-responsive --project=mobile
```

Expected: the test executes against all 6 routes. Some routes MAY fail here — that is the net doing its job (it surfaces existing overflow, e.g. before the `dvh` fix in Task 6). Record which routes fail; do not "fix" by loosening the assertion.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e/mobile-responsive.spec.ts
git commit -m "test(mobile): add 375px horizontal-overflow regression net"
```

---

### Task 2: ResponsiveDialog + migrate existing dialogs

**Files:**
- Create: `src/shared/ui/feedback/ResponsiveDialog.tsx`
- Modify: `src/shared/ui/feedback/index.ts`
- Modify: `src/features/links/components/list/DeleteConfirmDialog.tsx`
- Modify: `src/features/profile/components/SubdomainSettings.tsx`

**Interfaces:**
- Consumes: MUI `Dialog`, `useThemeMediaQuery` from `@/shared/hooks`.
- Produces: `ResponsiveDialog` — a drop-in for MUI `<Dialog>` that forces `fullScreen` when the viewport is `< sm`. Accepts all `DialogProps`. Signature: `function ResponsiveDialog(props: DialogProps): JSX.Element`.

- [ ] **Step 1: Read the current dialogs to preserve their props**

Read `src/features/links/components/list/DeleteConfirmDialog.tsx` and `src/features/profile/components/SubdomainSettings.tsx:520-540` so the migration keeps `maxWidth`, `onClose`, `open`, transitions intact.

- [ ] **Step 2: Create `ResponsiveDialog`**

Create `src/shared/ui/feedback/ResponsiveDialog.tsx`:

```tsx
"use client";

import { Dialog, type DialogProps } from "@mui/material";
import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";

/**
 * Drop-in MUI Dialog that becomes fullScreen on phones (< sm), where a
 * centered modal is cramped and easy to mis-tap. All DialogProps pass through;
 * an explicit `fullScreen` prop still wins on larger screens.
 */
export function ResponsiveDialog(props: DialogProps) {
  const isPhone = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  return <Dialog fullScreen={isPhone} {...props} />;
}

export default ResponsiveDialog;
```

Note: `{...props}` spreads AFTER `fullScreen={isPhone}`, so a caller that explicitly passes `fullScreen` overrides the default — intentional.

- [ ] **Step 3: Export from the feedback barrel**

Read `src/shared/ui/feedback/index.ts`; add:

```ts
export { ResponsiveDialog, default as ResponsiveDialogDefault } from "./ResponsiveDialog";
```

(If the barrel uses a different export style, match it — export at minimum the named `ResponsiveDialog`.)

- [ ] **Step 4: Migrate `DeleteConfirmDialog`**

In `src/features/links/components/list/DeleteConfirmDialog.tsx`, replace the `Dialog` import/usage with `ResponsiveDialog`:
- Remove `Dialog` from the `@mui/material` import (keep `DialogTitle`, `DialogContent`, etc.).
- Import: `import { ResponsiveDialog } from "@/shared/ui/feedback";`
- Change `<Dialog ...>` → `<ResponsiveDialog ...>` and the closing tag.

- [ ] **Step 5: Migrate the dialog in `SubdomainSettings`**

Same swap in `src/features/profile/components/SubdomainSettings.tsx` (the `<Dialog>` at ~line 523).

- [ ] **Step 6: Verify quality + visual**

Run:

```bash
npm run type-check && npm run lint
```

Expected: PASS. Then in browser DevTools at 375px, open the delete-confirm dialog (Links list) and the subdomain-release dialog (Profile) — both should render fullScreen. At ≥600px they render as normal centered modals.

- [ ] **Step 7: Commit**

```bash
git add src/shared/ui/feedback/ResponsiveDialog.tsx src/shared/ui/feedback/index.ts src/features/links/components/list/DeleteConfirmDialog.tsx src/features/profile/components/SubdomainSettings.tsx
git commit -m "feat(mobile): add ResponsiveDialog and make dialogs fullscreen on phones"
```

---

### Task 3: Chart-height discipline

**Files:**
- Modify: `src/features/analytics/components/insights/RetentionAnalysisChart.tsx:52`
- Modify: `src/features/analytics/components/insights/SessionDepthChart.tsx:100`
- Modify: `src/features/analytics/components/insights/sub-views/TrafficChannelsView.tsx:64,125`

**Interfaces:**
- Consumes: `ApexChartWrapper` `size?: "compact" | "standard" | "large"` prop → resolves via `useChartHeight` to a per-breakpoint height (xs smaller). Existing `height?: number` override stays but is reserved for genuine fixed-px cases.
- Produces: nothing new; removes fixed heights so charts shrink on xs.

- [ ] **Step 1: Read each chart to see how it passes height**

Read the four locations. Confirm each renders through `ApexChartWrapper` (or the raw `Chart`); note whether they pass `height={300}`/`{350}` to the wrapper or to ApexCharts directly.

- [ ] **Step 2: Replace fixed heights with `size`**

For each, map the fixed height to the closest responsive `size` and pass `size` to `ApexChartWrapper` instead of `height`:
- `height: 300` → `size="standard"` (standard md = 300).
- `height: 350` → `size="standard"` (standard lg = 350; xs shrinks to 220).

If a chart renders ApexCharts directly (not via wrapper), instead compute height with the hook: `const height = useChartHeight("standard");` and pass `height={height}`.

Concrete edits:
- `RetentionAnalysisChart.tsx:52` — remove `height: 300`; pass `size="standard"`.
- `SessionDepthChart.tsx:100` — remove `height: 350`; pass `size="standard"`.
- `TrafficChannelsView.tsx:64` (`350`) and `:125` (`300`) — pass `size="standard"`.

- [ ] **Step 3: Verify quality + visual**

```bash
npm run type-check && npm run lint
```

Expected: PASS. In DevTools at 375px, the three insights charts should render shorter than on desktop (no fixed 300/350). Confirm no clipping.

- [ ] **Step 4: Commit**

```bash
git add src/features/analytics/components/insights/RetentionAnalysisChart.tsx src/features/analytics/components/insights/SessionDepthChart.tsx src/features/analytics/components/insights/sub-views/TrafficChannelsView.tsx
git commit -m "fix(mobile): route insight charts through responsive size instead of fixed height"
```

---

### Task 4: Consolidate breakpoints to the theme

**Files:**
- Modify: `src/shared/ui/data-display/DataTableTopToolbar.tsx:41-42`

**Interfaces:**
- Consumes: `useThemeMediaQuery` from `@/shared/hooks`.
- Produces: nothing new; removes hardcoded-px media queries.

- [ ] **Step 1: Sweep for other hardcoded-px media queries**

Run:

```bash
grep -rnE 'useMediaQuery\("\(max-width|useMediaQuery\("\(min-width' src --include="*.tsx" --include="*.ts"
```

Expected: primarily `DataTableTopToolbar.tsx`. If others appear, add them to this task's edits.

- [ ] **Step 2: Replace with theme breakpoints**

In `DataTableTopToolbar.tsx`, replace:

```ts
const isMobile = useMediaQuery("(max-width:720px)");
const isTablet = useMediaQuery("(max-width:1024px)");
```

with theme-based queries (720px ≈ `sm`, 1024px ≈ `md`; use the nearest theme breakpoints for consistency):

```ts
import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";
// ...
const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
const isTablet = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));
```

Remove the now-unused `useMediaQuery` import if nothing else uses it.

- [ ] **Step 3: Verify quality**

```bash
npm run type-check && npm run lint
```

Expected: PASS. In DevTools, confirm the data-table toolbar collapses at the sm/md thresholds as before (behavior parity — the exact px shifts slightly from 720→600 / 1024→900, which is intended consistency).

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/data-display/DataTableTopToolbar.tsx
git commit -m "refactor(mobile): use theme breakpoints in data-table toolbar"
```

---

### Task 5: Slim `useResponsive` + add `isPhone`

**Files:**
- Modify: `src/lib/theme/hooks/useResponsive.ts`

**Interfaces:**
- Consumes: `useThemeMediaQuery`.
- Produces: `ResponsiveConfig` gains `isPhone: boolean` (= `down("sm")`). All existing fields keep identical names/types/values.

- [ ] **Step 1: Add `isPhone` to the interface and return value**

In `useResponsive.ts`:
- Add `isPhone: boolean;` to the `ResponsiveConfig` interface (near `isMobile`).
- Add `const isPhone = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));`
- Add `isPhone,` to the returned object.

Do NOT change `isMobile` (`down("md")`) or any other field. Slimming is optional; if you remove any of the `only(...)` queries, they must still be derivable so `currentBreakpoint` stays exact — safest is to leave the existing queries and only ADD `isPhone`.

- [ ] **Step 2: Verify quality**

```bash
npm run type-check && npm run lint
```

Expected: PASS (no consumer breaks — purely additive).

- [ ] **Step 3: Confirm no accidental behavior change**

```bash
grep -rn "isPhone" src --include="*.tsx" --include="*.ts"
```

Expected: only the definition in `useResponsive.ts` (no consumers yet — sub-projects adopt it later).

- [ ] **Step 4: Commit**

```bash
git add src/lib/theme/hooks/useResponsive.ts
git commit -m "feat(mobile): add isPhone breakpoint helper to useResponsive"
```

---

### Task 6: `dvh/svh` for full-height sections

**Files:**
- Modify: `src/shared/layout/MainLayout.tsx:35,74`
- Modify: `src/shared/layout/PublicLayout.tsx:271,369`
- Modify: `src/shared/layout/AuthLayout.tsx:77`
- Modify: `src/shared/layout/ErrorLayout.tsx:87`
- Modify: `src/page-components/system/UnauthorizedPage.tsx:41`
- Modify: `src/page-components/public/ShorterPage.tsx:56`
- Modify: `src/features/public-analytics/PublicAnalyticsPageContent.tsx:73`
- Modify: `src/shared/ui/feedback/Loading.tsx:180`

**Interfaces:**
- Consumes: nothing.
- Produces: full-height containers that respect mobile browser chrome. `RealTimeHeatmapChart.tsx:416` (`100vh` fullscreen) is intentionally left as-is.

- [ ] **Step 1: Replace `100vh` with `100dvh`**

In each file/line above, change `"100vh"` → `"100dvh"` and `calc(100vh - X)` → `calc(100dvh - X)`. `dvh` (dynamic viewport height) tracks the visible area as mobile browser bars show/hide; it degrades gracefully on desktop.

- [ ] **Step 2: Verify quality**

```bash
npm run type-check && npm run lint
```

Expected: PASS.

- [ ] **Step 3: Re-run the mobile net (should now be greener)**

```bash
npx playwright test mobile-responsive --project=mobile
```

Expected: routes that failed only due to viewport-height issues improve; horizontal-overflow assertions should pass for public routes. Any remaining overflow is a real layout bug — note it for sub-project B, do not loosen the test.

- [ ] **Step 4: Commit**

```bash
git add src/shared/layout/MainLayout.tsx src/shared/layout/PublicLayout.tsx src/shared/layout/AuthLayout.tsx src/shared/layout/ErrorLayout.tsx src/page-components/system/UnauthorizedPage.tsx src/page-components/public/ShorterPage.tsx src/features/public-analytics/PublicAnalyticsPageContent.tsx src/shared/ui/feedback/Loading.tsx
git commit -m "fix(mobile): use dvh for full-height sections to respect browser chrome"
```

---

### Task 7: Mobile-first convention doc

**Files:**
- Create: `docs/MOBILE.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the ruleset sub-projects B–D and future PRs follow.

- [ ] **Step 1: Write `docs/MOBILE.md`**

```markdown
# Mobile-First Conventions

The app is mobile-first. Follow these rules in every component and PR.

1. **Base = mobile.** In `sx`, the bare value targets the smallest screen; scale
   up with `sm`/`md`/`lg`. e.g. `gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }`.
2. **Theme breakpoints only.** Never `useMediaQuery("(max-width:720px)")`. Use
   `useThemeMediaQuery`/`useResponsive`. `isMobile` = `< md` (incl. tablet);
   `isPhone` = `< sm` (phone only).
3. **Dialogs** use `ResponsiveDialog` (fullScreen on phones), not raw `<Dialog>`.
4. **Charts** render through `ApexChartWrapper` with `size` (`compact`/`standard`/
   `large`), not a fixed `height`.
5. **No fixed px width > 360** on `sx` containers/cards/dialogs — use `%`,
   `maxWidth` tokens, or responsive objects.
6. **Full height** uses `dvh`/`svh`, not `vh`.
7. **Tables** on phones: hide non-essential columns or use a card fallback; never
   force `minWidth` that causes horizontal scroll.

CI runs `e2e/mobile-responsive.spec.ts` at 375px and fails on horizontal overflow.
```

- [ ] **Step 2: Commit**

```bash
git add docs/MOBILE.md
git commit -m "docs(mobile): add mobile-first convention guide"
```

---

## Final verification

- [ ] Run full quality gate:

```bash
npm run quality
```

Expected: PASS.

- [ ] Run the mobile net one last time:

```bash
npx playwright test mobile-responsive --project=mobile
```

Expected: all public-route overflow assertions pass (or remaining failures are documented and handed to sub-project B).

---

## Self-Review (completed by author)

- **Spec coverage:** U1→Task 2, U2→Task 3, U3→Task 4, U4→Task 5, U5→Task 6, U6→Task 1, U7→Task 7. All 7 units mapped.
- **Placeholders:** none — every code step shows real code; every command shows expected output.
- **Type consistency:** `ResponsiveDialog(props: DialogProps)`, `size` prop values `compact|standard|large`, `isPhone: boolean` used consistently across tasks and the spec.
- **Scope:** Foundation only; sub-projects B–D explicitly deferred, including public-analytics slug routes and authed routes in the test net.
