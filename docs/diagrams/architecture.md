# Arquitetura geral

Browser → Next.js (App Router) → ApiClient → Laravel API → PostgreSQL/Redis. O front é stateless (sem DB próprio) e proxia toda chamada de domínio para o backend via `/api/*` rewrites configurados em `next.config.ts`. Server Components renderizam a casca da página e podem fazer fetch server-side (ex: `generateMetadata` em `/public-analytics/[slug]`); Client Components usam TanStack Query (estado de servidor) e contexts React (estado de UI — ex: `MessageProvider` para notificações) sobre o `ApiClient`.

```mermaid
flowchart LR
  Browser[Browser]
  subgraph Front["frontend-next (Docker)"]
    App[Next.js App Router]
    SC[Server Components]
    CC[Client Components]
    AC[ApiClient]
    RQ[TanStack Query]
    CTX[Contexts: MessageProvider etc.]
  end
  subgraph Back["backend (api.linkcharts.com.br)"]
    L[Laravel 12 API]
    PG[(PostgreSQL 15)]
    Redis[(Redis 7)]
    Q[Queue Workers]
  end

  Browser -->|HTTPS| App
  App --> SC
  App --> CC
  SC -.->|server fetch via rewrites| AC
  CC --> RQ
  CC --> CTX
  RQ --> AC
  AC -->|/api/* via rewrites| L
  L --> PG
  L --> Redis
  L --> Q
  Q --> PG
```

A camada `ApiClient` (`src/lib/api/client.ts`) é o único ponto que conhece detalhes de transporte (JWT, envelope, normalização de erro). Todos os services estendem `BaseService` que delega ao `ApiClient`. Componentes nunca chamam `fetch` direto.

Em produção, o frontend é servido em `linkcharts.com.br` (deploy descrito no README raiz) e o backend em `api.linkcharts.com.br`. Em dev, os rewrites do Next apontam para `http://localhost:8000` — eliminando CORS.
