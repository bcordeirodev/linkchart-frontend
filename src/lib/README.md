# `lib`

## Propósito

Camada infraestrutural — tudo que não é "feature de domínio" nem "componente compartilhado de UI". Configuração, providers, autenticação, estado, theming, i18n, integrações. Após a fase 2 da reorganização, **`lib/` não tem mais arquivos soltos no root** — tudo vive em uma subpasta nominal.

## Subpastas

### `lib/api/`

HTTP client (`ApiClient`) e catálogo de endpoints (`endpoints.ts`). É a única camada que conhece detalhes de transporte (token, envelope, rewrites). Endpoints são acessados via `API_CONFIG.ENDPOINTS.*` — nunca inline strings.

### `lib/query/`

TanStack Query: `client.ts` (factory + defaults) e `keys.ts` (factory canônica de chaves de cache). Sempre importar chaves daqui — nunca inline.

### `lib/auth/`

- `AuthContext.tsx` — `AuthProvider` + `useAuth`. **ZONA CRÍTICA.**
- `AuthGuardRedirect.tsx` — guarda de redirecionamento (consumido pelos layouts/page-components — auth no layout, não no middleware; ver ADR 0006).
- `useUser.tsx` — wrapper conveniente (`data`, `isGuest`, `signOut`, etc.).
- Helpers: `authRoles.ts`, `sessionRedirectUrl.ts`.
- `lib/auth0.ts` (arquivo irmão) — cliente Auth0 usado pelo `middleware.ts`.

### `lib/i18n/`

i18next + react-i18next. Idiomas: `en`, `pt-BR`. Locales por feature em `locales/{en,pt-BR}/{analytics,auth,common,links,profile,public}.json`. **Nunca hardcode strings de UI** — sempre `t('namespace.key')`.

### `lib/theme/`

MUI 6 theme com design system custom. Tokens, paletas (light/dark), tipografia, breakpoints, hooks (`useResponsive`, `useChartHeight`), utils (`gradientUtils`, `chartColorUtils`). `MainThemeProvider` é o entry point.

### `lib/utils/`

Utilitários genéricos: `ErrorBoundary`, `authUtils`, `shortUrl`. Função genérica nova vai aqui só se for **realmente** genérica — caso contrário, próximo da feature.

### `lib/providers/`

- `Providers.tsx` — composição única dos providers. Importado pelo root layout. Ordem atual (de fora para dentro): `Auth0Provider` → `QueryClientProvider` → `AppContext.Provider` → `LocalizationProvider` (date-fns) → `AuthProvider` → `LayoutProvider` → `MainThemeProvider` → `MessageProvider` (+ `<Message />`) → `LazyMotion`.
- `MessageProvider.tsx` — provider de notificações globais (toast) baseado em `useReducer` + Context; hook `useMessage()` expõe `showMessage`/`hideMessage`. Substituiu o antigo `messageSlice` do Redux Toolkit (removido — ver ADR 0008 e `.superpowers/sdd/redux-removal-report.md`).
- `AppContext.ts` — contexto de aplicação compartilhado (movido para cá em R-MED-6 — antes ficava solto em `lib/`).

### `lib/seo/`

`structuredData.ts` — helpers de JSON-LD para metadata de páginas.

### `lib/telemetry/`

`adConversions.ts` — disparo de conversões do Google Ads (`gtag`).

### `lib/consent/`

Cookie consent (vanilla-cookieconsent embarcado). `cookieconsent.esm.js` é vendored e excluído do ESLint.

## Pontos de atenção

- Ordem de providers em `Providers.tsx` importa: Auth0 → Query → AppContext → Localization → Auth → Layout → Theme → Message. Não reordenar sem entender consequências (ex.: `MessageProvider`/`<Message />` precisam estar dentro do theme).
- `i18n` é inicializado sincronamente no primeiro render de `Providers.tsx` (`initI18n(initialLang)` com ref guard); `detectAndApplyLanguage()` roda em `useEffect`.
- Theme: dark/light mode é orquestrado pelo `MainThemeProvider`. Não criar themes paralelos.
- Não criar arquivos novos no root de `lib/` — toda nova adição precisa caber em uma subpasta nominal (criar uma se necessário, com nome explícito).
