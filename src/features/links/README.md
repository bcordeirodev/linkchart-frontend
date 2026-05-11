# `links`

## Propósito

CRUD do link encurtado autenticado: criar, listar (com filtros + meta enriquecida), editar, gerar QR e deletar. Cobre também o formulário de URL pública (que dispara o fluxo `/shorter` quando há sessão válida).

## Domínio espelhado no backend

- `Http/Controllers/Links/LinkController` — `/api/links` (CRUD).
- `Services/Links/LinkService` — regras de negócio (validação, slug custom, click_limit).
- `Repositories/LinkRepository` — persistência.

## Componentes principais

### Lista (`components/list/`)

- `LinkCardRich.tsx` — card de link com sparkline + metadata + ações.
- `LinksFilters.tsx`, `LinksHeader.tsx`, `LinksHeaderActions.tsx` — barra superior.
- `LinksMobileCards.tsx` — variante mobile da listagem.
- `LinkActionsInline.tsx`, `LinkActionsMenu.tsx` — copiar / editar / deletar.
- `LinkSparkline.tsx`, `LinkTrendBadge.tsx`, `LinkHealthBadge.tsx`, `LinkPreviewThumb.tsx` — meta enriquecida.
- `DeleteConfirmDialog.tsx` — confirmação modal (substituiu `window.confirm`).
- `LinksEmptyState.tsx` — placeholder vazio.

### Criar (`components/create/`)

- `CreateLinkForm.tsx` — formulário RHF + Zod via `LinkFormSchema`.

### Editar (`components/edit/`)

- `EditLinkForm.tsx` — mesma base de `CreateLinkForm`, em modo update.

### Forms compartilhados (`components/forms/`)

- `LinkFormFields.tsx` — campos compartilhados entre create e edit.
- `LinkFormSchema.ts` — schema Zod canônico.
- `UrlSafetyIndicator.tsx` — `getUrlSafetyHelperNode()` helper; retorna ReactNode para uso como `helperText` de TextField com o status da verificação de segurança da URL.

### Analytics da listagem (`components/analytics/`)

- `LinkAnalyticsTabs.tsx` — abas de análise no detalhe do link.
- `ClicksTable.tsx` — tabela paginada de cliques individuais.

### Outros

- `URLInput.tsx`, `URLShortenerForm.tsx` — formulário público / autenticado de encurtar.
- `LinkActions.tsx`, `LinkMetrics.tsx` — agrupadores reutilizados.

## Hooks de dados

| Hook                            | Type                                                | Cache key                       | Endpoint constant / path                                                                          |
| ------------------------------- | --------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `useLinks()`                    | `useQuery`                                          | `queryKeys.links.list()`        | `API_CONFIG.ENDPOINTS.LINKS` (`GET /api/links`)                                                   |
| `useLinkById(id)`               | `useQuery`                                          | `queryKeys.links.detail(id)`    | `API_CONFIG.ENDPOINTS.LINK(id)` (`GET /api/links/{id}`)                                           |
| `useCreateLink()`               | `useMutation` (invalidates `queryKeys.links.all()`) | n/a                             | `POST /api/links` (via `linkService.save()`)                                                      |
| `useUpdateLink()`               | `useMutation` (invalidates `queryKeys.links.all()`) | n/a                             | `PUT /api/links/{id}` (via `linkService.update()`)                                                |
| `useDeleteLink()`               | `useMutation` (invalidates `queryKeys.links.all()`) | n/a                             | `DELETE /api/links/{id}` (via `linkService.remove()`)                                             |
| `useLinkClicks({linkId, ...})`  | `useState`/`useEffect` (no RQ)                      | keyless (paginação client-side) | `GET /api/link/{id}/clicks-list` (via `linkService.getClicksList()`)                              |
| `useLinkAnalyticsOptimized(id)` | `useState`/`useEffect` (no RQ)                      | keyless                         | `GET /api/links/{id}` (via `linkService.findOne()`) — shell de compatibilidade                    |
| `useLinksMeta(ids)`             | `useQuery`                                          | `queryKeys.links.meta(ids)`     | `API_CONFIG.ENDPOINTS.LINKS_BATCH_META` (`POST /api/links/batch-meta`)                            |
| `usePublicURLShortener()`       | `useState` interno (sem TanStack Query)             | n/a                             | `API_CONFIG.ENDPOINTS.PUBLIC.SHORTEN` (`POST /api/public/shorten`)                                |
| `useShareAPI()`                 | sem chamada à API (envelopa `navigator.share`)      | n/a                             | n/a                                                                                               |
| `useSlugAvailability(slug)`     | `useState`/`useEffect` (debounced, sem RQ)          | keyless                         | `API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG(slug)` (`GET /api/public/link/{slug}`)                  |
| `useUrlSafetyCheck(url)`        | `useState`/`useEffect` (debounced, sem RQ)          | keyless                         | `POST /api/check-url` — rota Next.js (`app/api/check-url/route.ts`), bypassa o rewrite do backend |

## Rotas que consomem

- `app/(app)/links/page.tsx` — listagem.
- `app/(app)/links/create/page.tsx` — criar.
- `app/(app)/links/edit/[id]/page.tsx` — editar.
- `app/(app)/links/qr/[id]/page.tsx` — QR code.
- `app/(public)/shorter/page.tsx` — encurtador público (usa `URLInput` + `usePublicURLShortener`).

## Pontos de atenção

- `LinkFormSchema.ts` é a fonte canônica de validação. Não duplicar regras nos componentes; importar do schema.
- `batchMeta` é uma otimização: a página `/links` não chama N endpoints (sparkline, trend, health, preview) por linha; chama um único `POST /api/links/batch-meta` com a lista de IDs. **Mantenha** essa otimização.
- Mudanças em `LinksMobileCards` precisam ser testadas em viewport `< sm` (ver `useThemeMediaQuery`).
- Click count denormalizado em `links.clicks` é incrementado no backend; não confundir com a contagem real de `Click` rows.
- Hooks marcados como "keyless" usam `useState`/`useEffect` próprio (não TanStack Query). Se forem migrados, adicionar a chave correspondente em `lib/query/keys.ts` antes.
