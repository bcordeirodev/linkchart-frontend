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
   * Densidade visual da fileira. `"lg"` (default) é a escala original —
   * valor em `h2`/tabular-nums a `2.5rem` (xs) / `3rem` (sm+), com os
   * paddings/gaps de sempre. `"md"` é ~25% mais compacto (`2rem`/`2.25rem`)
   * com paddings proporcionalmente menores, para telas onde a fileira de
   * métricas não deve ocupar tanta altura — `/links` (`LinkMetrics`) e, desde
   * 2026-08-04, todas as fileiras do analytics (`OverviewKpiHeader`,
   * `TemporalAnalysis`, retenção e sessão). Relatórios e perfil não passam
   * esta prop e continuam em `"lg"`, pixel-idênticos a antes.
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
   * cima. Numa fileira estreita (ex.: um card de meia largura com 3 métricas)
   * basta um rótulo quebrar para o número dele descer uma linha e sair da
   * baseline dos vizinhos — o que faz a fileira parecer desalinhada, não
   * densa. Com a altura reservada, quebrar ou não quebrar deixa de mover o
   * número. No `xs` a fileira já é uma coluna empilhada e nada é reservado.
   *
   * Opt-in de propósito: os callers cujos rótulos cabem em uma linha não
   * devem ganhar uma linha de espaço morto acima de cada número.
   */
  labelLines?: 1 | 2;
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
 * Quando `metrics.length >= 5`, o `fontSize` do `sm` cai um degrau (`3rem`
 * → `2rem` no `"lg"`, `2.25rem` → `1.75rem` no `"md"`) e o gutter horizontal
 * entre colunas cai de `3` para `1.5`, only at that breakpoint. O `xs`
 * (empilhado, largura cheia) e o `md`+ (com folga de sobra) não mudam.
 * Callers com 3–4 métricas têm `isDense = false` e continuam recebendo
 * exatamente o mesmo objeto de estilo de antes — zero mudança visual. O
 * valor reduzido fica abaixo do salto de 3x sobre a caption de 13px nessa
 * faixa estreita específica; é a troca deliberada (legibilidade sem vazar >
 * proporção idealizada) só para o caso denso, não uma mudança da regra geral.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * `label`/`caption` chegam já traduzidos via props.
 *
 * @param props.metrics Métricas a renderizar, na ordem recebida.
 * @param props.size Densidade visual — `"md"` (compacto) ou `"lg"` (default, escala original).
 * @param props.labelLines Linhas de altura reservadas para o rótulo — `2` mantém
 * os números na mesma baseline quando algum rótulo quebra.
 * @returns Linha (coluna no mobile) de métricas sem card/ícone.
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
  // `em`, não px: resolve contra o próprio `font-size` do rótulo (`body2`,
  // cujo `line-height` é 1.54 no `typographyScale.bodySm`), então continua
  // valendo se a escala tipográfica mudar. Só duas linhas de rótulo é o
  // caso real hoje; um `labelLines` maior seguiria a mesma conta.
  //
  // Só a partir de `sm`: abaixo disso a fileira vira coluna empilhada, cada
  // métrica ocupa a largura toda (nenhum rótulo quebra) e não existe baseline
  // compartilhada para proteger — reservar a segunda linha ali seria só
  // espaço morto acima de cada número, no viewport que menos tem altura.
  const labelMinHeight =
    labelLines > 1 ? { xs: "auto", sm: `${labelLines * 1.54}em` } : undefined;

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
            key={`${index}-${metric.label}`}
            sx={{
              flex: 1,
              minWidth: 0,
              py: isCompact ? 1.25 : 2,
              pl: { xs: 0, sm: isFirst ? 0 : gutter },
              pr: { xs: 0, sm: isLast ? 0 : gutter },
              borderTop: isFirst ? "none" : { xs: hairline, sm: "none" },
              borderLeft: isFirst ? "none" : { xs: "none", sm: hairline },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                mb: isCompact ? 0.25 : 0.5,
                minHeight: labelMinHeight,
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
                      xs: "2rem",
                      sm: isDense ? "1.75rem" : "2.25rem",
                      md: "2.25rem",
                    }
                  : {
                      xs: "2.5rem",
                      sm: isDense ? "2rem" : "3rem",
                      md: "3rem",
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
