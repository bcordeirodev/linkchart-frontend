/**
 * O que a página pública de estatísticas ainda acrescenta aos gráficos —
 * e só isso.
 *
 * Antes deste arquivo carregava um tema inteiro (paleta própria com laranja e
 * verde, fill em gradiente para todo tipo de gráfico, barras com raio 7,
 * grid tracejado, tooltip, legenda). Tudo isso agora vem de
 * `buildApexBaseOptions` (`@/lib/theme/apexBaseTheme`), injetado por
 * `ApexChartWrapper` em **todos** os gráficos do app — logado e público. Um
 * "tema público" paralelo só conseguia divergir do resto do produto, que é
 * exatamente o que o redesign "instrumento técnico" existe para acabar.
 *
 * Sobrou uma única responsabilidade que a base não tem como conhecer: se o
 * visitante pediu movimento reduzido. As páginas públicas leem isso via
 * `usePrefersReducedMotion` e repassam aqui.
 */

/**
 * Bloco `chart.animations` dos gráficos públicos.
 *
 * `ApexChartWrapper` monta `animations` com seus defaults e faz spread das
 * opções da tela por cima, então devolver `{ enabled: false }` desliga a
 * animação de entrada do gráfico sem mexer em mais nada.
 *
 * @param reducedMotion `true` quando o visitante pede movimento reduzido.
 * @returns Fragmento para `chart.animations` do ApexCharts.
 */
export function getPublicChartAnimations(reducedMotion: boolean): {
  enabled: boolean;
} {
  return { enabled: !reducedMotion };
}
