# Link List Rich Cards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the DataTable on `/link` with rich vertical cards (sparkline, trend %, last click, OG preview, health badge) backed by 5 new backend endpoints and 2 new async jobs.

**Architecture:** Backend adds `health_status`/`health_checked_at` columns, `link_previews` table, two new methods in MetricsService (sparkline + trend), a LinkPreviewService, two jobs (FetchLinkPreviewJob, LinkHealthCheckJob), and a LinkMetaController. Frontend adds a `link-meta.service`, `useLinksMeta` hook, 5 atomic display components, and `LinkCardRich`. DataTable and LinkDetailDrawer are removed; LinksFilters gains chips-toggle + sort dropdown; LinkListPage wires it all together; LinksMobileCards gets a sparkline mini + trend line.

**Tech Stack:** Laravel 12 / Guzzle / Redis / PHPUnit (backend) · React 18 / TypeScript / MUI v6 / ApexCharts / react-router-dom (frontend) · Docker-only execution (`docker-compose exec app …`)

> **Note:** Frontend has no automated test suite. Verification uses `npm run type-check` + browser.

---

## File Map

### Backend — create
| Path | Purpose |
|---|---|
| `database/migrations/{ts}_add_health_to_links_table.php` | `health_status` + `health_checked_at` columns on `links` |
| `database/migrations/{ts}_create_link_previews_table.php` | `link_previews` table |
| `app/Models/LinkPreview.php` | Eloquent model for `link_previews` |
| `app/Services/Links/LinkPreviewService.php` | OG scraper with Guzzle, 5s timeout, 24h cache |
| `app/Jobs/FetchLinkPreviewJob.php` | Async job to fetch + persist OG data |
| `app/Jobs/LinkHealthCheckJob.php` | Cron job — HEAD request all active links, update health fields |
| `app/Http/Controllers/Links/LinkMetaController.php` | `batchMeta`, `sparkline`, `trend`, `preview`, `health` actions |

### Backend — modify
| Path | Change |
|---|---|
| `app/Models/Link.php` | Add `health_status`, `health_checked_at` to `$fillable` + `$casts`; add `preview()` relation |
| `app/Services/Analytics/MetricsService.php` | Add `getLinkSparkline(int $linkId, int $days)` + `getLinkTrend(int $linkId, int $window)` |
| `routes/api.php` | Register 5 new routes under `/api/links` inside auth middleware |
| `routes/console.php` | Schedule `LinkHealthCheckJob::everyHour()` |

### Frontend — create
| Path | Purpose |
|---|---|
| `src/types/core/link-meta.ts` | `SparklinePoint`, `LinkTrend`, `LinkPreview`, `LinkHealth`, `LinkMeta`, `BatchMetaResponse` |
| `src/services/link-meta.service.ts` | `batchMeta(ids)` — extends BaseService |
| `src/features/links/hooks/useLinksMeta.ts` | Calls `batchMeta`, returns `{ meta, loading }` |
| `src/features/links/components/list/LinkSparkline.tsx` | ApexChartWrapper in sparkline mode |
| `src/features/links/components/list/LinkPreviewThumb.tsx` | Favicon img with Language icon fallback |
| `src/features/links/components/list/LinkTrendBadge.tsx` | Clicks + trend % with directional icon |
| `src/features/links/components/list/LinkHealthBadge.tsx` | Dot + label for ok/error/unknown |
| `src/features/links/components/list/LinkCardRich.tsx` | Full 3-row desktop card |

### Frontend — modify
| Path | Change |
|---|---|
| `src/lib/api/endpoints.ts` | Add `LINKS_BATCH_META`, `LINK_SPARKLINE`, `LINK_TREND`, `LINK_PREVIEW`, `LINK_HEALTH` |
| `src/types/index.ts` | Export new types from `./core/link-meta` |
| `src/features/links/components/list/LinksFilters.tsx` | Status chips toggle + sort dropdown |
| `src/features/links/components/list/LinksMobileCards.tsx` | Mini sparkline + trend line row |
| `src/features/links/components/list/index.ts` | Add new exports, remove deleted ones |
| `src/pages/links/LinkListPage.tsx` | Replace DataTable + drawer with LinkCardRich stack + sort |

### Frontend — delete
| Path |
|---|
| `src/features/links/components/list/useLinksTableColumns.tsx` |
| `src/features/links/components/list/LinkDetailDrawer.tsx` |

---

## Task 1 — Migration: health columns on `links`

**Files:**
- Create: `backend/database/migrations/2026_04_27_000001_add_health_to_links_table.php`

- [ ] **Step 1: Create migration file**

```php
<?php
// backend/database/migrations/2026_04_27_000001_add_health_to_links_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->string('health_status', 20)->default('unknown')->after('click_limit');
            $table->timestamp('health_checked_at')->nullable()->after('health_status');
        });
    }

    public function down(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->dropColumn(['health_status', 'health_checked_at']);
        });
    }
};
```

- [ ] **Step 2: Run migration**

```bash
docker-compose exec app php artisan migrate
```

Expected: `Migrating: 2026_04_27_000001_add_health_to_links_table` → `Migrated`.

---

## Task 2 — Migration: `link_previews` table

**Files:**
- Create: `backend/database/migrations/2026_04_27_000002_create_link_previews_table.php`

- [ ] **Step 1: Create migration file**

```php
<?php
// backend/database/migrations/2026_04_27_000002_create_link_previews_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('link_previews', function (Blueprint $table) {
            $table->unsignedBigInteger('link_id')->primary();
            $table->foreign('link_id')->references('id')->on('links')->onDelete('cascade');
            $table->string('favicon_url', 500)->nullable();
            $table->string('og_title', 500)->nullable();
            $table->string('og_image_url', 500)->nullable();
            $table->timestamp('fetched_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('link_previews');
    }
};
```

- [ ] **Step 2: Run migration**

```bash
docker-compose exec app php artisan migrate
```

Expected: `Migrating: 2026_04_27_000002_create_link_previews_table` → `Migrated`.

---

## Task 3 — `LinkPreview` model + `Link` model update

**Files:**
- Create: `backend/app/Models/LinkPreview.php`
- Modify: `backend/app/Models/Link.php`

- [ ] **Step 1: Create LinkPreview model**

```php
<?php
// backend/app/Models/LinkPreview.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LinkPreview extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'link_id';
    public $incrementing = false;

    protected $fillable = [
        'link_id',
        'favicon_url',
        'og_title',
        'og_image_url',
        'fetched_at',
    ];

    protected $casts = [
        'fetched_at' => 'datetime',
    ];

    public function link()
    {
        return $this->belongsTo(Link::class);
    }
}
```

