# `lib`

## Propósito

Camada infraestrutural — tudo que não é "feature de domínio" nem "componente compartilhado de UI". Configuração, providers, autenticação, estado, theming, i18n, integrações. Após a fase 2 da reorganização, **`lib/` não tem mais arquivos soltos no root** — tudo vive em uma subpasta nominal.

## Subpastas

### `lib/api/`

HTTP client (`ApiClient`) e catálogo de endpoints (`endpoints.ts`). É a única camada que conhece detalhes de transporte (token, envelope, rewrites). Endpoints são acessados via `API_CONFIG.ENDPOINTS.*` — nunca inline strings.

### `lib/query/`

TanStack Query: `client.ts` (factory + defaults) e `keys.ts` (factory canônica de chaves de cache). Sempre importar chaves daqui — nunca inline.

### `lib/store/`

Redux Toolkit. Hoje contém `messageSlice` (notificações globais), middleware, root reducer e o store. Hooks tipados em `hooks.ts` (`useAppDispatch`, `useAppSelector`). Estado de servidor não vive aqui — fica em React Query.

### `lib/auth/`

- `AuthContext.tsx` — `AuthProvider` + `useAuth`.
- `AuthGuardRedirect.tsx` — guarda de redirecionamento (consumido pelos layouts).
- `useUser.tsx` — wrapper conveniente (`data`, `isGuest`, `signOut`, etc.).
- `components/EmailVerificationGuard.tsx` — guarda do grupo `(app)`. **ZONA CRÍTICA.** Não migrar para `middleware.ts`.
- `forms/` — formulários de auth genéricos compartilhados (`AuthJsForm`, `authFieldStyles`, `signinErrors`).
- Helpers: `authApi.ts`, `authRoles.ts`, `sessionRedirectUrl.ts`.

### `lib/i18n/`

i18next + react-i18next. Idiomas: `en`, `pt-BR`. Locales por feature em `locales/{en,pt-BR}/{analytics,auth,common,links,profile,public}.json`. **Nunca hardcode strings de UI** — sempre `t('namespace.key')`.

### `lib/theme/`

MUI 6 theme com design system custom. Tokens, paletas (light/dark), tipografia, breakpoints, hooks (`useResponsive`, `useChartHeight`), utils (`gradientUtils`, `chartColorUtils`). `MainThemeProvider` é o entry point.

### `lib/utils/`

Utilitários genéricos: `ErrorBoundary`, `authUtils`, `shortUrl`. Função genérica nova vai aqui só se for **realmente** genérica — caso contrário, próximo da feature.

### `lib/providers/`

- `Providers.tsx` — composição única dos providers (Query, Redux, Auth, Theme, i18n, Snackbar). Importado pelo root layout.
- `AppContext.ts` — contexto de aplicação compartilhado (movido para cá em R-MED-6 — antes ficava solto em `lib/`).

### `lib/seo/`

`structuredData.ts` — helpers de JSON-LD para metadata de páginas.

### `lib/ads/`

Componentes e config de Google Ads. Slot config em `config/adsConfig.ts`, hook em `hooks/useGoogleAds.ts`.

### `lib/consent/`

Cookie consent (vanilla-cookieconsent embarcado). `cookieconsent.esm.js` é vendored e excluído do ESLint.

## Pontos de atenção

- Ordem de providers em `Providers.tsx` importa: Query → Redux → Auth → Theme → i18n → Snackbar. Não reordenar sem entender consequências.
- `i18n` é inicializado via `useEffect` no provider (cliente). Strings server-rendered usam o idioma padrão.
- Theme: dark/light mode é orquestrado pelo `MainThemeProvider`. Não criar themes paralelos.
- Não criar arquivos novos no root de `lib/` — toda nova adição precisa caber em uma subpasta nominal (criar uma se necessário, com nome explícito).
