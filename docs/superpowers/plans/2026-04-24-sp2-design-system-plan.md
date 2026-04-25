# SP2 Design System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o design system do Link Chart frontend com tom adulto/negócios, dark-first, removendo a dependência do Tailwind e consolidando todos os tokens no tema MUI.

**Architecture:** Tokens centralizados em `src/lib/theme/designSystem.ts` + paletas em `src/lib/theme/colors/{dark,light,semantic,chart}.ts` + overrides em `src/lib/theme/config/muiComponents.ts`. O tema é assemblado em `MainThemeProvider.tsx` via `createTheme(...)`. O consumo é feito pelos ~110 arquivos que já usam `sx`/`styled()` do MUI; a remoção do Tailwind fecha a gambiarra atual (`important: true`, `preflight: false`).

**Tech Stack:** React 18 + TypeScript 5.4 + Vite 6 + MUI 6 (`@mui/material`, `@mui/system`, `@mui/x-date-pickers`) + Emotion.

**Spec:** `frontend/docs/superpowers/specs/2026-04-24-sp2-design-system-design.md` (commit `a007bcb`).

**Validação:** o frontend **não tem suite de testes automatizados**. Validação é `npm run type-check` + `npm run lint` + `npm run build` + validação visual em browser rodando o app via Docker (regra do projeto é Docker-only). Comandos de dev/build rodam DENTRO do container do Vite.

**Convenção de commits:** formato `<tipo>(<escopo>): <descrição>` em PT-BR, seguindo histórico do repo. Usar `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.

---

## File Structure

### Arquivos criados

| Path | Responsabilidade |
|---|---|
| `src/lib/theme/colors/dark.ts` | Paleta neutra dark-first canônica (bg, surface, elevated, input, border, text) + primary dark. |
| `src/lib/theme/colors/light.ts` | Paleta light secundária derivada. |
| `src/lib/theme/colors/semantic.ts` | Cores `success`/`warning`/`error`/`info` para dark e light. |
| `src/lib/theme/colors/chart.ts` | Paleta de chart (8 cores harmônicas) + utilitários `getChartColor`, `getGradientColors`. Substitui `chartColors.ts`. |

### Arquivos modificados

| Path | O que muda |
|---|---|
| `src/lib/theme/colors/index.ts` | Re-exportar nova estrutura; remover exports de `fuseDark`, `skyBlue`, `chartColors`, `brandColors`. Manter `lightPaletteText`, `darkPaletteText` (compat) ou removê-los se não usados. |
| `src/lib/theme/designSystem.ts` | Adicionar `typographyScale`, `radiusTokens`, `elevationTokens`, `motionTokens`, `zIndexTokens`. Manter `spacingTokens` existente. |
| `src/lib/theme/themes.ts` | Simplificar para 2 temas: `default` (light) e `defaultDark` (dark). Consumir novas paletas e tokens. Remover `skyBlue*`, `fuseDark*`. |
| `src/lib/theme/config/muiComponents.ts` | Overrides consomem tokens novos (radius, motion, paleta). Remover hardcodes (`rgba(25, 118, 210, 0.06)`, etc.). |
| `src/lib/theme/MainThemeProvider.tsx` | Garantir que `optimizedThemeOptions` (typography + breakpoints + muiComponents) é injetado em `createTheme`. |
| `src/lib/theme/index.ts` | Ajustar exports: remover `fuseDark`, `skyBlue`, `brandColors`, `simplifiedThemes`, `extendedThemes` se deixarem de existir. Exportar novos tokens. |
| `src/lib/theme/globalStyles.ts` | Alinhar com nova paleta (dark-first). |
| `src/features/redirect/components/RedirectSettings.tsx` | Converter `className` Tailwind para `sx`. |
| `src/features/redirect/components/RedirectStats.tsx` | Converter `className` Tailwind para `sx`. |
| `src/App.tsx` | Converter `classes.containerRoot` do Notistack para `sx` ou configuração inline. |
| `src/features/links/components/list/LinksFilters.tsx:49` | Remover `className='filter-container'` (órfã). |
| `src/features/links/components/analytics/LinkAnalyticsTabs.tsx:69` | Remover `className='link-analytics-tabs-container'` (órfã). |
| `src/styles/index.css` | Remover `@tailwind base;` `@tailwind components;` `@tailwind utilities;` (linhas 16-18). |
| `package.json` | Remover deps: `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`. |
| `src/shared/ui/base/MetricCardOptimized.tsx` | Aplicar tokens (color, typography tabular-nums, radius, elevation). |
| `src/shared/ui/base/ChartCard.tsx` | Aplicar tokens. |
| `src/shared/ui/data-display/ChartCard.tsx` | Aplicar tokens (mesma mudança; consolidar num único caminho é SP3). |
| `src/shared/ui/base/TabPanel.tsx` | Aplicar tokens; indicador, hover, foco na nova paleta. |
| `src/shared/ui/base/EnhancedPaper.tsx` | Aplicar tokens de surface/elevated. |
| `src/shared/ui/navigation/PageBreadcrumb.tsx` | Cor/tipografia secundárias; separador neutro. |
| `src/shared/ui/feedback/skeletons/*` | Shimmer/pulse na paleta neutra. |
| `src/shared/layout/*` (topbar, sidebar, container) | Alinhamento com tokens novos (sem redesenhar IA). |
| `src/shared/ui/data-display/ApexChartWrapper.tsx` + `ApexChartWrapper.styled.tsx` | Consumir paleta `chart.ts`. |

### Arquivos deletados

| Path | Razão |
|---|---|
| `src/lib/theme/colors/fuseDark.ts` | Substituído pela paleta dark. |
| `src/lib/theme/colors/skyBlue.ts` | Substituído pela paleta dark/light. |
| `src/lib/theme/colors/chartColors.ts` | Substituído por `chart.ts`. |
| `tailwind.config.ts` | Tailwind removido do stack. |
| `postcss.config.js` | Única necessidade era Tailwind. |
| `src/lib/theme/utils/glassUtils.ts` | Avaliado na Camada 3; remover se sem consumidor. |
| `src/lib/theme/utils/gradientUtils.ts` | Avaliado na Camada 3; remover se sem consumidor. |
| `src/lib/theme/themes/index.ts` (pasta vazia) | Remover se ficar vazio após consolidação. |

---

## Camadas (entrega incremental)

- **Camada 1 — Tokens base + remoção do Tailwind** (Tasks 1-18). Após esta camada, o app roda, o visual aparenta-se similar ao atual mas com tokens novos; Tailwind sumiu do stack.
- **Camada 2 — Componentes base** (Tasks 19-27). Os 8 componentes canônicos ganham a linguagem visual final; as demais telas herdam via tema.
- **Camada 3 — Polimento e limpeza** (Tasks 28-31). Motion, remoção de utilitários sem uso, validação final.

Cada tarefa termina com `npm run quality` e `npm run build` verdes dentro do container Docker. Validação visual em browser acontece nos checkpoints (Tasks 18, 27, 31).

**Comando-padrão para rodar scripts dentro do Docker** (usado ao longo do plano):

```bash
docker compose -f docker-compose.yml run --rm frontend npm run <script>
```

Ou, se o stack já estiver up:

```bash
docker compose exec frontend npm run <script>
```

---

# Camada 1 — Tokens base + remoção do Tailwind

## Task 1: Criar paleta dark

**Files:**
- Create: `src/lib/theme/colors/dark.ts`

- [ ] **Step 1: Criar o arquivo com a paleta dark canônica**

```ts
/**
 * Paleta dark-first canônica do Link Chart.
 * Tom: adulto/negócios, alto contraste informacional, zero neon.
 */

export const darkNeutral = {
	bg: '#0A0A0B',
	surface: '#111113',
	elevated: '#18181B',
	input: '#1C1C1F',
	border: {
		subtle: 'rgba(255, 255, 255, 0.06)',
		default: 'rgba(255, 255, 255, 0.10)',
		strong: 'rgba(255, 255, 255, 0.16)'
	},
	text: {
		primary: 'rgba(255, 255, 255, 0.95)',
		secondary: 'rgba(255, 255, 255, 0.68)',
		tertiary: 'rgba(255, 255, 255, 0.52)',
		disabled: 'rgba(255, 255, 255, 0.32)'
	}
} as const;

/**
 * Azul dessaturado business — shines against dark bg.
 */
export const darkPrimary = {
	50: '#EFF4FA',
	100: '#D6E3F1',
	200: '#AEC7E3',
	300: '#7DA3CF',
	400: '#5B8DEF', // main hover
	500: '#4E82E6', // main
	600: '#3C6CCC',
	700: '#2C5AA0',
	800: '#1F3F74',
	900: '#152C4A',
	main: '#4E82E6',
	light: '#7DA3CF',
	dark: '#2C5AA0',
	contrastText: '#FFFFFF'
} as const;

export const darkPalette = {
	mode: 'dark' as const,
	neutral: darkNeutral,
	primary: darkPrimary,
	background: {
		default: darkNeutral.bg,
		paper: darkNeutral.surface
	},
	text: {
		primary: darkNeutral.text.primary,
		secondary: darkNeutral.text.secondary,
		disabled: darkNeutral.text.disabled
	},
	divider: darkNeutral.border.default
} as const;

