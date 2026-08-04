# `shared`

## Propósito

Componentes, hooks e layouts que **cruzam features**. Se um componente é usado em > 1 feature, ele vive aqui. Se é usado em uma só feature, ele vive em `features/<nome>/components/`.

## Subpastas

### `shared/ui/`

Componentes visuais reutilizáveis, organizados por papel:

- `base/` — primitivas estendendo MUI (`EnhancedPaper`, `EmptyState`, `AnalyticsEmptyState`, `GradientButton`, `ResponsiveContainer`, `AppLogo`, `AnalyticsStateManager`, `PageSectionHeading`, `SectionLabel`, `OverviewMetricRow`, `cardSurface.ts`/`getCardSurfaceSx`).
- `data-display/` — `DataTable` (material-react-table), `DataTableTopToolbar`, `ApexChartWrapper`, `ChartCard`. **Usar o ApexChartWrapper, não importar `react-apexcharts` diretamente.**
- `feedback/` — `Loading`, `Message`, `EmailVerificationBanner`, `skeletons/*`.
- `icons/` — wrappers de `lucide-react` (`AppIcon`, `AppIcons`) e `SvgIcon` para SVG arbitrário.
- `navigation/` — `Link` (wrap de `next/link`), `PageBreadcrumb`.
- `patterns/` — agrupadores reutilizáveis: `FormActions`, `TableActions`.

### `shared/components/`

Componentes que não são "UI primitive" mas têm escopo cross-feature:

- `CookieConsentInit.tsx` — inicializa o banner de consent.
- `ads/AdSlot.tsx` — slot de anúncio (consome `lib/ads`).
- `cta/SignUpCtaCard.tsx` — CTA reutilizado por public-analytics e shorter.
- `routing/HomeRedirect.tsx` — usado em `app/page.tsx` (root) para decidir destino baseado em auth.

### `shared/hooks/`

Hooks de browser/Next:

- `useClipboard` — copy + flag `copied`.
- `useDebounce` — debounce simples.
- `useLocation`, `useNavigate`, `usePathname`, `useSearchParams` — wrappers `next/navigation`.
- `useThemeMediaQuery` — wrapper de `useMediaQuery` com tokens de breakpoint.
- `types.ts` — tipos compartilhados de hook state (`UseAsyncState`, etc.). Renomeado a partir do antigo `hooks.ts` em R-LOW-1 para deixar claro que o arquivo só contém tipos.

### `shared/layout/`

- `MainLayout`, `AuthLayout`, `PublicLayout`, `ErrorLayout` — layouts por grupo de rotas.
- `BenefitsSection`, `HeroSection`, `LoadingWithRedirect` — blocos compartilhados de página.
- `components/Navbar`, `components/Footer` — chrome global do `MainLayout`.
- `core/` — engine de layout settings (`LayoutProvider`, `LayoutSettingsContext`, `useLayoutSettings`, `Layout.tsx`, `types.ts`, `settingsConfig.ts` — este último movido para cá em R-MED-6, antes ficava solto em `lib/`).

## Quando colocar algo em `shared/`

Sim, colocar aqui se:

- Mais de uma feature usa.
- É genuinamente genérico (sem conhecimento de domínio).

Não colocar aqui se:

- É específico de uma feature (mesmo que pareça reutilizável "no futuro" — YAGNI).
- É um helper de uma página única (pertence a `page-components/`).

## Pontos de atenção

- Os arquivos `base/ChartCard.tsx` e `data-display/ChartCard.tsx` têm o mesmo nome — confirmar com a audit § 7 antes de qualquer consolidação.
- `hooks/types.ts` (antes `hooks.ts`) só deve conter tipos. Hooks executáveis ficam em arquivos próprios `useFoo.ts`.
- `layout/core/settingsConfig.ts` é o config central de layout. Não duplicar tokens em outros lugares — importar daqui.
