# SP2 — Design System Redesign (dark-first, business tone)

**Data:** 2026-04-24
**Status:** Proposta — aguardando revisão
**Sub-projeto:** 2 de 3 (decomposição do pedido original de melhorias no frontend)
**Depende de:** —
**Bloqueia:** SP1 (Navegação + Dashboard Agregado), SP3 (Higiene de código)

## 1. Contexto

O frontend do Link Chart (React 18 + Vite + MUI 6 + Tailwind 4) tem **um design system parcial** em `src/lib/theme/` (`designSystem.ts`, `colors/`, `config/muiComponents.ts`, utilitários para spacing/shadow/glass/animation/gradient/responsive) e **configuração defensiva de Tailwind** (`important: true`, `preflight: false`) protegendo uma adoção que nunca aconteceu: 110 arquivos usam `sx` do MUI, 0 arquivos usam classes Tailwind de forma sistemática (só uso esporádico em `features/redirect/`).

Decorrência: duas fontes de verdade parciais (Tailwind config + tema MUI), múltiplas paletas em `colors/` (`fuseDark.ts`, `skyBlue.ts`, `chartColors.ts`) sem uma identidade visual clara, e overrides do MUI em `muiComponents.ts` que podem divergir dos tokens em `designSystem.ts`.

O pedido original era "melhorar visualmente e padronizar design de código". O sub-projeto SP2 ataca **o design system + identidade visual**. Os outros cortes (SP1 navegação/dashboard agregado, SP3 higiene) ficam em specs separados.

## 2. Objetivos

1. **Identidade visual sóbria e de negócios, dark-first.** Ancorada em referências como Linear (dark-first, tipografia confiante, motion contida), Stripe/Vercel (densidade informacional), Retool/Metabase (dashboard adulto). Sem exageros decorativos.
2. **Fonte única de tokens.** Todos os eixos (color, typography, radius, elevation, spacing, motion, z-index) consumíveis a partir do tema MUI.
3. **Remoção do Tailwind** do stack, eliminando os hacks `important: true` e `preflight: false`.
4. **Componentes base canônicos atualizados** para a nova linguagem — o resto do app herda via `sx` e overrides.

## 3. Não-objetivos

- Redesenhar navegação, IA ou criar dashboard agregado — esses ficam para o SP1.
- Varredura feature por feature para corrigir estilos hardcoded em telas comuns — fica como backlog/SP2.1.
- Substituir MUI ou mudar framework.
- Introduzir testes visuais automatizados ou adicionar suíte de testes ao frontend (o projeto hoje não tem, e isso está fora do escopo).
- Internacionalização/acessibilidade profunda (revisão básica de contraste WCAG AA entra; auditoria a11y completa não).

## 4. Âncoras visuais (POV concreto)

| Âncora | O que pegamos |
|---|---|
| Linear | Dark-first. Backgrounds em camadas graduadas (não "shadows"). Tipografia confiante sem ser chamativa. Motion sutil e funcional. Tabular nums em métricas. |
| Stripe / Vercel | Densidade informacional. Hierarquia tipográfica clara. Radius moderado, não "chubby". Color usado com parcimônia para sinalizar, não decorar. |
| Retool / Metabase | Sobriedade em dashboards. Cores de chart harmoniosas e de alto contraste. |

**O que evitamos:** glassmorphism pesado, gradientes decorativos, sombras fofas, neon, radius > 16px, motion "elástico", emojis decorativos em UI.

## 5. Arquitetura do design system (após SP2)

```
src/lib/theme/
├── index.ts                    # exporta API pública do tema
├── MainThemeProvider.tsx       # provider (inalterado em responsabilidade)
├── designSystem.ts             # ÚNICO ponto de tokens (color refs, typography, radius, elevation, motion, spacing)
├── colors/
│   ├── index.ts
│   ├── dark.ts                 # paleta canônica (NOVO)
│   ├── light.ts                # paleta secundária derivada (NOVO)
│   ├── semantic.ts             # success/warning/error/info em ambos os modos (NOVO)
│   └── chart.ts                # paleta dedicada a charts (substitui chartColors.ts)
├── config/
│   ├── muiComponents.ts        # overrides dos componentes MUI consumindo designSystem.ts
│   └── optimizedSettings.ts    # settings gerais do MUI
├── utils/                      # utilitários existentes — auditados, removidos os não usados
│   ├── spacingUtils.ts
│   ├── shadowUtils.ts
│   ├── animationUtils.ts       # expandido para expor motion tokens
│   ├── gradientUtils.ts        # mantido apenas se ainda fizer sentido com o POV sóbrio
│   ├── colorUtils.ts
│   ├── chartColorUtils.ts
│   └── responsiveUtils.ts
└── globalStyles.ts             # reduzido, alinhado com a nova paleta
```