- [ ] **Step 2: Update `Link::$fillable`, `$casts`, and add `preview()` relation**

In `backend/app/Models/Link.php`, add to `$fillable` (after `updated_at`):
```php
'health_status',
'health_checked_at',
```

Add to `$casts` (after `is_active`):
```php
'health_checked_at' => 'datetime',
```

Add new relation method after the `clicks()` relation:
```php
public function preview()
{
    return $this->hasOne(LinkPreview::class);
}
```

- [ ] **Step 3: Verify syntax**

```bash
docker-compose exec app php artisan about
```

Expected: no PHP errors.

- [ ] **Step 4: Commit Tasks 1-3**

```bash
git add database/migrations/2026_04_27_000001_add_health_to_links_table.php \
        database/migrations/2026_04_27_000002_create_link_previews_table.php \
        app/Models/LinkPreview.php \
        app/Models/Link.php
git commit -m "feat(links): add health columns + link_previews table + LinkPreview model"
```

---

## Task 4 — MetricsService: `getLinkSparkline` + `getLinkTrend`

**Files:**
- Modify: `backend/app/Services/Analytics/MetricsService.php`

- [ ] **Step 1: Add `getLinkSparkline` method**

Append before the closing `}` of the class:

```php
    /**
     * Cliques diários dos últimos N dias para sparkline de um link.
     * Retorna array com N itens: [{date, clicks}]
     */
    public function getLinkSparkline(int $linkId, int $days = 7): array
    {
        $cacheKey = "meta:sparkline:{$linkId}:{$days}d";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($linkId, $days) {
            $rows = DB::table('clicks')
                ->where('link_id', $linkId)
                ->where('created_at', '>=', now()->subDays($days))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as clicks')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date');

            $result = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $result[] = [
                    'date'   => $date,
                    'clicks' => (int) ($rows->get($date)?->clicks ?? 0),
                ];
            }
            return $result;
        });
    }

    /**
     * Tendência comparando janela atual vs janela anterior.
     * Retorna {current, previous, percent_change, last_click_at}
     */
    public function getLinkTrend(int $linkId, int $window = 7): array
    {
        $cacheKey = "meta:trend:{$linkId}:{$window}d";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($linkId, $window) {
            $now = now();

            $current = DB::table('clicks')
                ->where('link_id', $linkId)
                ->where('created_at', '>=', $now->copy()->subDays($window))
                ->count();

            $previous = DB::table('clicks')
                ->where('link_id', $linkId)
                ->whereBetween('created_at', [
                    $now->copy()->subDays($window * 2),
                    $now->copy()->subDays($window),
                ])
                ->count();

            $percentChange = $previous > 0
                ? round((($current - $previous) / $previous) * 100, 1)
                : ($current > 0 ? 100.0 : 0.0);

            $lastClick = DB::table('clicks')
                ->where('link_id', $linkId)
                ->orderByDesc('created_at')
                ->value('created_at');

            return [
                'current'        => $current,
                'previous'       => $previous,
                'percent_change' => $percentChange,
                'last_click_at'  => $lastClick,
            ];
        });
    }
```

- [ ] **Step 2: Verify syntax**

```bash
docker-compose exec app php artisan about
```

Expected: no PHP errors.

- [ ] **Step 3: Commit**

```bash
git add app/Services/Analytics/MetricsService.php
git commit -m "feat(metrics): add getLinkSparkline + getLinkTrend to MetricsService"
```

---

## Task 5 — `LinkPreviewService`

**Files:**
- Create: `backend/app/Services/Links/LinkPreviewService.php`

- [ ] **Step 1: Create service**

```php
<?php
// backend/app/Services/Links/LinkPreviewService.php

namespace App\Services\Links;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class LinkPreviewService
{
    private Client $http;

    public function __construct()
    {
        $this->http = new Client([
            'timeout'         => 5,
            'connect_timeout' => 3,
            'allow_redirects' => ['max' => 5],
            'verify'          => false,
        ]);
    }

    /**
     * Fetches OG meta + favicon for a URL.
     * Returns ['favicon_url', 'og_title', 'og_image_url'] — all nullable on failure.
     */
    public function fetchPreview(string $url): array
    {
        $empty = ['favicon_url' => null, 'og_title' => null, 'og_image_url' => null];

        try {
            $response = $this->http->get($url, [
                'headers' => [
                    'User-Agent' => 'LinkChartBot/1.0 (preview-fetcher)',
                    'Accept'     => 'text/html',
                ],
            ]);
            $html = (string) $response->getBody();
        } catch (RequestException $e) {
            return $this->withFavicon($empty, $url);
        }

        $data = $this->parseOg($html);

        // Always inject favicon via Google's public favicon API (reliable fallback)
        $data['favicon_url'] = $this->faviconUrl($url);

        return $data;
    }

    private function parseOg(string $html): array
    {
        $data = ['og_title' => null, 'og_image_url' => null];

        $doc = new \DOMDocument();
        @$doc->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));

        foreach ($doc->getElementsByTagName('meta') as $meta) {
            $prop = $meta->getAttribute('property') ?: $meta->getAttribute('name');
            $content = $meta->getAttribute('content');
            if ($prop === 'og:title' && !$data['og_title']) {
                $data['og_title'] = $content;
            }
            if ($prop === 'og:image' && !$data['og_image_url']) {
                $data['og_image_url'] = $content;
            }
        }

        return $data;
    }

    private function faviconUrl(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST) ?? '';
        return "https://www.google.com/s2/favicons?domain={$host}&sz=32";
    }

    private function withFavicon(array $data, string $url): array
    {
        $data['favicon_url'] = $this->faviconUrl($url);
        return $data;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/Services/Links/LinkPreviewService.php
git commit -m "feat(links): add LinkPreviewService (OG scraper)"
```

---

## Task 6 — `FetchLinkPreviewJob`

**Files:**
- Create: `backend/app/Jobs/FetchLinkPreviewJob.php`

- [ ] **Step 1: Create job**

```php
<?php
// backend/app/Jobs/FetchLinkPreviewJob.php

namespace App\Jobs;

use App\Models\LinkPreview;
use App\Services\Links\LinkPreviewService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class FetchLinkPreviewJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 30;

    public function __construct(
        public readonly int $linkId,
        public readonly string $url
    ) {}

    public function handle(LinkPreviewService $previewService): void
    {
        $data = $previewService->fetchPreview($this->url);

        LinkPreview::updateOrCreate(
            ['link_id' => $this->linkId],
            array_merge($data, ['fetched_at' => now()])
        );
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/Jobs/FetchLinkPreviewJob.php
git commit -m "feat(jobs): add FetchLinkPreviewJob"
```

