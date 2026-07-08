# Mobile-First — Fundação (Sub-projeto 0) — Design

**Data:** 2026-07-08
**Autor:** Bruno (via brainstorming)
**Status:** proposto (aguardando revisão)

---

## 1. Contexto

A aplicação (`frontend-next`, Next 15 App Router + MUI 6 + Emotion) já é **mobile-first na
convenção** — os blocos `sx` usam `xs` como base e escalam para cima (ex.:
`{ xs: "1fr", md: "2fr 1fr" }`) — e já possui infraestrutura compartilhada boa:
`ApexChartWrapper` (com `size` → `useChartHeight`), `useResponsive()`, `Drawer` mobile na
`Navbar`. **98 de 223** arquivos `.tsx` já usam breakpoints responsivos.

O problema relatado ("mobile quebrado hoje") **não é ausência de mobile-first, nem exige
reescrita**. A auditoria estática mostrou que as quebras são **localizadas em componentes que
furam o sistema compartilhado**. A estratégia, portanto, é **remediação cirúrgica + blindagem
das convenções** para impedir regressão.

### Decisão de stack (confirmada)

Zero dependências novas. Pesquisa de mercado confirmou: MUI 6 já é mobile-first completo
(Grid v2, Stack, `useMediaQuery`, container queries); ApexCharts já é responsivo via wrapper;
Leaflet/`material-react-table` já cobrem o necessário. Adicionar um segundo design system
(Tailwind/Chakra) a um app MUI maduro **pioraria**. O ganho vem de disciplina, não de lib.

---

## 2. Programa completo (decomposição)

O trabalho total foi decomposto. Cada peça terá seu próprio ciclo spec → plano →
implementação. **Ordem acordada: 0 → B → A → C → D.**

| #     | Sub-projeto                | Foco                                                                  | Status        |
| ----- | -------------------------- | --------------------------------------------------------------------- | ------------- |
| **0** | **Fundação** (este doc)    | Utilitários responsivos compartilhados + rede de teste anti-regressão | **em design** |
| B     | Público / marketing / auth | `/shorter`, `public-analytics`, login, páginas legais                 | roadmap       |
| A     | Layout / navegação global  | Navbar, Drawer, `MainLayout`/`PublicLayout`, footer, tipografia base  | roadmap       |
| C     | App autenticada (links)    | Lista, criar/editar, QR, `LinkActions`, profile                       | roadmap       |
| D     | Analytics / dashboards     | ApexCharts, `material-react-table`, Leaflet/simple-maps               | roadmap       |

Este documento especifica **apenas a Fundação (0)**. Os demais serão specados quando chegar
a vez de cada um.

---

## 3. Escopo da Fundação

### 3.1 Objetivos

Entregar peças compartilhadas e reutilizáveis que os sub-projetos B–D vão consumir, e uma
**rede de segurança automatizada** que falha o CI quando uma tela quebra em mobile.

### 3.2 Não-objetivos (YAGNI)

- **Não** vamos varrer/corrigir todas as telas aqui — isso é dos sub-projetos B–D.
- **Não** adicionar libs (bottom-sheet, virtualização) — reavaliar só se B–D provarem
  necessidade.
- **Não** mudar a semântica de `isMobile` (`< md`) — 98 arquivos dependem dela; mudar seria
  regressão silenciosa. Em vez disso, **adicionamos** `isPhone` (`< sm`) sem quebrar a API.
- **Não** redesenhar visual — é responsividade estrutural, não redesign.

### 3.3 Unidades de trabalho

Cada unidade é isolada, com interface clara e testável de forma independente.

#### U1 — `ResponsiveDialog` (Dialog fullScreen no telefone)

- **O que faz:** um wrapper fino sobre o `Dialog` do MUI que aplica `fullScreen` quando a tela
  é `< sm`, mantendo o resto da API idêntica.
- **Interface:** `<ResponsiveDialog {...dialogProps} />` em `src/shared/ui/feedback/`
  (mesmo lugar dos outros componentes de feedback). Internamente usa
  `useThemeMediaQuery((t) => t.breakpoints.down("sm"))`.
- **Depende de:** MUI `Dialog`, tema.
- **Consumidores nesta fase:** migrar os 2 diálogos existentes —
  `features/links/components/list/DeleteConfirmDialog.tsx` e
  `features/profile/components/SubdomainSettings.tsx:523`.
- **Nota:** os sub-projetos futuros passam a usar `ResponsiveDialog` por padrão.

#### U2 — Disciplina de altura de charts

- **O que faz:** remove alturas fixas em px que furam o `useChartHeight`, roteando os charts
  pelo `size` (`compact | standard | large`) do `ApexChartWrapper`.
- **Alvos concretos:**
  - `features/analytics/components/insights/RetentionAnalysisChart.tsx:52` (`height: 300`)
  - `features/analytics/components/insights/SessionDepthChart.tsx:100` (`height: 350`)
  - `features/analytics/components/insights/sub-views/TrafficChannelsView.tsx:64` (`350`), `:125` (`300`)
- **Regra:** `height` explícito no `ApexChartWrapper` fica reservado a casos que realmente
  precisam de px fixo; o padrão é `size`.
- **Depende de:** `useChartHeight` (já existe, mapeia ChartSize → altura responsiva por bp).

#### U3 — Consolidar breakpoints no tema

- **O que faz:** eliminar media queries com px hardcoded, usando sempre os breakpoints do tema.
- **Alvo concreto:** `shared/ui/data-display/DataTableTopToolbar.tsx:41-42`
  (`useMediaQuery("(max-width:720px)")` e `(max-width:1024px)`) → trocar por
  `useThemeMediaQuery`/`useResponsive`.
