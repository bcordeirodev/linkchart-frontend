import { darkNeutral } from "@/lib/theme/colors/dark";

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
 * Cor do texto dos data labels de barra sobre a própria barra preenchida
 * (usada por {@link formatBarChart} no modo horizontal e por
 * {@link formatHorizontalStackedBar}).
 *
 * `dataVizPalette` é azul-dominante e desaturado por design (ver
 * `dataViz.ts`) — os tons mais claros da paleta (`secondary` #73AFDE,
 * `quaternary` #A8BEDC) dão ~1.7–1.9:1 de contraste contra o texto claro
 * padrão do Apex (`chart.foreColor`, herdado de `theme.palette.text
 * .secondary`), praticamente ilegível — e mesmo o `primary` da paleta fica
 * em 3.71:1, abaixo do mínimo de 4.5:1. `darkNeutral.bg` (o quase-preto
 * canônico do app) contra os 5 tons da paleta fica entre 4.19:1 (`tertiary`,
 * o mais escuro) e 10.81:1 (`quaternary`) — acima do mínimo de 3:1 para
 * texto grande/negrito em todos os casos, sem precisar de uma cor por série.
 */
const BAR_LABEL_TEXT_COLOR = darkNeutral.bg;

/**
 * Abaixo deste percentual (do total da série), o data label é suprimido
 * (formatter devolve string vazia): segmentos/barras finas colidem os
 * números uns nos outros ou ficam ilegíveis antes mesmo do problema de
 * contraste. O tooltip continua sendo a fonte precisa do valor exato em
 * qualquer segmento/barra.
 */
const BAR_LABEL_MIN_PCT = 8;

/**
 * Formata dados para gráfico de barras (vertical ou horizontal).
 *
 * Sem parâmetro de cor: a série assume `dataVizPalette.primary` via base do
 * tema. `horizontal` é estrutural (decide orientação + eixo de categoria) —
 * a única diferença visual permitida entre os dois modos.
 *
 * Data labels: no modo vertical, `offsetY: -20` já posiciona o número acima
 * da coluna, sobre o fundo do gráfico (não sobre o preenchimento azul) — o
 * texto claro padrão do Apex (`chart.foreColor`) já é legível ali, sem
 * ajuste. No modo horizontal não há esse deslocamento: para a barra mais
 * longa (tipicamente a primeira de uma lista ordenada, ex.:
 * `TopCountriesChart`), o Apex não tem espaço para desenhar o label depois
 * do fim da barra e o desenha **dentro** dela, sobre o preenchimento azul —
 * daí o mesmo tratamento de {@link formatHorizontalStackedBar}:
 * `BAR_LABEL_TEXT_COLOR` (contraste legível contra a paleta) e supressão
 * abaixo de `BAR_LABEL_MIN_PCT` do total da série (barra fina demais para um
 * número legível).
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

  const total = processedData.reduce((sum, item) => sum + item.y, 0);

  return {
    series: [{ name: seriesName, data: processedData }],
    options: {
      plotOptions: barPlotOptions(horizontal),
      dataLabels: {
        enabled: true,
        ...(horizontal
          ? { style: { colors: [BAR_LABEL_TEXT_COLOR] } }
          : { offsetY: -20 }),
        formatter: (val: number) => {
          if (
            horizontal &&
            total > 0 &&
            (val / total) * 100 < BAR_LABEL_MIN_PCT
          ) {
            return "";
          }
          return val.toLocaleString();
        },
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
 * base do tema — a mesma paleta que qualquer outro gráfico do app. Os data
 * labels usam `BAR_LABEL_TEXT_COLOR` (contraste legível contra qualquer
 * tom da paleta) e são suprimidos abaixo de `BAR_LABEL_MIN_PCT`
 * (segmento fino demais para exibir o número sem colidir com o vizinho).
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
        style: { colors: [BAR_LABEL_TEXT_COLOR] },
        formatter: (val: number) => {
          if (total <= 0) return "0%";
          const pct = (val / total) * 100;
          return pct < BAR_LABEL_MIN_PCT ? "" : `${Math.round(pct)}%`;
        },
      },
      legend: { show: true, position: "bottom" },
      tooltip: {
        y: { formatter: (val: number) => val.toLocaleString() },
      },
    },
  };
};
