# 0005 — Redirect canônico no backend

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

O fluxo `/r/{slug}` precisa: (1) redirecionar humanos para a `original_url` com 302; (2) servir HTML com Open Graph para bots de redes sociais (WhatsApp, Telegram, Twitter, Facebook); (3) registrar o clique com geo, UA e UTM no banco; (4) ser rápido o suficiente para sustentar picos de tráfego sem latência percebida pelo usuário.

## Decisão

O **redirect canônico vive no backend Laravel** (rota `web.php` → `RedirectController`). O backend implementa: detecção bot/humano, cache `Link::findActiveBySlugCached` (10min), increment denormalizado em `links.clicks`, dispatch do `ProcessLinkClickJob` para tracking assíncrono, render de OG HTML para bots, 302 para humanos.

O **frontend Next.js mantém uma rota espelho** em `app/(public)/r/[slug]/page.tsx` para que URLs no domínio principal (`linkcharts.com.br/r/{slug}`) também funcionem. Essa rota usa `generateMetadata` (server-side) chamando `/api/public/analytics/{slug}` para popular OG tags, e renderiza `RedirectDynamic` (client) que faz `router.push` para a `original_url` recebida.

## Alternativas consideradas

- **Redirect no front via API route do Next.js** — Perderia a rota `web.php` do backend e suas Open Graph tags renderizadas server-side com fidelidade ao schema do `Click`.
- **Redirect no front via middleware** — `middleware.ts` roda no edge; não pode renderizar HTML para bots; não pode acessar Redis nem o Postgres.
- **Frontend ser o único caminho** — Implicaria duplicar a lógica de tracking + bot detection no front; risco grande de divergência.

## Consequências

### Positivas

- Backend é o single source of truth: tracking, cache, bot detection.
- Frontend continua entregando URL bonita no domínio principal (UX > vanity URL).
- Open Graph funcionam tanto via `api.linkcharts.com.br/r/...` quanto `linkcharts.com.br/r/...`.
- Mudanças de schema de `Click` são centralizadas no backend.

### Negativas

- Duas implementações precisam manter paridade observável (302 vs `router.push`, OG tags idênticas).
- A rota do front depende do endpoint público do back para `generateMetadata`; downtime do back quebra OG no domínio do front.
- O endpoint `/api/r/{slug}` (legado, AJAX) foi desativado em 04/11/2025 — risco de alguém tentar reabrir sem entender o motivo.
