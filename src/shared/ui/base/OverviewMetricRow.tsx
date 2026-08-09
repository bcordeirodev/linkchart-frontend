"use client";

import { Box, Typography, useTheme } from "@mui/material";

import type { ReactNode } from "react";

export interface OverviewMetric {
  /** Nome da métrica (ex.: "Cliques totais"). Já traduzido pelo chamador. */
  label: string;
  /** Valor já formatado para exibição (ex.: `"1.204"` ou `1204`). */
  value: string | number;
  /**
   * Cor opcional do `value` (ex.: `"success.main"`, `"error.main"`,
   * `"warning.main"`) — para métricas onde o próprio número/palavra carrega
   * semântica (ex.: direção de tendência). Omitido: cor padrão do tema
   * (`text.primary`, herdada do variant `h2`). Gate visual de 2026-08-03
   * (item 4): restaura a cor semântica que existia antes do redesign nos
   * indicadores de tendência do Resumo e do Momento.
   */
  valueColor?: string;
  /**
   * Texto de apoio opcional abaixo do valor (ex.: período, variação).
   * Aceita `ReactNode` (não só `string`) para permitir que o chamador colora
   * só um trecho (ex.: a seta ▲/▼ de uma variação percentual) sem mudar a
   * cor do resto da legenda.
   */
  caption?: ReactNode;
  /** Sparkline ou outro elemento gráfico discreto, renderizado abaixo da caption. */
  sparkline?: ReactNode;
}

export interface OverviewMetricRowProps {
  /** Métricas a exibir, na ordem recebida. */
  metrics: OverviewMetric[];
  /**
   * Densidade visual da fileira. `"lg"` (default) é a escala compacta de
   * 2026-08-08 — valor em `h2`/tabular-nums a `2.25rem` (xs) / `2.5rem`
   * (sm+), `py: 1.5`. `"md"` é mais compacto ainda (`1.75rem` xs / `2rem`
   * sm+, `py: 1`), com paddings proporcionalmente menores, para telas onde a
   * fileira de métricas não deve ocupar tanta altura — `/links`
   * (`LinkMetrics`) e, desde 2026-08-04, todas as fileiras do analytics
   * (`OverviewKpiHeader`, `TemporalAnalysis`, retenção e sessão). Relatórios
   * e perfil não passam esta prop e continuam em `"lg"`.
   *
   * **Ambos os modos respeitam a densidade automática de 5+ métricas**
   * descrita abaixo. O `"md"` só passou a respeitá-la em 2026-08-04, quando
   * o `OverviewKpiHeader` (5 métricas) virou o primeiro caller compacto
   * **e** denso e transformou em bug real o que até então era uma lacuna
   * conhecida e inofensiva.
   */
  size?: "md" | "lg";
  /**
   * Quantas linhas de altura o rótulo reserva. `1` (default) deixa o rótulo
   * ocupar só o que precisa — o comportamento de sempre, e o certo quando
   * todos os rótulos da fileira cabem em uma linha.
   *
   * `2` reserva duas linhas em **todas** as colunas da fileira, de `sm` para
   * cima — e também no `xs` quando a fileira vira grid de 2 colunas (3+
   * métricas): cada coluna ocupa só ~50% da largura, então um rótulo pode
   * quebrar numa célula e não na vizinha da mesma linha, desalinhando os
   * números da linha. Numa fileira estreita (ex.: um card de meia largura
   * com 3 métricas) basta um rótulo quebrar para o número dele descer uma
   * linha e sair da baseline dos vizinhos — o que faz a fileira parecer
   * desalinhada, não densa. Com a altura reservada, quebrar ou não quebrar
   * deixa de mover o número. Com 1–2 métricas o `xs` continua coluna única
   * de largura cheia, onde nenhum rótulo quebra sozinho — ali nada é
   * reservado.
   *
   * Opt-in de propósito: os callers cujos rótulos cabem em uma linha não
   * devem ganhar uma linha de espaço morto acima de cada número.
   */
  labelLines?: 1 | 2;
}

