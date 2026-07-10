import { alpha, darken, keyframes } from "@mui/material/styles";

import { motionTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";

/**
 * Escala de arredondamento da feature /links — deliberadamente mais achatada
 * que os `radiusTokens` globais (o usuário apontou "radius em excesso"):
 * painéis e cards em 8px, controles/insets em 6px, chips em 6px (sem pílula).
 */
export const linksRadius = {
  panel: 8,
  card: 6,
  control: 6,
  chip: 6,
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

/** Crisp 1px top-edge highlight — premium "glass edge" for /links surfaces. */
export function getLinksTopHighlight(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return `inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.05 : 0.6)}`;
}

/** Faint top-light gradient giving panels subtle neutral depth (no color tint). */
export function getLinksTopLightGradient(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return `linear-gradient(180deg, ${alpha(
    theme.palette.common.white,
    isDark ? 0.035 : 0.4,
  )} 0%, ${alpha(theme.palette.common.white, 0)} 22%)`;
}

/** Shell styles aligned with `MetricCardOptimized` (border, radius, shadow). */
export function getLinksPanelSx(theme: Theme) {
  const borderColor = getLinksBorderColor(theme);

  return {
    backgroundColor: theme.palette.background.paper,
    backgroundImage: getLinksTopLightGradient(theme),
    borderRadius: `${linksRadius.panel}px`,
    border: `1px solid ${borderColor}`,
    boxShadow: `${getLinksTopHighlight(theme)}, ${getLinksCardShadow(theme)}`,
  };
}

/**
 * Quick-create panel — same neutral shell as the browse panel, slightly
 * lifted shadow. The blue "Encurtar" CTA and the ⚡ icon already mark the
 * action zone; a tinted panel on top of them read as too much.
 */
export function getLinksQuickCreatePanelSx(theme: Theme) {
  return {
    ...getLinksPanelSx(theme),
    boxShadow: `${getLinksTopHighlight(theme)}, ${getLinksCardShadow(theme, "hover")}`,
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
 * Shell dos cards de link (desktop e mobile) — nível 2 da escala de elevação.
 * Em dark mode a elevação é luminância (card mais claro que painel e página),
 * não sombra: um véu translúcido `alpha(white, 0.035)` sobre o painel, hover
 * um passo mais claro (`0.055`), borda hairline única e sem drop shadow nem
 * gradiente. A animação de entrada suaviza o load da lista; o stagger vem do
 * grid ({@link getLinksBrowseGridSx}).
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
    // Véu translúcido (não cor sólida) e sem gradiente: o card eleva pela
    // luminância do véu sobre o painel, com superfície limpa e uniforme.
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, 0.035)
      : alpha(theme.palette.common.black, 0.02),
    boxShadow: getLinksTopHighlight(theme),
    transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      backgroundColor: isDark
        ? alpha(theme.palette.common.white, 0.055)
        : alpha(theme.palette.common.black, 0.035),
      borderColor: alpha(theme.palette.text.primary, isDark ? 0.18 : 0.14),
    },
  };
}

/** Vertical gap between cards in the browse list. */
export const linkCardListItemMb = { xs: 2, sm: 2.25 } as const;

/**
 * Chip de cliques do card — pill azul que resume a métrica principal e serve
 * de porta de entrada colorida para o analytics (padrão Dub/Bitly).
 *
 * @param theme - tema MUI ativo.
 * @returns sx do `Chip` de cliques.
 */
export function getLinkClickChipSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return {
    height: 22,
    flexShrink: 0,
    borderRadius: `${linksRadius.chip}px`,
    fontSize: "0.6875rem",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    // Fonte branca (não primary.light) — chips coloridos precisam de texto
    // branco em dark para leitura; regra vale p/ futuros chips de tag.
    color: isDark ? theme.palette.common.white : theme.palette.primary.dark,
    bgcolor: alpha(primary, isDark ? 0.2 : 0.1),
    border: `1px solid ${alpha(primary, 0.28)}`,
    "& .MuiChip-icon": { color: "inherit", ml: 0.625 },
    "& .MuiChip-label": { px: 0.75 },
    "&:hover": {
      bgcolor: alpha(primary, isDark ? 0.24 : 0.16),
    },
  };
}

/**
 * Tag chip — same pill shape as {@link getLinkClickChipSx}, tinted with the
 * tag's own color instead of `primary`.
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

/** Row density for the desktop browse list. */
export type LinkCardDensity = "comfortable" | "compact";

/**
 * Grid do browse list (desktop). Mobile-first: 1 coluna é o estado natural;
 * o auto-fill só abre a 2ª coluna quando o painel comporta dois cards de
 * ≥560px. `alignItems: "start"` evita que um card futuro de altura variável
 * estique o vizinho da mesma linha.
 *
 * @param density - densidade ativa da lista.
 * @returns sx do container do grid.
 */
export function getLinksBrowseGridSx(density: LinkCardDensity) {
  return {
    display: "grid",
    gridTemplateColumns:
      density === "comfortable"
        ? "repeat(auto-fill, minmax(min(560px, 100%), 1fr))"
        : "1fr",
    gap: density === "comfortable" ? 2 : 1.25,
    alignItems: "start",
    // Stagger da animação de entrada dos cards (definida no shell) — só os 8
    // primeiros (PAGE_SIZE) precisam de delay próprio.
    ...Object.fromEntries(
      Array.from({ length: 8 }, (_, i) => [
        `& > *:nth-of-type(${i + 1})`,
        { animationDelay: `${i * 45}ms` },
      ]),
    ),
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

/** Card inner padding, tightened in `compact` density. */
const linkCardContentCompactSx = {
  px: { xs: 1.25, sm: 1.5 },
  py: { xs: 0.5, sm: 0.625 },
} as const;

/**
 * Inner padding for a desktop link card, tightened in `compact` density.
 *
 * @param density - the active list density.
 * @returns the responsive padding `sx` for {@link linkCardContentSx}.
 */
export function getLinkCardContentSx(density: LinkCardDensity) {
  return density === "compact" ? linkCardContentCompactSx : linkCardContentSx;
}

/** Subtle inset for filter toolbar inside a links panel. */
export function getLinksFilterInsetSx(theme: Theme) {
  return {
    borderRadius: `${linksRadius.control}px`,
    border: `1px solid ${getLinksBorderColor(theme)}`,
    backgroundColor: getLinksInsetBg(theme),
    overflow: "hidden" as const,
  };
}
