# `analytics`

## Propósito

Painel analítico completo de um link encurtado autenticado. Cobre dashboard, distribuição geográfica, séries temporais, segmentação de audiência e insights de negócio. Cada sub-módulo desenha sua própria aba do dashboard de link individual e/ou do dashboard agregado.

## Domínio espelhado no backend

- `Http/Controllers/Analytics/AnalyticsController` — endpoints `/api/analytics/...`.
- `Services/Analytics/LinkAnalyticsOrchestrator` (fan-out) e seus serviços por domínio: `DashboardAnalyticsService`, `GeographicAnalyticsService`, `TemporalAnalyticsService`, `AudienceAnalyticsService`, `InsightsAnalyticsService`.

## Componentes principais

A página tem **6 abas** e **9 sub-tabs**. Uma sub-tab só existe para separar
_perguntas diferentes_ — não níveis de zoom da mesma pergunta.

| Aba     | Sub-tabs                                            |
| ------- | --------------------------------------------------- |
| Resumo  | —                                                   |
| Origem  | Canais e redes · Campanhas · Detalhes técnicos      |
| Lugares | — (toggle Mapa/Lista/Calor dentro do card)          |
| Público | Perfil · Qualidade e fidelidade · Detalhes técnicos |
| Momento | Padrões · Linha do tempo · Picos e tendências       |
| Cliques | —                                                   |

### `components/dashboard/` (aba Resumo)

- `LinkDashboard.tsx` — composição superior do dashboard de link individual.
- `BusinessInsights.tsx` — o bloco "O que isso quer dizer", logo abaixo dos KPIs.
  Os textos vêm do backend como **chaves i18n** (`title_key`), resolvidas em runtime —
  por isso `insights.generators.*` parece órfão num grep e **não é**.
- `cards/UtmSourceCard.tsx`, `cards/SocialAppCard.tsx` — renderizados **só** pela aba
  Origem (sub-tab Campanhas). O dashboard não os duplica mais.
- `charts/DayOfWeekChart.tsx`, `charts/DeviceBreakdownChart.tsx`,
  `charts/HourlyClicksChart.tsx`, `charts/TopCountriesChart.tsx`.

### `components/origin/` (aba Origem)

- `OriginAnalysis.tsx` — orquestra a aba.
- `ChannelsBreakdown.tsx` — única representação da divisão por canal.
- `ChannelEngagementChart.tsx` — engajamento por canal (Detalhes técnicos).

### `components/geographic/` (aba Lugares)

- `GeographicAnalysis.tsx` — orquestra a aba. **Sem sub-tabs.**
- `GeographicMapAndList.tsx` — um card, três modos: Mapa / Lista / Calor.
- `GeographicChoropleth.tsx`, `GeographicChart.tsx`, `RealTimeHeatmapChart.tsx` —
  os três modos. O heatmap só monta quando ativo (Leaflet é caro) e aceita `bare`
  para renderizar sem moldura de card própria.
- `ContinentBreakdown.tsx`, `GeographicInsights.tsx`, `GeographicFilterBar.tsx`.

### `components/temporal/` (aba Momento)

- `TemporalAnalysis.tsx` / `TemporalChart.tsx` — orquestram a aba.
- `tabs/TemporalPatternsTab.tsx`, `tabs/TemporalTimelineTab.tsx`,
  `tabs/TemporalPeaksTab.tsx` — as 3 sub-tabs.
- `DailyTimelineChart.tsx`, `TemporalTrendsChart.tsx`, `HourDayHeatmapChart.tsx`,
  `TimezoneDistributionChart.tsx`, `DeviceByPeriodChart.tsx`,
  `HolidayImpactCard.tsx`, `PeakAnalysisCard.tsx`, `ClickVelocityChart.tsx`.

### `components/audience/` (aba Público)

- `AudienceAnalysis.tsx` / `AudienceChart.tsx` — orquestram a aba.
- `HorizontalBreakdownBars.tsx` — o mark padrão de distribuição categórica:
  é gráfico e lista ao mesmo tempo, e não sofre em 360px como donut/pizza.
- `tabs/` — os blocos de Perfil e de Detalhes técnicos.
- `QualitySection.tsx`, `RetentionAnalysisChart.tsx`, `SessionDepthChart.tsx`.
- `LanguageBreakdownCard.tsx` — idioma **com região** (pt-BR × pt-PT). Não é
  duplicata do idioma em Perfil, que agrega por família (`aggregateFamily.ts`).

### `components/insights/`

- `TrafficQualityChart.tsx`, `insightsLayout.ts` — resquícios da aba Insights,
  que foi dissolvida: os insights subiram para o Resumo e as fontes de tráfego
  viraram a aba Origem.

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
