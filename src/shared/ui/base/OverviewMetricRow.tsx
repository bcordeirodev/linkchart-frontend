"use client";

import { Box, Typography, useTheme } from "@mui/material";

import type { ReactNode } from "react";

export interface OverviewMetric {
  /** Nome da métrica (ex.: "Cliques totais"). Já traduzido pelo chamador. */
  label: string;
  /** Valor já formatado para exibição (ex.: `"1.204"` ou `1204`). */
  value: string | number;
  /** Texto de apoio opcional abaixo do valor (ex.: período, variação). */
  caption?: string;
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
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * `label`/`caption` chegam já traduzidos via props.
 *
 * @param props.metrics Métricas a renderizar, na ordem recebida.
 * @returns Linha (coluna no mobile) de métricas sem card/ícone.
 */
export function OverviewMetricRow({ metrics }: OverviewMetricRowProps) {
  const theme = useTheme();
  const hairline = `1px solid ${theme.palette.divider}`;

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

        return (
          <Box
            key={metric.label}
            sx={{
              flex: 1,
              minWidth: 0,
              py: 2,
              pl: { xs: 0, sm: isFirst ? 0 : 3 },
              pr: { xs: 0, sm: isLast ? 0 : 3 },
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
                fontSize: { xs: "2.5rem", sm: "3rem" },
                lineHeight: 1.1,
                mb: metric.caption || metric.sparkline ? 0.5 : 0,
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
