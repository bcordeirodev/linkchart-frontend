import type { ChartSeries } from "@/types";

/**
 * Utilitários para formatação de dados de gráficos.
 *
 * Redesign "instrumento técnico" (2026-08-03): estes formatters **não**
 * carregam mais estilo próprio (cor, grid, fonte, tooltip.theme, legend). O
 * visual compartilhado — paleta `dataVizPalette`, grid horizontal quase
 * invisível, eixos mono 11px, gradiente de área 18%→0, tooltip dark mono —
 * vem inteiro de `buildApexBaseOptions` (injetado por `ApexChartWrapper`).
 * Cada formatter devolve só o que é estrutural por natureza do gráfico: o
 * mapeamento dos dados em pontos/série, orientação (`horizontal`),
 * empilhamento, categorias e formatters de valor/tooltip — nunca cor.
 */

/**
 * Formata dados para gráfico de área.
 *
 * Sem parâmetro de cor: a série assume a cor `primary` de `dataVizPalette`
 * via base do tema. `labels` só controla o nome da série e o sufixo usado no
 * tooltip — nunca aparência.
 */
export const formatAreaChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  labels?: { series?: string; clicksLabel?: string },
): { series: ChartSeries[]; options: Record<string, unknown> } => {
  const seriesName = labels?.series ?? "Total";
  const clicksLabel = labels?.clicksLabel ?? "clicks";

  const points = (data || [])
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      x: String(
        item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : "",
      ),
      y: Number(item[yKey] || 0),
    }));

  return {
    series: [{ name: seriesName, data: points }],
    options: {
      markers: { size: 0, hover: { size: 8, sizeOffset: 2 } },
      tooltip: {
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString()} ${clicksLabel}`,
        },
      },
    },
  };
};

/** Shared structural bar options — orientation-specific plotOptions + dataLabels formatter. */
function barPlotOptions(horizontal: boolean) {
  return horizontal
    ? { bar: { horizontal: true, barHeight: "60%" } }
    : { bar: { horizontal: false, columnWidth: "60%" } };
}

/**
 * Formata dados para gráfico de barras (vertical ou horizontal).
 *
 * Sem parâmetro de cor: a série assume `dataVizPalette.primary` via base do
 * tema. `horizontal` é estrutural (decide orientação + eixo de categoria) —
 * a única diferença visual permitida entre os dois modos.
 */
export const formatBarChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  horizontal = false,
  labels?: { series?: string; clicksLabel?: string },
): { series: ChartSeries[]; options: Record<string, unknown> } => {
  const seriesName = labels?.series ?? "Clicks";
  const clicksLabel = labels?.clicksLabel ?? "clicks";

  const processedData = (data || [])
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      x: String(
        item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : "",
      ),
      y: Number(item[yKey] || 0),
    }));

  return {
    series: [{ name: seriesName, data: processedData }],
    options: {
      plotOptions: barPlotOptions(horizontal),
      dataLabels: {
        enabled: true,
        ...(horizontal ? {} : { offsetY: -20 }),
        formatter: (val: number) => val.toLocaleString(),
      },
      xaxis: { type: horizontal ? "numeric" : "category" },
      tooltip: {
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString()} ${clicksLabel}`,
        },
      },
    },
  };
};

/**
 * Formata uma distribuição categórica (dispositivos, idiomas, plataformas,
 * fim de semana vs dia de semana…) como uma única barra horizontal
 * empilhada — o substituto direto do donut/pizza morto pelo redesign
 * "instrumento técnico". Cada categoria vira sua própria série de um só
 * ponto, todas compartilhando a mesma linha do eixo Y ("Distribuição"), o
 * que produz o efeito de barra de progresso segmentada com legenda embaixo.
 *
 * Sem parâmetro de cor: as séries assumem `dataVizPalette` (cíclico) via
 * base do tema — a mesma paleta que qualquer outro gráfico do app.
 *
 * @param data - Linhas categóricas já filtradas/agrupadas pelo chamador.
 * @param labelKey - Chave de `data` usada como nome da série (rótulo da categoria).
 * @param valueKey - Chave de `data` usada como valor numérico da categoria.
 * @param labels - Rótulo opcional da única linha do eixo Y (default vazio).
 * @returns `series`/`options` prontos para `<ApexChartWrapper type="bar">`.
 */
export const formatHorizontalStackedBar = (
  data: Record<string, unknown>[],
  labelKey: string,
  valueKey: string,
  labels?: { rowLabel?: string },
): {
  series: Array<{ name: string; data: number[] }>;
  options: Record<string, unknown>;
} => {
  const rowLabel = labels?.rowLabel ?? "";

  const filtered = (data || []).filter(
    (item) => item && typeof item === "object",
  );

  if (filtered.length === 0) {
    return { series: [], options: { chart: { stacked: true } } };
  }

  const total = filtered.reduce(
    (sum, item) => sum + Number(item[valueKey] || 0),
    0,
  );

  const series = filtered.map((item) => ({
    name: String(item[labelKey] ?? ""),
    data: [Number(item[valueKey] || 0)],
  }));

  return {
    series,
    options: {
      chart: { stacked: true },
      plotOptions: {
        bar: { horizontal: true, barHeight: "45%", borderRadius: 2 },
      },
      xaxis: { categories: [rowLabel] },
      dataLabels: {
        enabled: true,
        formatter: (val: number) =>
          total > 0 ? `${Math.round((val / total) * 100)}%` : "0%",
      },
      legend: { show: true, position: "bottom" },
      tooltip: {
        y: { formatter: (val: number) => val.toLocaleString() },
      },
    },
  };
};