**Arquivos removidos na Camada 1:** `colors/fuseDark.ts` e `colors/skyBlue.ts` — conteúdo migrado e consolidado em `dark.ts`/`light.ts`.

**Arquivos auditados e reduzidos na Camada 3** (todos removidos se não tiverem consumidor): `themes.ts`, `themes/index.ts`, `utils/glassUtils.ts`, `utils/gradientUtils.ts`. O POV sóbrio descarta glassmorphism e gradientes decorativos; os utilitários só permanecem se houver uso justificável remanescente (ex.: background sutil de landing).

## 6. Inventário de tokens

### 6.1 Color (dark-first)

**Escala neutra (dark):**
- `neutral.bg` — background base da app
- `neutral.surface` — superfície de cards, paineis
- `neutral.elevated` — superfícies sobre a surface (modal, popover, tooltip)
- `neutral.input` — background de inputs
- `neutral.border.subtle` — divisórias quase invisíveis
- `neutral.border.default` — bordas padrão
- `neutral.border.strong` — bordas com peso (foco, ênfase)
- `neutral.text.primary` — texto principal (alto contraste)
- `neutral.text.secondary` — texto secundário
- `neutral.text.tertiary` — texto auxiliar / captions
- `neutral.text.disabled`

**Primary:** azul dessaturado (manter o DNA atual do projeto, mas ajustar a escala para parecer mais "business" e menos "hero"). Escala 50-900 revisada.

**Semantic** (`success`, `warning`, `error`, `info`):
- Tons adultos, não neon. Ex: success = verde-esmeralda dessaturado, não verde-limão.
- Cada um com 3-4 shades: `main`, `subtle-bg` (para alerts), `border`, `text`.

**Chart palette:** 8 cores harmônicas, otimizadas para dark mode (alto contraste sobre `neutral.surface`), testadas para daltonismo básico. Deriva para light com leve ajuste de saturação/lightness.

**Light mode:** derivado de dark — invertendo a escala neutra e ajustando chroma onde preciso. Não desenhado "do zero"; é o modo secundário.

### 6.2 Typography

- **Família:** Inter (mantida) — já é business-grade e tem tabular nums.
- **Scale:**
  - `display` — 48/56 (hero em landing, pouco usado)
  - `h1` — 32/40
  - `h2` — 24/32
  - `h3` — 20/28
  - `h4` — 18/28
  - `h5` — 16/24 (= body emphasizado)
  - `body-lg` — 16/24
  - `body` — 14/20 (default da app)
  - `body-sm` — 13/20
  - `caption` — 12/16
  - `code` — mono, 13/20
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold). Pesos 300/700/800/900 não carregados (economia de bundle + coerência "business").
- **Features:** `font-feature-settings: 'tnum', 'cv11', 'ss01'` (tabular nums sempre em métricas e tabelas).

### 6.3 Radius

- `none` — 0
- `sm` — 4
- `md` — 8 (default)
- `lg` — 12
- `xl` — 16
- `full` — 9999

Componentes: botões e inputs = `md`. Cards = `md` ou `lg`. Pills/chips = `full`. Modais = `lg`. Nada acima de `xl` na app.

### 6.4 Elevation

Em dark-first, "elevação" é luz, não sombra. A hierarquia se faz variando `neutral.bg` → `surface` → `elevated`, combinado com sombras sutis.

- `none` — sem shadow, só diferença de background
- `xs` — shadow muito sutil (cards estáticos)
- `sm` — cards interativos
- `md` — popovers, dropdowns
- `lg` — modais, dialogs

Valores derivados em tempo de uso via `shadowUtils.ts` atualizado, com variantes para dark e light (em light, shadows têm mais peso).