export default darkPalette;
```

- [ ] **Step 2: Rodar type-check e confirmar que o arquivo compila**

```bash
docker compose exec frontend npm run type-check
```

Expected: sem erros (o arquivo ainda não é importado em lugar nenhum, então só checa sintaxe/tipo).

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme/colors/dark.ts
git commit -m "feat(theme): adicionar paleta dark canônica"
```

---

## Task 2: Criar paleta light

**Files:**
- Create: `src/lib/theme/colors/light.ts`

- [ ] **Step 1: Criar o arquivo com a paleta light**

```ts
/**
 * Paleta light derivada (modo secundário).
 * Invertida em neutros, primary ajustado para contrastar contra bg claro.
 */

export const lightNeutral = {
	bg: '#FAFAFA',
	surface: '#FFFFFF',
	elevated: '#FFFFFF',
	input: '#F4F4F5',
	border: {
		subtle: 'rgba(0, 0, 0, 0.06)',
		default: 'rgba(0, 0, 0, 0.10)',
		strong: 'rgba(0, 0, 0, 0.16)'
	},
	text: {
		primary: 'rgba(0, 0, 0, 0.92)',
		secondary: 'rgba(0, 0, 0, 0.64)',
		tertiary: 'rgba(0, 0, 0, 0.48)',
		disabled: 'rgba(0, 0, 0, 0.32)'
	}
} as const;

export const lightPrimary = {
	50: '#EFF4FA',
	100: '#D6E3F1',
	200: '#AEC7E3',
	300: '#7DA3CF',
	400: '#4E82E6',
	500: '#2C5AA0', // main em light (mais escuro para contraste)
	600: '#234977',
	700: '#1C3A61',
	800: '#152C4A',
	900: '#0E1E33',
	main: '#2C5AA0',
	light: '#4E82E6',
	dark: '#1C3A61',
	contrastText: '#FFFFFF'
} as const;

export const lightPalette = {
	mode: 'light' as const,
	neutral: lightNeutral,
	primary: lightPrimary,
	background: {
		default: lightNeutral.bg,
		paper: lightNeutral.surface
	},
	text: {
		primary: lightNeutral.text.primary,
		secondary: lightNeutral.text.secondary,
		disabled: lightNeutral.text.disabled
	},
	divider: lightNeutral.border.default
} as const;

export default lightPalette;
```

- [ ] **Step 2: Type-check**

```bash
docker compose exec frontend npm run type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme/colors/light.ts
git commit -m "feat(theme): adicionar paleta light derivada"
```

---

## Task 3: Criar paleta semantic

**Files:**
- Create: `src/lib/theme/colors/semantic.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
/**
 * Cores semânticas (success, warning, error, info) para ambos os modos.
 * Tons adultos dessaturados — zero neon.
 */

export interface SemanticShade {
	main: string;
	light: string;
	dark: string;
	subtleBg: string;
	border: string;
	contrastText: string;
}

export interface SemanticPalette {
	success: SemanticShade;
	warning: SemanticShade;
	error: SemanticShade;
	info: SemanticShade;
}

/**
 * Para dark mode — cores vibram contra superfícies escuras.
 */
export const semanticDark: SemanticPalette = {
	success: {
		main: '#34D399',
		light: '#6EE7B7',
		dark: '#059669',
		subtleBg: 'rgba(52, 211, 153, 0.10)',
		border: 'rgba(52, 211, 153, 0.32)',
		contrastText: '#031810'
	},
	warning: {
		main: '#F59E0B',
		light: '#FBBF24',
		dark: '#B45309',
		subtleBg: 'rgba(245, 158, 11, 0.10)',
		border: 'rgba(245, 158, 11, 0.32)',
		contrastText: '#1A1203'
	},
	error: {
		main: '#F87171',
		light: '#FCA5A5',
		dark: '#DC2626',
		subtleBg: 'rgba(248, 113, 113, 0.10)',
		border: 'rgba(248, 113, 113, 0.32)',
		contrastText: '#1A0404'
	},
	info: {
		main: '#60A5FA',
		light: '#93C5FD',
		dark: '#2563EB',
		subtleBg: 'rgba(96, 165, 250, 0.10)',
		border: 'rgba(96, 165, 250, 0.32)',
		contrastText: '#04101F'
	}
};

/**
 * Para light mode — ajustado para contraste.
 */
export const semanticLight: SemanticPalette = {
	success: {
		main: '#059669',
		light: '#34D399',
		dark: '#047857',
		subtleBg: 'rgba(5, 150, 105, 0.08)',
		border: 'rgba(5, 150, 105, 0.24)',
		contrastText: '#FFFFFF'
	},
	warning: {
		main: '#D97706',
		light: '#F59E0B',
		dark: '#B45309',
		subtleBg: 'rgba(217, 119, 6, 0.08)',
		border: 'rgba(217, 119, 6, 0.24)',
		contrastText: '#FFFFFF'
	},
	error: {
		main: '#DC2626',
		light: '#EF4444',
		dark: '#B91C1C',
		subtleBg: 'rgba(220, 38, 38, 0.08)',
		border: 'rgba(220, 38, 38, 0.24)',
		contrastText: '#FFFFFF'
	},
	info: {
		main: '#2563EB',
		light: '#3B82F6',
		dark: '#1D4ED8',
		subtleBg: 'rgba(37, 99, 235, 0.08)',
		border: 'rgba(37, 99, 235, 0.24)',
		contrastText: '#FFFFFF'
	}
};
```

- [ ] **Step 2: Type-check**

```bash
docker compose exec frontend npm run type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme/colors/semantic.ts
git commit -m "feat(theme): adicionar paleta semântica dark/light"
```

---

## Task 4: Criar paleta de chart

**Files:**
- Create: `src/lib/theme/colors/chart.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
/**
 * Paleta dedicada a charts — 8 cores harmônicas, dark-first, alto contraste.
 * Substitui colors/chartColors.ts.
 */

/**
 * Cores canônicas em ordem de prioridade visual para séries múltiplas.
 */
export const chartPalette = [
	'#5B8DEF', // business blue
	'#34D399', // emerald
	'#F59E0B', // amber
	'#A78BFA', // violet
	'#22D3EE', // cyan
	'#F472B6', // muted pink
	'#FB923C', // orange
	'#FDE047' // yellow
] as const;

/**
 * Mapeamento por tipo de dado.
 */
export const chartByType = {
	devices: {
		mobile: '#5B8DEF',
		desktop: '#34D399',
		tablet: '#F59E0B'
	},
	geographic: {
		countries: '#34D399',
		states: '#F59E0B',
		cities: '#A78BFA'
	},
	temporal: {
		hourly: '#F59E0B',
		daily: '#5B8DEF',
		weekly: '#34D399'
	},
	heatmap: {
		low: '#1E3A5F',
		medium: '#2C5AA0',
		high: '#5B8DEF',
		intense: '#8AB0F5'
	}
} as const;

/**
 * Gradientes leves (ápice + claro) por cor base.
 */
const gradients: Record<string, readonly [string, string]> = {
	'#5B8DEF': ['#5B8DEF', '#8AB0F5'],
	'#34D399': ['#34D399', '#6EE7B7'],
	'#F59E0B': ['#F59E0B', '#FBBF24'],
	'#A78BFA': ['#A78BFA', '#C4B5FD'],
	'#22D3EE': ['#22D3EE', '#67E8F9'],
	'#F472B6': ['#F472B6', '#F9A8D4'],
	'#FB923C': ['#FB923C', '#FDBA74'],
	'#FDE047': ['#FDE047', '#FEF08A']
};

export function getChartColor(index: number): string {
	return chartPalette[index % chartPalette.length];
}

export function getGradientColors(baseColor: string): readonly [string, string] {
	return gradients[baseColor] ?? [baseColor, baseColor];
}

/**
 * Alias para compatibilidade com consumidores antigos de chartColors.
 * @deprecated Usar chartPalette e getChartColor diretamente.
 */
export const chartColors = {
	primary: chartPalette[0],
	success: chartPalette[1],
	warning: chartPalette[2],
	error: '#F87171',
	info: chartPalette[4],
	secondary: chartPalette[5],
	extended: [...chartPalette],
	devices: chartByType.devices,
	geographic: chartByType.geographic,
	temporal: chartByType.temporal,
	heatmap: chartByType.heatmap
} as const;
```

- [ ] **Step 2: Type-check**

```bash
docker compose exec frontend npm run type-check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme/colors/chart.ts
git commit -m "feat(theme): adicionar paleta de chart harmônica"
```

---

## Task 5: Atualizar colors/index.ts e deletar paletas antigas

**Files:**
- Modify: `src/lib/theme/colors/index.ts`
- Delete: `src/lib/theme/colors/fuseDark.ts`
- Delete: `src/lib/theme/colors/skyBlue.ts`
- Delete: `src/lib/theme/colors/chartColors.ts`

- [ ] **Step 1: Localizar quem importa `fuseDark`, `skyBlue`, `chartColors`, `brandColors`**

```bash
docker compose exec frontend sh -c "grep -rE 'from .(\\./)?(colors|\\.\\./(theme/)?colors)' src --include='*.ts' --include='*.tsx'"
```

