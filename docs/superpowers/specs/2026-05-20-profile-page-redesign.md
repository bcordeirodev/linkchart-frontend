# Profile Page Redesign — Design Spec

## Goal

Redesign the `/profile` page to be visually polished, minimalist, and market-standard (Vercel/Linear style) while improving the subdomain settings UX with a responsibility acceptance clause and adding user stats to the sidebar.

## Visual System

All three section cards follow the same internal pattern:

```
┌─────────────────────────────────────────────┐
│ Section Title                [optional badge]│
│ Subtitle explaining what this section does   │
│ ────────────────────────────────────────── │
│                                              │
│  [section content]                           │
│                                              │
│                          [primary action]    │
└─────────────────────────────────────────────┘
```

**Rules applied across all sections:**

- `Typography variant="h6"` title + `Typography variant="body2" color="text.secondary"` subtitle
- `Divider` between header and content
- All TextFields use external `FormLabel` above the input (no floating label/notch)
- Action buttons: `size="small"`, aligned right
- Section spacing: `gap: 4` desktop, `gap: 2.5` mobile

## Section Order (changed)

New order in `ProfilePage.tsx`:

1. Personal Info (`ProfileForm`)
2. **Custom Subdomain** (`SubdomainSettings`) ← moved up (most differentiated feature)
3. Change Password (`PasswordChangeForm`) ← moved down (utility)

## SubdomainSettings Redesign

### Claim form state

```
┌──────────────────────────────────────────────────────┐
│ Custom Subdomain                    [chip: FREE]      │
│ Links created while active will use                   │
│ yourname.linkcharts.com.br as base. Existing links   │
│ are not affected.                                     │
│ ──────────────────────────────────────────────────── │
│                                                       │
│ Your subdomain                                        │
│ ┌──────────────────────────┐  .linkcharts.com.br      │
│ │ mycompany                │                          │
│ └──────────────────────────┘                          │
│ ✓ Available  (or ✗ Already taken)                     │
│                                                       │
│ ┌── Alert outlined warning ───────────────────────┐   │
│ │ By claiming this subdomain you confirm you are  │   │
│ │ responsible for all content accessed through    │   │
│ │ it and that you will not violate trademarks or  │   │
│ │ third-party rights.                             │   │
│ └─────────────────────────────────────────────────┘   │
│ ☐ I have read and accept the terms above              │
│                                                       │
│                                  [Claim →]            │
└──────────────────────────────────────────────────────┘
```

**Claim button disabled until ALL of:**

- Input length ≥ 3 and format valid
- Availability check returned `available: true`
- Responsibility checkbox is checked
- Not currently submitting

**On release:** checkbox resets to unchecked.

**Chip:** `FREE` — `variant="outlined"` in `text.secondary` color (neutral, not promotional).

### Active subdomain state

```
┌──────────────────────────────────────────────────────┐
│ Custom Subdomain              [chip: ACTIVE ●]        │
│ New links will automatically use this subdomain       │
│ as base.                                              │
│ ──────────────────────────────────────────────────── │
│                                                       │
│ Your subdomain                                        │
│ ┌────────────────────────────────────┐ [copy] [open]  │
│ │ https://mycompany.linkcharts.com.br│               │
│ └────────────────────────────────────┘               │
│                                                       │
│                        [Release subdomain]            │
└──────────────────────────────────────────────────────┘
```

**Chip:** `ACTIVE ●` — `color="success"` filled.

### Responsibility clause i18n keys

Both `pt-BR/profile.json` and `en/profile.json` under `subdomain`:

```json
"chip": {
  "free": "GRÁTIS",
  "active": "ATIVO"
},
"responsibility": {
  "text": "Ao reivindicar este subdomínio você confirma que é responsável por todo conteúdo acessado através dele e que não violará marcas registradas ou direitos de terceiros.",
  "checkbox": "Li e aceito os termos acima"
},
```

## ProfileForm and PasswordChangeForm

Apply the unified header pattern (title + subtitle + Divider) to both components. No logic changes — visual only.

`ProfileForm` specific:

- Verified/Pending badge moves to inline chip next to the section title (replaces the absolute-positioned `ProfileBadge`)
- External `FormLabel` above Name and Email fields (remove `label` prop from `StyledTextField`)

`PasswordChangeForm` specific:

- Same title + subtitle + Divider header
- No logic or validation changes

## Sidebar Redesign

