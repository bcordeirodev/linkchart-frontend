"use client";

import { Box, Typography, useTheme } from "@mui/material";

import type { ReactNode } from "react";

export interface SectionLabelProps {
  /** Texto do micro-label (o chamador já traduziu via i18n). */
  children: ReactNode;
  /**
   * Quando `true` (default), prefixa o label com "/" em `primary.main`,
   * ecoando a identidade monospace do slug do produto.
   */
  slash?: boolean;
}

/**
 * Micro-label de seção da linguagem "instrumento técnico": caps em
 * JetBrains Mono 11px com prefixo "/" opcional, seguido de uma hairline
 * horizontal que preenche o restante da linha. É o padrão de nível 0
 * (sem caixa) para ancorar seções de página/painel — ex.: `/ VISÃO GERAL`.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * o texto chega já traduzido via `children`.
 *
 * @param props.children Texto do label, já traduzido pelo chamador.
 * @param props.slash Se o prefixo "/" é renderizado antes do label. Default `true`.
 * @returns Linha com o label caps mono seguido de uma hairline horizontal.
 */
export function SectionLabel({ children, slash = true }: SectionLabelProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        component="span"
        sx={{
          fontFamily:
            "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.secondary",
          whiteSpace: "nowrap",
        }}
      >
        {slash ? (
          <Box component="span" sx={{ color: "primary.main" }}>
            {"/ "}
          </Box>
        ) : null}
        {children}
      </Typography>
      <Box
        aria-hidden
        sx={{
          flex: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      />
    </Box>
  );
}

export default SectionLabel;
