# Clareza da `/links` + Onboarding leve — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar a página `/links` auto-explicativa (títulos/descrições claros por seção) e adicionar um onboarding leve (checklist "Primeiros passos" + tooltips contextuais) que guia o usuário novo na jornada **criar link → conhecer analytics**.

**Architecture:** Frontend-only (`frontend-next`, Next 15 App Router + MUI 6). Reusa o `PageSectionHeading` existente para dar heading a cada bloco da `/links`; adiciona três artefatos novos em `shared/` e `features/links/` — um hook de progresso (`useOnboardingProgress`, derivado do estado real + `localStorage`), um componente genérico de ajuda (`HelpHint`) e o card `FirstStepsChecklist`. Sem backend, sem migration, sem dependências novas.

**Tech Stack:** TypeScript, React, MUI 6 (`Tooltip`, `Collapse`, `IconButton`), `lucide-react` (já no projeto), `react-i18next`, `next/link`.

## Global Constraints

- **Zero dependências novas.** Só bibliotecas já presentes (MUI, lucide-react, react-i18next, next).
- **i18n obrigatório em pt-BR e en** — nenhuma string hardcoded; toda chave nova entra em `src/lib/i18n/locales/pt-BR/links.json` **e** `src/lib/i18n/locales/en/links.json`.
- **TSDoc** (`/** ... */`) em todo componente/hook/função novo — regra do projeto.
- **Mobile-first**: validar a 375px; base do `sx` = mobile, escalar para cima.
- **Sem backend / sem migration** — progresso derivado de estado real + `localStorage`.
- **Gate de verificação** (não há test runner no frontend): `npm run quality` (type-check + lint + format:check) verde + verificação visual no browser (light + dark, 375px) descrita em cada task.
- **Invocar o skill `frontend-design`** antes de criar/alterar UI visível (regra do projeto) — aplicável às tasks 2, 4, 5, 6.
- **Commits** em Conventional Commits, sem referência a IA, subject imperativo ≤72 chars.

---

## File Structure

**Novos:**
- `src/features/links/hooks/useOnboardingProgress.ts` — hook + helpers de `localStorage`; progresso derivado (`hasCreatedLink`, `hasSeenAnalytics`, `completed`, `visible`) + ações (`markAnalyticsSeen`, `dismiss`, `reopen`) e a função pura exportada `markAnalyticsOnboardingSeen()`.
- `src/shared/ui/base/HelpHint.tsx` — "?" discreto com `Tooltip` (genérico, reutilizável).
- `src/features/links/components/onboarding/FirstStepsChecklist.tsx` — card de primeiros passos.

**Modificados:**
- `src/lib/i18n/locales/pt-BR/links.json` e `src/lib/i18n/locales/en/links.json` — copy + chaves novas.
- `src/page-components/links/LinkListPage.tsx` — heading de "Visão geral", wiring do checklist e do botão "Ajuda", esconder métricas em conta vazia.
- `src/features/links/components/list/LinksBrowseSection.tsx` — renderizar heading de seção "Seus links".
- `src/page-components/links/LinkAnalyticsPage.tsx` — marcar `analyticsSeen` ao montar.
- `src/shared/ui/base/index.ts` — export do `HelpHint`.

---

## Task 1: Copy de clareza — títulos/descrições distintos por bloco (só i18n)

Elimina a duplicação "Meus links" (heading de página × seção da lista) e deixa cada bloco com nome próprio. Só edição de i18n; a renderização das seções vem nas tasks seguintes.

**Files:**
- Modify: `src/lib/i18n/locales/pt-BR/links.json`
- Modify: `src/lib/i18n/locales/en/links.json`

**Interfaces:**
- Produces: chaves `list.sections.overview`, `list.sections.overviewDescription`, `list.sections.links`, `list.quickCreate.label`, `list.quickCreate.description` com os valores abaixo (consumidas pelas tasks 2, 3).

- [ ] **Step 1: Atualizar copy pt-BR**

