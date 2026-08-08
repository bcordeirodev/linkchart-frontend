/**
 * Paleta de séries de dados (redesign "instrumento técnico", 2026-08-03).
 *
 * Assinatura visual única para todos os gráficos ApexCharts do app: cores
 * "azul-dominantes", desaturadas e coesas — nunca verde/laranja chapados
 * como cor de série (esses tons ficam reservados para semântica de
 * sucesso/erro/aviso em `colors/semantic.ts`).
 */

import { darkPrimary } from "@/lib/theme/colors/dark";

/**
 * Formato da paleta de dados: 5 tons ordenados por prioridade visual —
 * `primary` é a cor de marca, as demais são variações derivadas dela.
 */
export interface DataVizPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  muted: string;
}

/**
 * Paleta de cores para séries de gráficos (line/area/bar), consumida por
 * `buildApexBaseOptions`.
 *
 * Derivação: todos os tons partem do azul primário do tema dark —
 * `darkPrimary.main` = `#4E82E6` (`src/lib/theme/colors/dark.ts`), que em
 * HSL é `hsl(219.5°, 75.2%, 60.4%)`. As 4 variações rotacionam o matiz
 * apenas dentro da família azul (206°–231° — nunca cruzam para
 * verde/ciano-esverdeado nem para roxo/magenta) e ajustam
 * saturação/luminosidade para criar contraste entre séries mantendo a
 * assinatura "um só sistema":
 *
 * - `primary`    `#4E82E6` — hsl(219.5, 75%, 60%) — a própria cor de marca.
 * - `secondary`  `#73AFDE` — hsl(206, 62%, 66%) — mais clara, levemente
 *   mais ciano.
 * - `tertiary`   `#5869CA` — hsl(231, 52%, 57%) — mais escura, levemente
 *   mais índigo.
 * - `quaternary` `#A8BEDC` — hsl(214, 42%, 76%) — quase pastel, baixa
 *   saturação, para a 4ª série ou destaques discretos.
 * - `muted`      `#7081A4` — hsl(220, 22%, 54%) — slate quase neutro, para
 *   séries de comparação/baseline.
 *
 * Contraste validado contra o fundo dark canônico `darkNeutral.bg`
 * (`#0B0D12`), critério WCAG de componente não-textual (traços/áreas de
 * gráfico, ≥ 3:1):
 *
 * | tom        | hex       | contraste vs `#0B0D12` |
 * |------------|-----------|------------------------|
 * | primary    | `#4E82E6` | 5.24:1                 |
 * | secondary  | `#73AFDE` | 8.25:1                 |
 * | tertiary   | `#5869CA` | 3.97:1                 |
 * | quaternary | `#A8BEDC` | 10.24:1                |
 * | muted      | `#7081A4` | 4.97:1                 |
 *
 * Todos superam o mínimo de 3:1 com margem.
 *
 * Em modo claro os tons atuais NÃO atingem 3:1 sobre o card — ramp light
 * pendente (branch de refinamento de analytics).
 */
export const dataVizPalette: DataVizPalette = {
  primary: darkPrimary.main,
  secondary: "#73AFDE",
  tertiary: "#5869CA",
  quaternary: "#A8BEDC",
  muted: "#7081A4",
} as const;
