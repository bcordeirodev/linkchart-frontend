# 0003 — Redux para UI / TanStack Query para estado de servidor

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

A aplicação tem dois tipos de estado bem distintos: (a) **estado de servidor** (links, analytics, perfil — origem é a API, precisa de cache, invalidação, refetch); (b) **estado de UI** (notificações globais, mensagens transitórias). Misturar os dois numa única store traz boilerplate e bugs sutis (ex: invalidação manual de cache).

## Decisão

- **TanStack Query v5** cuida de todo estado de servidor. Hooks (`useLinks`, `useDashboardData`, etc.) usam `useQuery`/`useMutation` com chaves canônicas em `src/lib/query/keys.ts`. Cache + invalidação são declarativos.
- **Redux Toolkit** cuida apenas do `messageSlice` (notificações globais, integradas com Notistack via `Message.tsx`).
- Estado local de componente continua sendo `useState`/`useReducer` — não há regra que force tudo para Redux.

## Alternativas consideradas

- **Redux para tudo** — Boilerplate alto; cache/invalidação manual; reinventaria o que TanStack Query faz por padrão.
- **Zustand para UI** — Mais leve que Redux, mas o time já tem familiaridade com Redux Toolkit; trocar não trazia ganho concreto.
- **SWR no lugar de TanStack Query** — Similar, mas TanStack Query tem ecossistema maior (devtools, persisters, infinite queries) e API de mutations melhor para o caso da aplicação.

## Consequências

### Positivas

- Fronteira clara: cliente vs. servidor.
- Invalidação por chave (`queryKeys`) é declarativa.
- Boilerplate Redux fica mínimo (1 slice).
- Devtools do TanStack Query facilitam debug de cache.

### Negativas

- Duas APIs para devs aprenderem (Redux + Query).
- Cuidado com sincronização: após mutation, é responsabilidade do hook chamar `invalidateQueries`.
- Hooks novos precisam pensar em `staleTime`/`gcTime` — defaults globais nem sempre cobrem.