Em `src/lib/i18n/locales/pt-BR/links.json`, dentro de `list.sections`, trocar os valores:

```json
"overview": "Visão geral da conta",
"overviewDescription": "Somatório de todos os seus links.",
"links": "Seus links",
```

E dentro de `list.quickCreate`, trocar:

```json
"label": "Encurtar novo link",
"description": "Cole uma URL longa e gere um link curto.",
```

- [ ] **Step 2: Atualizar copy en (mesmas chaves)**

Em `src/lib/i18n/locales/en/links.json`, `list.sections`:

```json
"overview": "Account overview",
"overviewDescription": "Totals across all your links.",
"links": "Your links",
```

E `list.quickCreate`:

```json
"label": "Shorten a new link",
"description": "Paste a long URL and get a short link.",
```

- [ ] **Step 3: Verificar JSON válido e quality**

Run: `node -e "require('./src/lib/i18n/locales/pt-BR/links.json');require('./src/lib/i18n/locales/en/links.json');console.log('ok')" && npm run quality`
Expected: imprime `ok` e o quality passa (type-check + lint + format:check).

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/locales/pt-BR/links.json src/lib/i18n/locales/en/links.json
git commit -m "i18n(links): copy distinta por seção da /links"
```

---

## Task 2: Heading "Visão geral da conta" + esconder métricas em conta vazia

Dá um heading de seção às métricas (hoje elas aparecem sem título, `showTitle={false}`) e, numa conta sem links, remove o bloco de zeros para o olho ir direto ao "comece aqui".

**Files:**
- Modify: `src/page-components/links/LinkListPage.tsx:142-155`

**Interfaces:**
- Consumes: `list.sections.overview`, `list.sections.overviewDescription` (Task 1); `PageSectionHeading` via `LinksListSectionHeading` (já importado).
- Produces: nenhum símbolo novo para outras tasks.

- [ ] **Step 1: Invocar o skill `frontend-design`** (regra do projeto para mudança visual) antes de editar.

- [ ] **Step 2: Envolver as métricas num bloco com heading e condicioná-las a ter links**

Em `LinkListPage.tsx`, substituir o bloco atual das métricas (o `<Box component="div">` que contém o `LinksListSectionHeading` de página + `<LinkMetrics />`) por: manter o heading de página, e **adicionar** um heading de seção "Visão geral da conta" imediatamente acima das métricas, renderizando as métricas **apenas quando houver links**.

Trocar o trecho (linhas ~144-153):

```tsx
          <Box component="div">
            <LinksListSectionHeading
              icon={<BarChart3 {...ICON_MD} />}
              title={t("list.heading")}
              description={t("list.pageSubtitle")}
              titleVariant="page"
              sx={{ mb: { xs: 1.5, sm: 2 } }}
            />
            <LinkMetrics linksData={links} showTitle={false} />
          </Box>
```

por:

```tsx
          <Box component="div">
            <LinksListSectionHeading
              icon={<BarChart3 {...ICON_MD} />}
              title={t("list.heading")}
              description={t("list.pageSubtitle")}
              titleVariant="page"
              sx={{ mb: { xs: 1.5, sm: 2 } }}
            />
            {links.length > 0 ? (
              <>
                <LinksListSectionHeading
                  title={t("list.sections.overview")}
                  description={t("list.sections.overviewDescription")}
                  titleVariant="section"
                  sx={{ mb: { xs: 1, sm: 1.5 } }}
                />
                <LinkMetrics linksData={links} showTitle={false} />
              </>
            ) : null}
          </Box>
```

- [ ] **Step 3: Rodar o app e verificar no browser**

Run: `npm run dev` (se ainda não estiver rodando) e abrir `/links`.
Expected:
- Conta com links: heading de página "Meus links" seguido de "Visão geral da conta" + "Somatório de todos os seus links." acima dos cards de métrica.
- Conta sem links (ou filtrar/apagar até zerar): o bloco de métricas some; a tela mostra o empty state da lista.
- Checar 375px, light e dark: sem overflow horizontal, headings legíveis.

- [ ] **Step 4: Quality**

Run: `npm run quality`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/page-components/links/LinkListPage.tsx
git commit -m "feat(links): heading de visão geral e ocultar métricas sem links"
```