---

## Task 7 — `LinkHealthCheckJob` + cron schedule

**Files:**
- Create: `backend/app/Jobs/LinkHealthCheckJob.php`
- Modify: `backend/routes/console.php`

- [ ] **Step 1: Create job**

```php
<?php
// backend/app/Jobs/LinkHealthCheckJob.php

namespace App\Jobs;

use App\Models\Link;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class LinkHealthCheckJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 300; // 5 min for full sweep

    public function handle(): void
    {
        $http = new Client([
            'timeout'         => 5,
            'connect_timeout' => 3,
            'allow_redirects' => ['max' => 5],
            'verify'          => false,
            'http_errors'     => false,
        ]);

        Link::where('is_active', true)
            ->select(['id', 'original_url'])
            ->chunk(50, function ($links) use ($http) {
                foreach ($links as $link) {
                    try {
                        $response = $http->head($link->original_url);
                        $code   = $response->getStatusCode();
                        $status = ($code >= 200 && $code < 400) ? 'ok' : 'error';
                    } catch (\Exception $e) {
                        $status = 'error';
                    }

                    DB::table('links')
                        ->where('id', $link->id)
                        ->update([
                            'health_status'     => $status,
                            'health_checked_at' => now(),
                        ]);
                }
            });
    }
}
```

- [ ] **Step 2: Register cron in `routes/console.php`**

Append to `backend/routes/console.php`:

```php
use App\Jobs\LinkHealthCheckJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new LinkHealthCheckJob)->everyHour()->withoutOverlapping();
```

- [ ] **Step 3: Commit**

```bash
git add app/Jobs/LinkHealthCheckJob.php routes/console.php
git commit -m "feat(jobs): add LinkHealthCheckJob + hourly cron schedule"
```

---

## Task 8 — `LinkMetaController`

**Files:**
- Create: `backend/app/Http/Controllers/Links/LinkMetaController.php`

- [ ] **Step 1: Create controller**

```php
<?php
// backend/app/Http/Controllers/Links/LinkMetaController.php

namespace App\Http\Controllers\Links;

use App\Http\Controllers\Controller;
use App\Jobs\FetchLinkPreviewJob;
use App\Models\Link;
use App\Models\LinkPreview;
use App\Services\Analytics\MetricsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LinkMetaController extends Controller
{
    public function __construct(private MetricsService $metricsService) {}

    /**
     * Single batch call: returns sparkline + trend + preview + health for all requested IDs.
     * Frontend calls this once on page load to avoid N+1 requests.
     *
     * POST /api/links/batch-meta
     * Body: { ids: int[], days?: int }
     */
    public function batchMeta(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array|min:1|max:50',
            'ids.*' => 'integer|min:1',
            'days'  => 'integer|min:1|max:90',
        ]);

        $ids    = $validated['ids'];
        $days   = $validated['days'] ?? 7;
        $userId = auth()->id();

        $links = Link::whereIn('id', $ids)
            ->where('user_id', $userId)
            ->get(['id', 'original_url', 'health_status', 'health_checked_at'])
            ->keyBy('id');

        $previews = LinkPreview::whereIn('link_id', $ids)->get()->keyBy('link_id');

        $result = [];
        foreach ($links as $id => $link) {
            $preview = $previews->get($id);

            // Dispatch preview fetch if stale (>24h) or missing
            if (!$preview || $preview->fetched_at->lt(now()->subDay())) {
                FetchLinkPreviewJob::dispatch((int) $id, $link->original_url);
            }

            $result[$id] = [
                'sparkline' => $this->metricsService->getLinkSparkline((int) $id, $days),
                'trend'     => $this->metricsService->getLinkTrend((int) $id, 7),
                'preview'   => $preview ? [
                    'favicon_url'  => $preview->favicon_url,
                    'og_title'     => $preview->og_title,
                    'og_image_url' => $preview->og_image_url,
                ] : null,
                'health'    => [
                    'status'          => $link->health_status ?? 'unknown',
                    'last_checked_at' => $link->health_checked_at?->toISOString(),
                    'http_code'       => null,
                ],
            ];
        }

        return response()->json(['data' => $result]);
    }

    /**
     * GET /api/links/{id}/sparkline?days=7
     */
    public function sparkline(Request $request, int $id): JsonResponse
    {
        $link = Link::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $days = max(1, min(90, (int) $request->query('days', 7)));
        return response()->json(['data' => $this->metricsService->getLinkSparkline($link->id, $days)]);
    }

    /**
     * GET /api/links/{id}/trend?window=7
     */
    public function trend(Request $request, int $id): JsonResponse
    {
        $link = Link::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $window = max(1, min(90, (int) $request->query('window', 7)));
        return response()->json(['data' => $this->metricsService->getLinkTrend($link->id, $window)]);
    }

    /**
     * GET /api/links/{id}/preview
     */
    public function preview(int $id): JsonResponse
    {
        $link    = Link::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $preview = LinkPreview::find($link->id);

        if (!$preview || $preview->fetched_at->lt(now()->subDay())) {
            FetchLinkPreviewJob::dispatch($link->id, $link->original_url);
        }

        return response()->json(['data' => $preview ? [
            'favicon_url'  => $preview->favicon_url,
            'og_title'     => $preview->og_title,
            'og_image_url' => $preview->og_image_url,
        ] : null]);
    }

    /**
     * GET /api/links/{id}/health
     */
    public function health(int $id): JsonResponse
    {
        $link = Link::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail(['id', 'health_status', 'health_checked_at']);

        return response()->json(['data' => [
            'status'          => $link->health_status ?? 'unknown',
            'last_checked_at' => $link->health_checked_at?->toISOString(),
            'http_code'       => null,
        ]]);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/Http/Controllers/Links/LinkMetaController.php
git commit -m "feat(links): add LinkMetaController (batchMeta, sparkline, trend, preview, health)"
```

---

## Task 9 — Routes registration + backend feature test

**Files:**
- Modify: `backend/routes/api.php`
- Create: `backend/tests/Feature/LinkMetaControllerTest.php`

- [ ] **Step 1: Add routes to `routes/api.php`**

Inside the existing `Route::middleware(['api.auth:api', 'verified'])->group(function () {` block, after the existing `Route::prefix('links')->controller(LinkController::class)->group(...)` group, add:

