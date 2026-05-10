# `shorter`

## Propósito

Página pública (`/shorter`) que permite a qualquer visitante encurtar uma URL sem auth. Formulário simples + estados de carregando / sucesso / erro. Inclui CTA para upgrade para conta autenticada.

## Domínio espelhado no backend

- `Http/Controllers/Links/PublicLinkController` — endpoint público de encurtar.
- Rate limit `public-shorten` (10/min por IP) aplicado pelo backend.

## Componentes principais

- `components/ShorterForm.tsx` — formulário principal (URL + opções básicas).
- `components/ShorterHero.tsx` — bloco de destaque acima do formulário.
- `components/ShorterStats.tsx` — estatísticas (ex: total de URLs encurtadas).
- `components/ShorterSuccessState.tsx` — exibe URL curta + ações (copiar / share / abrir analytics públicos).
- `components/RedirectingState.tsx` — bloco transitório durante a navegação para a página de analytics.
- `components/ErrorAlert.tsx` — bloco de erro estruturado.
- `components/UpgradeCTA.tsx` — CTA de signup pós-encurtamento.

## Hooks de dados

A feature expõe **apenas** o `useShorter()`, que orquestra a máquina de estado da página (`isRedirecting`, `result`, `error`, `handle*`). Não há barrel `hooks/index.ts` — consumidores devem importar direto:

```ts
import { useShorter } from "@/features/shorter/hooks/useShorter";
```

A chamada HTTP de fato vem do feature `links` (`usePublicURLShortener`), que delega ao `publicLinkService`.

| Hook                      | Type                                          | Cache key | Endpoint                                                           |
| ------------------------- | --------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `useShorter()`            | `useState`/`useRef` (sem chamada HTTP direta) | n/a       | n/a (recebe `PublicLinkResponse` via `handleSuccess`)              |
| `usePublicURLShortener()` | (do feature `links`) `useState` interno       | n/a       | `API_CONFIG.ENDPOINTS.PUBLIC.SHORTEN` (`POST /api/public/shorten`) |

## Rotas que consomem

- `app/(public)/shorter/page.tsx` (Server Component) → renderiza `ShorterClientPage.tsx` (Client Component).

## Pontos de atenção

- Esta é a porta de entrada anônima — performance importa muito. Manter Server Component para a casca; Client Component apenas para o formulário interativo.
- Verifique limites do backend (`public-shorten` throttle, 10/min por IP) ao mexer em retries no cliente.
- Após sucesso, a URL pública de analytics precisa estar acessível (`/public-analytics/{slug}`); coordene com a feature `public-analytics` em mudanças de shape.
- Mensagens de erro devem ser amigáveis e i18n-aware (`lib/i18n/locales/{en,pt-BR}/public.json`).
- Endpoint público sempre via `API_CONFIG.ENDPOINTS.PUBLIC.SHORTEN` — não inline `/api/public/shorten`.
