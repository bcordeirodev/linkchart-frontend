# `public-analytics`

## Propósito

Página pública (sem auth) que exibe métricas resumidas e charts sumarizados de um slug. URL: `/public-analytics/{slug}`. Usada como vitrine compartilhável e como ponte para visitantes converterem para usuários.

## Domínio espelhado no backend

- `Http/Controllers/Links/PublicLinkController` — rotas públicas de `/api/public/*`. Endpoints consumidos: `GET /api/public/link/{slug}` e `GET /api/public/analytics/{slug}`.

## Componentes principais

- `PublicAnalyticsPageContent.tsx` — layout completo da página (hero + métricas + charts + CTA).
- `components/info/LinkHeroCard.tsx` — bloco superior com URL, slug e descrição.
- `components/info/AnalyticsInfo.tsx` — explicação curta de quais métricas estão sendo exibidas.
- `components/info/PublicCtaBlock.tsx` — bloco de chamada para conversão.
- `components/metrics/PublicMetrics.tsx` — métricas em destaque (cliques, países, dispositivos).
- `components/charts/PublicCharts.tsx` — charts sumarizados (subset do dashboard autenticado).
- `components/states/LoadingState.tsx`, `ErrorState.tsx` — estados de UI.

## Hooks de dados

`usePublicAnalytics(slug)` dispara duas queries em paralelo (TanStack Query) e expõe um único objeto consolidado:

| Sub-query                | Cache key                              | Endpoint constant                                                                  |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------- |
| Link público (metadados) | `queryKeys.analytics.publicLink(slug)` | `API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG(slug)` (`GET /api/public/link/{slug}`)   |
| Analytics público        | `queryKeys.analytics.public(slug)`     | `API_CONFIG.ENDPOINTS.PUBLIC.ANALYTICS(slug)` (`GET /api/public/analytics/{slug}`) |

## Rotas que consomem

- `app/(public)/public-analytics/[slug]/page.tsx`

## Pontos de atenção

- O endpoint `getPublicAnalytics(slug)` também é chamado em `generateMetadata` da rota `/r/[slug]` para gerar Open Graph tags. Mudanças no shape do payload afetam **dois** consumers — testar redirect bot preview após qualquer mudança.
- O conteúdo é cache-friendly (Redis no backend). Não invalide cache pelo cliente sem necessidade — não há mutações neste feature.
- Sem auth: nenhum dado sensível pode aparecer aqui (ex: IP completo, user agent identificável). Verificar o payload contra a política em `LinkAuditService` no backend.
- Endpoints públicos vivem em `API_CONFIG.ENDPOINTS.PUBLIC.*` (introduzido em R-MED-4). Não inline strings — sempre usar a constante.
