# `page-components`

## Propósito

Camada de "composição por rota". Cada arquivo aqui é a versão canônica de uma página inteira: combina layouts, features e estados de erro/loading. As rotas em `app/` ficam pequenas e delegam para um page component.

## Estrutura

- `auth/` — `SignInPage`, `SignUpPage`, `SignOutPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `VerifyEmailPage`, `EmailVerificationPendingPage`. Consomem `lib/auth/forms` e `services/auth.service.ts`.
- `links/` — `LinkListPage`, `LinkCreatePage`, `LinkEditPage`, `LinkAnalyticsPage`, `LinkQRPage`. Composições da feature `features/links`.
- `analytics/` — barrel apenas (`index.ts`). Composições próprias podem viver aqui se forem multi-feature; hoje a página usa `features/analytics` direto.
- `public/` — `ShorterPage`, `BenefitBadges`. Consomem `features/shorter`.
- `system/` — `NotFoundPage`, `UnauthorizedPage`. Páginas de erro renderizadas por `app/not-found.tsx` e `app/401/page.tsx`.
- `user/` — `ProfilePage`. Composição de `features/profile`.

## Quando criar um novo page component

- A rota tem mais de uma feature e precisa orquestrar.
- A rota precisa de loading/error specific patterns que não são reutilizados.
- A rota tem variantes (autenticada vs. anônima vs. mobile-only) que se beneficiam de uma classe de composição.

## Quando NÃO criar

- Se a página é uma única feature renderizada inteira: o `app/.../page.tsx` pode importar direto.
- Se a página é estática (`/privacy`, `/terms`): mantenha em `app/(public)/.../page.tsx`.

## Pontos de atenção

- Nunca importe de `app/` para dentro de `page-components/` (one-way: `app/` consome `page-components/`).
- Page components ficam orquestradores: lógica de domínio fica em `features/` e `services/`.
