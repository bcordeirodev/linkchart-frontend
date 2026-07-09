# Empty state unificado das sub-tabs de analytics

**Data:** 2026-07-09
**Escopo:** Frontend (`frontend-next`) — todas as tabs de analytics (Audience, Temporal, Insights, Geographic, Dashboard)

## Problema

As sub-tabs de analytics renderizam estados vazios de forma inconsistente quando não há
dados suficientes para o gráfico/card daquela visão. Coexistem hoje pelo menos três
tratamentos diferentes:

1. **`<Alert severity="info">` pequeno e ancorado no topo.** Como o painel das sub-tabs
   (`AnalyticsSubTabs`) **não define `min-height`**, o painel inteiro colapsa num
   quadradinho logo abaixo do segmented control — enquanto as tabs com gráfico têm
   400–520px. O resultado é um desalinhamento visível ao trocar de sub-tab.
   Ocorrências: `AudienceChart` (7×), cards de Audience (Quality, Platform, Language,
   Connection, Behavior, FetchDest), `TemporalDistributionTab`, `TemporalTimelineTab`,
   `TemporalPerformanceTab`, `DailyTimelineChart`, `BusinessInsights`.

2. **`<Typography variant="h6">` centralizado solto** — título + subtítulo sem container
   padronizado. Ocorrências: `TimezoneDistributionChart`, `TemporalTrendsChart`,
   `TrafficSourceChart`, `SessionDepthChart`, `RetentionAnalysisChart`.

3. **O componente `EmptyState`** (`shared/ui/base/EmptyState.tsx`), que é o tratamento
   "correto" (ícone + título + descrição, centralizado), existe mas é usado **uma única
   vez** (em `LinkDashboard`).

Ou seja: já existe um `EmptyState` bem-feito e um `AnalyticsStateManager` para o estado
top-level, mas as sub-tabs não os usam — caem em `Alert`s pequenos que quebram o layout.

## Decisões de escopo

- **Escopo:** todas as tabs de analytics.
- **Tratamento:** um empty state **visual único e consistente**. Sem lógica
  "poucos dados vs zero dados", sem CTAs. A mensagem de cada domínio (que já existe em
  i18n) é preservada — apenas o **container visual** é unificado.

## Solução

### 1. Componente `AnalyticsEmptyState`

Criar um wrapper pré-configurado em `src/shared/ui/base/AnalyticsEmptyState.tsx` que
encapsula o `EmptyState` existente com as escolhas visuais fixas das sub-tabs. Centralizar
num wrapper (em vez de repetir props em cada call site) garante que todas as sub-tabs
fiquem idênticas e não voltem a divergir.

Características:

- **Ícone lucide neutro e muted** (padrão: `Inbox`), ~40px, opacidade baixa — alinhado ao
  redesign calmo de analytics. Nada de emoji (`📭`), que destoa do restante das tabs.
  O ícone é sobrescrevível via prop para casos que peçam um símbolo mais específico.
- **Centralizado** vertical + horizontal.
- **`minHeight ≈ 320px` por padrão**, configurável via prop `minHeight` para tabs que
  precisem acompanhar a altura do gráfico vizinho. Preenche o painel de forma intencional —
  nem o Alert minúsculo, nem um vazio gigante de 520px.
- **Título obrigatório + descrição opcional**, ambos recebidos por prop (vêm das chaves
  i18n já existentes de cada domínio).
- **Theme-aware** (herdado do MUI) e **fade-in suave**, reaproveitando o padrão de
  animação já usado em `AnalyticsStateManager` (`createPresetAnimations(theme).fadeIn`).

Interface proposta:

```ts
interface AnalyticsEmptyStateProps {
  /** Título centralizado (já traduzido). Obrigatório. */
  title: string;
  /** Texto de apoio opcional abaixo do título (já traduzido). */
  description?: string;
  /** Override do ícone. Default: <Inbox /> muted. */
  icon?: React.ReactNode;
  /** Altura mínima do bloco em px. Default 320. */
  minHeight?: number;
  /** Densidade compacta para cards menores (reduz min-height e ícone). */
  compact?: boolean;
}
```

