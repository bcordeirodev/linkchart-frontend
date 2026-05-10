# `redirect`

## Propósito

UI cliente do redirect público quando o slug é acessado via domínio do front (`linkcharts.com.br/r/{slug}`). Renderiza um loader breve e dispara o redirect via `router.push` para a `original_url` enviada pelo backend.

> **ZONA CRÍTICA — paridade obrigatória com backend.** Mudanças neste feature exigem paridade bit-a-bit com `routes/web.php` → `RedirectController`. Ver ADR `0005-redirect-canonico-no-backend.md` e o tópico "Pontos críticos / dívidas técnicas" em `CLAUDE.md` (raiz).

## Domínio espelhado no backend

- `Http/Controllers/Links/RedirectController` (rota `web.php`).
- `Jobs/ProcessLinkClickJob` para o tracking assíncrono.
- `Models/Link::findActiveBySlugCached()` para o lookup com cache de 10min.

## Componentes principais

- `components/RedirectDynamic.tsx` — entry point usado pela página `app/(public)/r/[slug]/page.tsx`.
- `components/RedirectClientPage.tsx` — Client Component que resolve o slug e dispara o `router.push`.
- `components/RedirectLoader.tsx` — UI de loading durante o redirect.
- `components/Redirect.tsx`, `SmartRedirect.tsx`, `RedirectSettings.tsx`, `RedirectStats.tsx` — componentes auxiliares (verificar candidatos a órfão na audit § 8 antes de remover).
- `components/styles/Redirect.styled.ts` — Emotion styles.

## Hooks de dados

| Hook                                 | Type                                                      | Cache key | Endpoint |
| ------------------------------------ | --------------------------------------------------------- | --------- | -------- |
| `useRedirectWithDelay(url, delayMs)` | sem chamada à API (envelopa `setTimeout` + `router.push`) | n/a       | n/a      |

## Rotas que consomem

- `app/(public)/r/[slug]/page.tsx` — `generateMetadata` chama `PublicLinkService.getPublicAnalytics(slug)` para OG tags; o body renderiza `RedirectDynamic`.

## Pontos de atenção

- **PARIDADE COM BACKEND OBRIGATÓRIA.** Tipo de redirect (302/301), status code, ordem de tracking, tempo até disparo: tudo precisa permanecer idêntico após qualquer mudança.
- O endpoint `/api/r/{slug}` (legado, AJAX) **foi desativado** em `routes/api.php` do backend (04/11/2025). Não tentar reabrir.
- Se um bot acessar o domínio do front, a página renderiza HTML estático com OG tags via `generateMetadata` (server-side). Para humanos com JS, o `RedirectClientPage` faz o push.
- O domínio canônico de redirect ainda é o backend (`api.linkcharts.com.br/r/{slug}`). O front é um espelho de conveniência.
