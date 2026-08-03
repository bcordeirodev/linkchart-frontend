import { alpha, darken, keyframes } from "@mui/material/styles";

import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";

/**
 * Escala de arredondamento da feature /links — alias nomeado sobre os
 * `radiusTokens` globais (deixa os call sites auto-descritivos: `panel`,
 * `card`, `control`, `chip`, em vez de números soltos). Antes do redesign
 * "instrumento técnico" divergia de propósito dos tokens globais; agora fica
 * alinhado 1:1 — containers (`panel`/`card`) em `lg`, controles em `md`,
 * elementos pequenos (`chip`) em `sm` — para não voltar a colidir com a
 * escala única de raio da aplicação.
 */
export const linksRadius = {
  panel: radiusTokens.lg,
  card: radiusTokens.lg,
  control: radiusTokens.md,
  chip: radiusTokens.sm,
} as const;

/** Slightly stronger than `theme.palette.divider` for /links cards and panels. */
export function getLinksBorderColor(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  // Softer neutral border to avoid the "heavy card" look in /links.
  return alpha(theme.palette.text.primary, isDark ? 0.12 : 0.1);
}

/**
 * Borda interna do card de link — um passo mais presente que a hairline
 * externa: sobre a superfície elevada (#18181B) a 0.12 quase some, e as
 * divisões internas (rodapé de métricas, barra de ações, thumb) precisam
 * ler como estrutura, não ruído.
 *
 * @param theme - tema MUI ativo.
 * @returns cor de borda interna do card.
 */
export function getLinkCardInnerBorderColor(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return alpha(theme.palette.text.primary, isDark ? 0.18 : 0.14);
}

/**
 * Recipe único de superfície recuada (inset) da feature /links — nível 1 da
 * escala de elevação. Em dark, usa o tom do painel (`background.paper`):
 * dentro de um card elevado isso recua de verdade; sobre o próprio painel o
 * inset vira "border-only" (mesma cor, só a hairline delimita — menos ruído).
 * Em light, um véu neutro. Usado por barra de copiar, url bar e filter inset.
 *
 * @param theme - tema MUI ativo.
 * @returns cor de fundo do inset.
 */
export function getLinksInsetBg(theme: Theme) {
  return theme.palette.mode === "dark"
    ? theme.palette.background.paper
    : alpha(theme.palette.common.black, 0.025);
}

/** Hairline shadow for /links cards — softer than `elevation*.xs`. */
export function getLinksCardShadow(
  theme: Theme,
  state: "rest" | "hover" = "rest",
) {
  const isDark = theme.palette.mode === "dark";
  const ink = theme.palette.common.black;

  if (state === "hover") {
    return isDark
      ? `0 2px 6px ${alpha(ink, 0.22)}, 0 1px 2px ${alpha(ink, 0.14)}`
      : `0 2px 6px ${alpha(ink, 0.06)}, 0 1px 2px ${alpha(ink, 0.04)}`;
  }

  return isDark
    ? `0 1px 3px ${alpha(ink, 0.16)}, 0 1px 2px ${alpha(ink, 0.1)}`
    : `0 1px 4px ${alpha(ink, 0.045)}, 0 1px 2px ${alpha(ink, 0.03)}`;
}

/**
 * Hairline shell for /links panels that are genuinely level-1 surfaces (the
 * sticky bulk-actions bar on desktop, the create/edit form panel) — flat
 * `background.paper` + 1px border, no shadow and no gradient. Part of the
 * "instrumento técnico" surface grammar: exactly one raised level between the
 * page background and a card, signalled by the hairline alone (see
 * `radiusTokens`/`linksRadius`).
 *
 * The browse toolbar and quick-create section used to wrap themselves in
 * this same shell too, but both were flattened to level 0 (bare background,
 * `SectionLabel` instead of a bordered panel) — see `LinksBrowseSection` and
 * `LinksQuickCreate`.
 */
export function getLinksPanelSx(theme: Theme) {
  const borderColor = getLinksBorderColor(theme);

  return {
    backgroundColor: theme.palette.background.paper,
    borderRadius: `${linksRadius.panel}px`,
    border: `1px solid ${borderColor}`,
  };
}

