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
 *
 * Exceção estreita (ajuste fino de temas, 2026-08-09): a cor de TEXTO dos
 * data labels que caem sobre um fill sólido (dentro de uma barra, num
 * segmento empilhado) não é uma escolha de estilo — é uma exigência de
 * legibilidade que depende da cor efetiva desse fill, que só o call site
 * conhece (via `theme.palette.mode`). `formatBarChart` e
 * `formatHorizontalStackedBar` aceitam parâmetros opcionais para essa cor
 * (default retrocompatível quando omitidos) e delegam a decisão a
 * {@link labelColorFor}; a paleta de preenchimento em si continua vindo
 * inteira de `buildApexBaseOptions`.
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

/**
 * Shared structural bar options — orientation-specific plotOptions.
 *
 * Vertical: `dataLabels.position: "top"` é obrigatório (ajuste fino de
 * temas, 2026-08-09) — o default do Apex é `"center"`, e `offsetY: -20`
 * sobre o centro deixa o label EM CIMA do fill nas colunas altas (no claro,
 * texto do tema sobre `#2C5AA0` cai a 2.7:1). Com `"top"`, o label senta
 * sempre acima da coluna, sobre canvas/card do tema, nos DOIS modos —
 * mesma convenção que o TimezoneDistributionChart já usava.
 */
function barPlotOptions(horizontal: boolean) {
  return horizontal
    ? { bar: { horizontal: true, barHeight: "60%" } }
    : {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          dataLabels: { position: "top" },
        },
      };
}

/**
 * Quase-preto canônico do app (`darkNeutral.bg`, `#0B0D12`), reciclado por
 * {@link labelColorFor} como o texto de data label sobre fills claros — não
 * é um segundo "preto" inventado, é o mesmo tom já usado no resto do design
 * system para essa função. Também serve como default retrocompatível de
 * {@link formatBarChart} (ramo horizontal) e {@link formatHorizontalStackedBar}
 * quando o call site ainda não passa a cor de fill efetiva.
 */
const DARK_LABEL_TEXT = darkNeutral.bg;

/** Branco puro usado por {@link labelColorFor} como texto sobre fills escuros. */
const LIGHT_LABEL_TEXT = "#FFFFFF";

/**
 * Limiar de luminância relativa (WCAG) usado por {@link labelColorFor} para
 * decidir entre texto branco e quase-preto. Ver o TSDoc da função para a
 * fórmula completa e a justificativa do valor.
 */
const LABEL_LUMINANCE_THRESHOLD = 0.179;

/**
 * Resolve a cor de texto legível para um data label desenhado diretamente
 * sobre um fill sólido — segmento de {@link formatHorizontalStackedBar},
 * valor dentro de uma barra horizontal em {@link formatBarChart} — a partir
 * da cor efetiva desse fill: branco (`#FFFFFF`) quando o fill é escuro,
 * quase-preto (o mesmo `darkNeutral.bg`, `#0B0D12`, usado em todo o app)
 * quando o fill é claro.
 *
 * Substitui a antiga constante única `BAR_LABEL_TEXT_COLOR`, que fixava
 * sempre o quase-preto independentemente do fill: contra a rampa categórica
 * do modo claro (`dataVizCategoricalLight`, ex. `#2C5AA0`) isso rendia
 * ~2.85:1 — ilegível —, enquanto contra a rampa dark (`dataVizCategorical`)
 * o mesmo preto tinha contraste bom o bastante para nunca ter sido notado
 * como bug. `labelColorFor` decide por fill real em vez de assumir uma
 * rampa fixa, então o resultado já é correto nos dois temas sem precisar
 * saber qual rampa está ativa.
 *
 * A decisão usa a luminância relativa do WCAG 2.x — a mesma métrica das
 * tabelas de contraste documentadas em `dataViz.ts` — calculada em duas
 * etapas sobre `fillHex`:
 *
 * 1. Cada canal (R, G, B, 0–255) é normalizado para 0–1 e linearizado
 *    (correção de gama sRGB):
 *    `c ≤ 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4`
 * 2. Os três canais linearizados são combinados com os pesos de percepção
 *    do WCAG — mais peso no verde, quase nenhum no azul:
 *    `L = 0.2126·R + 0.7152·G + 0.0722·B` (0 = preto, 1 = branco)
 *
 * `L > 0.179` é tratado como fill claro (texto quase-preto); `L ≤ 0.179`
 * como fill escuro (texto branco). 0.179 é o crossover matemático do WCAG:
 * o ponto onde branco e preto empatam em contraste
 * (`(L+0.05)² = 1.05·0.05 → L ≈ 0.179`) — acima dele o preto SEMPRE ganha,
 * abaixo o branco. Nada de heurística: escolher pelo crossover maximiza o
 * contraste para qualquer fill. Conferido contra as duas rampas do app:
 * a dark (`dataVizCategorical`, ex. `#4E82E6` L≈0.233, `#3FB6A8` L≈0.373)
 * fica TODA acima do limiar → quase-preto (5.2–8.6:1, o mesmo resultado da
 * antiga constante fixa — zero regressão no dark); a light
 * (`dataVizCategoricalLight`, ex. `#2C5AA0` L≈0.104, `#9A6408` L≈0.113)
 * fica toda abaixo → branco (5.0–6.8:1). Um limiar maior que o crossover
 * (0.45 foi tentado) inverte o dark para branco e DERRUBA o contraste
 * (`#3FB6A8` branco = 2.48:1 vs preto = 7.84:1).
 *
 * @param fillHex - Cor do fill em hexadecimal (`#RRGGBB` ou `RRGGBB`).
 * @returns `"#FFFFFF"` ou o quase-preto canônico do app (`darkNeutral.bg`);
 * também `"#FFFFFF"` como fallback seguro se `fillHex` não for um hex de 6
 * dígitos válido.
 */
