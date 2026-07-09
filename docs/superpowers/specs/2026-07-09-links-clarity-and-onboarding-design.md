# Clareza da `/links` + Onboarding leve — Design

**Data:** 2026-07-09
**Escopo:** Frontend (`frontend-next`) — página `/links` e jornada autenticada **criar link → conhecer analytics**
**Status:** proposto (aguardando revisão)

---

## 1. Problema

Depois de logar, o usuário cai em `/links` e **não sabe o que é cada coisa nem por onde
começar**. Dois problemas se somam:

1. **A `/links` não é auto-explicativa.** Os blocos empilham sem deixar claro o propósito de
   cada um:

   - A faixa de métricas tem o título **"Métricas do Link"** (`metrics.title`), no singular —
     mas os números são **da conta inteira** (somatório de todos os links). O usuário lê como
     se fosse de um link específico.
   - O box **"Criação rápida"** fica no meio da página, sem se apresentar como o **ponto de
     partida**.
   - A lista não tem um título de seção claro que a distinga das métricas e da criação.
   - Para uma conta nova (0 links), a tela abre com **métricas zeradas dominando o topo** e uma
     lista vazia — o oposto de "comece aqui".

2. **Não há nenhum onboarding.** Nada orienta o usuário novo a percorrer a jornada principal
   (criar um link e depois conhecer o analytics). O único trabalho de onboarding existente é o
   **demo-link** no backend (`SeedDemoLinkJob`/`OnboardingDemoDataService`, já implementado), que
   _mostra dados_ mas não _ensina a usar_.

**Causa raiz (confirmada com o usuário):** falta de clareza do que cada coisa é.

---

## 2. Decisões de escopo

- **Duas partes que se reforçam:** (A) tornar a `/links` auto-explicativa e (B) um onboarding
  leve. Onboarding sozinho apontaria para uma tela que continua confusa.
- **Jornada alvo:** **criar link → conhecer analytics**. Só isso.
- **Formato do onboarding:** **checklist de primeiros passos + tooltips contextuais**
  (escolha do usuário). Sem tour com overlay full-screen.
- **Zero dependências novas** — segue a cultura estabelecida na Fundação Mobile-First. O combo
  checklist + tooltips é construído com MUI (`Tooltip`/`Card`/`Collapse`) já presente.
- **Sem backend nesta fase** — o progresso é derivado do estado real + `localStorage`. Nenhuma
  migration nova.

---

## 3. Parte A — Clareza estrutural da `/links`

Cada bloco passa a ter **título claro + uma linha curta dizendo o que é** (regra do projeto:
todo bloco de métrica/gráfico tem explicação visível). Reorganização de cima pra baixo em
`src/page-components/links/LinkListPage.tsx`:

| Bloco    | Componente                                              | Hoje (confuso)                            | Proposta                                                                                |
| -------- | ------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| Métricas | `features/links/components/LinkMetrics.tsx`             | **"Métricas do Link"** (parece de 1 link) | Título **"Visão geral da conta"** + descrição _"Somatório de todos os seus links"_      |
| Criação  | `features/links/components/list/LinksQuickCreate.tsx`   | "Criação rápida" solta no meio            | Título **"Encurtar novo link"** + descrição _"Cole uma URL longa e gere um link curto"_ |
| Lista    | `features/links/components/list/LinksBrowseSection.tsx` | Sem título de seção próprio               | Título **"Seus links"** + contador/contexto já existente (`list.sections.*`)            |

### 3.1 Renomear títulos/descrições (só i18n + props)

- Trocar `metrics.title` de "Métricas do Link" → "Visão geral da conta" e **adicionar** uma chave
  de descrição (ex.: `metrics.subtitle`) renderizada abaixo do título. `LinkMetrics` já aceita
  `title?` e `showTitle`; adicionar suporte a uma descrição (ou renderizar via o
  `LinksListSectionHeading`/`PageSectionHeading` existente para manter o padrão visual).
- `LinksQuickCreate` ganha título + descrição usando o mesmo componente de heading das outras
  seções, para consistência visual.
- `LinksBrowseSection` ganha um heading de seção "Seus links" (hoje ele **omite**
  intencionalmente o título — ver comentário no arquivo, linhas ~44-45; a decisão muda: passa a
  ter um heading de seção próprio, distinto do heading de página).

### 3.2 Estado de conta nova (0 links)

- Quando `links.length === 0`, as **métricas zeradas deixam de dominar**: ficam discretas
  (densidade menor) ou recolhidas, e o destaque visual vai para **criar o primeiro link**.
- Reaproveitar o `LinksEmptyState` (`features/links/components/list/LinksEmptyState.tsx`) já
  existente para a lista vazia; alinhar sua mensagem ao "comece aqui".
- A decisão fina (recolher vs. reduzir densidade das métricas) fica para o plano; o critério é:
  a primeira coisa que o olho encontra numa conta nova é **o que fazer primeiro**, não zeros.

---

## 4. Parte B — Onboarding leve (checklist + tooltips)

### 4.1 Card "Primeiros passos"

Novo componente `features/links/components/onboarding/FirstStepsChecklist.tsx`, renderizado no
topo da `/links` **apenas enquanto não concluído e não dispensado**.

- **Tarefas (2):**
  1. ☐ **Criar seu primeiro link** — auto-marca quando `links.length > 0`.
  2. ☐ **Conhecer o analytics** — marca quando o usuário abre uma página de analytics de link
     pela primeira vez.
