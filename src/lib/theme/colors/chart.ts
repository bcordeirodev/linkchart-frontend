/**
 * Paleta dedicada a charts — 8 cores harmônicas, dark-first, alto contraste.
 * Substitui colors/chartColors.ts.
 */

/**
 * Cores canônicas em ordem de prioridade visual para séries múltiplas.
 */
export const chartPalette = [
  "#5B8DEF", // business blue
  "#34D399", // emerald
  "#F59E0B", // amber
  "#A78BFA", // violet
  "#22D3EE", // cyan
  "#F472B6", // muted pink
  "#FB923C", // orange
  "#FDE047", // yellow
] as const;

/**
 * Mapeamento por tipo de dado.
 */
export const chartByType = {
  devices: {
    mobile: "#5B8DEF",
    desktop: "#34D399",
    tablet: "#F59E0B",
  },
  geographic: {
    countries: "#34D399",
    states: "#F59E0B",
    cities: "#A78BFA",
  },
  temporal: {
    hourly: "#F59E0B",
    daily: "#5B8DEF",
    weekly: "#34D399",
  },
  heatmap: {
    low: "#1E3A5F",
    medium: "#2C5AA0",
    high: "#5B8DEF",
    intense: "#8AB0F5",
  },
} as const;

/**
 * Rampa sequencial azul (MUI blue) usada pelo heatmap hora×dia.
 * Mantida separada de `chartByType.heatmap` porque é uma escala claro→escuro
 * (single-hue) calibrada para a aparência histórica do gráfico, enquanto
 * `chartByType.heatmap` é uma rampa escuro→claro de propósito geral.
 * Ordenada por intensidade crescente de cliques.
 */
export const heatmapBlueScale = {
  /** Célula vazia (0 cliques) — fundo neutro por tema. */
  empty: { dark: "#1e2a3a", light: "#f0f4f8" },
  /**
   * 1–5 cliques. No claro, `#90caf9` rendia 1.40:1 vs o card `#E3E6EA` —
   * o passo light desce um degrau (`#64b5f6`). Numa rampa sequencial de
   * matiz único o primeiro passo nunca alcança 3:1 sem colapsar a escala;
   * o stroke do grid delimita as células e "low" é semanticamente
   * quase-vazio, então o compromisso fica documentado aqui de propósito.
   */
  low: { dark: "#90caf9", light: "#64b5f6" },
  /** 6–15 cliques (light `#1e88e5`: 2.94:1 card / 3.49:1 paper). */
  medium: { dark: "#42a5f5", light: "#1e88e5" },
  /**
   * 16–50 cliques — também usada como cor base da série
   * (light `#1565c0`: 4.59:1 card).
   */
  high: { dark: "#1976d2", light: "#1565c0" },
  /** 51+ cliques (light mantém `#0d47a1`: 6.89:1 card). */
  veryHigh: { dark: "#0d47a1", light: "#0d47a1" },
} as const;

/**
 * Gradientes leves (ápice + claro) por cor base.
 */
const gradients: Record<string, readonly [string, string]> = {
  "#5B8DEF": ["#5B8DEF", "#8AB0F5"],
  "#34D399": ["#34D399", "#6EE7B7"],
  "#F59E0B": ["#F59E0B", "#FBBF24"],
  "#A78BFA": ["#A78BFA", "#C4B5FD"],
  "#22D3EE": ["#22D3EE", "#67E8F9"],
  "#F472B6": ["#F472B6", "#F9A8D4"],
  "#FB923C": ["#FB923C", "#FDBA74"],
  "#FDE047": ["#FDE047", "#FEF08A"],
};

export function getChartColor(index: number): string {
  return chartPalette[index % chartPalette.length]!;
}

export function getGradientColors(
  baseColor: string,
): readonly [string, string] {
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
  error: "#F87171",
  info: chartPalette[4],
  secondary: chartPalette[5],
  extended: [...chartPalette],
  devices: chartByType.devices,
  geographic: chartByType.geographic,
  temporal: chartByType.temporal,
  heatmap: chartByType.heatmap,
} as const;
