# Links Listing Page — Visual Upgrade

**Date:** 2026-04-25  
**Status:** Approved  
**Scope:** `src/features/links/` + `src/pages/links/LinkListPage.tsx`

---

## Problem

The links listing page has too many columns (up to 10 on desktop) and the 5 color-coded icon buttons in each row create visual noise. Both issues reduce usability and the overall look is not polished.

---

## Solution Summary

- Reduce visible table columns to 5 essentials; move secondary info to a detail drawer
- Split 5 action icons into 2 inline primary actions + 1 `⋯` menu with secondary actions
- Open a side drawer with full link details on row click
- Refactor oversized files to respect the <200 line component constraint

---

## Component Structure

### Files changed

| File | Change |
|---|---|
| `src/features/links/components/list/useLinksTableColumns.tsx` | Refactor: 446 → ~120 lines. Only 5 visible columns, no hidden-column logic |
| `src/pages/links/LinkListPage.tsx` | Add `drawerLink` state; pass `onRowClick` to DataTable |
| `src/features/links/components/list/useLinksTableColumns.tsx` stops importing `LinkTableActions` from `@/shared/ui/patterns/TableActions.tsx` | `TableActions.tsx` stays intact (shared); the columns hook simply stops using it in favour of the two new components |

### Files created

| File | Responsibility | Max lines |
|---|---|---|
| `src/features/links/components/list/LinkDetailDrawer.tsx` | Right-side drawer with full link info | 200 |
| `src/features/links/components/list/LinkActionsInline.tsx` | Analytics + Copy buttons, always visible | 80 |
| `src/features/links/components/list/LinkActionsMenu.tsx` | `⋯` menu: Edit / QR / Delete | 100 |

---

## Table Columns (desktop)

Five columns visible by default:

| # | Field | Render | Width |
|---|---|---|---|
| 1 | **Title** | Link title in `body1` bold; slug below in `caption` monospace `text.secondary` | flex 2 |
| 2 | **Short URL** | Badge: `alpha(primary, 0.08)` bg, `primary.main` text, `border-radius: 6px`, `padding: 4px 8px`, monospace font | flex 2 |
| 3 | **Clicks** | Number in `subtitle2` bold — no Chip | 90px |
| 4 | **Status** | 8px circle dot (`background: color.main`) + label in `caption` — replaces full Chip | 120px |
| 5 | **Actions** | `LinkActionsInline` + `LinkActionsMenu` | 140px |

**Row height:** 56px (up from default compact).

### Columns removed from table (shown in drawer instead)

`original_url` · `click_limit` · `created_at` · `starts_in` · `expires_at` · `utm_*`

### Mobile

`LinksMobileCards` keeps its current card structure. `LinkActionsInline` and `LinkActionsMenu` replace the existing action buttons within cards and the bottom drawer action list.

---

## Actions

### `LinkActionsInline`

Two `IconButton size="small"` side by side:

| Button | Icon | Default color | Hover |
|---|---|---|---|
| Analytics | `HiChartBar` | `text.secondary` | `success.main` + `alpha(success, 0.10)` bg |
| Copy URL | `HiClipboardDocument` | `text.secondary` | `primary.main` + `alpha(primary, 0.10)` bg |

- Both have `Tooltip`
- Copy button shows 16px spinner for ~300ms while clipboard processes, then reverts to icon

### `LinkActionsMenu`

`IconButton` with `HiEllipsisVertical`, same neutral style. Opens MUI `Menu`:

```
┌─────────────────────┐
│ ✏️  Editar           │
│ ◼  QR Code          │
│ ─────────────────── │
│ 🗑  Excluir          │  ← error.main, separated by Divider
└─────────────────────┘
```

- Delete triggers existing confirmation dialog
- Delete is separated by a `Divider` to signal destructive intent

### Visual result in the actions column

```
[📊] [📋] [⋯]
```

Three neutral grey icons, gaining color only on hover.

---

## `LinkDetailDrawer`

**Trigger:** Click anywhere on a table row (except action buttons — those use `stopPropagation`).  
**Width:** 400px (desktop) / 100vw (mobile).  
**Close:** `×` button, click outside, or `Esc`.  
**State:** `drawerLink: LinkResponse | null` in `LinkListPage`, passed as prop.

### Layout

```
┌─────────────────────────────────┐
│  [×]  {slug}                    │  header: slug as title + close button
│  ● Ativo                        │  status chip
├─────────────────────────────────┤
│  URL Original                   │
│  {original_url}            [↗]  │  2-line truncation + "ver completa" expand
│                                 │
│  URL Encurtada                  │
│  {short_url}               [📋] │  badge + copy button
├─── Estatísticas ────────────────┤
│  Clicks totais      Limite      │
│       42          100 / ∞       │
├─── Agendamento ─────────────────┤  conditional: only if starts_in or expires_at
│  Início         Término         │
│  01/05/2026     31/12/2026      │
├─── UTM ─────────────────────────┤  conditional: only if any utm_* present
│  Source: newsletter             │
│  Medium: email                  │
├─────────────────────────────────┤
│  Criado em:    {created_at}     │
│  Atualizado:   {updated_at}     │
├─────────────────────────────────┤  sticky footer
│  [📊 Analytics]  [✏️ Editar]    │
└─────────────────────────────────┘
```

### Rules

- "Agendamento" section only renders if `starts_in || expires_at` is set
- "UTM" section only renders if at least one `utm_*` field is non-null
- Footer is `position: sticky; bottom: 0` — always accessible without scrolling
- **Delete is not in the drawer** — destructive action stays in the `⋯` menu only
- URL original: truncated to 2 lines with a toggle to show full value inline

---

## Constraints

- All new/modified components: **< 200 lines** (page < 100)
- Reuse `EnhancedPaper`, `PageBreadcrumb` where applicable
- No new design tokens — use existing theme palette and spacing
- `useLinks()`, `useClipboard()`, `useResponsive()` hooks — no new hooks needed
