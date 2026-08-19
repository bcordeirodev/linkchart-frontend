"use client";

import { Box } from "@mui/material";

import { formatCount } from "@/lib/utils/formatNumber";

/**
 * Semantic color token for a signed period-over-period variation.
 *
 * Direction IS the information (decisão de 2026-08-03, item 4 do gate
 * visual): green when the metric grew, red when it shrank, and the inherited
 * text color when there is nothing to judge — `null` (sem período anterior
 * para comparar) ou exatamente `0` (estável não é má notícia, então não pega
 * emprestada a cor de queda).
 *
 * Exportado à parte do componente porque nem todo número que carrega uma
 * variação é um `MetricDelta`: em `OverviewMetricRow` o próprio valor pode
 * ser a variação (`valueColor`), e em `InsightsPanel` o valor do card É o
 * percentual. Nesses casos só a cor é reaproveitada, não a marcação.
 *
 * @param value Variação percentual assinada, ou `null` sem baseline.
 * @returns Token de paleta (`"success.main"` / `"error.main"`) ou `undefined`
 * para herdar a cor do contexto.
 */
export function getMetricDeltaColor(
  value: number | null | undefined,
): "success.main" | "error.main" | undefined {
  if (value == null || value === 0) {
    return undefined;
  }

  return value > 0 ? "success.main" : "error.main";
}

/** Props accepted by {@link MetricDelta}. */
export interface MetricDeltaProps {
  /**
   * Signed percentage change vs. the previous period. `null` when the backend
   * has no comparable baseline — renders a neutral em dash instead of a fake
   * `0%`.
   */
  value: number | null | undefined;
  /**
   * Active UI locale (`i18n.language`) — decides the decimal separator
   * (`12,3%` em pt-BR, `12.3%` em en).
   */
  locale: string;
  /**
   * Optional trailing text naming what the delta is compared against (ex.:
   * `"vs. período anterior"`), already translated by the caller. Rendered in
   * the inherited (neutral) color: só a seta e o número recebem a cor
   * semântica — é a variação que carrega o veredito, não a frase que a
   * qualifica.
   */
  label?: string;
  /** Optional native tooltip on the delta (ex.: `"Variação vs. período anterior"`). */
  title?: string;
}

/**
 * Inline period-over-period delta — `▲ 12,3%` / `▼ 4,1%` / `—` — colored by
 * direction and, opcionalmente, seguido de um rótulo neutro
 * (`▲ 12,3% vs. período anterior`).
 *
 * Renderiza um `<span>`, não um bloco: o uso canônico é dentro do slot
 * `caption` de {@link OverviewMetricRow} (que aceita `ReactNode` justamente
 * para o chamador colorir só um trecho da legenda) e herda tipografia do
 * `Typography` hospedeiro. Só o número usa `tabular-nums`, para que uma
 * variação que muda a cada refresh não empurre o rótulo ao lado.
 *
 * Setas `▲`/`▼` (e não os ícones lucide do `LinkTrendBadge`): esta é a
 * convenção da coluna "Variação" de `/reports`, a referência do sistema para
 * variação percentual em texto.
 *
 * Puramente apresentacional — o `label` chega traduzido pelo chamador, então
 * o componente não amarra `shared/ui` a nenhum namespace de i18n.
 *
 * @param props.value Variação percentual assinada, ou `null` sem baseline.
 * @param props.locale Idioma ativo (`i18n.language`).
 * @param props.label Texto neutro após a variação, já traduzido.
 * @param props.title Tooltip nativo opcional.
 * @returns `<span>` com a variação colorida e o rótulo opcional.
 */
export function MetricDelta({ value, locale, label, title }: MetricDeltaProps) {
  const color = getMetricDeltaColor(value);
  const text =
    value == null
      ? "—"
      : `${value >= 0 ? "▲" : "▼"} ${formatCount(Math.abs(value), locale)}%`;

  return (
    <Box component="span" title={title}>
      <Box
        component="span"
        sx={{ color, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
      >
        {text}
      </Box>
      {label ? ` ${label}` : null}
    </Box>
  );
}

export default MetricDelta;