Two separate `Paper` cards stacked vertically:

**Card 1 — Account Status** (existing, visually aligned to new system):

- Verified/pending status row
- Member since row

**Card 2 — Activity** (new):

```
┌──────────────────────────────┐
│ 📊 Activity                  │
│ ─────────────────────────── │
│   247              18.4k     │
│   Links            Clicks    │
└──────────────────────────────┘
```

Two values side by side: large `Typography variant="h4"` number + `Typography variant="caption" color="text.secondary"` label beneath each.
Skeleton (two `Skeleton variant="text"` placeholders) while loading.

### Stats data flow

**Backend:** new `GET /api/profile/stats` route, protected by `api.auth + verified`.

Controller method added to `AuthController` (keeps profile-related endpoints together):

```php
public function stats(): JsonResponse
{
    $user = auth()->user();
    $row = DB::table('links')
        ->where('user_id', $user->id)
        ->selectRaw('COUNT(*) as total_links, COALESCE(SUM(clicks), 0) as total_clicks')
        ->first();

    return response()->json([
        'data' => [
            'total_links'  => (int) $row->total_links,
            'total_clicks' => (int) $row->total_clicks,
        ],
    ]);
}
```

Route added to `routes/api.php` inside the `api.auth + verified` group:

```php
Route::get('/profile/stats', [AuthController::class, 'stats']);
```

**Frontend hook** `src/features/profile/hooks/useProfileStats.ts`:

```typescript
export function useProfileStats() {
  return useQuery({
    queryKey: ["profile", "stats"],
    queryFn: () => profileService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}
```

**ProfileService** — new method:

```typescript
async getStats(): Promise<{ total_links: number; total_clicks: number }> {
  return this.get('/api/profile/stats');
}
```

## i18n additions

### `pt-BR/profile.json`

```json
"sidebar": {
  // existing keys kept...
  "activity": "Atividade",
  "totalLinks": "Links",
  "totalClicks": "Cliques"
},
"subdomain": {
  // existing keys kept...
  "chip": {
    "free": "GRÁTIS",
    "active": "ATIVO"
  },
  "responsibility": {
    "text": "Ao reivindicar este subdomínio você confirma que é responsável por todo conteúdo acessado através dele e que não violará marcas registradas ou direitos de terceiros.",
    "checkbox": "Li e aceito os termos acima"
  }
}
```

### `en/profile.json`

```json
"sidebar": {
  // existing keys kept...
  "activity": "Activity",
  "totalLinks": "Links",
  "totalClicks": "Clicks"
},
"subdomain": {
  // existing keys kept...
  "chip": {
    "free": "FREE",
    "active": "ACTIVE"
  },
  "responsibility": {
    "text": "By claiming this subdomain you confirm you are responsible for all content accessed through it and that you will not violate trademarks or third-party rights.",
    "checkbox": "I have read and accept the terms above"
  }
}
```

## Files Changed

### Backend

| File                                           | Change                         |
| ---------------------------------------------- | ------------------------------ |
| `app/Http/Controllers/Auth/AuthController.php` | Add `stats()` method           |
| `routes/api.php`                               | Add `GET /profile/stats` route |

### Frontend

| File                                                     | Change                                                 |
| -------------------------------------------------------- | ------------------------------------------------------ |
| `src/features/profile/components/SubdomainSettings.tsx`  | Chip, responsibility clause + checkbox, visual header  |
| `src/features/profile/components/ProfileSidebar.tsx`     | Add Activity card with stats + Skeleton                |
| `src/features/profile/components/ProfileForm.tsx`        | Header pattern, inline verified badge, external labels |
| `src/features/profile/components/PasswordChangeForm.tsx` | Header pattern only                                    |
| `src/features/profile/hooks/useProfileStats.ts`          | New hook                                               |
| `src/services/profile.service.ts`                        | Add `getStats()` method                                |
| `src/page-components/user/ProfilePage.tsx`               | Reorder: Subdomain before Password                     |
| `src/lib/i18n/locales/pt-BR/profile.json`                | New keys                                               |
| `src/lib/i18n/locales/en/profile.json`                   | New keys                                               |

## Out of Scope

- `Profile.styled.tsx` — kept as-is; `ProfileForm` continues using existing styled components
- `useSubdomain` hook — no changes
- Backend subdomain routes — no changes
- Delete account / danger zone — not implemented in this iteration