- **Comportamento:** card **dispensável** (botão fechar); **some sozinho** quando as duas
  tarefas concluem. Cada item é um link/atalho para a ação correspondente (criar / abrir
  analytics de um link existente).
- **Visual:** calmo e profissional, alinhado ao redesign de analytics (sem emoji, ícones
  `lucide` muted); `Collapse`/`fadeIn` para entrada/saída suave.

### 4.2 Tooltips/infos contextuais

Novo componente reutilizável `shared/ui/base/HelpHint.tsx` — um "?" (ou ícone info) discreto que
abre um `Tooltip`/`Popover` do MUI com uma explicação curta. Pontos de aplicação nesta fase:

- No box **"Encurtar novo link"** — o que é encurtar / para que serve o slug.
- Na ação de **analytics** do card de link — o que o usuário vai encontrar lá.
- (Opcional, no caminho) no título **"Visão geral da conta"** — reforço de que é somatório.

`HelpHint` é genérico e reutilizável pelos sub-projetos futuros. TSDoc obrigatório.

### 4.3 Gatilho e persistência (sem backend)

Novo hook `features/links/hooks/useOnboardingProgress.ts`:

- **Derivado do estado real:** "criar primeiro link" vem de `useLinks()` (`links.length > 0`);
  "conhecer analytics" vem de um flag setado ao montar `LinkAnalyticsPage`
  (`src/page-components/links/LinkAnalyticsPage.tsx`).
- **Persistência via `localStorage`** (namespaced por usuário quando houver id disponível):
  flags `onboarding.dismissed` e `onboarding.analyticsSeen`. `SSR-safe` (ler no client após
  mount, sem quebrar hidratação).
- **Reabrir:** um botão discreto **"Ajuda"** no header da `/links` limpa o `dismissed` e
  reexibe o card. (Placement fino no plano.)

---

## 5. Arquitetura / fluxo

Nenhuma mudança arquitetural. Tudo dentro das camadas atuais:

```
LinkListPage (page-component)
 ├─ FirstStepsChecklist   (novo) ← useOnboardingProgress (novo)
 ├─ LinkMetrics           (título/descrição novos)
 ├─ LinksQuickCreate      (título/descrição + HelpHint)
 └─ LinksBrowseSection    (heading de seção "Seus links" + HelpHint na ação analytics)

LinkAnalyticsPage ← seta flag "analyticsSeen" (useOnboardingProgress)
shared/ui/base/HelpHint  (novo, genérico)
```

Sem novas dependências entre features; `HelpHint` vive em `shared/`.

---

## 6. i18n

Todas as strings novas em **pt-BR e en** (`src/lib/i18n/locales/{pt-BR,en}/links.json`), nada
hardcoded. Chaves novas mínimas:

- `metrics.title` (renomear) + `metrics.subtitle` (nova)
- `quickCreate.heading` + `quickCreate.description`
- `list.sections.title` ("Seus links")
- `onboarding.*` — título do card, rótulos das 2 tarefas, botão dispensar, botão "Ajuda",
  textos dos `HelpHint`.

---

## 7. Fora de escopo (YAGNI)

- **Tour com spotlight/overlay** e libs novas (driver.js, joyride, shepherd) — o combo
  checklist + tooltips cobre sem dependência.
- **Onboarding em profile / QR / edit** — foco só na jornada criar → analytics.
- **Flag de onboarding no backend** (coluna `onboarding_completed_at`) — derivamos do estado
  real; cross-device fica como follow-up se provado necessário.
- **Redesign visual amplo da `/links`** — é clareza de rótulos/hierarquia e blocos de ajuda, não
  um redesign do sistema de componentes.

---

## 8. Documentação obrigatória

- **TSDoc** em todo componente/hook novo (`FirstStepsChecklist`, `HelpHint`,
  `useOnboardingProgress`) e em helpers novos — regra do projeto.

---

## 9. Verificação

Sem suíte de testes no frontend. Gate:

- `npm run quality` (type-check + lint + format:check) passa.
- **Verificação visual no browser** (light + dark, e mobile 375px conforme convenção
  mobile-first):
  1. Conta **nova** (0 links): a `/links` destaca "crie seu primeiro link"; o card "Primeiros
     passos" aparece com as 2 tarefas desmarcadas; métricas zeradas não dominam.
  2. Após criar 1 link: a tarefa 1 auto-marca.
  3. Após abrir o analytics de um link: a tarefa 2 marca e o card some.
  4. Dispensar o card e reabrir pelo botão "Ajuda" funciona e persiste após reload.
  5. Títulos/descrições novos deixam claro o que é cada bloco; `HelpHint` abre e fecha bem.

---

## 10. Critérios de aceite

1. `/links`: métricas com título "Visão geral da conta" + descrição de somatório; criação com
   título "Encurtar novo link" + descrição; lista com heading "Seus links".
2. Conta nova prioriza visualmente "criar o primeiro link" sobre métricas zeradas.
3. Card "Primeiros passos" com as 2 tarefas, auto-marcação derivada do uso, dispensável e some ao
   concluir.
4. `HelpHint` genérico aplicado nos pontos-chave (criar, analytics).
5. Progresso persistido em `localStorage`; botão "Ajuda" reabre o card.
6. Strings em pt-BR + en; TSDoc nos artefatos novos.
7. `npm run quality` verde.