Registrar os consumidores para ajustar na Task 6 (themes.ts) e Tasks 19-26 (componentes base). Se algum consumidor fora do `theme/` usa `chartColors`, ele segue funcionando porque `chart.ts` exporta um alias `chartColors` deprecated.

- [ ] **Step 2: Reescrever `src/lib/theme/colors/index.ts`**

```ts
/**
 * Exports centralizados das paletas do design system.
 */

// Paletas canônicas
export { darkPalette, darkNeutral, darkPrimary } from './dark';
export { lightPalette, lightNeutral, lightPrimary } from './light';
export { semanticDark, semanticLight } from './semantic';
export type { SemanticShade, SemanticPalette } from './semantic';

// Chart
export { chartPalette, chartByType, getChartColor, getGradientColors, chartColors } from './chart';
```

- [ ] **Step 3: Deletar arquivos obsoletos**

```bash
rm src/lib/theme/colors/fuseDark.ts src/lib/theme/colors/skyBlue.ts src/lib/theme/colors/chartColors.ts
```

- [ ] **Step 4: Corrigir imports quebrados nos consumidores listados no Step 1**

Para cada consumidor que usava `brandColors`, `fuseDark`, `skyBlue`, `lightPaletteText`, `darkPaletteText` diretamente:
- Em código não-tema (fora de `src/lib/theme`): trocar por referência a `theme.palette.primary.main` ou equivalente via MUI `sx`/`useTheme()`.
- Em `themes.ts` (próxima task): já será reescrito na Task 6; ignorar.

Se algum consumidor fizer algo genérico (`import * from '@/theme/colors'`), revisar caso a caso.

- [ ] **Step 5: Rodar quality**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

Expected: sem erros. Qualquer erro aqui aponta consumidor esquecido do Step 4.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme/colors
git commit -m "refactor(theme): consolidar paletas em dark/light/semantic/chart"
```

---

## Task 6: Expandir designSystem.ts com novos tokens

**Files:**
- Modify: `src/lib/theme/designSystem.ts`

Manter tudo que já está em `spacingTokens`, `layoutSpacing`, `borderRadiusTokens`, `animationDurations`, `animationEasings`. Adicionar novos eixos: typography scale, radius escala business, elevation, motion, z-index.

- [ ] **Step 1: Ler designSystem.ts completo para ver o que já existe**

```bash
cat src/lib/theme/designSystem.ts
```

- [ ] **Step 2: Adicionar novos tokens ao final do arquivo**

Inserir ANTES do último `export` ou no final:

```ts
// ========================================
// 🔤 TYPOGRAPHY SCALE (SP2)
// ========================================

export const typographyScale = {
	display: { fontSize: '3rem', lineHeight: 1.17, fontWeight: 600 },
	h1: { fontSize: '2rem', lineHeight: 1.25, fontWeight: 600 },
	h2: { fontSize: '1.5rem', lineHeight: 1.33, fontWeight: 600 },
	h3: { fontSize: '1.25rem', lineHeight: 1.4, fontWeight: 600 },
	h4: { fontSize: '1.125rem', lineHeight: 1.55, fontWeight: 600 },
	h5: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 500 },
	h6: { fontSize: '0.875rem', lineHeight: 1.43, fontWeight: 500 },
	bodyLg: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 400 },
	body: { fontSize: '0.875rem', lineHeight: 1.43, fontWeight: 400 },
	bodySm: { fontSize: '0.8125rem', lineHeight: 1.54, fontWeight: 400 },
	caption: { fontSize: '0.75rem', lineHeight: 1.33, fontWeight: 400 },
	code: { fontSize: '0.8125rem', lineHeight: 1.54, fontWeight: 400, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
} as const;

// ========================================
// 📐 RADIUS SCALE (SP2)
// ========================================

export const radiusTokens = {
	none: 0,
	sm: 4,
	md: 8, // default da app
	lg: 12,
	xl: 16,
	full: 9999
} as const;

// ========================================
// 🌓 ELEVATION (SP2)
// ========================================

/**
 * Em dark mode, elevação é primariamente diferença de bg (neutral.surface → elevated).
 * Shadows são sutis e servem como reforço, não como principal sinal de profundidade.
 */
export const elevationTokens = {
	none: 'none',
	xs: '0 1px 2px 0 rgba(0, 0, 0, 0.24)',
	sm: '0 2px 4px 0 rgba(0, 0, 0, 0.28)',
	md: '0 4px 12px 0 rgba(0, 0, 0, 0.32)',
	lg: '0 12px 24px -4px rgba(0, 0, 0, 0.40)'
} as const;

/**
 * Em light mode, shadows carregam mais peso visual.
 */
export const elevationLightTokens = {
	none: 'none',
	xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
	sm: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
	md: '0 4px 12px 0 rgba(0, 0, 0, 0.10)',
	lg: '0 12px 24px -4px rgba(0, 0, 0, 0.14)'
} as const;

// ========================================
// 🎬 MOTION (SP2)
// ========================================

export const motionTokens = {
	duration: {
		instant: '0ms',
		fast: '120ms',
		base: '180ms',
		slow: '260ms',
		slower: '400ms'
	},
	easing: {
		default: 'cubic-bezier(0.4, 0, 0.2, 1)',
		in: 'cubic-bezier(0.4, 0, 1, 1)',
		out: 'cubic-bezier(0, 0, 0.2, 1)',
		linear: 'linear'
	}
} as const;

// ========================================
// 🎚️ Z-INDEX (SP2)
// ========================================

export const zIndexTokens = {
	hide: -1,
	base: 0,
	elevated: 10,
	sticky: 100,
	overlay: 1000,
	modal: 1300,
	popover: 1400,
	tooltip: 1500,
	toast: 1600
} as const;
```

- [ ] **Step 3: Type-check**

```bash
docker compose exec frontend npm run type-check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/theme/designSystem.ts
git commit -m "feat(theme): adicionar typography, radius, elevation, motion, z-index tokens"
```

---

## Task 7: Reescrever themes.ts para 2 temas consumindo tokens novos

**Files:**
- Modify: `src/lib/theme/themes.ts`

- [ ] **Step 1: Substituir inteiramente o conteúdo de `themes.ts`**

```ts
/**
 * Temas canônicos do Link Chart — dark (primário) e light (secundário).
 */

import { darkPalette, lightPalette, semanticDark, semanticLight } from './colors';

import type { FuseThemesType } from './types/theme';

// ========================================
// 🌙 TEMA DARK (CANÔNICO)
// ========================================

export const defaultDarkTheme = {
	palette: {
		...darkPalette,
		success: {
			light: semanticDark.success.light,
			main: semanticDark.success.main,
			dark: semanticDark.success.dark,
			contrastText: semanticDark.success.contrastText
		},
		warning: {
			light: semanticDark.warning.light,
			main: semanticDark.warning.main,
			dark: semanticDark.warning.dark,
			contrastText: semanticDark.warning.contrastText
		},
		error: {
			light: semanticDark.error.light,
			main: semanticDark.error.main,
			dark: semanticDark.error.dark,
			contrastText: semanticDark.error.contrastText
		},
		info: {
			light: semanticDark.info.light,
			main: semanticDark.info.main,
			dark: semanticDark.info.dark,
			contrastText: semanticDark.info.contrastText
		},
		secondary: {
			light: darkPalette.neutral.border.strong,
			main: darkPalette.neutral.text.secondary,
			dark: darkPalette.neutral.text.tertiary,
			contrastText: darkPalette.neutral.text.primary
		}
	}
};

// ========================================
// 🌞 TEMA LIGHT (SECUNDÁRIO)
// ========================================

export const defaultLightTheme = {
	palette: {
		...lightPalette,
		success: {
			light: semanticLight.success.light,
			main: semanticLight.success.main,
			dark: semanticLight.success.dark,
			contrastText: semanticLight.success.contrastText
		},
		warning: {
			light: semanticLight.warning.light,
			main: semanticLight.warning.main,
			dark: semanticLight.warning.dark,
			contrastText: semanticLight.warning.contrastText
		},
		error: {
			light: semanticLight.error.light,
			main: semanticLight.error.main,
			dark: semanticLight.error.dark,
			contrastText: semanticLight.error.contrastText
		},
		info: {
			light: semanticLight.info.light,
			main: semanticLight.info.main,
			dark: semanticLight.info.dark,
			contrastText: semanticLight.info.contrastText
		},
		secondary: {
			light: lightPalette.neutral.border.strong,
			main: lightPalette.neutral.text.secondary,
			dark: lightPalette.neutral.text.tertiary,
			contrastText: lightPalette.neutral.text.primary
		}
	}
};

// ========================================
// 📤 EXPORTS
// ========================================

export const allThemes: FuseThemesType = {
	default: defaultLightTheme,
	defaultDark: defaultDarkTheme
};

export const themesConfig = allThemes;

