# Profile Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/profile` page to be visually polished and market-standard (Linear/Shadcn style) with a responsibility acceptance clause on the subdomain block and user stats in the sidebar.

**Architecture:** Backend gains a single `GET /api/profile/stats` endpoint on `AuthController`. Frontend adds a `useProfileStats` hook backed by a new `ProfileService.getStats()` method, then applies the unified header pattern (title + subtitle + Divider) across all three section cards, redesigns `SubdomainSettings` with a chip + responsibility checkbox, and adds an Activity stats card to the sidebar.

**Tech Stack:** Laravel 12 (PHPUnit), Next.js 15 App Router, MUI 6, TanStack Query v5, react-i18next, TypeScript, Zod

---

## File Map

| Path                                                                   | Action                                                         |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `backend/app/Http/Controllers/Auth/AuthController.php`                 | Add `stats()` method                                           |
| `backend/routes/api.php`                                               | Add `GET /profile/stats` route                                 |
| `backend/tests/Feature/Auth/ProfileStatsTest.php`                      | New — 4 test cases                                             |
| `frontend-next/src/lib/api/endpoints.ts`                               | Add `AUTH.PROFILE_STATS`                                       |
| `frontend-next/src/services/profile.service.ts`                        | Add `ProfileStats` type + `getStats()`                         |
| `frontend-next/src/features/profile/hooks/useProfileStats.ts`          | New hook                                                       |
| `frontend-next/src/lib/i18n/locales/pt-BR/profile.json`                | Add sidebar.activity, subdomain.chip, subdomain.responsibility |
| `frontend-next/src/lib/i18n/locales/en/profile.json`                   | Same                                                           |
| `frontend-next/src/features/profile/components/ProfileSidebar.tsx`     | Add Activity card with stats                                   |
| `frontend-next/src/features/profile/components/SubdomainSettings.tsx`  | Chip, Divider, responsibility clause + checkbox                |
| `frontend-next/src/features/profile/components/ProfileForm.tsx`        | Unified header (Divider, inline badge)                         |
| `frontend-next/src/features/profile/components/PasswordChangeForm.tsx` | Add Divider after header                                       |
| `frontend-next/src/page-components/user/ProfilePage.tsx`               | Reorder: Subdomain before Password                             |

---

## Task 1: Backend — profile stats endpoint

**Files:**

- Create: `backend/tests/Feature/Auth/ProfileStatsTest.php`
- Modify: `backend/app/Http/Controllers/Auth/AuthController.php`
- Modify: `backend/routes/api.php`

Work in `backend/` directory.

- [ ] **Step 1: Write the failing tests**

Create `tests/Feature/Auth/ProfileStatsTest.php`:

```php
<?php

namespace Tests\Feature\Auth;

use App\Models\Link;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Tests for GET /api/profile/stats.
 */
class ProfileStatsTest extends TestCase
{
    use RefreshDatabase;

    private function makeVerifiedUser(): User
    {
        return User::factory()->create([
            'email_verified'    => true,
            'email_verified_at' => now(),
        ]);
    }

    /** @test */
    public function test_returns_zero_stats_for_user_with_no_links(): void
    {
        $user = $this->makeVerifiedUser();

        $this->actingAs($user, 'api')
            ->getJson('/api/profile/stats')
            ->assertOk()
            ->assertJsonPath('data.total_links', 0)
            ->assertJsonPath('data.total_clicks', 0);
    }

    /** @test */
    public function test_returns_correct_totals_for_user_with_links(): void
    {
        $user = $this->makeVerifiedUser();
        Link::factory()->create(['user_id' => $user->id, 'clicks' => 10]);
        Link::factory()->create(['user_id' => $user->id, 'clicks' => 25]);

        $this->actingAs($user, 'api')
            ->getJson('/api/profile/stats')
            ->assertOk()
            ->assertJsonPath('data.total_links', 2)
            ->assertJsonPath('data.total_clicks', 35);
    }

    /** @test */
    public function test_only_counts_links_belonging_to_authenticated_user(): void
    {
        $user  = $this->makeVerifiedUser();
        $other = $this->makeVerifiedUser();
        Link::factory()->create(['user_id' => $user->id,  'clicks' => 5]);
        Link::factory()->create(['user_id' => $other->id, 'clicks' => 100]);

        $this->actingAs($user, 'api')
            ->getJson('/api/profile/stats')
            ->assertOk()
            ->assertJsonPath('data.total_links', 1)
            ->assertJsonPath('data.total_clicks', 5);
    }

    /** @test */
    public function test_requires_authentication(): void
    {
        $this->getJson('/api/profile/stats')->assertUnauthorized();
    }
}
```