```php
    // === META-DADOS DE LINKS (sparkline, trend, preview, health) ===
    Route::prefix('links')->controller(\App\Http\Controllers\Links\LinkMetaController::class)->group(function () {
        Route::post('/batch-meta', 'batchMeta');
        Route::get('/{id}/sparkline', 'sparkline')->where('id', '[0-9]+');
        Route::get('/{id}/trend', 'trend')->where('id', '[0-9]+');
        Route::get('/{id}/preview', 'preview')->where('id', '[0-9]+');
        Route::get('/{id}/health', 'health')->where('id', '[0-9]+');
    });
```

- [ ] **Step 2: Create feature test**

```php
<?php
// backend/tests/Feature/LinkMetaControllerTest.php

namespace Tests\Feature;

use App\Models\Link;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LinkMetaControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(User $user): array
    {
        $token = auth('api')->login($user);
        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_batch_meta_returns_data_for_owned_links(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $link = Link::factory()->create(['user_id' => $user->id, 'is_active' => true]);

        $response = $this->postJson(
            '/api/links/batch-meta',
            ['ids' => [(int) $link->id]],
            $this->authHeader($user)
        );

        $response->assertOk()
            ->assertJsonPath("data.{$link->id}.health.status", 'unknown')
            ->assertJsonStructure([
                'data' => [
                    (string) $link->id => [
                        'sparkline',
                        'trend' => ['current', 'previous', 'percent_change', 'last_click_at'],
                        'health' => ['status', 'last_checked_at', 'http_code'],
                    ],
                ],
            ]);
    }

    public function test_batch_meta_ignores_other_users_links(): void
    {
        $user  = User::factory()->create(['email_verified_at' => now()]);
        $other = User::factory()->create(['email_verified_at' => now()]);
        $link  = Link::factory()->create(['user_id' => $other->id]);

        $response = $this->postJson(
            '/api/links/batch-meta',
            ['ids' => [(int) $link->id]],
            $this->authHeader($user)
        );

        $response->assertOk();
        $this->assertEmpty($response->json('data'));
    }

    public function test_batch_meta_requires_auth(): void
    {
        $this->postJson('/api/links/batch-meta', ['ids' => [1]])->assertUnauthorized();
    }

    public function test_sparkline_returns_n_daily_points(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $link = Link::factory()->create(['user_id' => $user->id]);

        $response = $this->getJson(
            "/api/links/{$link->id}/sparkline?days=7",
            $this->authHeader($user)
        );

        $response->assertOk();
        $this->assertCount(7, $response->json('data'));
    }
}
```

- [ ] **Step 3: Run tests**

```bash
docker-compose exec app ./vendor/bin/phpunit tests/Feature/LinkMetaControllerTest.php --testdox
```

Expected: 4 tests, 4 assertions, 0 failures.

> If `Link::factory()` or `User::factory()` don't exist, use manual model creation:
> `User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => bcrypt('pass'), 'email_verified_at' => now()])` and `Link::create([...])`.

- [ ] **Step 4: Commit**

```bash
git add routes/api.php tests/Feature/LinkMetaControllerTest.php
git commit -m "feat(links): register meta routes + feature tests for LinkMetaController"
```

---

## Task 10 — Frontend types + endpoint constants

**Files:**
- Create: `frontend/src/types/core/link-meta.ts`
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/lib/api/endpoints.ts`

- [ ] **Step 1: Create `src/types/core/link-meta.ts`**

```typescript
// src/types/core/link-meta.ts

export interface SparklinePoint {
	date: string;
	clicks: number;
}

export interface LinkTrend {
	current: number;
	previous: number;
	percent_change: number;
	last_click_at: string | null;
}

export interface LinkPreviewMeta {
	favicon_url: string | null;
	og_title: string | null;
	og_image_url: string | null;
}

export type LinkHealthStatus = 'ok' | 'error' | 'unknown';

export interface LinkHealth {
	status: LinkHealthStatus;
	last_checked_at: string | null;
	http_code: number | null;
}

export interface LinkMeta {
	sparkline: SparklinePoint[];
	trend: LinkTrend;
	preview: LinkPreviewMeta | null;
	health: LinkHealth;
}

