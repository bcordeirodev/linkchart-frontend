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
 *
 * @param locale - locale ativo do i18next (`i18n.language`), repassado ao
 * `toLocaleString()` do tooltip. Omitido: usa o locale padrão do browser
 * (comportamento anterior a esta prop).
 */
export const formatAreaChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  labels?: { series?: string; clicksLabel?: string },
  locale?: string,
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
            `${value.toLocaleString(locale)} ${clicksLabel}`,
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
 * `dataViz.ts`). O padrão do Apex quando nenhuma `dataLabels.style.colors`
 * é passada não é branco opaco — é `chart.foreColor`, herdado de
 * `theme.palette.text.secondary` (`rgba(255, 255, 255, 0.68)` no tema
 * dark), um branco translúcido que se mistura com o preenchimento da barra
 * embaixo dele. Contra qualquer um dos 5 tons da paleta esse blend fica bem
 * abaixo do mínimo de 4.5:1 — pior ainda nos tons mais claros (`secondary`
 * #73AFDE, `quaternary` #A8BEDC). `darkNeutral.bg` (o quase-preto canônico
 * do app), opaco, contra os 5 tons da paleta fica entre 4.19:1 (`tertiary`,
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
 *
 * @param locale - locale ativo do i18next (`i18n.language`), repassado aos
 * `toLocaleString()` do data label e do tooltip. Omitido: usa o locale
 * padrão do browser (comportamento anterior a esta prop).
 */
export const formatBarChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  horizontal = false,
  labels?: { series?: string; clicksLabel?: string },
  locale?: string,
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
  const maxY = processedData.reduce((max, item) => Math.max(max, item.y), 0);

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
          return val.toLocaleString(locale);
        },
      },
      xaxis: {
        type: horizontal ? "numeric" : "category",
        // Com máximo pequeno (< 5) o Apex divide o eixo numérico em ticks
        // fracionários que, arredondados, viram rótulos duplicados
        // ("0 1 1 2 2"). Travar o número de ticks no próprio máximo produz
        // só inteiros (0, 1, 2). Com dados maiores o auto-tick já é inteiro.
        ...(horizontal && maxY > 0 && maxY < 5 ? { tickAmount: maxY } : {}),
      },
      tooltip: {
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString(locale)} ${clicksLabel}`,
        },
      },
    },
  };
};

/**
 * Distribui o arredondamento de um conjunto de valores-como-participação
 * (percentuais) para que a soma exibida feche em exatamente 100 (quando o
 * total for positivo), pelo método do maior resto (largest remainder):
 * cada participação é primeiro arredondada para baixo (`Math.floor`); a
 * sobra (100 menos a soma dos arredondamentos para baixo) é distribuída, um
 * ponto por vez, para as participações com o maior resto fracionário,
 * da maior para a menor.
 *
 * Arredondar cada segmento isoladamente (`Math.round`) pode passar ou não
 * chegar a 100 — ex.: 72,5% e 27,5% arredondam individualmente para 73% e
 * 28%, somando 101% — porque cada segmento arredonda sem enxergar os
 * vizinhos. Este método mantém o conjunto exibido consistente entre si sem
 * alterar os valores subjacentes (é só exibição).
 *
 * @param values - valores numéricos brutos (ex.: cliques por categoria),
 * ainda não convertidos em percentual.
 * @returns percentuais inteiros, na mesma ordem/tamanho de `values`,
 * somando 100 sempre que `values` tiver um total positivo (todos zero caso
 * contrário).
 */
export function largestRemainderRound(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return values.map(() => 0);

  const shares = values.map((value) => (value / total) * 100);
  const floors = shares.map((share) => Math.floor(share));
  let leftover = 100 - floors.reduce((sum, floor) => sum + floor, 0);

  const byRemainderDesc = shares
    .map((share, index) => ({ index, remainder: share - floors[index]! }))
    .sort((a, b) => b.remainder - a.remainder);

  const result = [...floors];
  for (
    let i = 0;
    i < byRemainderDesc.length && leftover > 0;
    i += 1, leftover -= 1
  ) {
    result[byRemainderDesc[i]!.index]! += 1;
  }

  return result;
}

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
 * O eixo X é travado em `max: total`: sem isso o Apex arredonda o máximo
 * para o próximo tick "bonito" (1.251 → 1.500) e a barra — que soma
 * exatamente o total — para antes da borda direita do plot, deixando um
 * vão morto. Uma composição 100% deve varrer o plot de ponta a ponta.
 * Com o máximo travado os ticks numéricos virariam frações feias e não
 * dizem nada que os `%` dos segmentos e o tooltip já não digam — ficam
 * ocultos.
 *
 * Os `%` exibidos vêm de {@link largestRemainderRound} sobre os valores
 * brutos, não de `Math.round` por segmento — do contrário o conjunto
 * exibido podia somar 99 ou 101 (ex.: 72,5%/27,5% arredondando os dois para
 * cima). O Apex chama o `formatter` do data label uma vez por segmento
 * (série) com `opts.seriesIndex`, que indexa direto no array pré-calculado.
 *
 * @param data - Linhas categóricas já filtradas/agrupadas pelo chamador.
 * @param labelKey - Chave de `data` usada como nome da série (rótulo da categoria).
 * @param valueKey - Chave de `data` usada como valor numérico da categoria.
 * @param labels - Rótulo opcional da única linha do eixo Y (default vazio).
 * @param locale - locale ativo do i18next (`i18n.language`), repassado ao
 * `toLocaleString()` do tooltip. Omitido: usa o locale padrão do browser
 * (comportamento anterior a esta prop).
 * @returns `series`/`options` prontos para `<ApexChartWrapper type="bar">`.
 */
export const formatHorizontalStackedBar = (
  data: Record<string, unknown>[],
  labelKey: string,
  valueKey: string,
  labels?: { rowLabel?: string },
  locale?: string,
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

  const values = filtered.map((item) => Number(item[valueKey] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  const roundedPcts = largestRemainderRound(values);

  const series = filtered.map((item, index) => ({
    name: String(item[labelKey] ?? ""),
    data: [values[index]!],
  }));

  return {
    series,
    options: {
      chart: { stacked: true },
      plotOptions: {
        bar: { horizontal: true, barHeight: "45%", borderRadius: 2 },
      },
      xaxis: {
        categories: [rowLabel],
        labels: { show: false },
        ...(total > 0 ? { min: 0, max: total } : {}),
      },
      dataLabels: {
        enabled: true,
        style: { colors: [BAR_LABEL_TEXT_COLOR] },
        formatter: (val: number, opts?: { seriesIndex?: number }) => {
          if (total <= 0) return "0%";
          const rawPct = (val / total) * 100;
          if (rawPct < BAR_LABEL_MIN_PCT) return "";
          // Fallback (opts ausente) só se aplicaria fora de um render real
          // do Apex — em produção `seriesIndex` sempre vem preenchido.
          const index = opts?.seriesIndex ?? values.indexOf(val);
          return `${roundedPcts[index] ?? Math.round(rawPct)}%`;
        },
      },
      legend: { show: true, showForSingleSeries: true, position: "bottom" },
      tooltip: {
        y: { formatter: (val: number) => val.toLocaleString(locale) },
      },
    },
  };
};
