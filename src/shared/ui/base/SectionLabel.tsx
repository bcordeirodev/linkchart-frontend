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
  /**
   * Controle opcional renderizado no fim da linha, depois da hairline (ex.:
   * "Opções avançadas", "Selecionar vários") — o equivalente ao `action` de
   * `PageSectionHeading` para seções que migraram para `SectionLabel`.
   * Omitido (default): a hairline preenche a linha inteira até a borda.
   */
  action?: ReactNode;
}

/**
 * Micro-label de seção da linguagem "instrumento técnico": caps em
 * JetBrains Mono 13px (`0.8125rem` — bump do gate visual de 2026-08-03: o
 * tamanho original de 11px lia pequeno demais nas 6 abas de analytics;
 * 13px alinha com a escala de `body2` no resto do app sem deixar de ler
 * como label, já que caps + mono + `letterSpacing` continuam distinguindo
 * do corpo de texto) com prefixo "/" opcional, seguido de uma hairline
 * horizontal que preenche o restante da linha. É o padrão de nível 0
 * (sem caixa) para ancorar seções de página/painel — ex.: `/ VISÃO GERAL`.
 * Primitiva compartilhada: a mudança de tamanho é global (/links e
 * analytics), de propósito.
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
 * @param props.action Controle opcional no fim da linha, depois da hairline.
 * @returns Linha com o label caps mono seguido de uma hairline horizontal (e, se houver, a `action`).
 */
export function SectionLabel({
  children,
  slash = true,
  headingLevel,
  action,
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
          fontSize: "0.8125rem",
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
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Box>
  );
}

export default SectionLabel;
