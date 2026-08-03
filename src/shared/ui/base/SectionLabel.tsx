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
  /**
   * Nível semântico de heading a expor via ARIA (`role="heading"` +
   * `aria-level`), sem trocar a tag visual (`component="span"` continua
   * fixo — zero mudança de estilo). Passe isto **sempre** que `SectionLabel`
   * substituir um heading real (`<h2>`/`<h3>`) que existia antes — do
   * contrário a seção some da navegação por heading-list do leitor de tela.
   * Omitido (default): nenhum papel de heading é exposto — use apenas para
   * labels que nunca foram heading (ex.: rótulo inline de um grupo de chips).
   */
  headingLevel?: 2 | 3;
}

/**
 * Micro-label de seção da linguagem "instrumento técnico": caps em
 * JetBrains Mono 11px com prefixo "/" opcional, seguido de uma hairline
 * horizontal que preenche o restante da linha. É o padrão de nível 0
 * (sem caixa) para ancorar seções de página/painel — ex.: `/ VISÃO GERAL`.
 *
 * Puramente apresentacional: não busca dados nem contém lógica de negócio;
 * o texto chega já traduzido via `children`. Visualmente é sempre um
 * `<span>` (nunca um `<h2>`/`<h3>` de verdade, para não herdar estilo de
 * heading do tema) — quando o chamador precisa que a seção continue
 * navegável pela heading-list de um leitor de tela, `headingLevel` expõe o
 * papel via ARIA (`role="heading"` + `aria-level`) sem alterar a marcação
 * visual.
 *
 * @param props.children Texto do label, já traduzido pelo chamador.
 * @param props.slash Se o prefixo "/" é renderizado antes do label. Default `true`.
 * @param props.headingLevel Nível de heading (2 ou 3) a expor via ARIA. Omitido por padrão.
 * @returns Linha com o label caps mono seguido de uma hairline horizontal.
 */
export function SectionLabel({
  children,
  slash = true,
  headingLevel,
}: SectionLabelProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        component="span"
        role={headingLevel ? "heading" : undefined}
        aria-level={headingLevel}
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
