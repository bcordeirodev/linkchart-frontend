# `services`

## Propósito

Camada HTTP. Cada `*.service.ts` é uma classe extends `BaseService` que encapsula chamadas REST a um domínio do backend. Todo componente/hook consome services — nunca chama `fetch` direto.

## Domínio espelhado no backend

| Service                  | Backend                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `auth.service.ts`        | `Http/Controllers/Auth/AuthController`                            |
| `link.service.ts`        | `Http/Controllers/Links/LinkController`                           |
| `link-meta.service.ts`   | `Http/Controllers/Links/LinkController` (action `batchMeta`)      |
| `link-public.service.ts` | `Http/Controllers/Links/PublicLinkController` + analytics público |
| `profile.service.ts`     | `Http/Controllers/Auth/AuthController` (`@profile`)               |

## Public methods (resumo)

- `BaseService` (abstrato) — `get`, `post`, `put`, `delete`. Recebe um `ApiClient`.
- `AuthService` — `signIn`, `signUp`, `signOut`, `getMe`, `updateProfile`, `verifyEmail`, `forgotPassword`, `resetPassword`, `getEmailVerificationStatus`, `resendVerificationEmail`, `changePassword`.
- `LinkService` — `save`, `update`, `all`, `findOne`, `remove`, `getAnalytics`, `getClicksList`.
- `LinkMetaService` — `batchMeta`.
- `PublicLinkService` — `createPublicLink`, `getLinkBySlug`, `getPublicAnalytics`, `validateUrl`, `formatUrl`, `getPublicAnalyticsUrl`, `copyToClipboard`.
- `ProfileService` — `getCurrentUser`, `updateProfile`.

Singletons exportados pelo barrel `index.ts`: `authService`, `linkService`, `profileService`. `LinkMetaService` e `PublicLinkService` são instanciados por seus próprios módulos (`linkMetaService`, `publicLinkService`) — importar direto do arquivo do service. Não existe `AnalyticsService`: os hooks de `features/analytics/` chamam `api.get()` direto (`src/lib/api/client.ts`).

## Convenções

- **Sempre** estender `BaseService`.
- **Sempre** importar paths de `lib/api/endpoints.ts` (`API_CONFIG.ENDPOINTS`). Não inline strings.
- **Sempre** retornar tipos importados de `src/types/core/` ou `src/types/analytics/`.
- **Sempre** unwrap envelope via `ApiClient` (já feito automaticamente nos métodos do `BaseService`).

## Pontos de atenção

- Não criar uma instância nova; use o singleton exportado pelo `index.ts`.
- Ao adicionar um endpoint novo: adicione **primeiro** a constante em `lib/api/endpoints.ts`, depois o método no service.
- Erros do backend chegam normalizados (`{error: {code, message, details?}}`); deixe o componente decidir o tratamento (não jogue Notistack daqui).
