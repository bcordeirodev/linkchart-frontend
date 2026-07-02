"use client";
/**
 * 📊 CHART CARD - Componente Base para Gráficos
 *
 * @description
 * Componente reutilizável que encapsula um gráfico com estilo consistente,
 * incluindo título, ícone, subtítulo opcional, ação e estados de loading.
 * Seguindo os padrões de design do projeto.
 */

import { useMemo } from "react";
import { Box, Card, CardContent, Fade, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { createPresetAnimations } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

export interface ChartCardProps {
  /** Título do gráfico */
  title?: string;
  /** Ícone para o título */
  icon?: ReactNode;
  /** Subtítulo descritivo opcional, exibido abaixo do título */
  subtitle?: string;
  /** Elemento opcional (ex.: filtros, toggles) renderizado acima do conteúdo */
  action?: ReactNode;
  /** Conteúdo do gráfico */
  children: ReactNode;
  /** Altura do container externo */
  height?: number | string;
  /** Quando true, substitui o conteúdo por um texto de carregamento */
  loading?: boolean;
  /** Props adicionais de estilo */
  sx?: SxProps<Theme>;
}

/**
 * Card container for charts — title row (optional icon + heading) + slot for the chart body.
 *
 * Uses `radiusTokens.md`, a 1 px divider border and the `xs` elevation token (mode-aware).
 * The outer `<Box>` adds `animations.cardHover` so the whole card lifts on hover, and the
 * body is wrapped in a short `<Fade>` to soften initial mount.
 *
 * @example
 * ```tsx
 * <ChartCard title="Cliques por Hora" icon="📈" subtitle="Últimas 24h">
 *   <ApexChartWrapper {...chartProps} />
 * </ChartCard>
 * ```
 */
export function ChartCard({
  title,
  icon,
  subtitle,
  action,
  children,
  height = "100%",
  loading = false,
  sx = {},
}: ChartCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");

  // Memoize to avoid creating a new animations object on every render
  const animations = useMemo(() => createPresetAnimations(theme), [theme]);

  return (
    <Box
      sx={{
        height,
        width: "100%",
        minWidth: 0,
        ...animations.cardHover,
        ...sx,
      }}
    >
      <Card
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? elevationTokens.xs
              : elevationLightTokens.xs,
        }}
      >
        <CardContent>
          {title ? (
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                position: "relative",
                zIndex: 1,
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              {icon ? (
                <Box
                  component="span"
                  sx={{ display: "inline-flex", alignItems: "center", mr: 0.5 }}
                >
                  {icon}
                </Box>
              ) : null}
              {title}
            </Typography>
          ) : null}

          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          ) : null}

          {action ? <Box sx={{ mb: 1 }}>{action}</Box> : null}

          <Box sx={{ mb: 2 }}>
            {loading ? (
              <Typography color="text.secondary">
                {t("chart.loadingShort")}
              </Typography>
            ) : (
              <Fade in timeout={260}>
                <Box sx={{ width: "100%", minWidth: 0 }}>{children}</Box>
              </Fade>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChartCard;
