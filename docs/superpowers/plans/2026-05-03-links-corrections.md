# Links Page Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two remaining code-quality issues in the links feature after the main bug-fix session, then commit all accumulated changes.

**Architecture:** Module-level constants avoid re-creating objects on every render; i18n files should only carry keys that are actually referenced in code.

**Tech Stack:** Next.js 15, React, MUI 6, i18next, TypeScript

---

### Task 1: Move STATUS_LABEL_KEYS to module level

**Files:**

- Modify: `src/features/links/components/list/LinkCardRich.tsx:80-85`
- Modify: `src/features/links/components/list/LinksMobileCards.tsx:108-113`

- [ ] **Step 1: Move constant in LinkCardRich.tsx**

Replace the inline constant (currently inside the component function body at line 80) with a module-level constant placed just before the component declaration.

Remove from inside `LinkCardRich`:

```ts
const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const;
```

Add above the `LinkCardRich` function:

```ts
const STATUS_LABEL_KEYS: Record<LinkStatus, string> = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
};
```

- [ ] **Step 2: Move constant in LinksMobileCards.tsx**

Same pattern — remove the inline constant from inside `LinkMobileCard` component body (line 108) and place it at module level, above the `LinkMobileCard` memo declaration.

Remove from inside `LinkMobileCard`:

```ts
const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const;
```

Add above the `LinkMobileCard = memo(...)`:

```ts
const STATUS_LABEL_KEYS: Record<LinkStatus, string> = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
};
```

- [ ] **Step 3: Add LinkStatus import to LinksMobileCards.tsx if missing**

`LinkStatus` type must be imported. Check `import type { ... } from "@/types"` — add `LinkStatus` if not present.

- [ ] **Step 4: Verify TypeScript**

Run: `cd /Users/bruno/Projects/link-charts/frontend-next && npm run type-check`
Expected: no new type errors

---

### Task 2: Remove unused sortOldest translation keys

**Files:**

- Modify: `src/lib/i18n/locales/en/links.json`
- Modify: `src/lib/i18n/locales/pt-BR/links.json`

The key `filters.sortOldest` exists in both locale files but is not referenced in `LinksFilters.tsx` or anywhere in the codebase (grep confirms zero usages). Keeping orphaned keys creates maintenance burden.

- [ ] **Step 1: Remove from en/links.json**

Remove line: `"sortOldest": "Oldest first",`

- [ ] **Step 2: Remove from pt-BR/links.json**

Remove line: `"sortOldest": "Mais antigos",`

- [ ] **Step 3: Verify no runtime references**

Run: `grep -r "sortOldest" src/`
Expected: zero matches (only the json files themselves would have matched before)

---

### Task 3: Commit all session changes

**Files:** All modified files from the bug-fix session (36 files total — RSC `"use client"` fixes, i18n corrections, linkStatus refactor, component fixes).

- [ ] **Step 1: Stage all modified tracked files**

```bash
git -C /Users/bruno/Projects/link-charts/frontend-next add -u
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/bruno/Projects/link-charts/frontend-next commit -m "fix(links): fix RSC boundaries, i18n, status and filter correctness"
```

- [ ] **Step 3: Verify commit**

Run: `git -C /Users/bruno/Projects/link-charts/frontend-next log --oneline -3`
Expected: new commit appears at top