export default allThemes;
```

- [ ] **Step 2: Atualizar `src/lib/theme/index.ts` — remover exports obsoletos**

Abrir `src/lib/theme/index.ts` e ajustar o bloco de `colors` e de `themes`:

Trecho atual (colors):
```ts
export {
	fuseDark,
	skyBlue,
	chartColors,
	getChartColor,
	getGradientColors,
	lightPaletteText,
	darkPaletteText,
	brandColors
} from './colors';
```

Substituir por:
```ts
export {
	darkPalette,
	darkNeutral,
	darkPrimary,
	lightPalette,
	lightNeutral,
	lightPrimary,
	semanticDark,
	semanticLight,
	chartPalette,
	chartByType,
	getChartColor,
	getGradientColors,
	chartColors
} from './colors';
```

Trecho atual (themes):
```ts
export { allThemes, allThemes as themesConfig, simplifiedThemes, extendedThemes } from './themes';
```

Substituir por:
```ts
export { allThemes, themesConfig, defaultDarkTheme, defaultLightTheme } from './themes';
```

Exportar tokens novos do designSystem (adicionar depois do export existente de `createDesignTokens`):
```ts
export {
	typographyScale,
	radiusTokens,
	elevationTokens,
	elevationLightTokens,
	motionTokens,
	zIndexTokens
} from './designSystem';
```

- [ ] **Step 3: Type-check e lint**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

Possíveis erros: algum componente/config que importe `extendedThemes`, `simplifiedThemes`, `brandColors`. Corrigir:
- `extendedThemes`, `simplifiedThemes`: se houver consumidor, remover a referência (esses temas não existem mais).
- `brandColors`: se houver consumidor fora do tema, substituir por `theme.palette.primary.*` via `useTheme()` ou `sx`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/theme/themes.ts src/lib/theme/index.ts
git commit -m "refactor(theme): consolidar em 2 temas canônicos (dark/light)"
```

---

## Task 8: Atualizar muiComponents.ts para consumir tokens novos

**Files:**
- Modify: `src/lib/theme/config/muiComponents.ts`

Objetivo: substituir hardcodes (radius em `theme.spacing(1.5)`, cores rgba inline, durations '0.25s') por referências a `radiusTokens`, `motionTokens`, paleta do tema.

- [ ] **Step 1: Substituir `typography` no topo do arquivo**

Trecho atual:
```ts
export const typography = {
	fontFamily: ['Inter var', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
	fontWeightLight: 300,
	fontWeightRegular: 400,
	fontWeightMedium: 500,
	fontSize: 13,
	body1: { fontSize: '0.8125rem' },
	body2: { fontSize: '0.8125rem' }
};
```

Substituir por:
```ts
import { typographyScale } from '../designSystem';

export const typography = {
	fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'].join(','),
	fontWeightRegular: 400,
	fontWeightMedium: 500,
	fontWeightBold: 600,
	fontSize: 14,
	display: typographyScale.display,
	h1: typographyScale.h1,
	h2: typographyScale.h2,
	h3: typographyScale.h3,
	h4: typographyScale.h4,
	h5: typographyScale.h5,
	h6: typographyScale.h6,
	body1: typographyScale.body,
	body2: typographyScale.bodySm,
	caption: typographyScale.caption,
	overline: typographyScale.caption,
	button: { fontSize: typographyScale.body.fontSize, fontWeight: 500, textTransform: 'none' }
} as const;
```

Nota: pesos 300/700/800/900 não são carregados. A família `Inter` (sem `var`) carrega via Google Fonts se configurado; se o projeto hoje usa `Inter var` local, confirmar no `public/` e `index.html`. Se precisar manter `Inter var` como fallback primário, trocar a primeira entrada.

- [ ] **Step 2: Substituir hardcodes de radius por `radiusTokens.md`**

No topo do arquivo (após o import de `typographyScale`):
```ts
import { radiusTokens, motionTokens } from '../designSystem';
```

Em todos os `borderRadius: theme.spacing(1.5)` e `borderRadius: theme.spacing(2)`, substituir por `borderRadius: radiusTokens.md` (8px; tons sóbrios). Exceção: `MuiCard` pode manter `radiusTokens.lg` (12px) para diferenciação. `MuiDialog` e `MuiPopover` → `radiusTokens.lg`.

Lista de substituições:
- `MuiButton.root.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiIconButton.root.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiButtonGroup.root.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiInputBase.root.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiInputBase.sizeSmall.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiInputBase.sizeMedium.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiInputBase.sizeLarge.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`
- `MuiFilledInput.root.borderRadius: theme.spacing(1)` → `radiusTokens.md`
- `MuiPaper.root.borderRadius: theme.spacing(2)` → `radiusTokens.md`
- `MuiCard.root.borderRadius: theme.spacing(2)` → `radiusTokens.lg`
- `MuiBox.metric-container.borderRadius: theme.spacing(2)` → `radiusTokens.lg`
- `MuiDialog.paper.borderRadius: theme.spacing(1.5)` → `radiusTokens.lg`
- `MuiPopover.paper.borderRadius: theme.spacing(1.5)` → `radiusTokens.md`

- [ ] **Step 3: Substituir `transition` hardcodes por tokens de motion**

Procurar `transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'` e substituir por:
```ts
transition: `all ${motionTokens.duration.slow} ${motionTokens.easing.default}`
```

Procurar `transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'` e substituir por:
```ts
transition: `all ${motionTokens.duration.base} ${motionTokens.easing.default}`
```

Ocorrências: `MuiButton.root`, `MuiCard.root`, `MuiFilledInput.root`, `MuiTab.root`.

- [ ] **Step 4: Remover efeito `translateY(-1px)` no hover de botões e `translateY(-2px)` no hover de cards**

Motion decorativa; viola princípio do POV sóbrio. Remover os blocos:

```ts
// Em MuiButton.root.styleOverrides:
'&:hover': {
	transform: 'translateY(-1px)'
}
```
Substituir por: remover o bloco inteiro (o hover default do MUI com background change é suficiente) OU trocar por `filter: 'brightness(1.1)'` se precisar de feedback visual explícito. Recomendação: remover.

```ts
// Em MuiCard.root:
'&:hover': {
	transform: 'translateY(-2px)'
}
```
Remover.

- [ ] **Step 5: Substituir cor hardcoded no MuiTab**

Trecho atual:
```ts
MuiTab: {
	styleOverrides: {
		root: {
			textTransform: 'none',
			transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
			'&.Mui-selected': {
				backgroundColor: 'rgba(25, 118, 210, 0.06)',
				color: 'primary.main',
				'&:hover': {
					backgroundColor: 'rgba(25, 118, 210, 0.08)'
				}
			}
		}
	}
}
```

Substituir por (usando o callback `({ theme })` para ter acesso à paleta):
```ts
MuiTab: {
	styleOverrides: {
		root: ({ theme }: { theme: Theme }) => ({
			textTransform: 'none',
			transition: `all ${motionTokens.duration.base} ${motionTokens.easing.default}`,
			'&.Mui-selected': {
				color: theme.palette.primary.main,
				backgroundColor:
					theme.palette.mode === 'dark'
						? 'rgba(91, 141, 239, 0.10)'
						: 'rgba(44, 90, 160, 0.06)',
				'&:hover': {
					backgroundColor:
						theme.palette.mode === 'dark'
							? 'rgba(91, 141, 239, 0.14)'
							: 'rgba(44, 90, 160, 0.08)'
				}
			}
		})
	}
}
```

- [ ] **Step 6: Remover z-index hardcoded 99999; consumir zIndexTokens.popover**

Adicionar no import:
```ts
import { radiusTokens, motionTokens, zIndexTokens } from '../designSystem';
```

Trecho atual:
```ts
const highPriorityComponents = {
	MuiPickersPopper: {
		styleOverrides: { root: { zIndex: 99999 } }
	},
	MuiAutocomplete: {
		styleOverrides: { popper: { zIndex: 99999 } }
	}
};
```

Substituir por:
```ts
const highPriorityComponents = {
	MuiPickersPopper: {
		styleOverrides: { root: { zIndex: zIndexTokens.popover } }
	},
	MuiAutocomplete: {
		styleOverrides: { popper: { zIndex: zIndexTokens.popover } }
	}
};
```

- [ ] **Step 7: Type-check e lint**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/theme/config/muiComponents.ts
git commit -m "refactor(theme): muiComponents consome tokens (radius, motion, z-index)"
```

---

## Task 9: Garantir que optimizedThemeOptions é aplicado em createTheme

**Files:**
- Modify: `src/lib/theme/MainThemeProvider.tsx`

Hoje o `MainThemeProvider.tsx` chama `createTheme(mainTheme)` passando só a config vinda de `useMainTheme()`. Se `optimizedThemeOptions` (typography + breakpoints + muiComponents) não estiver sendo mesclado em outro lugar, os overrides não se aplicam. Precisamos verificar e corrigir.

- [ ] **Step 1: Inspecionar o hook que gera `mainTheme`**

```bash
cat src/lib/theme/hooks/fuseThemeHooks.tsx
```

Se o hook retorna um objeto que já inclui `components` e `typography`, prossegue. Caso contrário, mesclar `optimizedThemeOptions` manualmente no `MainThemeProvider.tsx`.

- [ ] **Step 2: Se necessário, atualizar `MainThemeProvider.tsx`**

Substituir o bloco `createTheme`:
```ts
const muiTheme = useMemo(() => {
	if (!mainTheme) {
		return createTheme();
	}
	return createTheme(mainTheme);
}, [mainTheme]);
```

Por:
```ts
import { optimizedThemeOptions } from './config';