- **Ação extra:** grep de varredura por `max-width:` / `min-width:` em `useMediaQuery` para
  pegar qualquer outro caso.

#### U4 — Aliviar `useResponsive` + adicionar `isPhone`

- **O que faz:** `useResponsive()` hoje dispara ~12 media queries por chamada. Reduzir para as
  efetivamente consumidas, **mantendo a API pública estável**, e **adicionar** `isPhone`
  (`down("sm")`) para o caso "telefone de verdade" (distinto de `isMobile = down("md")`, que
  inclui tablet).
- **Depende de:** `useThemeMediaQuery`.
- **Cuidado:** não alterar valores retornados hoje; só otimizar o cálculo interno e estender.

#### U5 — `dvh/svh` para seções full-height

- **O que faz:** substituir `100vh`/`minHeight: 100vh` por `100dvh` (ou `100svh` onde apropriado)
  nas áreas onde a barra do navegador mobile corta conteúdo.
- **Alvos concretos (8 ocorrências):** `MainLayout.tsx:35,74`, `PublicLayout.tsx:271,369`,
  `AuthLayout.tsx:77`, `ErrorLayout.tsx:87`, `page-components/system/UnauthorizedPage.tsx:41`,
  `page-components/public/ShorterPage.tsx:56`, `features/public-analytics/PublicAnalyticsPageContent.tsx:73`,
  `shared/ui/feedback/Loading.tsx:180`.
- **Nota:** `RealTimeHeatmapChart.tsx:416` (`100vh` em fullscreen) pode ficar — é modo tela cheia
  intencional; avaliar caso a caso.

#### U6 — Rede de segurança: teste Playwright a 375px

- **O que faz:** o entregável mais importante da Fundação. Um teste E2E (Playwright, já no
  projeto) que, num viewport de **375×812 (iPhone)**, visita as rotas-chave e **falha se houver
  overflow horizontal** (`document.documentElement.scrollWidth > clientWidth + tolerância`).
- **Rotas mínimas:** `/` (landing), `/shorter`, uma página legal (`/privacy`), `/login`, e uma
  `public-analytics/[slug]` de exemplo. (Rotas autenticadas ficam para o sub-projeto C, que
  cuidará do setup de auth no teste.)
- **Checagem extra (best-effort):** alvos de toque — botões/ícones clicáveis com caixa
  `< 44px` geram _warning_ (não falha dura na Fundação; vira falha nos sub-projetos).
- **Onde:** `tests/e2e/mobile-responsive.spec.ts` (ou pasta equivalente já usada pelo Playwright).

#### U7 — Documento de convenção mobile-first

- **O que faz:** uma seção curta (em `CLAUDE.md` do frontend ou `docs/.../MOBILE.md`) com as
  regras que os sub-projetos e PRs futuros devem seguir:
  1. Base do `sx` = mobile; escalar para cima com `sm/md/lg`.
  2. Sempre breakpoints do tema (nunca px hardcoded em `useMediaQuery`).
  3. `Dialog` → usar `ResponsiveDialog`.
  4. Chart → `ApexChartWrapper` com `size` (não `height` fixo).
  5. Nada de largura fixa em px `> 360` em `sx` de containers.
  6. Full-height → `dvh/svh`, não `vh`.

---

## 4. Arquitetura / fluxo

Nenhuma mudança arquitetural. Tudo se encaixa nas camadas existentes:

- `ResponsiveDialog` e o teste vivem em `shared/` e `tests/` — sem novas dependências entre
  features.
- `useResponsive`/`isPhone` permanecem em `lib/theme/hooks`.
- As correções de charts/`dvh` são edições pontuais nos arquivos-alvo.

Consumo pelos sub-projetos: B–D importam `ResponsiveDialog`, `isPhone` e seguem o doc de
convenção; o teste Playwright cresce (mais rotas) a cada sub-projeto.

---

## 5. Testes

- **Automatizado:** U6 (Playwright 375px, sem overflow horizontal) — roda no CI e é a rede
  anti-regressão de todo o programa.
- **Manual/visual:** validar os 2 diálogos migrados e os 4 charts corrigidos em viewport
  mobile do DevTools.
- **Guard:** `npm run quality` (type-check + lint + format) precisa passar.

---

## 6. Riscos & mitigação

| Risco                                                                | Mitigação                                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Mudar `useResponsive` quebra os 98 consumidores                      | API pública **imutável**; só otimizar interno e **adicionar** `isPhone`.                  |
| `100dvh` com suporte irregular em browsers antigos                   | `dvh` tem suporte amplo (2023+); manter `vh` como fallback via `@supports` se necessário. |
| Teste Playwright "flaky" por conteúdo assíncrono                     | Aguardar `networkidle`/seletores estáveis antes de medir; tolerância de ~1px no overflow. |
| `ResponsiveDialog` conflitar com transições/`keepMounted` existentes | Wrapper repassa 100% das props; migração diálogo a diálogo com verificação visual.        |

---

## 7. Critérios de aceite da Fundação

1. `ResponsiveDialog` existe e os 2 diálogos atuais o usam (fullScreen no telefone).
2. Os 4 charts-alvo usam `size` do wrapper; nenhuma altura fixa restante neles.
3. `DataTableTopToolbar` (e quaisquer outros) sem px hardcoded em `useMediaQuery`.
4. `useResponsive` expõe `isPhone`; API antiga intacta.
5. Seções full-height usam `dvh/svh`.
6. Teste Playwright a 375px passa nas rotas públicas e falha sob overflow horizontal.
7. Doc de convenção commitado.
8. `npm run quality` verde.