/** Expanding ring pulse after quick-create (visible outside the card). */
export function getNewlyCreatedHighlightSx(theme: Theme) {
  const primary = theme.palette.primary.main;
  const baseShadow = getLinksCardShadow(theme);

  const ringPulse = keyframes`
    0% {
      box-shadow: 0 0 0 0 ${alpha(primary, 0.5)}, ${baseShadow};
    }
    55% {
      box-shadow: 0 0 0 9px ${alpha(primary, 0)}, ${baseShadow};
    }
    100% {
      box-shadow: 0 0 0 0 ${alpha(primary, 0)}, ${baseShadow};
    }
  `;

  return {
    position: "relative" as const,
    overflow: "visible" as const,
    zIndex: 2,
    margin: "3px",
    border: `2px solid ${primary}`,
    animation: `${ringPulse} 1.6s cubic-bezier(0.33, 1, 0.68, 1) 3`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      outline: `2px solid ${primary}`,
      outlineOffset: 2,
    },
  };
}

/** Entrada suave do card: fade + leve subida, uma vez, no mount. */
const cardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

/**
 * Shell dos cards de link (desktop e mobile) — nível 1 da escala de
 * superfícies ("instrumento técnico"): `background.paper` liso, borda
 * hairline única, sem drop shadow, sem véu/gradiente de elevação por cinza.
 * O card fica direto sobre o fundo da página (o painel externo que o envolvia
 * foi achatado para nível 0 — ver `LinksBrowseSection`), então a hairline é o
 * único sinal de que ele é um objeto separado. Hover só reforça a borda, sem
 * mudar o fundo. A animação de entrada suaviza o load da lista; o stagger vem
 * do grid ({@link getLinksBrowseGridSx}).
 */
export function getLinkCardShellSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    animation: `${cardEnter} 280ms ${motionTokens.easing.default} backwards`,
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    borderRadius: `${linksRadius.card}px`,
    // Borda do card um passo acima da hairline dos painéis — o card é o
    // objeto principal da página e pode se afirmar.
    border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.14 : 0.12)}`,
    overflow: "hidden" as const,
    backgroundColor: theme.palette.background.paper,
    transition: `border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      borderColor: alpha(theme.palette.text.primary, isDark ? 0.22 : 0.2),
    },
  };
}

/** Vertical gap between cards in the browse list. */
export const linkCardListItemMb = { xs: 2, sm: 2.25 } as const;

/**
 * Selo "Exemplo" do link de demonstração semeado no cadastro.
 *
 * Neutro de propósito: ele informa a *procedência* do link, não um status, e não
 * pode competir por atenção com os chips de status coloridos. Em dark a fonte é
 * branca, seguindo a mesma regra dos demais chips.
 *
 * @param theme - tema MUI ativo.
 * @returns sx do `Chip` de exemplo.
 */
export function getDemoChipSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  const ink = theme.palette.text.primary;

  return {
    height: 20,
    flexShrink: 0,
    borderRadius: `${linksRadius.chip}px`,
    fontSize: "0.625rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: isDark ? theme.palette.common.white : theme.palette.text.secondary,
    bgcolor: alpha(ink, isDark ? 0.1 : 0.06),
    border: `1px solid ${alpha(ink, isDark ? 0.2 : 0.14)}`,
    "& .MuiChip-label": { px: 0.75 },
  };
}

/**
 * Tag chip — pill de tag, tingido com a cor da própria tag.
 *
 * Dark mode: chip text is always `common.white` over `alpha(color, 0.25)`
 * background — a per-tag color is rarely light enough to read as text on a
 * dark surface, so white is the one rule that always works. Light mode:
 * a darkened shade of the color as text over a light tint of the same color,
 * mirroring `getSoftSelectedChipSx`'s light-mode approach.
 *
 * @param theme - tema MUI ativo.
 * @param color - hex color of the tag (from `TAG_COLOR_PALETTE` or user data).
 * @returns sx do `Chip` de tag.
 */