const muiTheme = useMemo(() => {
	if (!mainTheme) {
		return createTheme(optimizedThemeOptions);
	}
	return createTheme({
		...optimizedThemeOptions,
		...mainTheme,
		components: {
			...optimizedThemeOptions.components,
			...(mainTheme as { components?: unknown }).components
		},
		typography: {
			...optimizedThemeOptions.typography,
			...(mainTheme as { typography?: unknown }).typography
		}
	});
}, [mainTheme]);
```

(Se `useMainTheme` já resolve isso, pular este step.)

- [ ] **Step 3: Type-check e build**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run build
```

- [ ] **Step 4: Commit (se houve mudança)**

```bash
git add src/lib/theme/MainThemeProvider.tsx
git commit -m "fix(theme): garantir merge de optimizedThemeOptions em createTheme"
```

---

## Task 10: Ajustar globalStyles.ts para nova paleta

**Files:**
- Modify: `src/lib/theme/globalStyles.ts`

- [ ] **Step 1: Inspecionar o arquivo**

```bash
cat src/lib/theme/globalStyles.ts
```

- [ ] **Step 2: Ajustar valores hardcoded**

Alvos:
- Backgrounds que referenciam `#121212`, `#1E2125`, `#FAFAFA`, `#FFFFFF` diretos: trocar por `darkNeutral.bg`, `darkNeutral.surface`, `lightNeutral.bg`, `lightNeutral.surface` via import.
- Cores de texto `rgb(255, 255, 255)`, `rgb(33, 33, 33)`, `rgb(95, 99, 104)`: trocar por `darkNeutral.text.primary`, `lightNeutral.text.primary`, etc.
- Scrollbar: se definida, usar `neutral.border.default` como thumb.

Import a adicionar:
```ts
import { darkNeutral, lightNeutral } from './colors';
```

(Se o arquivo fizer `applyGlobalStyles` como função com `document.body.style.*`, as mudanças são pontuais; não reescrever a função inteira.)

- [ ] **Step 3: Type-check e build**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/theme/globalStyles.ts
git commit -m "refactor(theme): globalStyles consome neutros da nova paleta"
```

---

## Task 11: Validação consolidada da parte de tokens (checkpoint intermediário)

- [ ] **Step 1: Rodar quality completo**

```bash
docker compose exec frontend npm run quality
```

Expected: `type-check` + `lint` + `format:check` todos passam. Se `format:check` falhar, rodar `npm run format` e commitar separadamente:
```bash
git add -A
git commit -m "style: prettier auto-format pós tokens SP2"
```

- [ ] **Step 2: Build de produção**

```bash
docker compose exec frontend npm run build
```

Expected: build termina sem erros. Warnings de bundle size são aceitáveis.

- [ ] **Step 3: Subir dev server e validar boot**

```bash
docker compose up -d frontend
docker compose logs -f frontend
```

Expected: Vite serve em `http://localhost:3000`, sem erros no console. Navegar para a home: a app deve carregar. Pode haver divergências visuais menores (cores, radius) — esperado, porque tokens mudaram mas componentes base ainda não.

- [ ] **Step 4: Commit se houver qualquer mudança colateral**

Nenhum commit nessa task a menos que format tenha auto-alterado.

---

## Task 12: Converter Tailwind em RedirectSettings.tsx

**Files:**
- Modify: `src/features/redirect/components/RedirectSettings.tsx`

- [ ] **Step 1: Ler o arquivo inteiro**

```bash
cat src/features/redirect/components/RedirectSettings.tsx
```

- [ ] **Step 2: Substituir classNames Tailwind por `sx`**

Mapeamento canônico a aplicar:

| Tailwind | sx equivalente |
|---|---|
| `className='max-w-2xl mx-auto'` | `sx={{ maxWidth: 672, mx: 'auto' }}` |
| `className='flex items-center gap-2'` | `sx={{ display: 'flex', alignItems: 'center', gap: 1 }}` |
| `className='flex items-center gap-2 mb-3'` | `sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}` |
| `className='bg-gray-50 dark:bg-gray-800 p-3 rounded'` | `sx={(theme) => ({ p: 1.5, borderRadius: 1, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] })}` |
| `className='mb-2'` | `sx={{ mb: 1 }}` |
| `className='justify-end gap-2'` | `sx={{ justifyContent: 'flex-end', gap: 1 }}` |

Para cada `<Box className='...'>` virar `<Box sx={{...}}>` mantendo o resto dos props. Para componentes não-Box (`<CardActions>`, `<Typography>`), usar `sx` direto.

- [ ] **Step 3: Validar localmente**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/features/redirect/components/RedirectSettings.tsx
git commit -m "refactor(redirect): migrar RedirectSettings de Tailwind para sx"
```

---

## Task 13: Converter Tailwind em RedirectStats.tsx

**Files:**
- Modify: `src/features/redirect/components/RedirectStats.tsx`

- [ ] **Step 1: Ler o arquivo inteiro**

```bash
cat src/features/redirect/components/RedirectStats.tsx
```

- [ ] **Step 2: Aplicar o mesmo mapeamento da Task 12**

Classes adicionais prováveis neste arquivo (expansão do mapeamento):

| Tailwind | sx equivalente |
|---|---|
| `className='space-y-4'` | `sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}` |
| `className='text-center'` | `sx={{ textAlign: 'center' }}` |
| `className='text-center py-8'` | `sx={{ textAlign: 'center', py: 4 }}` |
| `className='flex items-center justify-between'` | `sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}` |
| `className='flex-1 min-w-0'` | `sx={{ flex: 1, minWidth: 0 }}` |
| `className='truncate'` | `sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}` |
| `className='mb-3 flex items-center gap-2'` | `sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}` |
| `className='mt-2'` | `sx={{ mt: 1 }}` |
| `className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded'` | `sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] })}` |

- [ ] **Step 3: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/features/redirect/components/RedirectStats.tsx
git commit -m "refactor(redirect): migrar RedirectStats de Tailwind para sx"
```

---

## Task 14: Ajustar classes.containerRoot do Notistack em App.tsx

**Files:**
- Modify: `src/App.tsx:46-55` (bloco do `<SnackbarProvider>`)

- [ ] **Step 1: Substituir o bloco do SnackbarProvider**

Trecho atual (`src/App.tsx:46-55`):
```tsx
<SnackbarProvider
	maxSnack={5}
	anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'right'
	}}
	classes={{
		containerRoot: 'bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20 z-99'
	}}
>
```

Substituir por:

```tsx
<SnackbarProvider
	maxSnack={5}
	anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'right'
	}}
	style={{ zIndex: 99 }}
>
```

Decisão: remover as margens responsivas (`mb-13 md:mb-17 mr-2 lg:mr-20`) e deixar o Notistack usar posicionamento default. Se em validação visual da Task 18 aparecer sobreposição com footer/navbar, abrir item em "Achados Camada 1" e tratar na Camada 3.

- [ ] **Step 2: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor(app): remover classes Tailwind do SnackbarProvider"
```

---

## Task 15: Remover classes órfãs

**Files:**
- Modify: `src/features/links/components/list/LinksFilters.tsx:49`
- Modify: `src/features/links/components/analytics/LinkAnalyticsTabs.tsx:69`

- [ ] **Step 1: Confirmar que as classes são órfãs (sem CSS)**

```bash
docker compose exec frontend sh -c "grep -rE 'filter-container|link-analytics-tabs-container' src public --include='*.css' --include='*.scss' --include='*.ts' --include='*.tsx'"
```

Expected: só os dois usos nos JSX. Se aparecer uma definição em algum CSS/SCSS/JS, essa task muda — avaliar se a classe é necessária.

- [ ] **Step 2: Remover `className='filter-container'` em LinksFilters.tsx:49**

Usar Edit para remover o atributo. Se o componente ainda precisar de discriminação via prop (ex.: testes), avaliar; hoje provavelmente é só ruído.

- [ ] **Step 3: Remover `className='link-analytics-tabs-container'` em LinkAnalyticsTabs.tsx:69**

Mesmo procedimento.