export function labelColorFor(fillHex: string): string {
  const hex = fillHex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return LIGHT_LABEL_TEXT;
  }

  const linearizeChannel = (channel8bit: number): number => {
    const c = channel8bit / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  const r = linearizeChannel(parseInt(hex.slice(0, 2), 16));
  const g = linearizeChannel(parseInt(hex.slice(2, 4), 16));
  const b = linearizeChannel(parseInt(hex.slice(4, 6), 16));
  const relativeLuminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return relativeLuminance > LABEL_LUMINANCE_THRESHOLD
    ? DARK_LABEL_TEXT
    : LIGHT_LABEL_TEXT;
}

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
 * Sem parâmetro de cor de preenchimento: a série assume a cor resolvida da
 * paleta categórica do modo ativo (`resolveDataVizCategorical`) via base do
 * tema. `horizontal` é estrutural (decide orientação + eixo de categoria) —
 * a única diferença visual permitida entre os dois modos.
 *
 * Data labels — cor de TEXTO (ajuste fino de temas, 2026-08-09): o label cai
 * em dois lugares fisicamente diferentes conforme a orientação, e cada um
 * exige uma fonte de cor diferente porque o fundo por trás dele é diferente:
 *
 * - **Vertical** (`horizontal: false`): `offsetY: -20` posiciona o número
 *   acima da coluna, sobre o fundo do gráfico (canvas/card), não sobre o
 *   preenchimento azul. Sem `style.colors`, o Apex usa seu próprio branco
 *   fixo — **não** herda `theme.palette.text.secondary` como a versão
 *   anterior deste comentário presumia; esse branco fica invisível quando o
 *   fundo é claro (achado F1, confirmado por screenshot, mesmo padrão
 *   estrutural do `SessionDepthChart`). `style?.textColor` deve receber
 *   `theme.palette.text.primary` do call site: o label senta sobre
 *   canvas/card, que acompanha o tema, então a cor de texto do tema já é
 *   sempre legível ali — sem precisar de {@link labelColorFor}.
 * - **Horizontal** (`horizontal: true`): sem esse deslocamento, o Apex
 *   desenha o label **dentro** do fim da barra mais longa (tipicamente a
 *   primeira de uma lista ordenada, ex.: `TopCountriesChart`) quando não há
 *   espaço depois dela — sobre o preenchimento da própria barra.
 *   `style?.barColor` deve receber a cor efetiva dessa barra (o mesmo tom
 *   resolvido de `resolveDataVizCategorical(mode)` usado como fill); o
 *   formatter aplica {@link labelColorFor} sobre ela internamente — mesmo
 *   tratamento de {@link formatHorizontalStackedBar} — e continua suprimindo
 *   o label abaixo de `BAR_LABEL_MIN_PCT` do total da série (barra fina
 *   demais para um número legível).
 *
 * Os dois campos de `style` são opcionais com default retrocompatível:
 * omitidos, o comportamento é o de antes desta prop (vertical sem cor
 * própria, horizontal com o quase-preto fixo `DARK_LABEL_TEXT`) — até que o
 * call site seja migrado para passá-los.
 *
 * @param locale - locale ativo do i18next (`i18n.language`), repassado aos
 * `toLocaleString()` do data label e do tooltip. Omitido: usa o locale
 * padrão do browser (comportamento anterior a esta prop).
 * @param style - Cores de texto do data label, theme-aware, resolvidas pelo
 * call site (que tem `theme` em escopo). `textColor` para o modo vertical
 * (usado como está); `barColor` para o modo horizontal (vira
 * `labelColorFor(barColor)` internamente). Omitido: default retrocompatível
 * (ver acima).
 */
