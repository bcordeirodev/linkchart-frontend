# `subdomains`

## Propósito

Subdomínios custom do usuário autenticado (`meunome.linkcharts.com.br`): reivindicar até `MAX_SUBDOMAINS_PER_USER` (3) labels, listar/liberar na página `/subdomains` e escolher qual subdomínio usar ao criar um link (select embutido nos formulários da feature `links`). Feature inteira atrás do flag `NEXT_PUBLIC_SUBDOMAINS_ENABLED`.

## Domínio espelhado no backend

- Endpoints plurais `/api/subdomains` (N por usuário, limite enforçado server-side) — `GET` (lista), `POST` (claim), `DELETE /api/subdomains/{id}` (release), `GET /api/subdomains/check?name=` (disponibilidade). Os endpoints singulares legados `/api/subdomain` foram removidos do backend depois que `checkAvailability` (o último caller) migrou para o plural.
- `UserSubdomain::findByUserCached` — o backend usa o subdomínio ativo **mais antigo** como default quando `subdomain_id` é omitido; o frontend espelha essa ordem.

## Componentes principais

- `SubdomainClaimForm.tsx` — formulário de claim com validação da regra de label do backend (lowercase, dígitos, hífens; 3–63 chars; sem hífen nas pontas) e check de disponibilidade debounced. Sem card próprio — quem embrulha em `EnhancedPaper` é a página (`SubdomainsPage`), na seção "/ Criar novo endereço".
- `SubdomainList.tsx` — lista dos subdomínios ativos da conta com ação de liberar (release) por id; cada endereço é um card hairline translúcido (`getCardSurfaceSx`) com hover em tom de primary.
- `SubdomainQuotaMeter.tsx` — âncora de cota no topo da seção de endereços: contagem atual em Space Grotesk + `/ max` + faixa de `max` segmentos preenchidos. Puramente apresentacional; reusa as chaves `subtitle`/`subtitleLoading` como `aria-label` do grupo (o conteúdo visual é `aria-hidden`).
- `SubdomainSelect.tsx` — `Select` de subdomínio para a criação de link; valor sentinela para "usar o domínio padrão" (`subdomain_id: null`).

O preenchimento translúcido dos cards in-page da feature (linhas de endereço, placeholder vazio, card do formulário de claim) vem de `getCardSurfaceSx(theme)` (`shared/ui/base/cardSurface.ts`) — helper único compartilhado por todas as features desde a consolidação de 2026-08-04 (antes, cada feature tinha sua própria cópia `get*CardSx`); mesma fórmula do `MuiCard` global.

`constants.ts` — `MAX_SUBDOMAINS_PER_USER = 3`, espelho manual do default de `config('app.max_subdomains_per_user')` do backend (não há endpoint que exponha o limite). Mudou lá → atualizar aqui; um mismatch só degrada UX, o 422 `SUBDOMAIN_LIMIT_REACHED` do backend continua sendo a fonte de verdade.

## Hooks de dados

| Hook                                | Type                                            | Cache key                    | Endpoint constant / path                                                                                            |
| ----------------------------------- | ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `useSubdomains()`                   | `useQuery` (gated no flag) + 2 `useMutation`    | `queryKeys.subdomains.all()` | `GET /api/subdomains`; claim `POST /api/subdomains`; release `DELETE /api/subdomains/{id}` (via `subdomainService`) |
| `useSubdomains().checkAvailability` | `useState` + debounce 300ms (sem RQ)            | keyless                      | `GET /api/subdomains/check?name=` (via `subdomainService.checkAvailability()`)                                      |
| `useSubdomainSelection()`           | wrapper de `useSubdomains()` + `useState` local | (reusa `subdomains.all()`)   | n/a — devolve `subdomainIdField` para o payload de criação de link                                                  |

Claim e release invalidam `queryKeys.subdomains.all()` no `onSuccess` — todos os consumidores (página `/subdomains`, `SubdomainSelect`) sincronizam sem round trip extra.

## Rotas que consomem

- `app/(app)/subdomains/page.tsx` → `src/page-components/subdomains/SubdomainsPage.tsx` — gestão, apresentação horizontal empilhada (`maxWidth="md"`, 900px): título+intro → quota meter → `/ Seus endereços` + lista → `/ Criar novo endereço` + card do formulário, cada bloco full-width.
- Formulários de criação de link (`features/links`): `LinkFormFields`, `CreateLinkForm`, `QuickCreateLinkStrip`, `LinksQuickCreate` consomem `SubdomainSelect`/`useSubdomainSelection`; `src/lib/utils/shortUrl.ts` monta a URL curta com o host do subdomínio.

## Pontos de atenção

- **Flag `NEXT_PUBLIC_SUBDOMAINS_ENABLED`**: com o flag off, a query de `useSubdomains()` nem dispara (`enabled: false`) e `isLoading` já nasce `false`. Como é `NEXT_PUBLIC_*`, precisa de `ARG` no `Dockerfile` (guard `scripts/check-build-args.sh`).
- **`subdomain_id` presente-`null` ≠ omitido** no payload de criação de link: `null` explícito força o domínio padrão; campo omitido faz o backend escolher o subdomínio ativo mais antigo. `useSubdomainSelection().subdomainIdField` encapsula essa semântica — spread do objeto (`{ ...field }`) omite a chave de verdade quando preciso.
- `useSubdomainSelection` aplica o default (mais antigo) **uma única vez por mount** — refetch em background não troca a seleção do usuário no meio da edição.
- `limitReached` no client é pré-emptivo (esconde o form); o limite real é do backend.
