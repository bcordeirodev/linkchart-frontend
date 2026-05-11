# Fluxo de redirect (`/r/{slug}`)

O domínio canônico de redirect é o **backend** (`api.linkcharts.com.br/r/{slug}`, rota `web.php`). Lá vive a lógica completa: detecção bot/humano, cache `findActiveBySlugCached`, increment denormalizado, dispatch do `ProcessLinkClickJob`, render Open Graph para bots ou 302 para humanos.

O front mantém uma rota espelho em `app/(public)/r/[slug]/page.tsx` para que URLs no domínio principal (`linkcharts.com.br/r/{slug}`) também resolvam. Esta rota usa `generateMetadata` (server-side) para popular Open Graph chamando `/api/public/analytics/{slug}`, e renderiza o componente `RedirectDynamic` (client) que faz o `router.push` para a `original_url`.

```mermaid
flowchart TD
  subgraph FrontDomain["linkcharts.com.br/r/{slug}"]
    F1[GET /r/abc] --> F2[generateMetadata]
    F2 -->|server fetch| F3[GET /api/public/analytics/abc]
    F3 --> F4[render RedirectDynamic]
    F4 --> F5[router.push original_url]
  end

  subgraph BackDomain["api.linkcharts.com.br/r/{slug}"]
    B1[GET /r/abc] --> B2[RedirectController route web]
    B2 --> B3[Link::findActiveBySlugCached]
    B3 --> B4{Bot?}
    B4 -->|yes| B5[render Open Graph HTML]
    B4 -->|no| B6[302 to original_url]
    B6 --> B7[dispatch ProcessLinkClickJob]
    B7 --> B8[(Click row + geo + UA)]
  end
```

**Zona crítica.** Mudanças exigem paridade bit-a-bit em: tipo de redirect (302), status code, OG tags, ordem de tracking, tempo até disparo. O endpoint `/api/r/{slug}` (legado, AJAX) foi desativado em `routes/api.php` do backend (04/11/2025) — não reabrir.

Tracking sempre roda via job assíncrono (`ProcessLinkClickJob`) — o response HTTP do backend não espera o tracking terminar. Frontend e backend compartilham o mesmo schema de `clicks` no Postgres; mudanças no schema afetam `features/analytics` e `features/public-analytics`.
