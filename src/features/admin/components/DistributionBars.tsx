"use client";
/**
 * Barras horizontais de distribuição — visual compartilhado por
 * `AdminEngagementTab` (links por usuário) e `AdminHealthTab` (qualidade do
 * tráfego). Replica o padrão de `BreakdownBars`
 * (`src/features/reports/components/BreakdownBars.tsx`): hairline sutil,
 * barra proporcional ao maior valor da lista ("rank shape", não
 * parte-do-todo — o `pct` no rótulo carrega esse significado) e cor de
 * `dataVizPalette`. Sem `Select` de dimensão (o admin não precisa trocar de
 * eixo) e sem `ChartCard` próprio — o chamador já envolve isto num
 * `ChartCard` com título/subtítulo.
 */

import { Box, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme/designSystem";
import { formatCount } from "@/lib/utils/formatNumber";

/** Uma linha de barra: rótulo + contagem bruta, com share opcional. */
export interface DistributionBarRow {
  /** Rótulo já traduzido (ou código estável, ex.: bucket `"6+"`). */
  label: string;
  /** Contagem bruta associada à categoria. */
  value: number;
  /**
   * Share (%) já calculado pelo backend, 0–100. Quando omitido, o
   * componente deriva o share a partir do total das `rows` recebidas (soma
   * das barras = 100%).
   */
  pct?: number;
  /**
   * Cor da barra desta linha. Default: `theme.palette.primary.main` (o
   * mesmo azul único que `BreakdownBars` usa para todas as linhas). Passe um
   * tom de `dataVizPalette` por linha quando as categorias precisam ser
   * diferenciáveis por cor (ex.: tiers de qualidade).
   */
  color?: string;
}

export interface DistributionBarsProps {
  /** Linhas a desenhar, na ordem recebida. */
  rows: DistributionBarRow[];
  /**
   * Sufixo textual após a contagem (ex.: "usuários"). Omitido: só conta + pct.
   *
   * Aceita uma função `(count) => string` para sufixos que precisam concordar
   * em número com a contagem da própria linha — sem isso o bucket de 1 usuário
   * saía como "1 usuários". O chamador resolve a forma via `t(chave, { count })`
   * (plural do i18next), que é quem conhece as regras do idioma ativo.
   */
  unit?: string | ((count: number) => string);
  /**
   * Mensagem exibida no lugar das barras quando `rows` está vazio (ex.:
   * nenhum clique classificado no período — `quality_tiers_7d` é resultado
   * de INNER JOIN, então um tier sem cliques fica ausente do array, e todos
   * ausentes deixa o array vazio). Omitido: `rows` vazio não deve acontecer
   * para o chamador (ex.: buckets de engajamento sempre vêm com as 4 chaves
   * zeradas) e o componente não renderiza nada.
   */
  emptyMessage?: string;
}

/**
 * Barras horizontais rankeadas — cada linha mostra rótulo, contagem
 * (+ sufixo opcional) e share, com uma barra escalada ao maior valor da
 * lista. Pura apresentação: não busca dados, não decide loading/error/empty
 * de query (isso é responsabilidade do `AnalyticsStateManager` do
 * chamador) — só o caso `rows` vazio tem um estado próprio, via
 * `emptyMessage`, porque nesse caso a query já teve sucesso e só a
 * distribuição em si está vazia.
 *
 * @param props.rows Linhas a desenhar.
 * @param props.unit Sufixo textual após a contagem (string ou função do count).
 * @param props.emptyMessage Mensagem para `rows` vazio.
 * @returns Pilha de barras horizontais, ou a mensagem de vazio.
 */
export function DistributionBars({
  rows,
  unit,
  emptyMessage,
}: DistributionBarsProps) {
  const theme = useTheme();
  // Só o idioma ativo interessa aqui: o componente não tem texto próprio, mas
  // formata números — que mudam de separador entre pt-BR e en.
  const { i18n } = useTranslation("admin");

  if (rows.length === 0) {
    return emptyMessage ? (
      <Typography variant="body2" color="text.secondary">
        {emptyMessage}
      </Typography>
    ) : null;
  }

  const max = Math.max(...rows.map((row) => row.value), 1);
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <Stack spacing={1.5} sx={{ pt: 0.5 }}>
      {rows.map((row) => {
        const pct = row.pct ?? (total === 0 ? 0 : (row.value / total) * 100);
        const roundedPct = Math.round(pct * 10) / 10;
        const barColor = row.color ?? theme.palette.primary.main;
        const suffix = typeof unit === "function" ? unit(row.value) : unit;

        return (
          <Box key={row.label}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="body2"
                noWrap
                title={row.label}
                sx={{
                  fontFamily: typographyScale.code.fontFamily,
                  fontWeight: 500,
                  minWidth: 0,
                }}
              >
                {row.label}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  fontFamily: typographyScale.code.fontFamily,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatCount(row.value, i18n.language)}
                {suffix ? ` ${suffix}` : ""} ·{" "}
                {formatCount(roundedPct, i18n.language)}%
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(barColor, 0.12),
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(row.value / max) * 100}%`,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: barColor,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

export default DistributionBars;