### 6.5 Motion

- **Durations:**
  - `instant` — 0ms
  - `fast` — 120ms (toggles, hover states)
  - `base` — 180ms (default de transição)
  - `slow` — 260ms (entrada de modal, drawer)
  - `slower` — 400ms (raro, só quando pedagogicamente necessário)
- **Easings:**
  - `default` — `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out-ish)
  - `in` — `cubic-bezier(0.4, 0, 1, 1)`
  - `out` — `cubic-bezier(0, 0, 0.2, 1)`
  - `linear` — `linear` (só progress)
- **Regra:** motion serve compreensão (state change, entry/exit, feedback). Zero motion decorativo.

### 6.6 Spacing

Manter o `spacingTokens` e `layoutSpacing` já existentes em `designSystem.ts` — auditar uso, corrigir divergências em componentes base. Não reinventar.

### 6.7 Z-index

Escala explícita:
- `hide` — -1
- `base` — 0
- `elevated` — 10
- `sticky` — 100
- `overlay` — 1000
- `modal` — 1300
- `popover` — 1400
- `tooltip` — 1500
- `toast` — 1600

Consumida via tokens, não hardcoded.

## 7. Remoção do Tailwind

**Passos:**

1. Converter `className` com classes Tailwind para `sx` MUI nos arquivos identificados por grep:
   - `src/features/redirect/components/RedirectSettings.tsx`
   - `src/features/redirect/components/RedirectStats.tsx`
   - `src/App.tsx` — linha do Notistack `classes.containerRoot` vira configuração via `sx` ou estilo direto
2. Remover as classes órfãs `filter-container` (em `src/features/links/components/list/LinksFilters.tsx:49`) e `link-analytics-tabs-container` (em `src/features/links/components/analytics/LinkAnalyticsTabs.tsx:69`) — confirmado por grep que não têm definição CSS em parte alguma do projeto; são no-ops.
3. Remover do `package.json`: `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`.
4. Deletar: `tailwind.config.ts`, `postcss.config.js`.
5. Em `src/styles/index.css`, remover as diretivas `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` (linhas 16-18 atuais).
6. `.cursorrules` não menciona Tailwind — nenhum ajuste necessário.
7. Rodar `npm run quality` e `npm run build` para confirmar.

**Critério:** o app roda, compila e parece igual visualmente antes de qualquer mudança de tokens. Esta etapa é neutra.

## 8. Componentes base atualizados

Lista fechada (regra de disciplina de escopo). Caminhos confirmados no repo:

1. `MetricCardOptimized` — `src/shared/ui/base/MetricCardOptimized.tsx`. Aplica novos tokens de color, typography (tabular nums no valor), radius, elevation.
2. `ChartCard` — existe em dois caminhos (`src/shared/ui/base/ChartCard.tsx` e `src/shared/ui/data-display/ChartCard.tsx`). Ambos recebem os tokens novos. Consolidação num único arquivo é **SP3** (higiene), não SP2.
3. `TabPanel` — `src/shared/ui/base/TabPanel.tsx`. Indicador ativo, hover e foco na nova paleta.
4. `EnhancedPaper` — `src/shared/ui/base/EnhancedPaper.tsx`. Surface/elevated com nova escala.
5. `PageBreadcrumb` — `src/shared/ui/navigation/PageBreadcrumb.tsx`. Cor e tipografia secundárias, separador neutro.
6. Skeletons — `src/shared/ui/feedback/skeletons/*`. Shimmer/pulse na nova paleta neutra.
7. Layout shell — `src/shared/layout/*` (topbar, sidebar, container). Apenas alinhamento com tokens novos, **sem redesenhar IA** (IA fica para SP1).
8. `ApexChartWrapper` — `src/shared/ui/data-display/ApexChartWrapper.tsx` e `ApexChartWrapper.styled.tsx`. Consumir `chart.ts` como paleta default.

**Fora da lista:** qualquer componente de feature (LinkForm, URLShortenerForm, formulários específicos, tabelas de link, etc.) — esses herdam via tema e `sx`. Se parecerem errados após a aplicação, fica como backlog/SP2.1.

## 9. Estratégia de entrega (em camadas)

Cada camada = um PR auto-contido, reversível, validado em browser antes da próxima.

### Camada 1 — Tokens base + remoção do Tailwind

- Criar `colors/dark.ts`, `colors/light.ts`, `colors/semantic.ts`, `colors/chart.ts`.
- Migrar conteúdo relevante de `fuseDark.ts`/`skyBlue.ts` → deletar os antigos.
- Atualizar `designSystem.ts` para expor type scale, radius, elevation, motion, z-index.
- Atualizar `muiComponents.ts` para consumir os novos tokens nos overrides (Button, Card, Paper, Typography, TextField, Chip, etc.).
- Executar os passos de remoção do Tailwind (seção 7).
- `npm run quality` + `npm run build` verdes.
- Validação em browser: app roda; visual é a nova linguagem em componentes MUI base (botões, inputs, tipografia), mas os componentes base canônicos ainda podem parecer "meio transição". Aceitável.

### Camada 2 — Componentes base canônicos

- Atualizar os 8 componentes listados na seção 8.
- Validação em browser nas 6 telas principais (ver seção 11).
- Validação em dark **e** light.
- `npm run quality` verde.

### Camada 3 — Polimento

- Motion/micro-animações nos componentes base (respeitando os tokens de duração).
- Ajustes pontuais surgidos na revisão visual da Camada 2.
- Auditoria de `globalStyles.ts`, `utils/glassUtils.ts`, `utils/gradientUtils.ts`, `themes.ts` e `themes/index.ts` — remover os que não têm consumidor ou não servem ao POV sóbrio.
- **Fora de escopo nesta camada:** qualquer mudança no `frontend/README.md`, tipos de higiene (lockfile duplicado, typo `perfomance`, etc.) — pertencem ao SP3.

## 10. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Regressões visuais em telas não-base que tinham estilos hardcoded. | Camada 2 inclui validação nas 6 telas principais em browser. Hardcodes achados ficam em backlog/SP2.1, não atrasam SP2. |
| Light mode quebra porque estava mascarado por dark bugs. | Validação explícita em ambos os modos na Camada 2. Light é secundário mas funcional. |
| Charts ficam estranhos com nova paleta até ser refinada. | Paleta chart é tokenizada e isolada; pode ser ajustada na Camada 3 sem tocar outros tokens. |
| Componente de feature não previsto quebra após remoção do Tailwind. | Busca programática (`grep className`) para achar todos os consumidores antes de remover Tailwind. |
| Escopo estoura para varredura de features. | Regra explícita de disciplina (seção 3): fora de escopo é backlog. |

## 11. Validação

Sem suite de testes no frontend. Validação é:

- `npm run quality` (type-check + lint + format:check) verde em cada camada.
- Build `npm run build` verde em cada camada.
- Validação manual **no Docker** (regra do projeto: nunca no host):
  - `docker-compose up -d`
  - Abrir cada uma das 6 telas principais em dark e light:
    1. Home pós-login (provavelmente `/link`)
    2. Link create (`/link/create`)
    3. Link edit (`/link/edit/:id`)
    4. Link analytics (`/link/analytic/:id`) — a tela mais densa em dados
    5. Shorter público (`/shorter`)
    6. Profile (`/profile`)
  - Responsividade em cada tela: mobile (375px), tablet (768px), desktop (1440px).
  - Contraste dos textos principais em dark/light (verificação rápida WCAG AA).

## 12. Critérios de sucesso

- [ ] Tailwind removido do repo (pacotes, configs, CSS).
- [ ] Todos os tokens consumíveis do tema MUI.
- [ ] `colors/` consolidado (`dark`, `light`, `semantic`, `chart`), sem `fuseDark`/`skyBlue`.
- [ ] 8 componentes base da seção 8 redesenhados.
- [ ] Dark-first validado; light funcional.
- [ ] `npm run quality` e `npm run build` verdes.
- [ ] Validação visual feita nas 6 telas em ambos os modos.

## 13. Próximos passos (fora do SP2)

- **SP1** — Navegação + Dashboard Agregado (entrega a "home" real e soluciona "colher máximo de info dos cliques").
- **SP2.1 (backlog)** — varredura de hardcodes em features/pages.
- **SP3** — Higiene (typo `perfomance`, lockfile único, alinhamento `features/` vs `pages/`).