- [ ] **Step 4: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/features/links/components/list/LinksFilters.tsx src/features/links/components/analytics/LinkAnalyticsTabs.tsx
git commit -m "chore: remover classNames órfãs (filter-container, link-analytics-tabs-container)"
```

---

## Task 16: Remover diretivas @tailwind do index.css

**Files:**
- Modify: `src/styles/index.css:16-18`

- [ ] **Step 1: Ler o arquivo**

```bash
cat src/styles/index.css
```

- [ ] **Step 2: Remover as três linhas**

Usar Edit para apagar as linhas:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Confirmar que não há `@apply` remanescente em nenhum CSS**

```bash
docker compose exec frontend sh -c "grep -rE '@apply|@tailwind' src --include='*.css' --include='*.scss'"
```

Expected: vazio.

- [ ] **Step 4: Commit**

```bash
git add src/styles/index.css
git commit -m "chore: remover diretivas @tailwind do CSS"
```

---

## Task 17: Remover pacotes e configs Tailwind

**Files:**
- Modify: `package.json`
- Delete: `tailwind.config.ts`
- Delete: `postcss.config.js`

- [ ] **Step 1: Ler `postcss.config.js` para confirmar que só contém config do Tailwind**

```bash
cat postcss.config.js
```

Se contiver outros plugins (CSS nesting, cssnano, etc.), **não deletar** o arquivo — remover apenas os plugins do Tailwind dele.

- [ ] **Step 2: Remover deps do package.json**

Remover das `dependencies`:
- `"@tailwindcss/postcss"`
- `"tailwindcss"`
- `"autoprefixer"` (só removerr se nada mais depender — comum vir só com Tailwind; confirmar procurando `require('autoprefixer')` ou `from 'autoprefixer'` no repo)

Confirmar autoprefixer não é usado em outro lugar:
```bash
docker compose exec frontend sh -c "grep -rE \"require\\('autoprefixer'\\)|from 'autoprefixer'\" . --include='*.ts' --include='*.js' --include='*.json' --include='*.mjs' --include='*.cjs' | grep -v node_modules"
```

Se a saída for só `postcss.config.js` (que vamos deletar) e `package.json`, pode remover autoprefixer com segurança.

- [ ] **Step 3: Deletar arquivos de config**

```bash
rm tailwind.config.ts
```

Se `postcss.config.js` for puramente Tailwind:
```bash
rm postcss.config.js
```

- [ ] **Step 4: Rodar `npm install` dentro do container**

```bash
docker compose exec frontend npm install
```

Expected: atualiza `package-lock.json`, remove `tailwindcss`, `@tailwindcss/postcss` e (opcional) `autoprefixer` do `node_modules`.

- [ ] **Step 5: Validar build**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

Expected: todos passam. Se build falhar porque algum arquivo ainda referencia Tailwind, investigar.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts postcss.config.js
git commit -m "chore: remover Tailwind (pacotes, tailwind.config.ts, postcss.config.js)"
```

Observação: `tailwind.config.ts` e `postcss.config.js` aparecem como deletados no `git status`; o `git add` com os paths permite stage da deleção.

---

## Task 18: Checkpoint de validação da Camada 1

- [ ] **Step 1: Subir stack do frontend e backend (proxy /api → 8000)**

```bash
cd /Users/bruno/Projects/link-charts/backend && docker compose up -d
cd /Users/bruno/Projects/link-charts/frontend && docker compose up -d
```

- [ ] **Step 2: Abrir app no browser**

`http://localhost:3000`. Navegar através das telas principais (mesmo que o visual ainda não esteja "final" — é esperado):

1. Home/landing
2. Sign-in ou Sign-up (fluxo de auth)
3. Link list (`/link`)
4. Link create (`/link/create`)
5. Link analytics (`/link/analytic/:id` — criar um link primeiro ou usar algum já existente)
6. Shorter (`/shorter`)

- [ ] **Step 3: Validação funcional**

Verificar visualmente:
- App boota sem quebrar.
- Cores básicas (background, paper) aparentam consistentes com a nova paleta (bg escuro "sóbrio", não azul navy forte).
- Inputs e botões têm radius menor (8px) do que antes (12px).
- Notistack aparece na base direita sem sobrepor conteúdo crítico.
- Telas que usavam Tailwind (`RedirectSettings`, `RedirectStats`) renderizam corretamente.

- [ ] **Step 4: Validação em DevTools**

- Console sem erros de runtime.
- Network sem 404s para `tailwind.css` ou similares.
- Inspecionar elemento qualquer: confirmar que classes `tw-*` ou `p-3` estão ausentes no HTML gerado (apenas classes MUI e `MuiXxx-`).

- [ ] **Step 5: Registrar o checkpoint**

Se tudo OK, tag ou anotar o commit final da Camada 1 (último hash do `git log`). Sem commit novo; apenas log.

Se houver regressões:
- Registrar em `docs/superpowers/plans/2026-04-24-sp2-design-system-plan.md` como "Encontrado na Camada 1" no final do plano.
- Abrir tarefa corretiva e aplicar antes da Camada 2.

---

# Camada 2 — Componentes base

**Regra geral para Tasks 19-26:** cada componente recebe aplicação de tokens com o seguinte padrão (substituir valores equivalentes):

| Hardcode comum | Token novo |
|---|---|
| `borderRadius: 8` ou `borderRadius: theme.spacing(1)` | `radiusTokens.md` |
| `borderRadius: 12` ou `borderRadius: 16` em cards | `radiusTokens.lg` |
| `backgroundColor: theme.palette.background.paper` | manter (o tema agora serve surface corretamente) |
| Shadows hardcoded (`'0 4px 20px rgba(0,0,0,0.1)'`) | `elevationTokens.md` (dark) / `elevationLightTokens.md` (light) via callback `({theme}) => ({boxShadow: theme.palette.mode === 'dark' ? elevationTokens.md : elevationLightTokens.md})` |
| `fontWeight: 700` em headings | `fontWeight: 600` (peso 700 não carregado) |
| Números de métricas sem tabular-nums | Adicionar `fontVariantNumeric: 'tabular-nums'` |
| `transition: 'all 0.2s ease'` | `transition: \`all ${motionTokens.duration.base} ${motionTokens.easing.default}\`` |
| Cor de chart hardcoded | `getChartColor(i)` ou `chartByType.<grupo>.<chave>` |

Cada task segue: **(1)** ler componente; **(2)** aplicar padrão; **(3)** `npm run type-check` + `npm run lint`; **(4)** commit focado no componente.

## Task 19: Atualizar MetricCardOptimized

**Files:**
- Modify: `src/shared/ui/base/MetricCardOptimized.tsx`

- [ ] **Step 1: Ler arquivo**

```bash
cat src/shared/ui/base/MetricCardOptimized.tsx
```

- [ ] **Step 2: Aplicar padrão**

Mudanças específicas:
- Radius: `radiusTokens.lg` nos containers (cards grandes = 12px).
- Valor numérico da métrica: adicionar `fontVariantNumeric: 'tabular-nums'` no `<Typography>` do valor.
- Trend color (up/down): consumir `semanticDark.success.main`/`semanticDark.error.main` via callback de tema (`theme.palette.mode === 'dark'` escolhe dark, senão light).
- Elevation: usar `elevationTokens.xs` (cards estáticos).
- Motion: substituir qualquer transition custom pela token `motionTokens.duration.base`.

Import a adicionar:
```ts
import { radiusTokens, elevationTokens, elevationLightTokens, motionTokens } from '@/lib/theme/designSystem';
import { semanticDark, semanticLight } from '@/lib/theme/colors';
```

- [ ] **Step 3: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/base/MetricCardOptimized.tsx
git commit -m "feat(ui): MetricCardOptimized aplica tokens SP2"
```

---

## Task 20: Atualizar ChartCard (ambos os caminhos)

**Files:**
- Modify: `src/shared/ui/base/ChartCard.tsx`
- Modify: `src/shared/ui/data-display/ChartCard.tsx`

- [ ] **Step 1: Ler os dois arquivos**

```bash
cat src/shared/ui/base/ChartCard.tsx src/shared/ui/data-display/ChartCard.tsx
```

- [ ] **Step 2: Aplicar padrão nos dois**

Mesma mudança em ambos:
- Radius: `radiusTokens.lg`.
- Elevation: `elevationTokens.xs` / `elevationLightTokens.xs`.
- Header (título do chart): `typographyScale.h5` (peso 500).
- Padding interno: manter espaçamento atual, mas padronizar via `spacingTokens` se houver hardcode em pixels.

Consolidação num único arquivo é SP3. Por ora, aplicar a mesma mudança nos dois.

- [ ] **Step 3: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/base/ChartCard.tsx src/shared/ui/data-display/ChartCard.tsx
git commit -m "feat(ui): ChartCard aplica tokens SP2"
```

---

## Task 21: Atualizar TabPanel

**Files:**
- Modify: `src/shared/ui/base/TabPanel.tsx`

- [ ] **Step 1: Ler**

```bash
cat src/shared/ui/base/TabPanel.tsx
```

- [ ] **Step 2: Aplicar padrão**

Pontos específicos:
- Se o componente define estilos de `Tabs` indicator: aplicar `transition: motionTokens.duration.base` e cor `theme.palette.primary.main`.
- Hover state: usar sombra sutil, `backgroundColor: theme.palette.mode === 'dark' ? darkNeutral.elevated : lightNeutral.elevated`.
- Radius em pills/tabs individuais: `radiusTokens.md`.
- Padding do conteúdo: manter atual.

- [ ] **Step 3: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/ui/base/TabPanel.tsx
git commit -m "feat(ui): TabPanel aplica tokens SP2"
```

---

## Task 22: Atualizar EnhancedPaper

**Files:**
- Modify: `src/shared/ui/base/EnhancedPaper.tsx`

- [ ] **Step 1: Ler**

```bash
cat src/shared/ui/base/EnhancedPaper.tsx
```

- [ ] **Step 2: Aplicar padrão**

Pontos específicos:
- Background: `theme.palette.background.paper` (já correto via tema); se houver variante `elevated`, usar `darkNeutral.elevated` em dark e `lightNeutral.elevated` em light.
- Radius: `radiusTokens.md` por padrão; `radiusTokens.lg` se for container de métricas/cards grandes.
- Border: se o componente usa border inline, trocar por `theme.palette.divider` (que agora é `neutral.border.default`).
- Elevation: consumir `elevationTokens.xs` ou `sm` dependendo da variante.

- [ ] **Step 3: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/ui/base/EnhancedPaper.tsx
git commit -m "feat(ui): EnhancedPaper aplica tokens SP2"
```

