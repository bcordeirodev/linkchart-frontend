"use client";
import { Box, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { LinkQuality, LinkQualityTier } from "@/types";

const QUALITY_COLORS: Record<LinkQualityTier, string> = {
  organic: "success.main",
  suspicious: "warning.main",
  likely_fraud: "error.main",
};

const QUALITY_LABEL_KEYS = {
  organic: "quality.organic",
  suspicious: "quality.suspicious",
  likely_fraud: "quality.likely_fraud",
} as const satisfies Record<LinkQualityTier, string>;

const QUALITY_TOOLTIP_KEYS = {
  organic: "quality.tooltip.organic",
  suspicious: "quality.tooltip.suspicious",
  likely_fraud: "quality.tooltip.likely_fraud",
} as const satisfies Record<LinkQualityTier, string>;

interface LinkQualityBadgeProps {
  /** Agregado de qualidade vindo do batch-meta; ausente/nulo = sem indicador. */
  quality?: LinkQuality | null;
}

/**
 * Selo de qualidade de tráfego do card de link — a assinatura visual do
 * scoring anti-fraude (Fase 3) na lista de links.
 *
 * Três estados, pela cor semântica do projeto (verde = sucesso, laranja =
 * aviso, vermelho = problema real):
 *
 *   - `organic` (≥ 90% orgânico): SÓ o ponto verde, sem rótulo — presença
 *     ambiente e quieta ("este link está saudável"), sem adicionar texto a
 *     todos os cards.
 *   - `suspicious` / `likely_fraud`: ponto + rótulo colorido, como o
 *     `LinkHealthBadge` — é sinal acionável, merece as palavras.
 *   - `tier` nulo/ausente (sem cliques pontuados na janela de 30 dias, ou
 *     backend anterior ao campo): não renderiza nada.
 *
 * O tooltip sempre traz o percentual orgânico e a janela, para o número
 * bruto nunca ficar a mais de um hover de distância.
 */
export function LinkQualityBadge({ quality }: LinkQualityBadgeProps) {
  const { t } = useTranslation("links");

  const tier = quality?.tier ?? null;
  if (tier === null) {
    return null;
  }

  const color = QUALITY_COLORS[tier];
  const pct = quality?.organic_pct ?? 0;
  const showLabel = tier !== "organic";

  return (
    <Tooltip title={t(QUALITY_TOOLTIP_KEYS[tier], { pct })}>
      <Box
        aria-label={t(QUALITY_LABEL_KEYS[tier])}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.375,
          minHeight: 20,
          lineHeight: "20px",
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        {showLabel ? (
          <Typography
            variant="caption"
            component="span"
            sx={{
              color,
              fontWeight: 500,
              fontSize: "0.75rem",
              lineHeight: "20px",
              m: 0,
            }}
          >
            {t(QUALITY_LABEL_KEYS[tier])}
          </Typography>
        ) : null}
      </Box>
    </Tooltip>
  );
}
