# `profile`

## Propósito

Edição de perfil do usuário autenticado: dados básicos, alteração de senha e preferências. Página única em `/profile`.

## Domínio espelhado no backend

- `Http/Controllers/Auth/AuthController@profile / @updateProfile / @changePassword` — endpoints `/api/profile`, `/api/me`, `/api/change-password`.

## Componentes principais

- `components/ProfileForm.tsx` — formulário de dados básicos (nome, email).
- `components/PasswordChangeForm.tsx` — alteração de senha com confirmação.
- `components/ProfileSidebar.tsx` — menu lateral com seções.
- `components/Profile.styled.tsx` — Emotion styles compartilhados pela página.

## Hooks de dados

A feature **não** expõe hooks próprios; consome `ProfileService` e `AuthService` via TanStack Query no `page-components/user/ProfilePage.tsx`. Verifique o page component para chaves de cache exatas.

| Operação         | Type                                        | Endpoint constant                                                         |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| Obter usuário    | `getMe()` (já carregado pelo `AuthContext`) | `API_CONFIG.ENDPOINTS.AUTH.ME` (`GET /api/me`)                            |
| Atualizar perfil | `useMutation` no `ProfilePage`              | `API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE` (`PUT /api/profile`)           |
| Alterar senha    | `useMutation` no `ProfilePage`              | `API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD` (`POST /api/change-password`) |

## Rotas que consomem

- `app/(app)/profile/page.tsx`

## Pontos de atenção

- Os tipos de usuário foram consolidados em `types/index.ts` (login/register API shapes, `UserProfile`, `UserPreferences`, `UserSession`, `UserActivity`, e o factory `UserModel`). Não recriar arquivos separados — a duplicação histórica foi resolvida.
- Após alterar email, o backend dispara fluxo de verificação — a UI precisa refletir o estado intermediário "pending verification".
- Sem hook compartilhado próprio: se outro lugar precisar do mesmo carregamento de perfil, refatorar para `hooks/useProfile.ts` antes (não criar duplicata).