---

## Task 3: Heading "Seus links" na seção de busca/lista

Hoje `LinksBrowseSection` omite o título de seção de propósito (comentário nas linhas ~44-45) e só mostra a caption de contagem. Com o heading de página não sendo mais "a única" âncora, a seção passa a se anunciar como "Seus links".

**Files:**
- Modify: `src/features/links/components/list/LinksBrowseSection.tsx:44-45` (comentário) e o bloco de render do cabeçalho (~linhas 117-125, a `<Box>` com a caption).

**Interfaces:**
- Consumes: `list.sections.links` (Task 1); `LinksListSectionHeading` (importar de `./LinksListSectionHeading`).
- Produces: nenhum símbolo novo.

- [ ] **Step 1: Invocar o skill `frontend-design`** antes de editar.

- [ ] **Step 2: Importar o heading de seção**

No topo de `LinksBrowseSection.tsx`, junto aos imports de `./`, adicionar:

```tsx
import { LinksListSectionHeading } from "./LinksListSectionHeading";
```

- [ ] **Step 3: Renderizar o título "Seus links" acima da caption de contagem**

Localizar o `return (<EnhancedPaper ...><Box sx={{ p: ... }}>` e, logo após o `<Box ref={topRef} .../>`, inserir o heading de seção com a caption existente como `description`:

```tsx
        <LinksListSectionHeading
          title={t("list.sections.links")}
          description={description}
          titleVariant="section"
          sx={{ mb: { xs: 1.25, sm: 1.75 } }}
        />
```

Remover a `<Box>` antiga que renderizava apenas o ícone + `description` (o bloco de caption iniciado em ~linha 118 `sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.75 }}`), já que o heading agora carrega a `description`. Atualizar o comentário de doc (linhas ~44-45) para refletir que a seção passa a ter título próprio ("Seus links"), distinto do heading de página.

- [ ] **Step 4: Verificar no browser**

Abrir `/links` com links. Expected: a seção da lista mostra "Seus links" + "{N} links — use busca e filtros abaixo para refinar"; ao aplicar filtro, a description muda para "{N} links encontrados com os filtros atuais". Sem duplicação com o heading de página. Checar 375px/light/dark.

- [ ] **Step 5: Quality**

Run: `npm run quality`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/links/components/list/LinksBrowseSection.tsx
git commit -m "feat(links): título de seção Seus links na lista"
```

---

## Task 4: `HelpHint` — componente genérico de ajuda contextual

Um "?" discreto e acessível que revela uma explicação curta. Base reutilizável para os tooltips da jornada.

**Files:**
- Create: `src/shared/ui/base/HelpHint.tsx`
- Modify: `src/shared/ui/base/index.ts`

**Interfaces:**
- Produces: `HelpHint` (default + named) e `HelpHintProps { label: string; ariaLabel?: string; size?: number; icon?: ReactNode }`. Consumido nas tasks 5 e 6.

- [ ] **Step 1: Invocar o skill `frontend-design`** antes de criar o componente.

- [ ] **Step 2: Criar o componente**

Criar `src/shared/ui/base/HelpHint.tsx`:

```tsx
"use client";

import { HelpCircle } from "lucide-react";
import { IconButton, Tooltip } from "@mui/material";

import type { ReactNode } from "react";

export interface HelpHintProps {
  /** Texto explicativo mostrado no tooltip (já traduzido). */
  label: string;
  /** Nome acessível do gatilho. Default: o próprio `label`. */
  ariaLabel?: string;
  /** Tamanho do ícone em px. Default 15. */
  size?: number;
  /** Override do ícone do gatilho. Default: <HelpCircle />. */
  icon?: ReactNode;
}

