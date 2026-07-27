# Link Charts — Frontend

Frontend Next.js 15 do Link Charts (linkcharts.com.br) — encurtador de URL com analytics avançado. Este repo cobre apenas a camada web; a API Laravel mora em outro repositório (`backend/`) e atende em `api.linkcharts.com.br`.

## Stack

- Next.js 15 (App Router, Server Components, Turbopack em dev)
- React 19 · TypeScript strict
- MUI 6 + Emotion (sem Tailwind, sem CSS Modules)
- TanStack Query v5 (estado de servidor) · React Context para estado global de UI (`MessageProvider` para notificações — Redux foi removido, ver ADR 0008)
- React Hook Form + Zod
- i18next (`pt-BR`, `en`)
- Playwright para E2E

## Pré-requisitos

- Node 20+ (ver `.nvmrc` se presente)
- npm 10+
- API rodando em `http://localhost:8000` (use o repo `backend/` ou `docker-compose up -d` lá dentro)

## Setup local

```bash
# 1. Clonar
git clone <repo-url> && cd frontend-next

# 2. Variáveis de ambiente
cp .env.example .env.local
# Edite .env.local conforme seu setup local

# 3. Instalar dependências
npm install

# 4. Subir o app (Turbopack, porta 3000)
npm run dev
```

Abra http://localhost:3000. O app proxia `/api/*` para `process.env.API_URL` (default `http://localhost:8000`) — sem CORS no dev.

## Estrutura de pastas

```
frontend-next/
├── app/                  # App Router (rotas + layouts + middleware)
│   ├── (app)/            # Rotas autenticadas (links, analytics, profile)
│   ├── (auth)/           # Login, signup, reset, verificação de email
│   ├── (public)/         # Shorter, public-analytics, comparar, guia, legais
│   └── api/              # API routes do front (health, check-url)
├── src/
│   ├── features/         # Domínios (analytics, links, profile, public-analytics, reports, shorter, subdomains) — README em cada
│   ├── page-components/  # Composições por rota
│   ├── services/         # Camada HTTP (extends BaseService)
│   ├── lib/              # Infra: api, query, auth, providers, theme, i18n, consent, seo, telemetry, utils
│   ├── shared/           # UI / hooks / layouts cross-feature
│   ├── styles/           # CSS global
│   └── types/            # Tipos compartilhados (core, analytics)
├── e2e/                  # Playwright specs
├── docs/
│   ├── adr/              # Decisões arquiteturais (MADR)
│   ├── diagrams/         # Diagramas Mermaid
│   ├── _audit/           # Inventário interno do código
│   └── superpowers/      # Specs e implementation plans
└── public/               # Assets estáticos
```

Mais detalhe por módulo:

- [`src/features/analytics/`](src/features/analytics/README.md)
- [`src/features/links/`](src/features/links/README.md)
- [`src/features/profile/`](src/features/profile/README.md)
- [`src/features/public-analytics/`](src/features/public-analytics/README.md)
- [`src/features/reports/`](src/features/reports/README.md)
- [`src/features/shorter/`](src/features/shorter/README.md)
- [`src/features/subdomains/`](src/features/subdomains/README.md)
- [`src/page-components/`](src/page-components/README.md)
- [`src/services/`](src/services/README.md)
- [`src/lib/`](src/lib/README.md)
- [`src/shared/`](src/shared/README.md)

## Como contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md) — convenções de commit, branching, gates obrigatórios e onde colocar coisa nova.

## Comandos úteis

| Comando                | O que faz                                           |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Sobe Next dev com Turbopack (porta 3000)            |
| `npm run build`        | Build de produção (`output: standalone`)            |
| `npm run start`        | Serve o build                                       |
| `npm run lint`         | ESLint                                              |
| `npm run type-check`   | `tsc --noEmit`                                      |
| `npm run format`       | Prettier (write)                                    |
| `npm run format:check` | Prettier (check only)                               |
| `npm run quality`      | Type-check + lint + format:check (gate de CI local) |
| `npm run test:e2e`     | Playwright em modo headless                         |
| `npm run test:e2e:ui`  | Playwright em modo UI                               |

## Testes

- **E2E (Playwright):** specs em `e2e/` (`smoke`, `auth`, `authed-responsive`, `mobile-responsive`), com setup de sessão em `e2e/auth.setup.ts` + `e2e/global-setup.ts`. Rodar com `npm run test:e2e` (headless) ou `npm run test:e2e:ui`.
- **Unitários:** não há runner de testes unitários configurado — o gate local é `npm run quality` + a suite E2E.

## Documentação avançada

- [`CLAUDE.md`](../CLAUDE.md) (raiz do monorepo) — referência canônica de arquitetura.
- [`docs/adr/`](docs/adr/) — decisões arquiteturais (formato MADR).
- [`docs/diagrams/`](docs/diagrams/) — diagramas Mermaid (architecture, auth flow, redirect flow, data fetching).
- [`docs/superpowers/specs/`](docs/superpowers/specs/), [`docs/superpowers/plans/`](docs/superpowers/plans/) — specs e planos por feature.
- [`docs/_audit/frontend-inventory.md`](docs/_audit/frontend-inventory.md) — inventário interno do código.

## Deploy

- **Frontend:** linkcharts.com.br — pipeline em `.github/workflows/release.yml` (deploy por tag `v*`, blue/green — ver `docs/DEPLOY.md` na raiz do workspace).
- **Backend:** api.linkcharts.com.br — VPS Docker, repositório separado.
- **Merge em `main` NÃO deploya:** só roda o CI (`.github/workflows/ci.yml`). Publicar é um ato explícito — criar e pushar uma tag `v*`.
- **Build artifact:** `output: standalone` (ver `next.config.ts`).

Ambientes:

- `.env.example` — template (commit ok).
- `.env.local` — desenvolvimento local (gitignored).
- `.env.production` — produção (commitado como template; secrets reais via env do runner).