export const formatBarChart = (
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  horizontal = false,
  labels?: { series?: string; clicksLabel?: string },
  locale?: string,
  style?: { textColor?: string; barColor?: string },
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
          ? {
              style: {
                colors: [
                  style?.barColor !== undefined
                    ? labelColorFor(style.barColor)
                    : DARK_LABEL_TEXT,
                ],
              },
            }
          : {
              offsetY: -20,
              ...(style?.textColor !== undefined
                ? { style: { colors: [style.textColor] } }
                : {}),
            }),
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
 * Sem parâmetro de cor de preenchimento: as séries assumem a paleta
 * categórica resolvida do modo ativo (`resolveDataVizCategorical`) via base
 * do tema — a mesma paleta que qualquer outro gráfico do app.
 *
 * Data labels — cor de TEXTO (ajuste fino de temas, 2026-08-09): cada label
 * senta em cima do próprio segmento colorido, então a cor de texto correta
 * depende do tom exato desse segmento — não existe uma cor única que
 * funcione para os 5 tons da paleta nos dois modos (a antiga constante
 * `BAR_LABEL_TEXT_COLOR`, quase-preto fixo, ficava ilegível sobre os tons
 * escuros da rampa do modo claro). `colors` deixa o formatter conhecer as
 * cores efetivas das séries — a mesma array resolvida por
 * `resolveDataVizCategorical(theme.palette.mode)` que o call site já usa
 * como `colors` do chart — e aplica {@link labelColorFor} por segmento,
 * ciclando por `colors` do mesmo jeito que o próprio ApexCharts cicla a
 * paleta quando há mais séries que cores (`colors[index % colors.length]`).
 * Omitido (call site ainda não migrado): cai no quase-preto fixo de sempre
 * (`DARK_LABEL_TEXT`) — default retrocompatível. Labels continuam
 * suprimidos abaixo de `BAR_LABEL_MIN_PCT` (segmento fino demais para
 * exibir o número sem colidir com o vizinho).
 *
 * Consequência intencional no modo dark, uma vez o call site migrado
 * (autorizada pela política única de C1 — ver spec de ajuste fino de
 * temas): o mesmo defeito de contraste existe nos dois temas (o quase-preto
 * fixo sobre `#4E82E6`/`#3FB6A8` da rampa dark já rendia ~3:1, borderline).
 * Com `colors` passado, o helper passa a escolher branco para os tons da
 * rampa dark que precisarem — uma mudança visual real no dark, restrita a
 * este formatter e explicitamente fora da garantia de "dark byte-idêntico"
 * do resto do ajuste fino.
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
 * @param colors - Cores efetivas das séries no modo ativo, na mesma ordem
 * de `data` (tipicamente `resolveDataVizCategorical(theme.palette.mode)`,
 * a mesma array já passada como `colors` do chart). Usada para resolver a
 * cor de texto de cada label via {@link labelColorFor}; cicla como o
 * próprio ApexCharts quando há mais segmentos que cores. Omitido: default
 * retrocompatível (quase-preto fixo em todos os segmentos).
 * @returns `series`/`options` prontos para `<ApexChartWrapper type="bar">`.
 */
export const formatHorizontalStackedBar = (
  data: Record<string, unknown>[],
  labelKey: string,
  valueKey: string,
  labels?: { rowLabel?: string },
  locale?: string,
  colors?: readonly string[],
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

  // Uma entrada por segmento, na mesma ordem de `series` — cicla `colors`
  // como o próprio ApexCharts faz quando há mais segmentos que cores; sem
  // `colors` (call site não migrado), todo segmento cai no default
  // retrocompatível `DARK_LABEL_TEXT`.
  const labelTextColors = series.map((_, index) => {
    const segmentFill =
      colors && colors.length > 0 ? colors[index % colors.length] : undefined;
    return segmentFill !== undefined
      ? labelColorFor(segmentFill)
      : DARK_LABEL_TEXT;
  });

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
        style: { colors: labelTextColors },
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