/**
 * Afordância "?" discreta e muted que revela uma explicação curta ao passar o
 * mouse ou focar. Use ao lado de títulos ou ações para esclarecer o que algo faz
 * sem poluir o layout. Theme-aware e acessível por teclado (botão focável + Tooltip do MUI).
 *
 * @param props Configuração do hint.
 * @returns Botão-ícone com tooltip.
 */
export function HelpHint({ label, ariaLabel, size = 15, icon }: HelpHintProps) {
  return (
    <Tooltip title={label} arrow enterTouchDelay={0} leaveTouchDelay={4000}>
      <IconButton
        aria-label={ariaLabel ?? label}
        size="small"
        sx={{
          color: "text.disabled",
          p: 0.25,
          "&:hover": { color: "text.secondary" },
        }}
      >
        {icon ?? <HelpCircle width={size} height={size} />}
      </IconButton>
    </Tooltip>
  );
}

export default HelpHint;
```

- [ ] **Step 3: Exportar no barrel**

Em `src/shared/ui/base/index.ts`, adicionar (seguindo o padrão de export existente do arquivo):

```ts
export { HelpHint, type HelpHintProps } from "./HelpHint";
```

- [ ] **Step 4: Quality**

Run: `npm run quality`
Expected: PASS (type-check reconhece o export novo).

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/base/HelpHint.tsx src/shared/ui/base/index.ts
git commit -m "feat(ui): componente HelpHint de ajuda contextual"
```

---

## Task 5: `useOnboardingProgress` — hook de progresso + flag no analytics

Fonte de verdade do onboarding: deriva "criou link" do estado real e "viu analytics" de um flag em `localStorage`, gravado quando a página de analytics monta.

**Files:**
- Create: `src/features/links/hooks/useOnboardingProgress.ts`
- Modify: `src/page-components/links/LinkAnalyticsPage.tsx`

**Interfaces:**
- Consumes: `useLinks()` de `@/features/links/hooks/useLinks` (retorna `{ links: LinkResponse[]; loading }`).
- Produces:
  - `markAnalyticsOnboardingSeen(): void` — função pura que grava o flag (sem hooks).
  - `useOnboardingProgress(): OnboardingProgress` onde
    `OnboardingProgress = { hasCreatedLink: boolean; hasSeenAnalytics: boolean; completed: boolean; dismissed: boolean; visible: boolean; markAnalyticsSeen: () => void; dismiss: () => void; reopen: () => void }`.
  - Consumido pela Task 6.

- [ ] **Step 1: Criar o hook e os helpers de storage**