- [ ] **Step 2: Run tests — expect FAIL (route not found)**

```bash
php artisan test --filter ProfileStatsTest
```

Expected: 4 failures with `404` or route-not-found errors.

- [ ] **Step 3: Add the `stats()` method to AuthController**

Open `app/Http/Controllers/Auth/AuthController.php`. Find the `me()` method (around line 227) and add the following method directly after it:

```php
/**
 * GET /api/profile/stats
 *
 * Returns total link count and cumulative click count for the authenticated user.
 *
 * Auth: JWT + email verified
 * Response shape: { data: { total_links: int, total_clicks: int } } (200)
 *
 * @return \Illuminate\Http\JsonResponse
 */
public function stats(): \Illuminate\Http\JsonResponse
{
    $row = \Illuminate\Support\Facades\DB::table('links')
        ->where('user_id', auth()->id())
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

- [ ] **Step 4: Register the route**

Open `routes/api.php`. Inside the `Route::middleware(['api.auth:api', 'verified'])->group(function () {` block, after the `PUT /profile` line (around line 90), add:

```php
Route::get('/profile/stats', [AuthController::class, 'stats']);   // ✅ NOVO: Stats do perfil
```

- [ ] **Step 5: Run tests — expect all PASS**

```bash
php artisan test --filter ProfileStatsTest
```

Expected output:

```
PASS  Tests\Feature\Auth\ProfileStatsTest
✓ test returns zero stats for user with no links
✓ test returns correct totals for user with links
✓ test only counts links belonging to authenticated user
✓ test requires authentication

Tests: 4 passed
```

- [ ] **Step 6: Run full suite to check for regressions**

```bash
php artisan test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add app/Http/Controllers/Auth/AuthController.php routes/api.php tests/Feature/Auth/ProfileStatsTest.php
git commit -m "feat(profile): add GET /profile/stats endpoint"
```

---

## Task 2: Frontend — API endpoint constant + ProfileService + useProfileStats hook

**Files:**

- Modify: `frontend-next/src/lib/api/endpoints.ts`
- Modify: `frontend-next/src/services/profile.service.ts`
- Create: `frontend-next/src/features/profile/hooks/useProfileStats.ts`

Work in `frontend-next/` directory for all remaining tasks.

- [ ] **Step 1: Add endpoint constant**

Open `src/lib/api/endpoints.ts`. Inside the `AUTH` object (around line 50), add the new entry after `CHANGE_PASSWORD`:

```typescript
PROFILE_STATS: "/api/profile/stats",
```

The `AUTH` block should now contain:

```typescript
AUTH: {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/logout",
  REGISTER: "/api/auth/register",
  PROFILE: "/api/profile",
  ME: "/api/me",
  UPDATE_PROFILE: "/api/profile",
  CHANGE_PASSWORD: "/api/change-password",
  PROFILE_STATS: "/api/profile/stats",
  // ... rest of keys
},
```

Also find the `API_ENDPOINTS` re-export object near the bottom of the file and add:

```typescript
PROFILE_STATS: API_CONFIG.ENDPOINTS.AUTH.PROFILE_STATS,
```

- [ ] **Step 2: Add `ProfileStats` type and `getStats()` to ProfileService**

Open `src/services/profile.service.ts`. Add the `ProfileStats` interface after `UpdateProfileResponse` (around line 33):

```typescript
/**
 * Shape returned by GET /api/profile/stats.
 */
export interface ProfileStats {
  total_links: number;
  total_clicks: number;
}
```

Add `getStats()` as a new method on `ProfileService`, after `updateProfile()`:

```typescript
/**
 * Returns total link and click counts for the authenticated user.
 *
 * @returns `ProfileStats` with total_links and total_clicks.
 * @endpoint `GET /api/profile/stats`
 */
async getStats(): Promise<ProfileStats> {
  return this.get<ProfileStats>(API_CONFIG.ENDPOINTS.AUTH.PROFILE_STATS, {
    context: "get_profile_stats",
  });
}
```

- [ ] **Step 3: Create `useProfileStats` hook**

Create `src/features/profile/hooks/useProfileStats.ts`:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

import { profileService } from "@/services/profile.service";
import type { ProfileStats } from "@/services/profile.service";

export type { ProfileStats };

/** Query key for the authenticated user's profile stats. */
export const PROFILE_STATS_QUERY_KEY = ["profile", "stats"] as const;

/**
 * Returns total link and click counts for the authenticated user.
 *
 * Data is considered fresh for 2 minutes — stats do not need real-time accuracy
 * on the profile page.
 */
export function useProfileStats() {
  return useQuery({
    queryKey: PROFILE_STATS_QUERY_KEY,
    queryFn: () => profileService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
}
```

- [ ] **Step 4: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api/endpoints.ts src/services/profile.service.ts src/features/profile/hooks/useProfileStats.ts
git commit -m "feat(profile): add profile stats service and hook"
```

---

## Task 3: i18n — add new translation keys

**Files:**

- Modify: `src/lib/i18n/locales/pt-BR/profile.json`
- Modify: `src/lib/i18n/locales/en/profile.json`

- [ ] **Step 1: Add keys to pt-BR**

Open `src/lib/i18n/locales/pt-BR/profile.json`.

Inside `"sidebar"`, add after `"dateUnavailable"`:

```json
"activity": "Atividade",
"totalLinks": "Links",
"totalClicks": "Cliques"
```

Inside `"subdomain"`, add after `"releaseError"`:

```json
"chip": {
  "free": "GRÁTIS",
  "active": "ATIVO"
},
"responsibility": {
  "text": "Ao reivindicar este subdomínio você confirma que é responsável por todo conteúdo acessado através dele e que não violará marcas registradas ou direitos de terceiros.",
  "checkbox": "Li e aceito os termos acima"
}
```

- [ ] **Step 2: Add keys to en**

Open `src/lib/i18n/locales/en/profile.json`.

Inside `"sidebar"`, add after `"dateUnavailable"`:

```json
"activity": "Activity",
"totalLinks": "Links",
"totalClicks": "Clicks"
```

Inside `"subdomain"`, add after `"releaseError"`:

```json
"chip": {
  "free": "FREE",
  "active": "ACTIVE"
},
"responsibility": {
  "text": "By claiming this subdomain you confirm you are responsible for all content accessed through it and that you will not violate trademarks or third-party rights.",
  "checkbox": "I have read and accept the terms above"
}
```

- [ ] **Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/locales/pt-BR/profile.json src/lib/i18n/locales/en/profile.json
git commit -m "feat(profile): add i18n keys for stats and subdomain responsibility"
```

---

## Task 4: ProfileSidebar — add Activity stats card

**Files:**

- Modify: `src/features/profile/components/ProfileSidebar.tsx`

- [ ] **Step 1: Rewrite ProfileSidebar.tsx**

Replace the entire file with:

```tsx
"use client";
import {
  BarChart2,
  Calendar,
  Shield,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useProfileStats } from "../hooks/useProfileStats";

import type { UserProfile } from "@/services";

interface ProfileSidebarProps {
  user: UserProfile;
}

/**
 * Sidebar do perfil com status da conta e estatísticas de atividade.
 *
 * Composta por dois cards:
 *  1. Account Status — verified badge + member since
 *  2. Activity — total links and total clicks from useProfileStats
 */
export function ProfileSidebar({ user }: ProfileSidebarProps) {
  const { t } = useTranslation("profile");
  const { data: stats, isLoading: statsLoading } = useProfileStats();

  return (
    <Stack spacing={3}>
      {/* ── Card 1: Account Status ───────────────────────────────── */}
      <EnhancedPaper>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
          >
            <Shield {...ICON_MD} />
            {t("sidebar.accountStatus")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {user.email_verified_at ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "success.50",
                }}
              >
                <BadgeCheck {...ICON_MD} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t("sidebar.verified")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("sidebar.verifiedDesc")}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "warning.50",
                }}
              >
                <AlertCircle {...ICON_MD} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t("sidebar.pendingVerification")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("sidebar.pendingVerificationDesc")}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "info.50",
              }}
            >
              <Calendar {...ICON_SM} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t("sidebar.memberSince")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("pt-BR")
                    : t("sidebar.dateUnavailable")}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </EnhancedPaper>

      {/* ── Card 2: Activity ─────────────────────────────────────── */}
      <EnhancedPaper>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
          >
            <BarChart2 {...ICON_MD} />
            {t("sidebar.activity")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 5 }}>
            <Box>
              {statsLoading ? (
                <Skeleton variant="text" width={48} height={52} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {stats?.total_links ?? 0}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {t("sidebar.totalLinks")}
              </Typography>
            </Box>

            <Box>
              {statsLoading ? (
                <Skeleton variant="text" width={64} height={52} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {(stats?.total_clicks ?? 0).toLocaleString("pt-BR")}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {t("sidebar.totalClicks")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </EnhancedPaper>
    </Stack>
  );
}

export default ProfileSidebar;
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/profile/components/ProfileSidebar.tsx
git commit -m "feat(profile): add activity stats card to sidebar"
```

---

## Task 5: SubdomainSettings — chip, Divider, responsibility clause + checkbox

**Files:**

- Modify: `src/features/profile/components/SubdomainSettings.tsx`

- [ ] **Step 1: Rewrite SubdomainSettings.tsx**

Replace the entire file with:

```tsx
"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

import { useSubdomain } from "../hooks/useSubdomain";

/** Validates the subdomain label on the client before making an API call. */
function isValidSubdomainLabel(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) &&
    value.length >= 3 &&
    value.length <= 63
  );
}

/**
 * Profile settings section that lets the user claim or release a custom subdomain.
 *
 * Renders three states:
 *  1. Loading — MUI Skeletons while initial data is being fetched
 *  2. No subdomain — claim form with availability check + responsibility checkbox
 *  3. Active subdomain — display URL + copy + open + release dialog
 */
export function SubdomainSettings() {
  const { t } = useTranslation("profile");
  const {
    subdomain,
    isLoading,
    claim,
    isClaiming,
    claimError,
    release,
    isReleasing,
    releaseError,
    checkAvailability,
    availability,
    isCheckingAvailability,
  } = useSubdomain();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  /** Sanitizes input to lowercase alphanumeric + hyphens, then triggers debounced check. */
  const handleInputChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(sanitized);
    setInputError(null);
    checkAvailability(sanitized);
  };

  /** Validates and submits the claim request. */
  const handleClaim = async () => {
    if (!isValidSubdomainLabel(inputValue)) {
      setInputError(t("subdomain.validation.format"));
      return;
    }
    if (!availability?.available) {
      setInputError(t("subdomain.validation.unavailable"));
      return;
    }
    try {
      await claim(inputValue);
      setInputValue("");
      setTermsAccepted(false);
    } catch {
      // Error surface via claimError
    }
  };

  /** Copies the full subdomain URL to the clipboard. */
  const handleCopy = () => {
    if (!subdomain?.full_url) return;
    navigator.clipboard.writeText(subdomain.full_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** Releases the current subdomain after dialog confirmation. */
  const handleRelease = async () => {
    try {
      await release();
      setReleaseDialogOpen(false);
      setTermsAccepted(false);
    } catch {
      // Error surface via releaseError
    }
  };

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={320} height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* ── Section header ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography variant="h6">{t("subdomain.title")}</Typography>
        {subdomain ? (
          <Chip
            label={t("subdomain.chip.active")}
            color="success"
            size="small"
          />
        ) : (
          <Chip
            label={t("subdomain.chip.free")}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("subdomain.description")}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ── Active subdomain ─────────────────────────────────────────── */}
      {subdomain ? (
        <Box>
          <FormLabel sx={{ display: "block", mb: 0.75 }}>
            {t("subdomain.activeLabel")}
          </FormLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TextField
              value={subdomain.full_url}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{ flexGrow: 1 }}
              fullWidth
            />
            <Tooltip
              title={copied ? t("subdomain.copied") : t("subdomain.copy")}
            >
              <IconButton onClick={handleCopy} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("subdomain.openInNew")}>
              <IconButton
                component="a"
                href={subdomain.full_url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setReleaseDialogOpen(true)}
            disabled={isReleasing}
          >
            {isReleasing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.releaseButton")}
          </Button>

          {releaseError && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {t("subdomain.releaseError")}
            </Alert>
          )}
        </Box>
      ) : (
        /* ── Claim form ──────────────────────────────────────────────── */
        <Box>
          <FormLabel sx={{ display: "block", mb: 0.75 }}>
            {t("subdomain.inputLabel")}
          </FormLabel>
          <TextField
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("subdomain.inputPlaceholder")}
            error={!!inputError}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.disabled">
                      .linkcharts.com.br
                    </Typography>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 0.75 }}
          />

          {/* Availability indicator */}
          {inputValue.length >= 3 && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}
            >
              {isCheckingAvailability ? (
                <CircularProgress size={14} />
              ) : availability?.available ? (
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              ) : availability ? (
                <ErrorOutlineIcon fontSize="small" color="error" />
              ) : null}
              <Typography
                variant="caption"
                color={
                  isCheckingAvailability
                    ? "text.secondary"
                    : availability?.available
                      ? "success.main"
                      : "error.main"
                }
              >
                {isCheckingAvailability
                  ? t("subdomain.checking")
                  : availability?.available
                    ? t("subdomain.available")
                    : availability
                      ? t("subdomain.unavailable")
                      : ""}
              </Typography>
            </Box>
          )}

          {inputError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mb: 1.5 }}
            >
              {inputError}
            </Typography>
          )}

          {/* Responsibility clause */}
          <Alert severity="warning" variant="outlined" sx={{ mb: 1 }}>
            {t("subdomain.responsibility.text")}
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {t("subdomain.responsibility.checkbox")}
              </Typography>
            }
            sx={{ mb: 1.5, alignItems: "center" }}
          />

          {claimError && (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {t("subdomain.claimError")}
            </Alert>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={handleClaim}
            disabled={
              isClaiming ||
              isCheckingAvailability ||
              !availability?.available ||
              inputValue.length < 3 ||
              !termsAccepted
            }
          >
            {isClaiming ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.claimButton")}
          </Button>
        </Box>
      )}

      {/* ── Release confirmation dialog ──────────────────────────────── */}
      <Dialog
        open={releaseDialogOpen}
        onClose={() => setReleaseDialogOpen(false)}
      >
        <DialogTitle>{t("subdomain.releaseDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("subdomain.releaseDialog.body")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReleaseDialogOpen(false)}>
            {t("subdomain.releaseDialog.cancel")}
          </Button>
          <Button color="error" onClick={handleRelease} disabled={isReleasing}>
            {isReleasing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.releaseDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/profile/components/SubdomainSettings.tsx
git commit -m "feat(profile): redesign SubdomainSettings with chip, divider, and responsibility checkbox"
```

---

## Task 6: ProfileForm — unified header with Divider and inline badge

**Files:**

- Modify: `src/features/profile/components/ProfileForm.tsx`

The goal is to add a `Divider` between the section header and the content, and replace the absolute-positioned `ProfileBadge` with an inline `Chip` next to the title. Logic and styled components remain unchanged.

- [ ] **Step 1: Update ProfileForm.tsx**

In `src/features/profile/components/ProfileForm.tsx`:

1. Add `Chip` and `Divider` to the MUI imports:

```tsx
import { Chip, CircularProgress, Divider } from "@mui/material";
```

2. Replace the `ProfileBadge` + `ProfileHeader` block. Find this section (around line 117):

```tsx
        <ProfileBadge isVerified={!!user.email_verified_at}>
          {user.email_verified_at
            ? t("form.verifiedBadge")
            : t("form.pendingBadge")}
        </ProfileBadge>

        <ProfileHeader>
          <ProfileTitle>{t("sections.personalInfo")}</ProfileTitle>
        </ProfileHeader>
```

Replace with:

```tsx
        <ProfileHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ProfileTitle>{t("sections.personalInfo")}</ProfileTitle>
            <Chip
              label={
                user.email_verified_at
                  ? t("form.verifiedBadge")
                  : t("form.pendingBadge")
              }
              color={user.email_verified_at ? "success" : "warning"}
              size="small"
              variant="outlined"
            />
          </Box>
        </ProfileHeader>
        <Divider sx={{ mb: 3 }} />
```

Note: `Box` is already imported from MUI. If it's not in the MUI import line, add it.

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/profile/components/ProfileForm.tsx
git commit -m "feat(profile): add divider and inline verified chip to ProfileForm header"
```

---

## Task 7: PasswordChangeForm — add Divider after header

**Files:**

- Modify: `src/features/profile/components/PasswordChangeForm.tsx`

The `PasswordChangeForm` already has the title + subtitle pattern. This task only adds a `Divider` below the subtitle to match the other sections.

- [ ] **Step 1: Add Divider import and element**

In `src/features/profile/components/PasswordChangeForm.tsx`:

1. Add `Divider` to the MUI import line:

```tsx
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
```

2. Find the closing of the header `<Box>` (around line 134 — after the `body2` subtitle Typography):

```tsx
            <Typography variant="body2" color="text.secondary">
              {t("password.subtitle")}
            </Typography>
          </Box>
```

Add a `Divider` immediately after that closing `</Box>`:

```tsx
            <Typography variant="body2" color="text.secondary">
              {t("password.subtitle")}
            </Typography>
          </Box>

          <Divider />
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/profile/components/PasswordChangeForm.tsx
git commit -m "feat(profile): add divider after PasswordChangeForm header"
```

---

## Task 8: ProfilePage — reorder sections and final QA

**Files:**

- Modify: `src/page-components/user/ProfilePage.tsx`

- [ ] **Step 1: Reorder the main column sections**

Open `src/page-components/user/ProfilePage.tsx`. Find the main column content (around line 112):

```tsx
              <ProfileForm user={user} onUserUpdate={handleUserUpdate} />
              <PasswordChangeForm />
              {process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" && (
                <SubdomainSettings />
              )}
```

Reorder to put `SubdomainSettings` before `PasswordChangeForm`:

```tsx
<ProfileForm user={user} onUserUpdate={handleUserUpdate} />;
{
  process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" && (
    <SubdomainSettings />
  );
}
<PasswordChangeForm />;
```

- [ ] **Step 2: Run full quality check**

```bash
npm run quality
```

Expected: type-check, lint, and format all pass with no errors.

- [ ] **Step 3: Start dev server and manually test the profile page**

```bash
npm run dev
```

Open `http://localhost:3000/profile` and verify:

