# Contribuindo com Link Charts (frontend)

Antes de abrir PR, leia este guia. Os tópicos abaixo são todos requisitos, não sugestões.

## Antes de começar

1. Leia o [README.md](README.md) — setup local e estrutura geral.
2. Leia o [`CLAUDE.md`](../CLAUDE.md) (raiz do monorepo) — fonte canônica de arquitetura.
3. Para mudanças não-triviais, consulte [`docs/adr/`](docs/adr/) para entender as decisões em vigor.
4. Se a feature já tem um spec ou plano em [`docs/superpowers/`](docs/superpowers/), siga-o.

## Padrão de commit (Conventional Commits)

Pattern observado e canônico no repositório:

```
type(scope): subject
```

- **Tipos:** `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`, `perf`, `ci`, `build`.
- **Scope** (opcional): nome curto da feature/módulo (ex: `analytics`, `links`, `auth`, `ui`, `i18n`, `deps`).
- **Subject:** lowercase, imperativo ("add", "fix", "rewrite" — não "added", "fixed", "rewritten"); sem ponto final; ≤72 caracteres.
- **Sem** trailers `Co-Authored-By: Claude` ou referências a IA. Sem emojis.

Exemplos válidos (do log atual):

- `feat: replace window.confirm with DeleteConfirmDialog on delete flow`
- `fix(public-analytics): use theme tokens on ghost CTA button`
- `refactor(audience): improve visual layout and label quality`
- `docs(services): add TSDoc to service classes and methods`

Exemplos inválidos:

- `Update files.` ❌ (capitalizado, vago, com ponto)
- `feat: Added new feature for users.` ❌ (passado, capitalizado, ponto)
- `wip` ❌ (sem tipo, vago)

## Branching e PR

1. Crie a branch a partir de `main`: `git checkout -b feat/<scope>-<short-name>`.
2. Commits pequenos e atômicos — **um commit = uma mudança coerente**. Não misture refactor + fix + feature.
3. PR contra `main`. Título do PR no mesmo formato Conventional Commits.
4. Descrição do PR: o porquê (não apenas o quê) e os testes manuais que você fez.

## Gates obrigatórios antes de pedir review

```bash
# 1. Quality gate (type-check + lint + format:check)
npm run quality

# 2. E2E (auth flow)
npx playwright test
```

Os dois precisam passar localmente. CI roda os mesmos comandos — não passe pra cima de gate falhando localmente.

## Convenções de código

### Arquivos e nomes

- Componentes React: `PascalCase` (ex: `LinkCardRich.tsx`).
- Hooks: `useXxxYyy.ts` em camelCase a partir do `use`.
- Utils, services, helpers: `camelCase` ou `kebab-case` (siga o padrão da pasta — ex: services usam `*.service.ts`).
- Pastas de feature/módulo: `kebab-case` (ex: `public-analytics/`, `data-display/`).

### Imports

**Sempre use os aliases definidos em `tsconfig.json`.** Nunca use caminhos relativos longos (`../../../`).

```ts
// ✅ Bom
import { Loading } from "@/shared/ui/feedback/Loading";
import { useLinks } from "@/features/links/hooks/useLinks";
import { ApiClient } from "@/lib/api/client";

// ❌ Ruim
import { Loading } from "../../../shared/ui/feedback/Loading";
```

Aliases disponíveis: `@/`, `@/features/*`, `@/lib/*`, `@/shared/*`, `@/auth/*`, `@/analytics/*`, `@/links/*`, `@/ui/*`, `@/layout/*`, `@/hooks/*`, `@/api/*`, `@/theme/*`, `@/store/*`, `@/utils/*`, `@/i18n/*`, `@/pages/*`.

### i18n

- **Nunca hardcode strings de UI.** Sempre `t('namespace.key')`.
- Adicione tanto em `src/lib/i18n/locales/pt-BR/<ns>.json` quanto em `src/lib/i18n/locales/en/<ns>.json`.
- Namespaces: `analytics`, `auth`, `common`, `links`, `profile`, `public`. Crie um novo apenas se realmente não couber em nenhum.

### TypeScript

- `strict: true` é obrigatório — nunca afrouxe tipos com `any`/`unknown` para "fazer compilar".
- Tipos compartilhados vivem em `src/types/core/` (genéricos) ou `src/types/analytics/` (analytics).
- Tipos de feature ficam em `src/features/<nome>/types/`.

### Estado

- **Estado de servidor:** TanStack Query. Hooks em `src/features/<nome>/hooks/`. Chaves de cache canônicas em `src/lib/query/keys.ts` — sempre importar.
- **Estado de UI global:** Redux (`src/lib/store/messageSlice.ts` para notificações). Não criar slices novos sem alinhamento.
- **Estado local:** `useState`/`useReducer` mesmo.

### HTTP

- Componentes nunca chamam `fetch` direto. Sempre via service (`*.service.ts`) que estende `BaseService`.
- Endpoints novos → primeiro adicione a constante em `src/lib/api/endpoints.ts`, depois o método no service.

## Onde colocar coisa nova

| Tipo de mudança                      | Vai em                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| Componente usado por **uma** feature | `src/features/<nome>/components/`                                                    |
| Componente usado por **2+** features | `src/shared/ui/` (ou `src/shared/components/` se for cross-cutting com lógica)       |
| Hook específico de feature           | `src/features/<nome>/hooks/`                                                         |
| Hook genérico (browser/Next)         | `src/shared/hooks/`                                                                  |
| Helper genérico (sem domínio)        | `src/lib/utils/`                                                                     |
| Endpoint novo / mudança em service   | `src/lib/api/endpoints.ts` + `src/services/<nome>.service.ts`                        |
| Página nova                          | `app/<group>/<rota>/page.tsx` (delegando para `src/page-components/...` se complexa) |
| Tipo compartilhado entre features    | `src/types/core/` ou `src/types/analytics/`                                          |

## Doc é parte do PR

- PR que muda comportamento de uma feature **atualiza** o `README.md` da feature no mesmo PR.
- PR que muda a arquitetura geral **adiciona ou supera** uma ADR.
- PR que muda diagrama mental do app **atualiza** os diagramas em `docs/diagrams/`.

Não merge: PR com mudança de comportamento e doc desatualizada.

## Zonas críticas (cuidado triplicado)

Não toque sem combinar com alguém da equipe e sem testes manuais explícitos:

- `app/(public)/r/[slug]/page.tsx` — fluxo de redirect.
- `src/features/redirect/components/RedirectDynamic.tsx`.
- `middleware.ts` (apenas headers de segurança).
- `src/lib/auth/components/EmailVerificationGuard.tsx`.

Spec completo em [`CLAUDE.md`](../CLAUDE.md) — seção "Pontos críticos / dívidas técnicas".