Criar `src/features/links/hooks/useOnboardingProgress.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

import { useLinks } from "@/features/links/hooks/useLinks";

const DISMISSED_KEY = "onboarding.links.dismissed";
const ANALYTICS_SEEN_KEY = "onboarding.links.analyticsSeen";

/**
 * Lê um flag booleano do localStorage de forma SSR-safe.
 *
 * @param key Chave do storage.
 * @returns `true` quando o flag está setado; `false` no servidor ou em erro.
 */
function readFlag(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/**
 * Grava/limpa um flag booleano no localStorage, ignorando erros de quota/modo privado.
 *
 * @param key Chave do storage.
 * @param value `true` para setar, `false` para remover.
 */
function writeFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (value) {
      window.localStorage.setItem(key, "1");
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Marca que o usuário já conheceu o analytics. Função pura (sem hooks), para ser
 * chamada de páginas que não devem carregar a lista de links (ex.: analytics).
 */
export function markAnalyticsOnboardingSeen(): void {
  writeFlag(ANALYTICS_SEEN_KEY, true);
}

/** Estado e ações do onboarding de primeiros passos da /links. */
export interface OnboardingProgress {
  /** O usuário já tem pelo menos 1 link. */
  hasCreatedLink: boolean;
  /** O usuário já abriu uma página de analytics. */
  hasSeenAnalytics: boolean;
  /** As duas tarefas foram concluídas. */
  completed: boolean;
  /** O card foi dispensado pelo usuário. */
  dismissed: boolean;
  /** O card deve ser exibido (não concluído e não dispensado). */
  visible: boolean;
  /** Marca a tarefa de analytics como concluída. */
  markAnalyticsSeen: () => void;
  /** Dispensa o card. */
  dismiss: () => void;
  /** Reexibe o card (limpa o "dispensado"). */
  reopen: () => void;
}

/**
 * Deriva o progresso do onboarding de primeiros passos: "criar link" vem do
 * estado real (`useLinks`), "conhecer analytics" e "dispensado" vêm do localStorage.
 * SSR-safe: os flags são hidratados no cliente após o mount.
 *
 * @returns Estado e ações do onboarding.
 */
export function useOnboardingProgress(): OnboardingProgress {
  const { links } = useLinks();
  const hasCreatedLink = links.length > 0;

  const [hasSeenAnalytics, setHasSeenAnalytics] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setHasSeenAnalytics(readFlag(ANALYTICS_SEEN_KEY));
    setDismissed(readFlag(DISMISSED_KEY));
  }, []);

  const markAnalyticsSeen = useCallback(() => {
    writeFlag(ANALYTICS_SEEN_KEY, true);
    setHasSeenAnalytics(true);
  }, []);

  const dismiss = useCallback(() => {
    writeFlag(DISMISSED_KEY, true);
    setDismissed(true);
  }, []);

  const reopen = useCallback(() => {
    writeFlag(DISMISSED_KEY, false);
    setDismissed(false);
  }, []);

  const completed = hasCreatedLink && hasSeenAnalytics;
  const visible = !completed && !dismissed;

  return {
    hasCreatedLink,
    hasSeenAnalytics,
    completed,
    dismissed,
    visible,
    markAnalyticsSeen,
    dismiss,
    reopen,
  };
}
```

- [ ] **Step 2: Marcar o flag ao montar a página de analytics**

Em `src/page-components/links/LinkAnalyticsPage.tsx`, adicionar o import e um `useEffect` que grava o flag no mount. Adicionar `useEffect` à linha de import de `react` (já importa `memo, useMemo, Suspense`):

```tsx
import { memo, useMemo, useEffect, Suspense } from 'react'
import { markAnalyticsOnboardingSeen } from '@/features/links/hooks/useOnboardingProgress'
```

Dentro do componente `LinkAnalyticsPage`, após os hooks existentes e antes do early return `if (!id)`, adicionar:

```tsx
  useEffect(() => {
    markAnalyticsOnboardingSeen()
  }, [])
```

- [ ] **Step 3: Verificar no browser**

Abrir uma página `/links/analytics/{id}` e depois voltar para `/links`. Nas DevTools → Application → Local Storage, confirmar `onboarding.links.analyticsSeen = "1"`.

- [ ] **Step 4: Quality**