Nota de implementação: o `EmptyState` atual já aceita `icon?: string | React.ReactNode` e
`height`, então `AnalyticsEmptyState` pode delegar a ele. Se durante a implementação ficar
mais limpo montar o bloco direto (Box centralizado) em vez de passar por `EmptyState`,
tudo bem — o contrato público é o `AnalyticsEmptyState` acima. A decisão fica para o plano.

### 2. Substituições nos call sites

Trocar, em **todas as tabs**, os dois padrões inconsistentes pelo `AnalyticsEmptyState`,
**preservando as chaves i18n já existentes** de cada mensagem:

**Padrão 1 — `<Alert severity="info">`:**

- `AudienceChart.tsx` — 7 blocos (`audience.noData`)
- `audience/QualitySection.tsx`, `PlatformBreakdownCard.tsx`, `LanguageBreakdownCard.tsx`,
  `ConnectionTypeCard.tsx`, `BehaviorSection.tsx`, `FetchDestChart.tsx`
- `temporal/tabs/TemporalDistributionTab.tsx`, `TemporalTimelineTab.tsx`,
  `TemporalPerformanceTab.tsx` (`temporal.chart.noData`)
- `temporal/DailyTimelineChart.tsx`
- `insights/BusinessInsights.tsx`
- `dashboard/cards/SocialAppCard.tsx`

**Padrão 2 — `<Typography h6>` solto:**

- `temporal/TimezoneDistributionChart.tsx` (`temporal.timezone.noData` + `noDataSub`)
- `temporal/TemporalTrendsChart.tsx` (`temporal.trends.noData` + `noDataSub`)
- `insights/TrafficSourceChart.tsx` (`insights.traffic.noData`)
- `insights/SessionDepthChart.tsx` (`insights.session.noData`)
- `insights/RetentionAnalysisChart.tsx` (`insights.retention.noData`)

Cada call site passa `title` (e `description` quando houver a chave `...Sub`/`...Desc`
correspondente). Cards menores (ex.: os cards de meia largura de Audience) usam
`compact`/`minHeight` menor quando a altura de 320px destoar do card.

## Ajustes de CSS oportunistas

Enquanto os arquivos das sub-tabs são tocados, corrigir **pequenos problemas de CSS/layout
encontrados no caminho** (espaçamentos inconsistentes, alinhamentos quebrados, `mt/mb`
duplicados, larguras que estouram o grid, etc.). Regra: apenas em arquivos já sendo
editados por este trabalho e apenas correções pontuais e óbvias — **sem refactor de layout
não relacionado**. Cada ajuste é registrado no plano/commit para revisão.

## Fora de escopo (YAGNI)

- **Lógica "poucos dados vs zero dados"** — mensagem visual única.
- **CTAs / botões de ação** no empty state.
- **`noData` interno do ApexCharts** — quando o gráfico renderiza mas a série está vazia,
  o texto vem do próprio Apex (`chartFormatters.ts`). É outro caminho de render, fora de
  escopo.
- **Empty state top-level do `AnalyticsStateManager`** (tab inteira sem dados) — já
  funciona. Alinhamento visual opcional ao novo componente pode ser um follow-up, não faz
  parte deste spec.

## Documentação obrigatória

- **TSDoc** em `AnalyticsEmptyState` e em qualquer helper novo (regra do projeto:
  todo componente/função no `frontend-next/` tem bloco `/** ... */`).

## Verificação

Sem suíte de testes no frontend. Gate:

- `npm run quality` (type-check + lint + format:check) passa.
- Verificação visual no browser: abrir uma sub-tab sem dados em Audience e Temporal e
  confirmar que o bloco centralizado preenche o painel com altura consistente (sem
  quadradinho colado no topo, sem vazio exagerado) em light e dark.
```