---

## Task 23: Atualizar PageBreadcrumb

**Files:**
- Modify: `src/shared/ui/navigation/PageBreadcrumb.tsx`

- [ ] **Step 1: Ler**

```bash
cat src/shared/ui/navigation/PageBreadcrumb.tsx
```

- [ ] **Step 2: Aplicar padrão**

Pontos específicos:
- Cor do texto secundário: `theme.palette.text.secondary`.
- Cor do link ativo: `theme.palette.text.primary`.
- Separador: usar `theme.palette.text.tertiary` ou `theme.palette.divider`; remover qualquer cor hardcoded.
- Typography: `typographyScale.bodySm` ou `typographyScale.caption`.

- [ ] **Step 3: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/ui/navigation/PageBreadcrumb.tsx
git commit -m "feat(ui): PageBreadcrumb aplica tokens SP2"
```

---

## Task 24: Atualizar Skeletons

**Files:**
- Modify: `src/shared/ui/feedback/skeletons/*` (todos os .tsx da pasta)

- [ ] **Step 1: Listar skeletons**

```bash
ls src/shared/ui/feedback/skeletons/
```

- [ ] **Step 2: Aplicar padrão em cada arquivo**

Pontos:
- Cor base do skeleton: `theme.palette.mode === 'dark' ? darkNeutral.elevated : lightNeutral.input`.
- Cor highlight (shimmer): `theme.palette.mode === 'dark' ? darkNeutral.border.default : lightNeutral.border.default`.
- Radius: `radiusTokens.md` para blocos retangulares; `radiusTokens.full` para avatars/pills.
- Animação: usar `motionTokens.duration.slower` (400ms) para pulse; `motionTokens.easing.default`.

O MUI `<Skeleton>` aceita `sx={{ bgcolor: ... }}` e tem prop `animation="pulse" | "wave"`. Manter as props; ajustar só cores e radius via `sx`.

- [ ] **Step 3: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/ui/feedback/skeletons
git commit -m "feat(ui): skeletons aplicam paleta neutra SP2"
```

---

## Task 25: Atualizar layout shell (topbar, sidebar, container)

**Files:**
- Modify: `src/shared/layout/**/*.tsx` (os componentes de shell)

**Escopo claro:** apenas alinhamento com tokens novos. **NÃO** redesenhar IA (ordem de itens, agrupamento, hierarquia) — isso é SP1.

- [ ] **Step 1: Listar arquivos de layout**

```bash
find src/shared/layout -name "*.tsx" -o -name "*.ts" | head
```

- [ ] **Step 2: Em cada componente relevante (topbar, sidebar, container):**

- Background: `darkNeutral.surface` em dark, `lightNeutral.surface` em light.
- Border divisor: `theme.palette.divider`.
- Texto de item ativo: `theme.palette.primary.main`.
- Texto default: `theme.palette.text.primary`.
- Texto secundário: `theme.palette.text.secondary`.
- Hover de nav item: `darkNeutral.elevated` ou `lightNeutral.elevated` com transition base.
- Padding/spacing: manter (é SP1 quem mexe nisso).

Se houver gradient ou glassmorphism em topbar/sidebar, **remover** (POV sóbrio). Substituir por `darkNeutral.surface` com `borderBottom: 1px solid theme.palette.divider`.

- [ ] **Step 3: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/layout
git commit -m "feat(layout): shell aplica tokens SP2 sem redesenhar IA"
```

---

## Task 26: Atualizar ApexChartWrapper

**Files:**
- Modify: `src/shared/ui/data-display/ApexChartWrapper.tsx`
- Modify: `src/shared/ui/data-display/ApexChartWrapper.styled.tsx`

- [ ] **Step 1: Ler**

```bash
cat src/shared/ui/data-display/ApexChartWrapper.tsx src/shared/ui/data-display/ApexChartWrapper.styled.tsx
```

- [ ] **Step 2: Atualizar paleta default de chart**

Onde o componente passa `colors` ao ApexCharts:
```ts
import { chartPalette } from '@/lib/theme/colors';

// Usar como default:
const defaultColors = [...chartPalette];
```

E substituir hardcodes como `['#1976d2', '#2e7d32', ...]` pelo `chartPalette`.

- [ ] **Step 3: Ajustar cores do grid, axis, text**

As opções ApexCharts `chart.foreColor`, `grid.borderColor`, `xaxis.labels.style.colors` devem ser derivadas do tema:
```ts
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const foreColor = theme.palette.text.secondary;
const gridColor = theme.palette.divider;
```

- [ ] **Step 4: Validar e commitar**

```bash
docker compose exec frontend npm run type-check && docker compose exec frontend npm run lint
git add src/shared/ui/data-display/ApexChartWrapper.tsx src/shared/ui/data-display/ApexChartWrapper.styled.tsx
git commit -m "feat(charts): ApexChartWrapper consome paleta chart.ts"
```

---

## Task 27: Checkpoint de validação da Camada 2

- [ ] **Step 1: Rodar `npm run quality` e `npm run build`**

```bash
docker compose exec frontend npm run quality
docker compose exec frontend npm run build
```

Ambos verdes.

- [ ] **Step 2: Subir stack e validar nas 6 telas em ambos os modos**

Se stack já estiver up, só abrir browser. Criar link de teste se necessário.

Rodar para cada uma das 6 telas, em dark e em light (toggle no profile ou header da app):

1. Home pós-login (`/link` se é a home)
2. Link create (`/link/create`)
3. Link edit (`/link/edit/:id`) — escolher um link existente
4. Link analytics (`/link/analytic/:id`) — **a tela mais densa em dados, prioritária**
5. Shorter público (`/shorter`)
6. Profile (`/profile`)

Para cada tela:
- **Dark mode:** tudo legível? `MetricCard` mostra métrica com tabular-nums? Charts usam a paleta nova? Tabs têm indicador visível? Breadcrumb sóbrio?
- **Light mode:** mesmo exercício. Se alguma tela ficar "estranhamente clara" (contraste baixo), anotar.
- **Responsividade:** 375px (mobile), 768px (tablet), 1440px (desktop). Layout shell não quebra.
- **Console:** sem erros.

- [ ] **Step 3: Registrar achados**

Anexar ao plano (seção "Achados Camada 2" no final) uma lista curta de issues visuais. NÃO corrigir ainda — a Camada 3 é pra polimento.

---

# Camada 3 — Polimento e limpeza

## Task 28: Motion e micro-animações nos componentes base

**Files:**
- Modify: Todos os 8 componentes base já tocados na Camada 2 (MetricCard, ChartCard, TabPanel, EnhancedPaper, PageBreadcrumb, skeletons, layout shell, ApexChartWrapper)

Objetivo: adicionar motion onde **serve à compreensão**, nunca decorativo. Usar `motionTokens`.

- [ ] **Step 1: Definir onde aplicar**

- `MetricCardOptimized`: entrada em fade-in de 180ms quando o valor muda (se já houver um sinal de "value changed"); zero hover transform.
- `TabPanel`: transição do indicador do tab (180ms ease-out).
- `ChartCard`: fade-in de 260ms na entrada inicial (skeleton → chart).
- `Skeletons`: mantém pulse 400ms.
- `PageBreadcrumb`: sem motion.
- `EnhancedPaper`: opcional — fade-in 180ms em props-change de variant.
- Layout shell: transitions de cor em hover (180ms); sem transform.
- `ApexChartWrapper`: passar `motion: { animate: true, animateGradually: { enabled: true, delay: 150 } }` para ApexCharts (nativo).

- [ ] **Step 2: Implementar**

Usar `sx` com a `motionTokens.duration.base` / `motionTokens.easing.default`. Ex.:
```tsx
sx={{
	transition: `opacity ${motionTokens.duration.base} ${motionTokens.easing.default}`
}}
```

Para animation de entrada, usar o componente `Fade` do MUI com `timeout={parseInt(motionTokens.duration.base)}`.

- [ ] **Step 3: Validar visual — os componentes sentem "vivos" mas não exagerados**

```bash
docker compose up -d frontend
# Browser check
```

Se algo parecer exagerado, reduzir para `motionTokens.duration.fast` (120ms).

- [ ] **Step 4: Commit**

```bash
git add src/shared
git commit -m "feat(motion): micro-animações contidas nos componentes base"
```

---

## Task 29: Auditoria e limpeza de utils do tema

**Files:**
- Possível delete: `src/lib/theme/utils/glassUtils.ts`
- Possível delete: `src/lib/theme/utils/gradientUtils.ts`
- Modify: `src/lib/theme/utils/index.ts`
- Modify: `src/lib/theme/index.ts`

Objetivo: remover utilitários que não servem ao POV sóbrio.

- [ ] **Step 1: Verificar consumidores de glass utilities**

```bash
docker compose exec frontend sh -c "grep -rE 'createGlassEffect|createGlassCard|createGlassNavbar|createGlassModal|createGlassButton' src --include='*.ts' --include='*.tsx' | grep -v 'lib/theme'"
```