export type BatchMetaResponse = Record<string, LinkMeta>;
```

- [ ] **Step 2: Export from `src/types/index.ts`**

Find the first `export type {` block in the file and append a new block after it:

```typescript
export type {
	SparklinePoint,
	LinkTrend,
	LinkPreviewMeta,
	LinkHealthStatus,
	LinkHealth,
	LinkMeta,
	BatchMetaResponse,
} from './core/link-meta';
```

- [ ] **Step 3: Add endpoint constants to `src/lib/api/endpoints.ts`**

Inside `API_CONFIG.ENDPOINTS`, add after the existing `DELETE_LINK` entry:

```typescript
		// Link meta (sparkline, trend, preview, health)
		LINKS_BATCH_META: '/api/links/batch-meta',
		LINK_SPARKLINE: (id: string) => `/api/links/${id}/sparkline`,
		LINK_TREND: (id: string) => `/api/links/${id}/trend`,
		LINK_PREVIEW: (id: string) => `/api/links/${id}/preview`,
		LINK_HEALTH: (id: string) => `/api/links/${id}/health`,
```

- [ ] **Step 4: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/core/link-meta.ts src/types/index.ts src/lib/api/endpoints.ts
git commit -m "feat(types): add LinkMeta types + batch-meta endpoint constants"
```

---

## Task 11 — `link-meta.service.ts`

**Files:**
- Create: `frontend/src/services/link-meta.service.ts`

- [ ] **Step 1: Create service**

```typescript
// src/services/link-meta.service.ts
import { API_CONFIG } from '../lib/api/endpoints';
import { BaseService } from './base.service';
import type { BatchMetaResponse } from '@/types';

class LinkMetaService extends BaseService {
	constructor() {
		super('LinkMetaService');
	}

	async batchMeta(ids: string[], days = 7): Promise<BatchMetaResponse> {
		return this.post<BatchMetaResponse>(
			API_CONFIG.ENDPOINTS.LINKS_BATCH_META,
			{ ids: ids.map(Number), days },
			{ fallback: {}, context: 'batch_meta' }
		);
	}
}

export const linkMetaService = new LinkMetaService();
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/services/link-meta.service.ts
git commit -m "feat(services): add LinkMetaService with batchMeta"
```

---

## Task 12 — `useLinksMeta` hook

**Files:**
- Create: `frontend/src/features/links/hooks/useLinksMeta.ts`

- [ ] **Step 1: Create hook**

```typescript
// src/features/links/hooks/useLinksMeta.ts
import { useEffect, useRef, useState } from 'react';
import { linkMetaService } from '@/services/link-meta.service';
import type { BatchMetaResponse } from '@/types';

/**
 * Fetches sparkline + trend + preview + health for a list of link IDs.
 * Re-fetches whenever the sorted list of IDs changes.
 */
export function useLinksMeta(ids: string[]) {
	const [meta, setMeta] = useState<BatchMetaResponse>({});
	const [loading, setLoading] = useState(false);

	// Stable key: sorted IDs joined — avoids re-fetch on same set with different order
	const key = [...ids].sort().join(',');
	const prevKey = useRef('');

	useEffect(() => {
		if (!ids.length || key === prevKey.current) return;
		prevKey.current = key;

		setLoading(true);
		linkMetaService
			.batchMeta(ids)
			.then(setMeta)
			.finally(() => setLoading(false));
	}, [key]); // eslint-disable-line react-hooks/exhaustive-deps

	return { meta, loading };
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/links/hooks/useLinksMeta.ts
git commit -m "feat(links): add useLinksMeta hook"
```

---

## Task 13 — `LinkSparkline` component

**Files:**
- Create: `frontend/src/features/links/components/list/LinkSparkline.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkSparkline.tsx
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import type { SparklinePoint } from '@/types';

interface LinkSparklineProps {
	data: SparklinePoint[];
	trend?: number;
	height?: number;
	width?: number | string;
}

export function LinkSparkline({ data, trend = 0, height = 32, width = 120 }: LinkSparklineProps) {
	const theme = useTheme();

	const color =
		trend > 0
			? theme.palette.success.main
			: trend < 0
				? theme.palette.error.main
				: theme.palette.text.secondary;

	const series = useMemo(() => [{ data: data.map((d) => d.clicks) }], [data]);

	const options = useMemo(
		() => ({
			chart: { sparkline: { enabled: true }, animations: { enabled: false } },
			stroke: { curve: 'smooth', width: 2 },
			fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
			colors: [color],
			tooltip: { enabled: false },
			xaxis: { labels: { show: false }, axisBorder: { show: false } },
			yaxis: { labels: { show: false } },
			grid: { show: false },
		}),
		[color]
	);

	if (!data.length) return null;

	return (
		<ApexChartWrapper
			type='area'
			height={height}
			width={width}
			series={series}
			options={options}
		/>
	);
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

---

## Task 14 — `LinkPreviewThumb` component

**Files:**
- Create: `frontend/src/features/links/components/list/LinkPreviewThumb.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkPreviewThumb.tsx
import { Language } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useState } from 'react';
import type { LinkPreviewMeta } from '@/types';

interface LinkPreviewThumbProps {
	preview?: LinkPreviewMeta | null;
	size?: number;
}

export function LinkPreviewThumb({ preview, size = 24 }: LinkPreviewThumbProps) {
	const [error, setError] = useState(false);

	if (!preview?.favicon_url || error) {
		return (
			<Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Language sx={{ fontSize: size, color: 'text.disabled' }} />
			</Box>
		);
	}

	return (
		<Box
			component='img'
			src={preview.favicon_url}
			alt=''
			onError={() => setError(true)}
			sx={{ width: size, height: size, borderRadius: '4px', objectFit: 'contain', flexShrink: 0 }}
		/>
	);
}
```

- [ ] **Step 2: Commit Tasks 13-14**

```bash
git add src/features/links/components/list/LinkSparkline.tsx \
        src/features/links/components/list/LinkPreviewThumb.tsx