/**
 * Fileira de métricas de visão geral na linguagem "instrumento técnico":
 * números soltos no fundo (nível 0 — sem card, sem ícone), separados por
 * hairlines em vez de bordas de card. Mobile-first: no `xs`, fileiras com 3+
 * métricas viram um grid de 2 colunas (contagem ímpar: a última métrica
 * ocupa a linha inteira via `gridColumn: "span 2"`; hairline vertical
 * (`borderLeft`) entre colunas, horizontal (`borderTop`) entre linhas);
 * fileiras com 1–2 métricas mantêm coluna única empilhada, como antes. A
 * partir de `sm`, vira sempre uma linha única com hairlines verticais
 * (`borderLeft`).
 *
 * O valor usa a escala tipográfica de `variant="h2"` (que já herda Space
 * Grotesk 700 do tema) com `fontVariantNumeric: "tabular-nums"`. Desde
 * 2026-08-08 a escala é mais compacta: `"lg"` (default) a `2.25rem` (xs) /
 * `2.5rem` (sm+), `"md"` a `1.75rem` (xs) / `2rem` (sm+), ambos com
 * `py: 1.5` (`"lg"`) / `py: 1` (`"md"`). Renderizado com `component="p"` —
 * é um valor de dado, não um heading de página, então não deve poluir a
 * árvore de headings com um `<h2>` por métrica.
 *
 * **Exceção consciente:** no modo `"md"`, o salto do valor sobre a caption
 * (`body2`, 13px) fica em ~2.5x — abaixo da regra geral de 3x+ do projeto.
 * Decisão de 2026-08-08: a fileira compacta prioriza densidade vertical
 * sobre a proporção idealizada; não é lacuna a "corrigir".
 *
 * **Densidade automática (5+ métricas):** o único caller com 5 métricas
 * (`OverviewKpiHeader`) estourava a largura entre ~600–900px — a faixa em
 * que o layout já virou linha (`sm`) mas ainda não ganhou a folga do `md`
 * (900px). Com `flex: 1` e a coluna espremida, o número (sem espaço para
 * quebrar) vaza da própria coluna. Quando `metrics.length >= 5`, o
 * `fontSize` do `sm` cai um degrau (`2.5rem` → `1.875rem` no `"lg"`,
 * `2rem` → `1.625rem` no `"md"`) e o gutter horizontal entre colunas cai de
 * `3` para `1.5`, só nesse breakpoint. O `xs` (grid/empilhado) e o `md`+
 * (com folga de sobra) não mudam. Callers com 3–4 métricas têm
 * `isDense = false` e continuam recebendo exatamente o mesmo objeto de
 * estilo de antes — zero mudança visual adicional.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * `label`/`caption` chegam já traduzidos via props.
 *
 * @param props.metrics Métricas a renderizar, na ordem recebida.
 * @param props.size Densidade visual — `"md"` (mais compacto) ou `"lg"` (default).
 * @param props.labelLines Linhas de altura reservadas para o rótulo — `2` mantém
 * os números na mesma baseline quando algum rótulo quebra.
 * @returns Linha (grid 2 colunas no mobile com 3+ métricas) de métricas sem card/ícone.
 */
