# Architecture Decision Records

Decisões de arquitetura do frontend Link Charts em formato [MADR](https://adr.github.io/madr/).

Cada arquivo é uma decisão. Status possíveis: `Proposed`, `Accepted`, `Deprecated`, `Superseded`.

## Índice

- [0001 — App Router e Server Components por padrão](0001-app-router-e-server-components-por-padrao.md)
- [0002 — MUI + Emotion sobre Tailwind](0002-mui-emotion-sobre-tailwind.md)
- [0003 — Redux para UI / TanStack Query para servidor](0003-redux-para-ui-tanstack-query-para-estado-de-servidor.md)
- [0004 — React Hook Form com Zod](0004-react-hook-form-com-zod.md)
- [0005 — Redirect canônico no backend](0005-redirect-canonico-no-backend.md)
- [0006 — Auth guard no layout, não no middleware](0006-auth-guard-no-layout-nao-no-middleware.md)
- [0007 — `ApiClient` customizado em vez de fetch direto](0007-apiclient-customizado-em-vez-de-fetch-direto.md)

## Como propor uma nova ADR

1. Copie o template abaixo para `docs/adr/NNNN-titulo-em-kebab-case.md`.
2. Status inicial: `Proposed`.
3. Abra PR — discussão na PR.
4. Mergeada com aprovação → status vira `Accepted`.

## Template

```markdown
# NNNN — Título

- Status: Proposed | Accepted | Deprecated | Superseded by [NNNN](...)
- Data: YYYY-MM-DD
- Autores: ...

## Contexto

(Por que essa decisão foi necessária? Qual problema resolve?)

## Decisão

(O que foi decidido. Em prosa, não em bullets.)

## Alternativas consideradas

- A — por que não.
- B — por que não.

## Consequências

### Positivas

- ...

### Negativas

- ...
```