Run: `npm run quality`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/links/hooks/useOnboardingProgress.ts src/page-components/links/LinkAnalyticsPage.tsx
git commit -m "feat(links): hook de progresso de onboarding + flag no analytics"
```

---

## Task 6: `FirstStepsChecklist` + wiring na `/links` (card, "Ajuda", tooltips)

O entregável visível do onboarding: card de primeiros passos, botão "Ajuda" para reabrir, e o `HelpHint` nos pontos-chave.

**Files:**
- Create: `src/features/links/components/onboarding/FirstStepsChecklist.tsx`
- Modify: `src/page-components/links/LinkListPage.tsx`
- Modify: `src/lib/i18n/locales/pt-BR/links.json` e `src/lib/i18n/locales/en/links.json`

**Interfaces:**
- Consumes: `useOnboardingProgress`/`OnboardingProgress` (Task 5); `HelpHint` (Task 4); `EnhancedPaper` (`@/shared/ui/base/EnhancedPaper`).
- Produces: `FirstStepsChecklist` (named) e `FirstStepsChecklistProps { progress: OnboardingProgress; analyticsHref: string | null }`.

- [ ] **Step 1: Invocar o skill `frontend-design`** antes de criar/alterar UI.

- [ ] **Step 2: Adicionar as chaves i18n do onboarding (pt-BR)**

Em `src/lib/i18n/locales/pt-BR/links.json`, dentro do objeto `list`, adicionar um bloco `onboarding`:

```json
"onboarding": {
  "title": "Primeiros passos",
  "subtitle": "Dois passos para começar a usar o Link Chart.",
  "createLink": "Crie seu primeiro link",
  "createLinkDone": "Link criado",
  "seeAnalytics": "Conheça o analytics do link",
  "seeAnalyticsLocked": "Crie um link para desbloquear o analytics",
  "dismiss": "Dispensar",
  "help": "Ajuda",
  "hintQuickCreate": "Cole qualquer URL longa aqui para gerar um link curto e rastreável.",
  "hintAnalytics": "Abra o analytics de um link para ver cliques, países, dispositivos e mais."
}
```

- [ ] **Step 3: Adicionar as mesmas chaves em en**

Em `src/lib/i18n/locales/en/links.json`, dentro de `list`:

```json
"onboarding": {
  "title": "Getting started",
  "subtitle": "Two steps to start using Link Chart.",
  "createLink": "Create your first link",
  "createLinkDone": "Link created",
  "seeAnalytics": "Explore a link's analytics",
  "seeAnalyticsLocked": "Create a link to unlock analytics",
  "dismiss": "Dismiss",
  "help": "Help",
  "hintQuickCreate": "Paste any long URL here to get a short, trackable link.",
  "hintAnalytics": "Open a link's analytics to see clicks, countries, devices and more."
}
```

- [ ] **Step 4: Criar o componente `FirstStepsChecklist`**

Criar `src/features/links/components/onboarding/FirstStepsChecklist.tsx`:

```tsx
"use client";

import { CheckCircle2, Circle, Sparkles, X } from "lucide-react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { OnboardingProgress } from "@/features/links/hooks/useOnboardingProgress";

export interface FirstStepsChecklistProps {
  /** Progresso derivado do onboarding. */
  progress: OnboardingProgress;
  /** Href do analytics de um link existente, ou `null` quando ainda não há links. */
  analyticsHref: string | null;
}

/**
 * Card "Primeiros passos" com as duas tarefas da jornada (criar link → conhecer
 * analytics). Cada item vira atalho para a ação; itens concluídos ficam marcados.
 * É dispensável e some sozinho quando o onboarding conclui.
 *
 * @param props Progresso e href de analytics.
 * @returns O card, ou `null` quando não deve ser exibido.
 */
export function FirstStepsChecklist({
  progress,
  analyticsHref,
}: FirstStepsChecklistProps) {
  const { t } = useTranslation("links");

  if (!progress.visible) {
    return null;
  }

  const items = [
    {
      key: "create",
      done: progress.hasCreatedLink,
      label: progress.hasCreatedLink
        ? t("list.onboarding.createLinkDone")
        : t("list.onboarding.createLink"),
      href: "/links/create",
      enabled: !progress.hasCreatedLink,
    },
    {
      key: "analytics",
      done: progress.hasSeenAnalytics,
      label: progress.hasCreatedLink
        ? t("list.onboarding.seeAnalytics")
        : t("list.onboarding.seeAnalyticsLocked"),
      href: analyticsHref,
      enabled: !progress.hasSeenAnalytics && analyticsHref != null,
    },
  ];

  return (
    <EnhancedPaper variant="outlined" animated={false} sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={1}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: { xs: "1.0625rem", sm: "1.125rem" },
              fontWeight: 600,
            }}
          >
            <Sparkles width={18} height={18} />
            {t("list.onboarding.title")}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.375 }}
          >
            {t("list.onboarding.subtitle")}
          </Typography>
        </Box>
        <IconButton
          aria-label={t("list.onboarding.dismiss")}
          size="small"
          onClick={progress.dismiss}
          sx={{ color: "text.disabled", flexShrink: 0 }}
        >
          <X width={16} height={16} />
        </IconButton>
      </Stack>

      <Stack spacing={0.5} sx={{ mt: 1.5 }}>
        {items.map((item) => {
          const content = (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                py: 1,
                px: 1,
                borderRadius: 1,
                color: item.done ? "text.disabled" : "text.primary",
                textDecoration: item.done ? "line-through" : "none",
                transition: "background-color 120ms",
                ...(item.enabled && {
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }),
                ...(!item.enabled &&
                  !item.done && { opacity: 0.55 }),
              }}
            >
              <Box component="span" sx={{ display: "inline-flex", color: item.done ? "success.main" : "text.disabled" }}>
                {item.done ? (
                  <CheckCircle2 width={18} height={18} />
                ) : (
                  <Circle width={18} height={18} />
                )}
              </Box>
              <Typography variant="body2">{item.label}</Typography>
            </Stack>
          );

          if (item.enabled && item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {content}
              </Link>
            );
          }

          return <Box key={item.key}>{content}</Box>;
        })}
      </Stack>
    </EnhancedPaper>
  );
}

