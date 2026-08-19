"use client";

import { Box, Typography, useTheme } from "@mui/material";

import { darkNeutral, lightNeutral, radiusTokens } from "@/lib/theme";

import { getCardSurfaceSx } from "./cardSurface";

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
   * (sm+), `p: 2` no tile. `"md"` é mais compacto ainda (`1.75rem` xs /
   * `2rem` sm+, `p: 1.5`), com paddings proporcionalmente menores, para
   * telas onde a fileira não deve ocupar tanta altura — `/links`
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
  /**
   * `true` quando a fileira vive **dentro** de um card/painel já delimitado
   * (`ChartCard`, `ProfileSection`, o card-hero de `/reports`). Redesenho de
   * 2026-08-17: como cada métrica agora é uma caixa, um tile com a mesma
   * superfície do card que o contém desapareceria — sobraria só a hairline,
   * sem degrau de fundo. Com `nested`, o tile passa a usar o degrau
   * **acima** do card no dark (`darkNeutral.elevated`) e o degrau **abaixo**
   * no claro (`lightNeutral.bg`, o canvas) — exatamente o precedente já
   * usado pelos poços internos de `SubdomainList`/`ApiKeyList`/
   * `LinksEmptyState`, onde a elevação clareia no dark e escurece no claro.
   *
   * Default `false`: solta na página, a fileira usa a superfície padrão de
   * card (`getCardSurfaceSx`), que é o degrau correto sobre o canvas.
   *
   * Explícito (e não inferido por contexto) de propósito: o componente não
   * tem como saber se o ancestral é um card, e um `Context` só para isso
   * acoplaria a primitiva a quem a renderiza.
   */
  nested?: boolean;
}

/**
 * Fileira de métricas de visão geral na linguagem "instrumento técnico":
 * um grid de **tiles** — cada métrica numa caixa própria, hairline de 1px
 * (`divider`), raio `radiusTokens.md` e a superfície de card do app. Mobile
 * first: no `xs`, fileiras com 3+ métricas viram um grid de 2 colunas
 * (contagem ímpar: a última métrica ocupa a linha inteira via
 * `gridColumn: "span 2"`); fileiras com 1–2 métricas mantêm coluna única
 * empilhada. A partir de `sm`, vira sempre uma linha única de tiles de
 * largura igual (`repeat(n, minmax(0, 1fr))`).
 *
 * **Redesenho de 2026-08-17 (tiles).** Até aqui a fileira era nível 0 —
 * números soltos no fundo, separados por hairlines (`borderTop`/`borderLeft`)
 * em vez de bordas de caixa, com gutters de `pl`/`pr` fazendo o respiro. A
 * pedido do Bruno ("bordas mais concisas, caixas mais visíveis"), e no mesmo
 * pacote em que os tokens de borda subiram um degrau nos dois temas, cada
 * métrica passou a ser uma caixa visível: as hairlines de separação viraram
 * a borda do próprio tile, os gutters viraram `gap` do grid e o antigo
 * `py` virou padding interno. O bloco `<frontend_aesthetics>` do CLAUDE.md
 * do frontend ainda descreve a regra antiga ("números soltos + hairlines")
 * — esta é a supersessão consciente dela; o resto da identidade continua
 * valendo (sem ícone-chip, sem fundo colorido no tile, escala numérica
 * intocada).
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
 * `2rem` → `1.625rem` no `"md"`) e o `gap` entre tiles cai de `1.5` para
 * `1`, só nesse breakpoint (no layout de hairlines o mesmo degrau ia de
 * gutter `3` para `1.5` — a proporção se manteve, a base é que encolheu
 * junto com a troca de gutter por `gap`). O `xs` (grid/empilhado) e o `md`+
 * (com folga de sobra) não mudam. Callers com 3–4 métricas têm
 * `isDense = false`.
 *
 * **Card dentro de card.** Vários callers renderizam a fileira dentro de um
 * card já delimitado; ver a prop `nested`, que troca a superfície do tile
 * pelo degrau de elevação em vez da superfície de card (que sumiria contra
 * o card hospedeiro). Sem ela a regra "sem card dentro de card" seria
 * violada de fato, não só na aparência.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * `label`/`caption` chegam já traduzidos via props.
 *
 * @param props.metrics Métricas a renderizar, na ordem recebida.
 * @param props.size Densidade visual — `"md"` (mais compacto) ou `"lg"` (default).
 * @param props.labelLines Linhas de altura reservadas para o rótulo — `2` mantém
 * os números na mesma baseline quando algum rótulo quebra.
 * @param props.nested `true` quando a fileira vive dentro de um card/painel —
 * o tile ganha o fundo de elevação em vez da superfície de card.
 * @returns Grid de tiles de métrica (2 colunas no mobile com 3+ métricas,
 * linha única de larguras iguais a partir de `sm`), sem ícone.
 */
export function OverviewMetricRow({
  metrics,
  size = "lg",
  labelLines = 1,
  nested = false,
}: OverviewMetricRowProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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

  // Superfície do tile. Solto na página: a mesma superfície de card in-page
  // de todo o app (`getCardSurfaceSx` — véu branco no dark, `background
  // .paper` sólido no claro). Dentro de um card (`nested`): o degrau de
  // elevação, seguindo o precedente dos poços internos de
  // `SubdomainList`/`ApiKeyList` — no dark a elevação CLAREIA
  // (`darkNeutral.elevated`), no claro ela ESCURECE em direção ao canvas
  // (`lightNeutral.bg`), porque ali `background.paper` já é a cor do card
  // hospedeiro e o tile ficaria invisível.
  const tileSurfaceSx = nested
    ? { backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.bg }
    : getCardSurfaceSx(theme);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: twoColXs ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
          sm: `repeat(${metrics.length}, minmax(0, 1fr))`,
        },
        // Substitui os antigos gutters `pl`/`pr`: com tiles, o respiro é o
        // vão ENTRE caixas, não padding assimétrico dentro de cada coluna.
        gap: { xs: 1.5, sm: isDense ? 1 : 1.5 },
      }}
    >
      {metrics.map((metric, index) => {
        const isLast = index === metrics.length - 1;
        // Grid 2 colunas no xs (3+ métricas): contagem ímpar deixa a última
        // métrica ocupando a linha inteira.
        const spansFullRow = twoColXs && isLast && metrics.length % 2 === 1;

        return (
          <Box
            key={`${index}-${metric.label}`}
            sx={{
              minWidth: 0,
              gridColumn: { xs: spansFullRow ? "span 2" : "auto", sm: "auto" },
              ...tileSurfaceSx,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${radiusTokens.md}px`,
              p: isCompact ? 1.5 : 2,
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
