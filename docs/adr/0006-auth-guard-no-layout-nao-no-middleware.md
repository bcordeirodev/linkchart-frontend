# 0006 — Auth guard no layout, não no middleware

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

Precisávamos garantir que (a) usuários não autenticados não vejam rotas em `app/(app)/*` e (b) usuários com email não verificado sejam direcionados para `/email-verification-pending`. Em Next.js 15, há dois lugares óbvios para essa lógica: `middleware.ts` (roda no edge, antes de qualquer renderização) ou um Client Component no layout do grupo.

## Decisão

- `middleware.ts` é mantido **mínimo** e responsável apenas por **headers de segurança** (CSP, etc.).
- A guarda real (`EmailVerificationGuard`) é um **Client Component** no `app/(app)/layout.tsx`. Ele lê o estado de `useAuth()` e redireciona via `useRouter().push()` quando necessário.
- Ataques de loading flash são mitigados pelo loading skeleton que o layout renderiza enquanto o guard decide.

## Alternativas consideradas

- **Middleware com decode de JWT** — Validar a assinatura no edge requer publicar a chave pública no edge runtime; complica o setup, vaza chave em build, e exige sincronizar lógica de expiração com o backend.
- **Guarda em cada page individualmente** — DRY ruim; alguém esquece em uma rota nova e expõe dado.
- **Server-side check via cookies** — Token vive em `localStorage`, não em cookie. Mover para cookie tem implicações de CSRF que preferimos evitar.

## Consequências

### Positivas

- Layout é single source of truth da guarda no grupo `(app)`.
- Middleware fica fino e cacheável.
- Token + estado de auth ficam no cliente — modelo simples.

### Negativas

- Páginas `(app)/*` mostram brevemente o skeleton enquanto a guarda decide (sub-100ms; aceitável).
- Não bloqueia bots ou requests sem JS — aceitável porque rotas autenticadas não têm conteúdo público para bots.
- Se o token expirar entre requisições, o usuário só descobre no próximo fetch (`401`); fluxo de refresh do `ApiClient` lida com isso.
