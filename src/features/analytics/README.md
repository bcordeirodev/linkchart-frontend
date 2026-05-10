# `analytics`

## Propósito

Painel analítico completo de um link encurtado autenticado. Cobre dashboard, distribuição geográfica, séries temporais, segmentação de audiência e insights de negócio. Cada sub-módulo desenha sua própria aba do dashboard de link individual e/ou do dashboard agregado.

## Domínio espelhado no backend

- `Http/Controllers/Analytics/AnalyticsController` — endpoints `/api/analytics/...`.
- `Services/Analytics/LinkAnalyticsOrchestrator` (fan-out) e seus serviços por domínio: `DashboardAnalyticsService`, `GeographicAnalyticsService`, `TemporalAnalyticsService`, `AudienceAnalyticsService`, `InsightsAnalyticsService`.

## Componentes principais

### `components/dashboard/`

- `LinkDashboard.tsx` — composição superior do dashboard de link individual.
- `cards/LinkInfoCard.tsx` — bloco hero com URL, slug e meta.
- `cards/TimeframeSelector.tsx` — switch de janela temporal.
- `cards/TrafficQualityCard.tsx` — card de qualidade de tráfego.
- `cards/ViralityCard.tsx` — card de viralização (compartilhamentos / impressões).
- `charts/DayOfWeekChart.tsx` — distribuição por dia da semana.
- `charts/DeviceBreakdownChart.tsx` — proporção de dispositivos.
- `charts/HourlyClicksChart.tsx` — cliques por hora do dia.
- `charts/TopCountriesChart.tsx` — top N países.

### `components/geographic/`

- `GeographicAnalysis.tsx` — orquestra a aba geográfica.
- `GeographicChoropleth.tsx` — mapa coroplético mundial.
- `RealTimeHeatmapChart.tsx` — heatmap por densidade.
- `HeatmapMap.tsx`, `HeatmapControls.tsx` — Leaflet.
- `ContinentBreakdown.tsx`, `CountryDistributionChart.tsx`, `GeographicMetrics.tsx`, `GeographicInsights.tsx`.

### `components/temporal/`

- `TemporalAnalysis.tsx` — orquestra a aba temporal.
- `DailyTimelineChart.tsx`, `TemporalTrendsChart.tsx`, `HourDayHeatmapChart.tsx`.
- `SeasonalDistributionChart.tsx`, `TimezoneDistributionChart.tsx`, `DeviceByPeriodChart.tsx`.
- `HolidayImpactCard.tsx`, `PeakAnalysisCard.tsx`, `TemporalInsights.tsx`.

### `components/audience/`

- `AudienceAnalysis.tsx` — orquestra a aba audiência.
- `AudienceChart.tsx`, `LanguageBreakdownChart.tsx`.
- `AudienceMetrics.tsx`, `AudienceInsights.tsx`.
- `BehaviorSection.tsx`, `QualitySection.tsx`.

### `components/insights/`

- `InsightsAnalysis.tsx` — orquestra a aba insights.
- `BusinessInsights.tsx`, `RetentionAnalysisChart.tsx`, `SessionDepthChart.tsx`.
- `TrafficQualityChart.tsx`, `TrafficSourceChart.tsx`.

## Hooks de dados

Todos os hooks abaixo já usam `API_CONFIG.ENDPOINTS.ANALYTICS_*` (não há mais strings inline para esses paths — ver R-MED-3 da audit) e a factory `queryKeys.analytics.*`.

| Hook                                  | Type                           | Cache key                                  | Endpoint constant                               |
| ------------------------------------- | ------------------------------ | ------------------------------------------ | ----------------------------------------------- |
| `useDashboardData(linkId, timeframe)` | `useState`/`useEffect` (no RQ) | keyless (não entra no cache compartilhado) | `API_CONFIG.ENDPOINTS.ANALYTICS_DASHBOARD(id)`  |
| `useGeographicData(linkId)`           | `useQuery`                     | `queryKeys.analytics.geographic(id)`       | `API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(id)` |
| `useTemporalData(linkId)`             | `useQuery`                     | `queryKeys.analytics.temporal(id)`         | `API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL(id)`   |
| `useAudienceData(linkId)`             | `useQuery`                     | `queryKeys.analytics.audience(id)`         | `API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE(id)`   |
| `useInsightsData(linkId)`             | `useQuery`                     | `queryKeys.analytics.insights(id)`         | `API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(id)`   |

> `useDashboardData` é o único hook do feature que ainda não migrou para TanStack Query — mantém `useState` + `AbortController` para deduplicar requests e suportar polling. Não há entrada em `lib/query/keys.ts` para ele; se for migrado, adicionar a chave canônica antes.

## Rotas que consomem

- `app/(app)/analytics/page.tsx` — visão multi-link.
- `app/(app)/links/analytics/[id]/page.tsx` — dashboard de link individual.

## Pontos de atenção

- Charts usam ApexCharts via `shared/ui/data-display/ApexChartWrapper.tsx`. **Não importar `react-apexcharts` diretamente** — o wrapper trata SSR (`dynamic({ ssr: false })`).
- Mapas usam Leaflet (`react-leaflet`) e dependem de CSS no `app/layout.tsx`. Mudanças em `RealTimeHeatmapChart` exigem teste manual em modo escuro/claro.
- O endpoint `/api/analytics/link/{id}/heatmap` foi removido — não tentar reabri-lo.
- Schema dos dados vem do backend; tipos vivem em `src/types/analytics/`. Mudanças no schema do `clicks` no backend requerem atualizar tanto este feature quanto `public-analytics`.
- `utils/dataMappers.ts` adapta o payload do backend para o shape esperado pelos charts. Não duplicar essa lógica nos componentes.