git commit -m "feat(links): add LinkSparkline + LinkPreviewThumb atomic components"
```

---

## Task 15 — `LinkTrendBadge` + `LinkHealthBadge`

**Files:**
- Create: `frontend/src/features/links/components/list/LinkTrendBadge.tsx`
- Create: `frontend/src/features/links/components/list/LinkHealthBadge.tsx`

- [ ] **Step 1: Create `LinkTrendBadge`**

```tsx
// src/features/links/components/list/LinkTrendBadge.tsx
import { TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { LinkTrend } from '@/types';

interface LinkTrendBadgeProps {
	trend?: LinkTrend | null;
}

export function LinkTrendBadge({ trend }: LinkTrendBadgeProps) {
	if (!trend) {
		return (
			<Typography
				variant='caption'
				color='text.disabled'
			>
				—
			</Typography>
		);
	}

	const { percent_change, current } = trend;
	const isPositive = percent_change > 0;
	const isNeutral = percent_change === 0;
	const color = isPositive ? 'success.main' : isNeutral ? 'text.secondary' : 'error.main';
	const Icon = isPositive ? TrendingUp : isNeutral ? TrendingFlat : TrendingDown;
	const sign = isPositive ? '+' : '';

	return (
		<Stack
			direction='row'
			spacing={0.5}
			alignItems='center'
		>
			<Typography
				variant='subtitle2'
				sx={{ fontWeight: 700 }}
			>
				{current.toLocaleString('pt-BR')}
			</Typography>
			<Stack
				direction='row'
				alignItems='center'
				sx={{ color }}
			>
				<Icon sx={{ fontSize: 14 }} />
				<Typography
					variant='caption'
					sx={{ color, fontWeight: 600 }}
				>
					{sign}
					{percent_change.toFixed(1)}%
				</Typography>
			</Stack>
		</Stack>
	);
}
```

- [ ] **Step 2: Create `LinkHealthBadge`**

```tsx
// src/features/links/components/list/LinkHealthBadge.tsx
import { Box, Tooltip, Typography } from '@mui/material';
import type { LinkHealth, LinkHealthStatus } from '@/types';

const HEALTH_CONFIG: Record<LinkHealthStatus, { color: string; label: string }> = {
	ok:      { color: 'success.main',  label: 'Saudável' },
	error:   { color: 'error.main',    label: 'Erro' },
	unknown: { color: 'text.disabled', label: 'Não verificado' },
};

interface LinkHealthBadgeProps {
	health?: LinkHealth | null;
}

export function LinkHealthBadge({ health }: LinkHealthBadgeProps) {
	const status: LinkHealthStatus = health?.status ?? 'unknown';
	const { color, label } = HEALTH_CONFIG[status];

	return (
		<Tooltip title={label}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
				<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
				<Typography
					variant='caption'
					sx={{ color, fontWeight: 500 }}
				>
					{label}
				</Typography>
			</Box>
		</Tooltip>
	);
}
```

- [ ] **Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/links/components/list/LinkTrendBadge.tsx \
        src/features/links/components/list/LinkHealthBadge.tsx
git commit -m "feat(links): add LinkTrendBadge + LinkHealthBadge components"
```

---

## Task 16 — `LinkCardRich` component

**Files:**
- Create: `frontend/src/features/links/components/list/LinkCardRich.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkCardRich.tsx
import { Launch } from '@mui/icons-material';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { EnhancedPaper } from '@/shared/ui/base';
import useClipboard from '@/hooks/useClipboard';
import type { LinkMeta, LinkResponse } from '@/types';

import { LinkActionsMenu } from './LinkActionsMenu';
import { LinkHealthBadge } from './LinkHealthBadge';
import { LinkPreviewThumb } from './LinkPreviewThumb';
import { LinkSparkline } from './LinkSparkline';
import { LinkTrendBadge } from './LinkTrendBadge';

interface LinkCardRichProps {
	link: LinkResponse;
	meta?: LinkMeta;
	onDelete: (id: string) => Promise<void>;
}

export function LinkCardRich({ link, meta, onDelete }: LinkCardRichProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'Link copiado!', variant: 'success' })),
	});

	const handleDelete = useCallback(async () => {
		if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
			try {
				await onDelete(String(link.id));
			} catch {
				dispatch(showMessage({ message: 'Erro ao excluir o link.', variant: 'error' }));
			}
		}
	}, [link.id, onDelete, dispatch]);

	const status = getLinkStatus(link);
	const { label: statusLabel, color: statusColor } = STATUS_MAP[status];

	const lastClickAt = meta?.trend?.last_click_at;
	const lastClickLabel = lastClickAt
		? formatDistanceToNow(new Date(lastClickAt), { addSuffix: true, locale: ptBR })
		: 'Nunca';

	return (
		<EnhancedPaper
			sx={{
				borderRadius: '12px',
				border: '1px solid',
				borderColor: 'divider',
				overflow: 'hidden',
				transition: 'box-shadow 0.2s',
				'&:hover': { boxShadow: 4 },
			}}
		>
			{/* Linha 1 — Header */}
			<Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
				<LinkPreviewThumb
					preview={meta?.preview}
					size={24}
				/>
				<Typography
					variant='body1'
					sx={{ fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
				>
					{link.title || 'Link sem título'}
				</Typography>

				{/* URL curta — pill copiável */}
				<Tooltip title={copied ? 'Copiado!' : 'Copiar URL'}>
					<Box
						onClick={() => copy(link.short_url)}
						sx={{
							px: 1.5, py: 0.5,
							bgcolor: 'rgba(25, 118, 210, 0.08)',
							borderRadius: '20px',
							border: '1px solid',
							borderColor: 'primary.light',
							fontFamily: 'monospace',
							fontSize: '0.75rem',
							color: 'primary.main',
							fontWeight: 600,
							cursor: 'pointer',
							maxWidth: 220,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							flexShrink: 0,
							'&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' },
						}}
					>
						{link.short_url}
					</Box>
				</Tooltip>

				{/* Status dot */}
				<Stack
					direction='row'
					spacing={0.5}
					alignItems='center'
					sx={{ flexShrink: 0 }}
				>
					<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
					<Typography variant='caption'>{statusLabel}</Typography>
				</Stack>

				{/* Kebab menu */}
				<Box onClick={(e) => e.stopPropagation()}>
					<LinkActionsMenu
						onEdit={() => navigate(`/link/edit/${link.id}`)}
						onQR={() => navigate(`/link/qr/${link.id}`)}
						onDelete={handleDelete}
					/>
				</Box>
			</Box>

			<Divider />

			{/* Linha 2 — URL original + thumb OG */}
			<Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Launch sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
					title={link.original_url}
				>
					{link.original_url}
				</Typography>
				{meta?.preview?.og_image_url && (
					<Box
						component='img'
						src={meta.preview.og_image_url}
						alt={meta.preview.og_title ?? ''}
						sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				)}
			</Box>

			<Divider />

			{/* Linha 3 — Métricas */}
			<Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
				{meta?.sparkline?.length ? (
					<Box sx={{ flexShrink: 0 }}>
						<LinkSparkline
							data={meta.sparkline}
							trend={meta.trend?.percent_change}
						/>
					</Box>
				) : (
					<Box sx={{ width: 120, height: 32, bgcolor: 'action.hover', borderRadius: 1 }} />
				)}

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<LinkTrendBadge trend={meta?.trend} />

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<Stack spacing={0}>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						Último clique
					</Typography>
					<Typography
						variant='caption'
						sx={{ fontWeight: 600 }}
					>
						{lastClickLabel}
					</Typography>
				</Stack>

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<LinkHealthBadge health={meta?.health} />
			</Box>
		</EnhancedPaper>
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
git add src/features/links/components/list/LinkCardRich.tsx
git commit -m "feat(links): add LinkCardRich component"
```

---

## Task 17 — Update `LinksFilters` (chips toggle + sort dropdown)

**Files:**
- Modify: `frontend/src/features/links/components/list/LinksFilters.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
// src/features/links/components/list/LinksFilters.tsx
import { FilterList, Sort } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import {
	Box,
	Chip,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

const STATUS_CHIPS = [
	{ value: 'all',       label: 'Todos' },
	{ value: 'active',    label: 'Ativos' },
	{ value: 'inactive',  label: 'Inativos' },
	{ value: 'scheduled', label: 'Agendados' },
	{ value: 'expired',   label: 'Expirados' },
];

const SORT_OPTIONS = [
	{ value: 'created_at',    label: 'Criado mais recente' },
	{ value: 'clicks',        label: 'Mais clicks' },
	{ value: 'trend',         label: 'Maior tendência' },
	{ value: 'last_activity', label: 'Última atividade' },
];

interface LinksFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	sortBy: string;
	onSortChange: (value: string) => void;
}

export function LinksFilters({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusChange,
	sortBy,
	onSortChange,
}: LinksFiltersProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const [localSearch, setLocalSearch] = useState(searchTerm);

	const debouncedSearch = useMemo(
		() => debounce((value: string) => onSearchChange(value), 200),
		[onSearchChange]
	);

	useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
	useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

	const activeFiltersCount =
		(searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'created_at' ? 1 : 0);

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: `${radiusTokens.lg}px`,
				border: `1px solid ${theme.palette.divider}`,
				p: 3,
				mb: 4,
				boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
				transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
				'&:hover': { boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm },
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<FilterList sx={{ color: 'primary.main', mr: 1 }} />
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, color: 'text.primary' }}
				>
					Filtros
				</Typography>
				{activeFiltersCount > 0 && (
					<Chip
						label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'ativo' : 'ativos'}`}
						size='small'
						color='primary'
						sx={{ ml: 'auto', fontWeight: 500 }}
					/>
				)}
			</Box>

			{/* Busca + sort */}
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'center' },
					mb: 2,
				}}
			>
				<TextField
					variant='filled'
					placeholder='Buscar por título, URL ou slug...'
					value={localSearch}
					onChange={(e) => {
						setLocalSearch(e.target.value);
						debouncedSearch(e.target.value);
					}}
					fullWidth
					sx={{ flex: 1, minWidth: 260, '& .MuiFilledInput-root': { minHeight: 52 } }}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Search sx={{ color: 'text.secondary', fontSize: 22 }} />
							</InputAdornment>
						),
					}}
				/>

				<FormControl sx={{ minWidth: 200, flexShrink: 0 }}>
					<InputLabel>
						<Box
							component='span'
							sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
						>
							<Sort sx={{ fontSize: 16 }} /> Ordenar por
						</Box>
					</InputLabel>
					<Select
						value={sortBy}
						label='Ordenar por'
						onChange={(e) => onSortChange(e.target.value)}
					>
						{SORT_OPTIONS.map((opt) => (
							<MenuItem
								key={opt.value}
								value={opt.value}
							>
								{opt.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Status chips */}
			<Stack
				direction='row'
				spacing={1}
				flexWrap='wrap'
				useFlexGap
			>
				{STATUS_CHIPS.map((chip) => (
					<Chip
						key={chip.value}
						label={chip.label}
						clickable
						color={statusFilter === chip.value ? 'primary' : 'default'}
						variant={statusFilter === chip.value ? 'filled' : 'outlined'}
						onClick={() => onStatusChange(chip.value)}
						size='small'
					/>
				))}
			</Stack>
		</Box>
	);
}

export default LinksFilters;
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/links/components/list/LinksFilters.tsx
git commit -m "feat(links): upgrade LinksFilters to chips toggle + sort dropdown"
```

---

## Task 18 — Update `LinkListPage`

**Files:**
- Modify: `frontend/src/pages/links/LinkListPage.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
// src/pages/links/LinkListPage.tsx
import { Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { LinkMetrics } from '@/features/links/components/LinkMetrics';
import {
	LinkCardRich,
	LinksEmptyState,
	LinksFilters,
	LinksHeader,
	LinksMobileCards,
} from '@/features/links/components/list';
import { useLinks } from '@/features/links/hooks/useLinks';
import { useLinksMeta } from '@/features/links/hooks/useLinksMeta';
import { getLinkStatus } from '@/features/links/utils/linkStatus';
import { useResponsive } from '@/lib/theme';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';
import { LinkListSkeleton } from '@/shared/ui/feedback/skeletons';
import type { LinkResponse } from '@/types';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';

function LinkListPage() {
	const { isMobile } = useResponsive();
	const { links, loading, deleteLink } = useLinks();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('created_at');

	const filteredLinks = useMemo(() => {
		return links.filter((link) => {
			const matchesSearch =
				link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(link.slug || link.custom_slug)?.toLowerCase().includes(searchTerm.toLowerCase());

			const status = getLinkStatus(link);
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && status === 'active') ||
				(statusFilter === 'inactive' && status === 'inactive') ||
				(statusFilter === 'scheduled' && status === 'scheduled') ||
				(statusFilter === 'expired' && status === 'expired');

			return matchesSearch && matchesStatus;
		});
	}, [links, searchTerm, statusFilter]);

	const linkIds = useMemo(() => filteredLinks.map((l) => String(l.id)), [filteredLinks]);
	const { meta } = useLinksMeta(linkIds);

	const sortedLinks = useMemo(() => {
		const sorted = [...filteredLinks];
		switch (sortBy) {
			case 'clicks':
				return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
			case 'trend':
				return sorted.sort(
					(a, b) =>
						(meta[String(b.id)]?.trend?.percent_change ?? 0) -
						(meta[String(a.id)]?.trend?.percent_change ?? 0)
				);
			case 'last_activity': {
				return sorted.sort((a, b) => {
					const aLast = meta[String(a.id)]?.trend?.last_click_at;
					const bLast = meta[String(b.id)]?.trend?.last_click_at;
					if (!aLast && !bLast) return 0;
					if (!aLast) return 1;
					if (!bLast) return -1;
					return new Date(bLast).getTime() - new Date(aLast).getTime();
				});
			}
			default:
				return sorted.sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
		}
	}, [filteredLinks, sortBy, meta]);

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<LinkListSkeleton
						isMobile={isMobile}
						count={6}
					/>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	const handleClearFilters = () => {
		setSearchTerm('');
		setStatusFilter('all');
		setSortBy('created_at');
	};

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer variant='page'>
					<LinksHeader />

					<LinkMetrics
						linksData={links}
						showTitle={false}
					/>

					<LinksFilters
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						statusFilter={statusFilter}
						onStatusChange={setStatusFilter}
						sortBy={sortBy}
						onSortChange={setSortBy}
					/>

					{sortedLinks.length === 0 ? (
						<LinksEmptyState
							hasActiveFilters={Boolean(searchTerm) || statusFilter !== 'all'}
							onClearFilters={handleClearFilters}
						/>
					) : isMobile ? (
						<LinksMobileCards
							data={sortedLinks}
							meta={meta}
							loading={loading}
							onDelete={deleteLink}
						/>
					) : (
						<Stack spacing={2}>
							{sortedLinks.map((link: LinkResponse) => (
								<LinkCardRich
									key={link.id}
									link={link}
									meta={meta[String(link.id)]}
									onDelete={deleteLink}
								/>
							))}
						</Stack>
					)}
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkListPage;
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors. If `LinksMobileCards` complains about `meta` prop, proceed to Task 19 first.

---

## Task 19 — Update `LinksMobileCards` (mini sparkline + trend line)

**Files:**
- Modify: `frontend/src/features/links/components/list/LinksMobileCards.tsx`

- [ ] **Step 1: Add `meta` prop to interface**

At the top of `LinksMobileCards.tsx`, add `BatchMetaResponse` to imports:

```tsx
import type { BatchMetaResponse, LinkResponse as Link } from '@/types';
```

Update `LinksMobileCardsProps`:

```tsx
interface LinksMobileCardsProps {
	data: Link[];
	loading?: boolean;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	meta?: BatchMetaResponse;
}
```

Update `LinkMobileCardProps` to receive `meta`:

```tsx
interface LinkMobileCardProps {
	link: Link;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	meta?: import('@/types').LinkMeta;
}
```

- [ ] **Step 2: Add sparkline + trend line to `LinkMobileCard`**

Add imports at the top of the file (after existing imports):

```tsx
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LinkSparkline } from './LinkSparkline';
import { LinkHealthBadge } from './LinkHealthBadge';
```

Inside `LinkMobileCard`, after the URL encurtada `Box` (the blue box with `shortUrl`), add:

```tsx
				{/* Sparkline mini */}
				{meta?.sparkline?.length ? (
					<Box sx={{ mb: 1.5 }}>
						<LinkSparkline
							data={meta.sparkline}
							trend={meta.trend?.percent_change}
							height={24}
							width='100%'
						/>
					</Box>
				) : null}

				{/* Linha de tendência */}
				{meta?.trend && (
					<Stack
						direction='row'
						spacing={1}
						alignItems='center'
						sx={{ mb: 1.5 }}
					>
						<Typography
							variant='caption'
							sx={{ color: meta.trend.percent_change >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
						>
							{meta.trend.percent_change >= 0 ? '+' : ''}
							{meta.trend.percent_change.toFixed(1)}%
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							•
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							{meta.trend.last_click_at
								? formatDistanceToNow(new Date(meta.trend.last_click_at), { addSuffix: true, locale: ptBR })
								: 'Nunca'}
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							•
						</Typography>
						<LinkHealthBadge health={meta.health} />
					</Stack>
				)}
```

- [ ] **Step 3: Pass `meta` from container to `LinkMobileCard`**

In `LinksMobileCards` (the container), pass meta to each card:

```tsx
	return (
		<Box sx={{ p: { xs: 2, sm: 3 } }}>
			{data.map((link) => (
				<LinkMobileCard
					key={link.id}
					link={link}
					meta={meta?.[String(link.id)]}
					onDelete={onDelete}
					onEdit={onEdit}
				/>
			))}
		</Box>
	);
```

- [ ] **Step 4: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 5: Commit Tasks 18-19**

```bash
git add src/pages/links/LinkListPage.tsx \
        src/features/links/components/list/LinksMobileCards.tsx
git commit -m "feat(links): wire LinkCardRich into LinkListPage + mobile sparkline"
```

---

## Task 20 — Cleanup + `index.ts` update

**Files:**
- Delete: `frontend/src/features/links/components/list/useLinksTableColumns.tsx`
- Delete: `frontend/src/features/links/components/list/LinkDetailDrawer.tsx`
- Modify: `frontend/src/features/links/components/list/index.ts`

- [ ] **Step 1: Delete obsolete files**

```bash
rm src/features/links/components/list/useLinksTableColumns.tsx
rm src/features/links/components/list/LinkDetailDrawer.tsx
```

- [ ] **Step 2: Replace `index.ts` with updated exports**

```typescript
// src/features/links/components/list/index.ts
export { LinkActionsInline } from './LinkActionsInline';
export { LinkActionsMenu } from './LinkActionsMenu';
export { LinkCardRich } from './LinkCardRich';
export { LinkHealthBadge } from './LinkHealthBadge';
export { LinkPreviewThumb } from './LinkPreviewThumb';
export { LinkSparkline } from './LinkSparkline';
export { LinkTrendBadge } from './LinkTrendBadge';
export { LinksEmptyState } from './LinksEmptyState';
export { LinksFilters } from './LinksFilters';
export { LinksHeader } from './LinksHeader';
export { LinksHeaderActions } from './LinksHeaderActions';
export { LinksMobileCards } from './LinksMobileCards';
```

- [ ] **Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/links/components/list/index.ts
git rm src/features/links/components/list/useLinksTableColumns.tsx \
       src/features/links/components/list/LinkDetailDrawer.tsx
git commit -m "refactor(links): remove DataTable/Drawer artefacts, update list/index.ts exports"
```

---

## Task 21 — Visual verification + quality gate

- [ ] **Step 1: Start Docker services**

```bash
docker-compose up -d
```

- [ ] **Step 2: Start frontend dev server**

```bash
npm run dev
```

Open http://localhost:3000/link (login if needed).

- [ ] **Step 3: Verify desktop cards**

- Cada link aparece como card com 3 linhas (header / URL original / métricas)
- Linha 1: favicon (ou ícone Language), título, pill da URL curta, dot de status, kebab
- Clicar na pill copia e exibe toast "Link copiado!"
- Kebab abre menu: Editar / QR Code / Excluir
- Linha 2: URL original truncada; thumb OG aparece se preview existir
- Linha 3: sparkline (ou placeholder cinza enquanto meta carrega), tendência %, último clique, badge de saúde
- Hover no card eleva sombra

- [ ] **Step 4: Verify meta loading**

- Abrir DevTools → Network → filtrar por `batch-meta`
- Ao carregar `/link`, deve aparecer exatamente 1 chamada POST `/api/links/batch-meta`
- Ao filtrar/buscar, deve aparecer nova chamada com os IDs filtrados

- [ ] **Step 5: Verify filters**

- Chips de status (Todos / Ativos / Inativos / Agendados / Expirados) funcionam
- Dropdown de ordenação filtra corretamente por clicks, criação, tendência, última atividade
- Botão "Limpar filtros" no `LinksEmptyState` reseta busca + status + sort

- [ ] **Step 6: Verify mobile (resize to < 640px)**

- Cards mobile continuam aparecendo com sparkline mini + linha de tendência
- LinkDetailDrawer NÃO aparece mais (removido)

- [ ] **Step 7: Quality gate**

```bash
npm run quality
```

Expected: type-check + lint + format-check all pass.

- [ ] **Step 8: Final commit (se lint fizer fixes automáticos)**

```bash
git add -A
git commit -m "chore(links): lint/format fixes after rich cards implementation"
```

---

## Critérios de aceitação finais

- [ ] `/link` desktop usa `LinkCardRich` — sem `DataTable`
- [ ] Card mostra: favicon, título, URL curta (copiável), status, sparkline 7d, clicks + tendência %, último clique, health badge
- [ ] Página faz UMA chamada `POST /api/links/batch-meta` ao carregar
- [ ] Filtros têm chips de status + dropdown de ordenação
- [ ] Mobile preserva `LinksMobileCards` com sparkline mini e linha de tendência
- [ ] `LinkDetailDrawer` e `useLinksTableColumns` removidos do projeto
- [ ] `LinkMetrics` (4 cards) e `LinksHeader` intactos
- [ ] `npm run quality` passa sem erros
- [ ] `docker-compose exec app ./vendor/bin/phpunit` passa sem regressões