export function getTagChipSx(theme: Theme, color: string) {
  const isDark = theme.palette.mode === "dark";

  return {
    height: 20,
    flexShrink: 0,
    borderRadius: `${linksRadius.chip}px`,
    fontSize: "0.6875rem",
    fontWeight: 600,
    color: isDark ? theme.palette.common.white : darken(color, 0.35),
    bgcolor: alpha(color, isDark ? 0.25 : 0.12),
    border: `1px solid ${alpha(color, isDark ? 0.4 : 0.32)}`,
    "& .MuiChip-label": { px: 0.75 },
  };
}

/** Defasagem (ms) entre a entrada de um card e a do card seguinte. */
const CARD_ENTER_STAGGER_MS = 45;

/**
 * Escalona a entrada dos cards: cada filho direto ganha um `animation-delay`
 * crescente, de modo que a lista cascateia em vez de aparecer num bloco só. A
 * animação em si mora no shell do card ({@link getLinkCardShellSx}); aqui só
 * se distribui o atraso. Vale para o grid (desktop) e para a lista (mobile).
 *
 * @param count - quantos filhos escalonar (na prática, o PAGE_SIZE da lista).
 * @returns sx com um `animation-delay` por filho.
 */
export function getStaggeredEntranceSx(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, i) => [
      `& > *:nth-of-type(${i + 1})`,
      { animationDelay: `${i * CARD_ENTER_STAGGER_MS}ms` },
    ]),
  );
}

/**
 * Grid do browse list (desktop). Mobile-first: 1 coluna é o estado natural;
 * o auto-fill só abre a 2ª coluna quando o painel comporta dois cards de
 * ≥560px. `alignItems: "start"` evita que um card futuro de altura variável
 * estique o vizinho da mesma linha.
 *
 * @param staggerCount - quantos cards escalonar na entrada (PAGE_SIZE da lista).
 * @returns sx do container do grid.
 */
export function getLinksBrowseGridSx(staggerCount: number) {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(560px, 100%), 1fr))",
    gap: 2,
    alignItems: "start",
    ...getStaggeredEntranceSx(staggerCount),
  } as const;
}

/** Footer metrics — single row with vertical dividers between segments. */
export function getLinkCardMetricsRowSx(theme: Theme) {
  return {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    columnGap: 0,
    rowGap: 0.5,
    pt: 0.625,
    mt: 0.625,
    borderTop: `1px solid ${getLinkCardInnerBorderColor(theme)}`,
    minWidth: 0,
  };
}

/** Shared row height so sparkline, badges and inline metrics align on one axis. */
export const LINK_CARD_METRIC_ROW_HEIGHT = 20;

/** Thin separator between metric segments in the link card footer. */
export function getLinkCardMetricDividerSx(theme: Theme) {
  return {
    width: "1px",
    alignSelf: "stretch",
    minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
    mx: { xs: 1, sm: 1.25 },
    bgcolor: getLinkCardInnerBorderColor(theme),
    flexShrink: 0,
  };
}

/** Wrapper for each segment in the metrics row (centers content vertically). */
export const linkCardMetricSegmentSx = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
  flexShrink: 0,
} as const;

/** Inline label + value on one horizontal line. */
export const linkCardMetricInlineSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.375,
  minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
  minWidth: 0,
  whiteSpace: "nowrap" as const,
} as const;

const metricTextLineHeight = `${LINK_CARD_METRIC_ROW_HEIGHT}px`;

export const linkCardMetricLabelSx = {
  fontSize: "0.6875rem",
  lineHeight: metricTextLineHeight,
  fontWeight: 500,
  color: "text.secondary",
  m: 0,
  p: 0,
} as const;

/** Compact metric value — same scale as other card captions. */
export const linkCardMetricValueSx = {
  fontSize: "0.75rem",
  lineHeight: metricTextLineHeight,
  fontWeight: 600,
  color: "text.primary",
  fontVariantNumeric: "tabular-nums",
  m: 0,
  p: 0,
} as const;

/** Card inner padding. */
export const linkCardContentSx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.25 },
} as const;