export function OverviewMetricRow({
  metrics,
  size = "lg",
  labelLines = 1,
}: OverviewMetricRowProps) {
  const theme = useTheme();
  const hairline = `1px solid ${theme.palette.divider}`;
  const isDense = metrics.length >= 5;
  const isCompact = size === "md";
  const twoColXs = metrics.length >= 3;
  // `em`, não px: resolve contra o próprio `font-size` do rótulo (`body2`,
  // cujo `line-height` é 1.54 no `typographyScale.bodySm`), então continua
  // valendo se a escala tipográfica mudar. Só duas linhas de rótulo é o
  // caso real hoje; um `labelLines` maior seguiria a mesma conta.
  //
  // No `xs`, só reserva quando o grid de 2 colunas está ativo (`twoColXs`):
  // cada célula ocupa ~50% da largura e um rótulo pode quebrar numa coluna
  // sem quebrar na vizinha da mesma linha, desalinhando os números — o
  // mesmo problema que a prop resolve a partir de `sm`. Com 1–2 métricas o
  // `xs` é coluna única de largura cheia (nenhum rótulo quebra sozinho) e
  // reservar ali seria só espaço morto acima de cada número, no viewport
  // que menos tem altura.
  const labelMinHeight =
    labelLines > 1
      ? {
          xs: twoColXs ? `${labelLines * 1.54}em` : "auto",
          sm: `${labelLines * 1.54}em`,
        }
      : undefined;

  return (
    <Box
      sx={{
        display: { xs: "grid", sm: "flex" },
        gridTemplateColumns: twoColXs ? "repeat(2, 1fr)" : "1fr",
        flexDirection: { sm: "row" },
      }}
    >
      {metrics.map((metric, index) => {
        const isFirst = index === 0;
        const isLast = index === metrics.length - 1;
        const gutter = isDense ? 1.5 : 3;
        // Grid 2 colunas no xs (3+ métricas): coluna/linha derivadas do índice;
        // contagem ímpar deixa a última métrica ocupando a linha inteira.
        const spansFullRow = twoColXs && isLast && metrics.length % 2 === 1;
        const xsCol = twoColXs && !spansFullRow ? index % 2 : 0;
        const xsRow = twoColXs ? Math.floor(index / 2) : index;

        return (
          <Box
            key={`${index}-${metric.label}`}
            sx={{
              flex: { sm: 1 },
              minWidth: 0,
              gridColumn: spansFullRow ? "span 2" : undefined,
              py: isCompact ? 1 : 1.5,
              pl: {
                xs: xsCol === 1 ? 1.5 : 0,
                sm: isFirst ? 0 : gutter,
              },
              pr: {
                xs: twoColXs && xsCol === 0 && !spansFullRow ? 1.5 : 0,
                sm: isLast ? 0 : gutter,
              },
              borderTop: {
                xs: xsRow > 0 ? hairline : "none",
                sm: "none",
              },
              borderLeft: {
                xs: xsCol === 1 ? hairline : "none",
                sm: isFirst ? "none" : hairline,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                mb: isCompact ? 0.25 : 0.5,
                // `spansFullRow` is an `xs`-only condition (it drives
                // `gridColumn: "span 2"`, which only means anything under the
                // `xs` grid) — the full-row item has no sibling on its own
                // line to desync from, so its `xs` reservation zeroes out
                // while `sm`+, where it is just another cell in the shared
                // row, keeps the same reservation as everyone else.
                minHeight: labelMinHeight
                  ? {
                      ...labelMinHeight,
                      xs: spansFullRow ? "auto" : labelMinHeight.xs,
                    }
                  : undefined,
              }}
            >
              {metric.label}
            </Typography>
            <Typography
              variant="h2"
              component="p"
              sx={{
                fontVariantNumeric: "tabular-nums",
                fontSize: isCompact
                  ? {
                      xs: "1.75rem",
                      sm: isDense ? "1.625rem" : "2rem",
                      md: "2rem",
                    }
                  : {
                      xs: "2.25rem",
                      sm: isDense ? "1.875rem" : "2.5rem",
                      md: "2.5rem",
                    },
                lineHeight: 1.1,
                mb:
                  metric.caption || metric.sparkline
                    ? isCompact
                      ? 0.25
                      : 0.5
                    : 0,
                overflowWrap: "anywhere",
                color: metric.valueColor,
              }}
            >
              {metric.value}
            </Typography>
            {metric.caption ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {metric.caption}
              </Typography>
            ) : null}
            {metric.sparkline ? (
              <Box sx={{ mt: isCompact ? 0.75 : 1 }}>{metric.sparkline}</Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}

export default OverviewMetricRow;
