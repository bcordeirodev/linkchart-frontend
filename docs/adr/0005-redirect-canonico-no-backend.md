# 0005 — Redirect canônico no backend

- Status: Accepted (revisado 2026-05-11 — frontend interstitial removido)
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

O fluxo `/r/{slug}` precisa: (1) redirecionar humanos para a `original_url` com 302; (2) servir HTML com Open Graph para bots de redes sociais (WhatsApp, Telegram, Twitter, Facebook); (3) registrar o clique com geo, UA e UTM no banco; (4) ser rápido o suficiente para sustentar picos de tráfego sem latência percebida pelo usuário.

## Decisão

O **redirect canônico vive no backend Laravel** (rota `web.php` → `RedirectController`). O backend implementa: detecção bot/humano, cache `Link::findActiveBySlugCached` (10min), increment denormalizado em `links.clicks`, dispatch do `ProcessLinkClickJob` para tracking assíncrono, render de OG HTML para bots, 302 para humanos.

O frontend **não** mantém rota espelho. Hits em `linkcharts.com.br/r/{slug}` são 307-redirected pelo `next.config.ts` (`redirects()`) para `${NEXT_PUBLIC_REDIRECT_URL}/{slug}`, que aponta ao backend. O browser navega de fato, o backend recebe o IP real do cliente e dispara o tracking.

## Alternativas consideradas

- **Manter rota espelho no front com `generateMetadata` + `RedirectClientPage`** — usada até 2026-05-11. O componente client chamava `/api/public/link/{slug}` e fazia `window.location.href = original_url`, mas isso **bypassava o backend `/r/{slug}`** e nenhum clique era contabilizado. Removido.
- **Rewrite do Next em vez de redirect** — o backend veria o IP do servidor Next, não do cliente; quebraria geo-tracking.
- **Redirect no front via middleware** — `middleware.ts` roda no edge; não pode renderizar HTML para bots; não pode acessar Redis nem o Postgres.
- **Frontend ser o único caminho** — Implicaria duplicar a lógica de tracking + bot detection no front; risco grande de divergência.

## Consequências

### Positivas

- Backend é o single source of truth: tracking, cache, bot detection.
- Não há mais janela onde cliques são silenciosamente perdidos.
- Open Graph para preview em redes sociais é responsabilidade exclusiva do backend (`web.php` renderiza para bots).
- Mudanças de schema de `Click` são centralizadas no backend.

### Negativas

- Hits no domínio do app pagam um hop extra (307 → backend). Aceitável: redirect é uma operação naturalmente latente.
- `app/(public)/r/[slug]/`, `src/features/redirect/`, e `src/shared/layout/LoadingWithRedirect.tsx` foram removidos. Re-introduzir uma rota client-side aqui regrediria o tracking — qualquer mudança precisa preservar o redirect no `next.config.ts`.
- O endpoint `/api/r/{slug}` (legado, AJAX) foi desativado em 04/11/2025 — risco de alguém tentar reabrir sem entender o motivo.
