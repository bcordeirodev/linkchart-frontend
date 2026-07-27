# 0008 — Remoção do Redux: contexts React para estado de UI

- Status: Accepted
- Data: 2026-07-09 (registrado como ADR em 2026-07-27)
- Autores: equipe Link Charts

## Contexto

A ADR [0003](0003-redux-para-ui-tanstack-query-para-estado-de-servidor.md) manteve o Redux Toolkit no projeto exclusivamente para o `messageSlice` (notificações globais). Na prática, o custo não se justificava: duas dependências (`@reduxjs/toolkit`, `react-redux`) e toda a cerimônia de store/reducer/middleware para um único slice. Durante a migração descobriu-se ainda que o componente `<Message />` nunca era montado — `showMessage(...)` não fazia nada em silêncio — e que o `SnackbarProvider` do `notistack` estava plugado sem nenhum consumidor.

## Decisão

Redux foi removido por completo do projeto (branch `refactor/remove-redux`, merge `e8bef25`, 2026-07-09):

- **Estado de servidor** continua 100% no TanStack Query v5 (chaves canônicas em `src/lib/query/keys.ts`) — essa metade da ADR 0003 permanece válida e inalterada.
- **Estado de UI global** passa a viver em contexts React. As notificações usam `src/lib/providers/MessageProvider.tsx` — provider baseado em `useReducer` que reproduz o comportamento do antigo `messageSlice` (`showMessage`/`hideMessage`, fila, defaults mobile-first) e expõe o hook `useMessage()`. O `<Message />` agora é montado dentro do `MainThemeProvider` em `Providers.tsx`.
- `src/lib/store/` foi deletado (store, rootReducer, middleware, hooks tipados, `messageSlice`); `notistack` e o `SnackbarProvider` morto saíram junto. Nenhuma dependência Redux resta no `package.json`.

Relatório completo da migração (arquivos tocados, consumidores convertidos, verificação): `.superpowers/sdd/redux-removal-report.md`.

## Alternativas consideradas

- **Manter o Redux só para o slice de mensagens** — era o status quo (ADR 0003); duas dependências e boilerplate de store para um único reducer trivial.
- **Zustand** — resolveria, mas adiciona dependência nova para um caso que `useReducer` + Context cobre por inteiro.
- **Notistack puro (`enqueueSnackbar`)** — perderia a fila e os defaults custom do slice; o `SnackbarProvider` existente estava, na prática, morto (zero consumidores).

## Consequências

### Positivas

- Duas dependências a menos e um conceito a menos para devs aprenderem (só TanStack Query + contexts).
- Corrigiu o bug do toast global nunca montado.
- Fronteira de estado mais simples: servidor = TanStack Query; UI global = context; local = `useState`/`useReducer`.

### Negativas

- ADRs, READMEs e o inventário `docs/_audit/` escritos antes de 2026-07-09 citam `lib/store/`/`@/store` e ficaram históricos.
- Um novo estado de UI global exige criar/estender um provider manualmente (não há mais infraestrutura de slices pronta) — alinhar antes de criar contexts novos.