export default FirstStepsChecklist;
```

- [ ] **Step 5: Fazer o wiring na `LinkListPage`**

Em `src/page-components/links/LinkListPage.tsx`:

Adicionar imports:

```tsx
import { HelpCircle } from "lucide-react";
import { Button } from "@mui/material";
import { FirstStepsChecklist } from "@/features/links/components/onboarding/FirstStepsChecklist";
import { useOnboardingProgress } from "@/features/links/hooks/useOnboardingProgress";
```

Dentro do componente, após `const { links, loading } = useLinks();`, adicionar:

```tsx
  const onboarding = useOnboardingProgress();
```

Calcular o href de analytics do primeiro link visível (depois de `sortedLinks` existir):

```tsx
  const analyticsHref =
    sortedLinks.length > 0 ? `/links/analytics/${sortedLinks[0].id}` : null;
```

No heading de página, passar um `action` com o botão "Ajuda" — visível apenas quando o card está dispensado mas o onboarding não concluiu:

```tsx
            <LinksListSectionHeading
              icon={<BarChart3 {...ICON_MD} />}
              title={t("list.heading")}
              description={t("list.pageSubtitle")}
              titleVariant="page"
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              action={
                !onboarding.visible && !onboarding.completed ? (
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<HelpCircle width={16} height={16} />}
                    onClick={onboarding.reopen}
                  >
                    {t("list.onboarding.help")}
                  </Button>
                ) : undefined
              }
            />
```

E renderizar o card no topo do `Stack`, imediatamente após a abertura `<Stack ...>` e antes do `<Box component="div">` do heading:

```tsx
          <FirstStepsChecklist progress={onboarding} analyticsHref={analyticsHref} />
```

- [ ] **Step 6: Verificar a jornada completa no browser**

Com `localStorage` limpo (DevTools → Application → Clear site data) e uma conta **sem links**:
1. `/links` mostra o card "Primeiros passos" com as 2 tarefas desmarcadas; "Conheça o analytics" aparece travado ("Crie um link para desbloquear…").
2. Criar um link → tarefa 1 marca (riscada) ao voltar para `/links`.
3. Abrir o analytics do link → voltar para `/links`: tarefa 2 marca e o card **some**.
4. Antes de concluir, clicar no "X" dispensa o card; o botão "Ajuda" aparece no header e reabre o card; recarregar a página mantém o estado (persistido).
5. Checar 375px, light e dark: sem overflow, card e header legíveis.

- [ ] **Step 7: Quality**

Run: `npm run quality`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/links/components/onboarding/FirstStepsChecklist.tsx src/page-components/links/LinkListPage.tsx src/lib/i18n/locales/pt-BR/links.json src/lib/i18n/locales/en/links.json
git commit -m "feat(links): card primeiros passos e botão de ajuda"
```

