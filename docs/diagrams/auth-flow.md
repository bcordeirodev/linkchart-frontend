# Fluxo de autenticação

O usuário envia credenciais ao backend via `AuthService.signIn()`. O backend retorna `{token, user}`; o front grava o token em `localStorage` e atualiza o `AuthContext`. Toda navegação subsequente para o grupo `(app)` passa pelo `EmailVerificationGuard` (Client Component no layout do grupo), que checa `email_verified_at` e redireciona para `/email-verification-pending` se faltar.

```mermaid
sequenceDiagram
  participant U as Usuário
  participant FE as Next.js (Client)
  participant Ctx as AuthContext
  participant API as Laravel API
  participant Layout as (app)/layout.tsx
  participant Guard as EmailVerificationGuard

  U->>FE: POST /sign-in (form)
  FE->>API: AuthService.signIn(email, password)
  API-->>FE: 200 {token, user}
  FE->>Ctx: setUser(user); localStorage.setItem('token', ...)
  FE->>Layout: router.push('/links')
  Layout->>Guard: render guard
  alt email_verified_at presente
    Guard-->>U: render rotas (app)/*
  else email_verified_at nulo
    Guard-->>FE: router.push('/email-verification-pending')
  end
```

`middleware.ts` apenas injeta headers de segurança (CSP, etc.) — **não** decide auth. A decisão é client-side por design (ver ADR `0006`). O `ApiClient` lê `localStorage.token` em cada request e injeta `Authorization: Bearer ...`; quando o backend retorna `401`, o client desloga via `AuthContext.logout()` e redireciona para `/sign-in`.

Tokens expiram conforme política do `tymon/jwt-auth`; o refresh automático é tratado por interceptor no `ApiClient` (ler o código para detalhes — fluxo coberto em `lib/auth/`).