- [ ] **Step 2: Se houver consumidores, fazer uma das duas:**
   (a) Se o consumidor é um componente base já atualizado na Camada 2 que acidentalmente ainda chama glass-util: substituir por `sx` com tokens neutros.
   (b) Se for componente fora de escopo (feature page): deixar por ora — adicionar nota no backlog e **não** deletar o util.

- [ ] **Step 3: Se nenhum consumidor (além de `lib/theme`): deletar**

```bash
rm src/lib/theme/utils/glassUtils.ts
```

Remover exports correspondentes em `src/lib/theme/utils/index.ts` e em `src/lib/theme/index.ts`.

- [ ] **Step 4: Repetir 1-3 para gradientUtils**

```bash
docker compose exec frontend sh -c "grep -rE 'createGradient|createThemeGradient|createPresetGradients|createTextGradient' src --include='*.ts' --include='*.tsx' | grep -v 'lib/theme'"
```

Decidir e agir.

- [ ] **Step 5: Verificar `themes/index.ts` (pasta)**

```bash
cat src/lib/theme/themes/index.ts
```

Se estiver vazio ou só re-exportar de `themes.ts`, remover a pasta:
```bash
rm -rf src/lib/theme/themes
```

E limpar qualquer import quebrado que aponte para `./themes/index` em vez de `./themes`.

- [ ] **Step 6: Validar**

```bash
docker compose exec frontend npm run type-check
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(theme): remover utils sem consumidor (glass/gradient) e limpar exports"
```

---

## Task 30: Atualizar `cursorrules` para refletir nova realidade

**Files:**
- Modify: `.cursorrules`

Motivação: o `.cursorrules` lista cores antigas em "Cores para Charts" (`#1976d2`, `#2e7d32`, etc.). Após SP2, essas cores não são mais canônicas.

- [ ] **Step 1: Ler o arquivo**

```bash
cat .cursorrules | head -110
```

- [ ] **Step 2: Substituir a seção "Cores para Charts"**

Trecho atual (~linhas 85-93):
```
### Cores para Charts:
```typescript
'#1976d2'  // Azul principal
'#2e7d32'  // Verde
'#dc004e'  // Rosa
'#9c27b0'  // Roxo
'#ff9800'  // Laranja
'#d32f2f'  // Vermelho
```

Substituir por:
```
### Cores para Charts:
Usar `chartPalette` de `@/lib/theme/colors` — 8 cores harmônicas, dark-first. Consumir via `getChartColor(index)` ou `chartByType.<grupo>.<chave>`.
```

- [ ] **Step 3: Commit**

```bash
git add .cursorrules
git commit -m "docs(cursorrules): atualizar paleta de charts para apontar para chartPalette"
```

---

## Task 31: Checkpoint final da Camada 3

- [ ] **Step 1: Rodar `npm run quality` completo**

```bash
docker compose exec frontend npm run quality
```

- [ ] **Step 2: Build de produção**

```bash
docker compose exec frontend npm run build
```

- [ ] **Step 3: Validação visual final — checklist dos critérios de sucesso do spec**

No browser:
- [ ] Tailwind removido (confirmar `grep -r '@tailwind' src/` vazio; procurar `tailwind` no `package.json` vazio; `tailwind.config.ts` ausente).
- [ ] Todos os tokens consumíveis do tema MUI — abrir React DevTools, inspecionar `ThemeProvider`, ver que o theme tem `typography`, `components`, paleta esperada.
- [ ] `colors/` tem apenas `dark.ts`, `light.ts`, `semantic.ts`, `chart.ts`, `index.ts` (sem `fuseDark`, `skyBlue`, `chartColors`).
- [ ] 8 componentes base com a nova linguagem (olho nu: MetricCard, ChartCard, TabPanel, EnhancedPaper, PageBreadcrumb, Skeletons, Layout shell, ApexChartWrapper).
- [ ] Dark-first validado em todas as 6 telas.
- [ ] Light mode funcional em todas as 6 telas.

- [ ] **Step 4: Abrir PR (se fluxo de PR)**

```bash
git log --oneline -30
```

Se o projeto usa feature branches, fazer:
```bash
git checkout -b feat/sp2-design-system
git push -u origin feat/sp2-design-system
gh pr create --title "SP2 — Design System redesign (dark-first, business tone)" --body "$(cat <<'EOF'
## Summary
- Remove Tailwind do stack (config, packages, CSS)
- Consolida tokens em `src/lib/theme/designSystem.ts` (typography, radius, elevation, motion, z-index)
- Redesenha paletas em `src/lib/theme/colors/` (dark, light, semantic, chart)
- Atualiza overrides MUI em `config/muiComponents.ts`
- Aplica tokens nos 8 componentes base canônicos (MetricCardOptimized, ChartCard, TabPanel, EnhancedPaper, PageBreadcrumb, Skeletons, Layout shell, ApexChartWrapper)

Ver spec: `docs/superpowers/specs/2026-04-24-sp2-design-system-design.md`
Ver plano: `docs/superpowers/plans/2026-04-24-sp2-design-system-plan.md`

## Test plan
- [ ] `npm run quality` verde
- [ ] `npm run build` verde
- [ ] Validação visual nas 6 telas principais em dark e light
- [ ] Responsividade 375/768/1440

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Marcar SP2 como done e sinalizar que SP1 é o próximo sub-projeto**

Sem commit; apenas nota no plano ou README do projeto se for convenção.

---

# Achados (preencher durante execução)

## Achados Camada 1

- **Task 9 pulada**: `useMainTheme` (`fuseThemeHooks.tsx:50`) já mescla `optimizedThemeOptions` via `defaultThemeOptions`. Sem mudança em `MainThemeProvider.tsx`.
- **Regressão de tipo em `chartColorUtils.ts`** (introduzida pela Task 4): `chartByType as const` deixou os campos `readonly` literais, incompatíveis com os overloads que esperavam `string` mutável. Corrigido em commit `50bc836` declarando interfaces explícitas e tipando a impl signature como união.
- **Task 10 pulada**: `globalStyles.ts` não tem hex hardcoded — apenas `scroll-behavior: smooth` e `:focus-visible` usando `var(--color-primary)`. Nada a trocar pela nova paleta.
- **Bug pré-existente em `useLinksTableColumns.tsx`**: `starts_in.constructor === Date` e `expires_at.constructor === Date` em campos tipados como `ISODateString`. Branch morto. Removido em commit `a21a5f4` para destravar checkpoints (fora do escopo SP2 mas necessário).
- **Bug pré-existente em `globalStyles.ts`**: CSS var `--color-primary` é referenciada mas nunca declarada — `:focus-visible` cai no outline default do navegador. Não corrigido (fora do escopo SP2).
- **Checkpoint Task 11 com ressalva**: type-check, build, lint nos arquivos do SP2 e dev server passam sem erros. App boota com dark theme aplicado, paleta nova de chart visível, console limpo. **`npm run quality` cheio falha** com 35 erros (16 baseline pré-SP2 + 19 vindos de arquivos modificados pendentes não-tema: hooks de analytics, services, EditLinkForm, EmailVerificationGuard, etc.). Esses arquivos são trabalho paralelo fora do escopo SP2. Quality cheio só passará quando esse trabalho pendente for triado/commitado/revertido pelo dono.
- **Task 17 com desvio cirúrgico**: plano original mandava `npm install`, mas o repo tinha `package-lock.json` (763 linhas) e `yarn.lock` (327 linhas) já modificados por trabalho paralelo. Rodar install misturaria escopos. Solução: deletei `postcss.config.js` e `tailwind.config.ts`, removi as 3 deps do `package.json` (preservando `humps`/`@types/humps` que estavam pendentes), **não toquei lockfiles nem rodei install**. PostCSS sem `postcss.config.js` deixa de carregar Tailwind, então `node_modules` ainda contendo Tailwind morto não bloqueia build. Próximo install que o dono rodar regenera os locks.
- **Tailwind sobrevivente em 6 arquivos não previstos pelo plano** (descoberto após Task 17): `FormActions.tsx`, `DataTableTopToolbar.tsx`, `LoadingWithRedirect.tsx`, `AuthGuardRedirect.tsx`, `SignOutPage.tsx`, `UnauthorizedPage.tsx`. Total de 17 ocorrências. Após Task 17 essas classes ficam mortas (sem CSS). Convertidas em Tailwind→sx em commit dedicado (extensão da Camada 1).
- **Regressão de contraste em `UnauthorizedPage`** (pré-existente, NÃO causada pela conversão Tailwind): textos com `color='text.secondary'` resolvem para `rgba(255, 255, 255, 0.68)` (tema dark) sobre fundo branco, ficando invisíveis. Causa: o ErrorLayout renderiza com background branco mas o tema novo aplica `text.secondary` do modo dark mesmo. Confirmado que o `color='text.secondary'` já estava no código antes do SP2. SignOutPage não tem o problema porque envolve com `Paper` (que aplica bg do tema). **Próxima ação**: revisar ErrorLayout (e potencialmente outras páginas de erro 404/etc.) na Camada 2 ou 3 — garantir que ele aplique `theme.palette.background.default`.

## Achados Camada 2
_(preencher com issues descobertas na Task 27)_

## Achados Camada 3
_(preencher com issues descobertas na Task 31)_