---

## Task 7: `HelpHint` nos pontos-chave (encurtar + analytics)

Aplica os tooltips contextuais da jornada, reusando o `HelpHint` e as chaves `list.onboarding.hint*`.

**Files:**
- Modify: `src/features/links/components/list/LinksQuickCreate.tsx` (heading do box, ~linha 348-361)
- Modify: `src/features/links/components/list/LinkCardActionBar.tsx` (ação de analytics do card)

**Interfaces:**
- Consumes: `HelpHint` (Task 4); `list.onboarding.hintQuickCreate`, `list.onboarding.hintAnalytics` (Task 6).
- Produces: nenhum símbolo novo.

- [ ] **Step 1: Invocar o skill `frontend-design`** antes de editar.

- [ ] **Step 2: Hint no box "Encurtar novo link"**

Em `LinksQuickCreate.tsx`, importar o `HelpHint`:

```tsx
import { HelpHint } from "@/shared/ui/base";
```

No `LinksListSectionHeading` do box (que usa `title={t("list.quickCreate.label")}`), passar um `action` com o hint:

```tsx
          action={
            <HelpHint label={t("list.onboarding.hintQuickCreate")} />
          }
```

(Se já houver um `action` no heading — ex.: o botão "mais opções" — compor os dois num `<Stack direction="row" spacing={0.5} alignItems="center">` preservando o botão existente.)

- [ ] **Step 3: Hint na ação de analytics do card**

Abrir `src/features/links/components/list/LinkCardActionBar.tsx`, localizar o controle que leva ao analytics do link (ícone/botão de analytics). Garantir que ele tenha um `aria-label`/`Tooltip` claro ("Ver analytics") usando i18n; se o `Tooltip` já existir, apenas confirmar a cópia. Não adicionar um segundo ícone "?" no card (evita poluição) — o `HelpHint` fica reservado ao heading do box de criação; no card, a clareza vem do `Tooltip` do próprio botão.

Verificação: se o botão de analytics já tem `Tooltip` com label traduzido, esta etapa é só confirmação (sem diff). Caso não tenha, adicionar:

```tsx
<Tooltip title={t("...analyticsAction")} arrow>
  {/* botão existente */}
</Tooltip>
```

usando a chave de tradução já existente para a ação de analytics (verificar no arquivo qual é; não criar chave duplicada).

- [ ] **Step 4: Verificar no browser**

Em `/links`: passar o mouse/focar no "?" ao lado de "Encurtar novo link" mostra a dica; o botão de analytics do card mostra seu tooltip. Testar toque no mobile (o `enterTouchDelay={0}` abre no tap).

- [ ] **Step 5: Quality**

Run: `npm run quality`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/links/components/list/LinksQuickCreate.tsx src/features/links/components/list/LinkCardActionBar.tsx
git commit -m "feat(links): dicas contextuais em encurtar e analytics"
```

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura da spec:** Parte A (clareza) → Tasks 1-3; estado de conta nova → Task 2 (esconde métricas) + empty state existente. Parte B: checklist → Tasks 5-6; tooltips → Tasks 4+7; hook/persistência/reabrir → Tasks 5-6; flag analytics → Task 5. i18n pt-BR+en → Tasks 1,6. TSDoc → todos os artefatos novos têm bloco. Verificação → gate `npm run quality` + browser em cada task.
- **Placeholders:** a Task 7 Step 3 é condicional (confirmar/adicionar `Tooltip` conforme o estado atual do `LinkCardActionBar`) — instrução explícita de inspecionar antes; não é "TODO" solto.
- **Consistência de tipos:** `OnboardingProgress` definido na Task 5 é consumido igual nas Tasks 5-6; `markAnalyticsOnboardingSeen()` (Task 5) usado na Task 5 Step 2; `FirstStepsChecklistProps`/`HelpHintProps` consistentes entre criação e consumo.
