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
}

/**
 * Fileira de métricas de visão geral na linguagem "instrumento técnico":
 * números soltos no fundo (nível 0 — sem card, sem ícone), separados por
 * hairlines em vez de bordas de card. Mobile-first: empilha em coluna com
 * hairlines horizontais abaixo de `sm` (600px) e vira uma linha com
 * hairlines verticais (`borderLeft`) a partir de `sm`.
 *
 * O valor usa a escala tipográfica de `variant="h2"` (que já herda Space
 * Grotesk 700 do tema) com `fontVariantNumeric: "tabular-nums"` e um
 * `fontSize` maior, produzindo o salto de escala de 3x+ sobre a caption
 * (`body2`, `text.secondary`) pedido pelo redesign. Renderizado com
 * `component="p"` — é um valor de dado, não um heading de página, então não
 * deve poluir a árvore de headings com um `<h2>` por métrica.
 *
 * **Densidade automática (5+ métricas):** o único caller com 5 métricas
 * (`OverviewKpiHeader`) estourava a largura entre ~600–900px — a faixa em
 * que o layout já virou linha (`sm`) mas ainda não ganhou a folga do `md`
 * (900px). Com `flex: 1` e `fontSize: "3rem"`, cada coluna fica com
 * ~80–130px e o número (sem espaço para quebrar) vaza da própria coluna.
 * Quando `metrics.length >= 5`, o `fontSize` do `sm` cai para `"2rem"` (o
 * `xs` — empilhado, largura cheia — e o `md` — com folga de sobra — não
 * mudam) e o gutter horizontal entre colunas cai de `3` para `1.5`, only at
 * that breakpoint. Callers com 3–4 métricas (`/links`, retenção, sessão)
 * têm `isDense = false` e continuam recebendo exatamente o mesmo objeto de
 * estilo de antes — zero mudança visual. `2rem` (32px) fica abaixo do
 * salto de 3x sobre a caption de 13px nessa faixa estreita específica; é a
 * troca deliberada (legibilidade sem vazar > proporção idealizada) só para
 * o caso denso, não uma mudança da regra geral.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * `label`/`caption` chegam já traduzidos via props.
 *
 * @param props.metrics Métricas a renderizar, na ordem recebida.
 * @returns Linha (coluna no mobile) de métricas sem card/ícone.
 */
export function OverviewMetricRow({ metrics }: OverviewMetricRowProps) {
  const theme = useTheme();
  const hairline = `1px solid ${theme.palette.divider}`;
  const isDense = metrics.length >= 5;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {metrics.map((metric, index) => {
        const isFirst = index === 0;
        const isLast = index === metrics.length - 1;
        const gutter = isDense ? 1.5 : 3;

        return (
          <Box
            key={metric.label}
            sx={{
              flex: 1,
              minWidth: 0,
              py: 2,
              pl: { xs: 0, sm: isFirst ? 0 : gutter },
              pr: { xs: 0, sm: isLast ? 0 : gutter },
              borderTop: isFirst ? "none" : { xs: hairline, sm: "none" },
              borderLeft: isFirst ? "none" : { xs: "none", sm: hairline },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500, mb: 0.5 }}
            >
              {metric.label}
            </Typography>
            <Typography
              variant="h2"
              component="p"
              sx={{
                fontVariantNumeric: "tabular-nums",
                fontSize: {
                  xs: "2.5rem",
                  sm: isDense ? "2rem" : "3rem",
                  md: "3rem",
                },
                lineHeight: 1.1,
                mb: metric.caption || metric.sparkline ? 0.5 : 0,
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
              <Box sx={{ mt: 1 }}>{metric.sparkline}</Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}

export default OverviewMetricRow;