1. **Layout order**: Personal Info → Subdomain → Change Password ✓
2. **Sidebar**: two cards — Account Status (with Divider) + Activity (links count, clicks count with skeleton while loading) ✓
3. **SubdomainSettings (no subdomain)**: FREE chip, body2 description, Divider, input field, warning Alert with responsibility text, checkbox (unchecked by default), Claim button disabled until checkbox checked + subdomain available ✓
4. **SubdomainSettings (active)**: ACTIVE green chip, body2 description, Divider, URL field with copy+open buttons, Release button ✓
5. **After claiming**: checkbox resets to unchecked ✓
6. **After releasing**: checkbox is unchecked ✓
7. **ProfileForm**: inline Chip badge next to section title, Divider below header ✓
8. **PasswordChangeForm**: Divider below subtitle ✓

- [ ] **Step 4: Commit**

```bash
git add src/page-components/user/ProfilePage.tsx
git commit -m "feat(profile): move subdomain section above password section"
```

---

## Self-Review

**Spec coverage:**

- ✅ Visual system (unified header: title + subtitle + Divider) → Tasks 4, 5, 6, 7
- ✅ Section reorder (Subdomain before Password) → Task 8
- ✅ SubdomainSettings: FREE/ACTIVE chip → Task 5
- ✅ SubdomainSettings: responsibility clause (Alert warning outlined) → Task 5
- ✅ SubdomainSettings: checkbox before claim button → Task 5
- ✅ Claim button disabled until checkbox checked → Task 5
- ✅ Checkbox resets on claim success and release success → Task 5
- ✅ ProfileForm: inline Chip badge + Divider → Task 6
- ✅ PasswordChangeForm: Divider after header → Task 7
- ✅ Sidebar: Activity card with total_links + total_clicks → Task 4
- ✅ Skeleton while stats loading → Task 4
- ✅ Backend GET /api/profile/stats → Task 1
- ✅ ProfileService.getStats() + useProfileStats hook → Task 2
- ✅ i18n both locales → Task 3

**Type consistency:**

- `ProfileStats` defined in `profile.service.ts`, re-exported from `useProfileStats.ts` — consistent
- `stats?.total_links` / `stats?.total_clicks` match the interface shape
- `t("subdomain.chip.free")` / `t("subdomain.chip.active")` / `t("subdomain.responsibility.text")` / `t("subdomain.responsibility.checkbox")` all defined in Task 3 before use in Task 5
- `t("sidebar.activity")` / `t("sidebar.totalLinks")` / `t("sidebar.totalClicks")` defined in Task 3 before use in Task 4

**No placeholders found.**
