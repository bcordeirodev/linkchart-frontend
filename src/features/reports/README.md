# `reports`

## Propósito

Relatórios agregados **multi-link** do usuário autenticado (página `/reports`): KPIs do período com variação vs. período anterior, série temporal diária, ranking de links, distribuição por dimensão (país, device, browser, etc.), insights de portfólio e export CSV dos cliques. Irmã da feature `analytics` (que é **por link**) — aqui toda query soma sobre todos os links próprios (non-demo) do usuário.

## Domínio espelhado no backend

- `Http/Controllers/.../ReportsController` — endpoints `/api/reports/*`.
- `Contracts/Analytics/ReportsAnalyticsServiceInterface` — os tipos em `types/index.ts` espelham esse contrato 1:1.

## Componentes principais

- `ReportsOverviewHero.tsx` — hero da página: um único card fundindo o strip de KPIs (`OverviewMetricRow`: total de cliques com tendência colorida na caption, visitantes únicos, links ativos, média/dia) com o gráfico de tendência diária (janela ativa em área sólida, janela anterior tracejada, toggle cliques/visitantes).
- `ReportsDateFilter.tsx` — filtro de período: presets 7/30/90 dias + "custom" com dois inputs de data nativos.
- `LinkPerformanceTable.tsx` — leaderboard de portfólio: cada link com variação vs. o período anterior de mesma duração e share do tráfego total. Único ranking de links da página — o antigo `TopLinksTable.tsx` (clicks + unique visitors, sem variação/share) foi removido em 15/07/2026 (`72762621`, "consolida ranking de links"), mas ficou como código morto até a reskin de 2026-08-03 (Task 10) apagar o componente, o hook `useTopLinks`, o tipo `TopLinkRow`, o endpoint `REPORTS.TOP_LINKS`/`queryKeys.reports.topLinks` e as chaves i18n exclusivas — zero consumidor real desde aquele commit.
- `LinkSparkline.tsx` — sparkline SVG puro (um `<polyline>`) para as linhas do leaderboard — sem ApexCharts de propósito (dez instâncias Apex numa tabela custam caro demais).
- `BreakdownBars.tsx` — barras horizontais ranqueadas da distribuição de cliques por uma dimensão selecionável (substituiu o donut anterior).
- `InsightsPanel.tsx` — cards de insight de portfólio: melhor link, link em crescimento mais rápido, concentração top-3, crescimento geral da conta.

Utils: `resolveReportsPeriod.ts` (preset → par `dateFrom`/`dateTo`; range custom incompleto cai no default de 30 dias para nunca disparar query sem limite), `variationPillStyles.ts` (estilo compartilhado das pílulas de variação).

## Hooks de dados

Todos em `hooks/useReports.ts`, `useQuery` com `staleTime` de 60s (espelha o TTL do `Cache::remember` do backend) e chaves canônicas de `queryKeys.reports.*`:

| Hook                                 | Cache key                                     | Endpoint constant / path                                                |
| ------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------- |
| `useReportsSummary(filters)`         | `queryKeys.reports.summary(f)`                | `API_CONFIG.ENDPOINTS.REPORTS.SUMMARY` (`GET /api/reports/summary`)     |
| `useReportsTimeseries(filters)`      | `queryKeys.reports.timeseries(f)`             | `REPORTS.TIMESERIES` (`GET /api/reports/timeseries`)                    |
| `useBreakdown(dimension, filters)`   | `queryKeys.reports.breakdown(dim, f)`         | `REPORTS.BREAKDOWN` (`GET /api/reports/breakdown?dimension=`)           |
| `useLinkPerformance(filters, limit)` | `queryKeys.reports.linkPerformance(f, limit)` | `REPORTS.LINK_PERFORMANCE` (`GET /api/reports/link-performance?limit=`) |
| `useReportsInsights(filters)`        | `queryKeys.reports.insights(f)`               | `REPORTS.INSIGHTS` (`GET /api/reports/insights`)                        |

O export CSV não passa por hook: `ReportsPage` chama `reportsService` direto (`REPORTS.EXPORT_CLICKS`, `GET /api/reports/export/clicks`) com estado `exporting` local e toast de erro via `useMessage()`.

## Rotas que consomem

- `app/(app)/reports/page.tsx` → `src/page-components/reports/ReportsPage.tsx` — única rota; monta filtro, hero, tabelas, breakdown e o botão de export.

## Pontos de atenção

- `ReportsFilters` (período + exclude-bots) é o shape compartilhado por **todos** os endpoints — mais estreito que `AnalyticsQueryFilters` (reports não têm `segment`/`continent`). Mudou filtro → mudam todas as chaves `queryKeys.reports.*`.
- `limit` default é 10 e o backend capa em 50 (`top-links` e `link-performance`).
- Os tipos em `types/index.ts` são unwrap direto do envelope `{data: ...}` pelo `ApiClient`; qualquer mudança no contrato do backend precisa refletir aqui.
- Comparações "vs. período anterior" usam sempre a janela imediatamente anterior de mesma duração — não misturar com outras semânticas de comparação.
