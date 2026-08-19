import { alpha, darken, keyframes } from "@mui/material/styles";

import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import {
  motionTokens,
  radiusTokens,
  surfaceOverlayTokens,
} from "@/lib/theme/designSystem";

import { sanitizeTagColor } from "../../utils/tagColors";

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

/**
 * Hairline neutra dos painéis e superfícies de /links.
 *
 * É literalmente `theme.palette.divider` (= `*Neutral.border.default`): antes
 * derivava um alpha próprio de `text.primary` (0.12 dark / 0.10 light) para
 * ficar "um pouco mais forte que o divider" — e o polish de 2026-08-17, que
 * subiu os tokens globais de borda (dark 0.10→0.14, light 0.10→0.13), inverteu
 * a relação: /links passou a desenhar a hairline MAIS FRACA que o resto da app
 * e ficou de fora do bump. Apontar para o token elimina a divergência e faz a
 * feature herdar qualquer recalibração futura.
 *
 * @param theme - tema MUI ativo.
 * @returns cor da hairline de painéis/superfícies de /links.
 */
export function getLinksBorderColor(theme: Theme) {
  return theme.palette.divider;
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
  // Um degrau acima do hairline externo (divider) nos DOIS temas. Com o bump
  // global de 2026-08-17 o divider light subiu para 0.13 e o antigo 0.14
  // daqui colapsou nele — 0.18 restaura o degrau sem saltar até
  // `border.strong` (0.22), que é o tom de hover do shell.
  return alpha(theme.palette.text.primary, 0.18);
}

/**
 * Superfície recuada (inset) dentro de um card ou controle de link. Dois
 * consumidores: o fundo do controle de copiar no card mobile
 * (`LinkCardActionBar`, `touchTargets`) e o addon de domínio do
 * input group de link curto (`QuickCreateLinkStrip`) — nos dois casos é o
 * segmento que *não* se digita, um degrau acima do preenchimento ao redor
 * (`getLinksControlFillBg` no input group, `getLinkCardShellSx` no card).
 * Precisa ler como um recuo *dentro* do card, não como um
 * retângulo mais claro colado por cima dele — por isso segue a mesma
 * gramática translúcida de `getLinkCardShellSx`/`MuiCard`, só um passo mais
 * forte (o recuo tem que se destacar do próprio card): `alpha(white, 0.05)`
 * em dark — empilha SOBRE o véu do card (`surfaceOverlayTokens.card.dark`),
 * não o substitui — e `alpha(black, 0.035)` em light, sobre o
 * `background.paper` sólido do card. Valor próprio, não derivado do token
 * compartilhado (é "um passo acima" dele, não o mesmo véu).
 *
 * Antes retornava `background.paper` sólido (dark) / um véu quase-preto
 * (light); com o card shell agora translúcido, o preenchimento sólido
 * passou a ler mais CLARO que o card ao redor — um recuo deveria ler mais
 * escuro/recolhido, não mais claro.
 *
 * @param theme - tema MUI ativo.
 * @returns cor de fundo do inset.
 */
export function getLinksInsetBg(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return isDark
    ? alpha(theme.palette.common.white, 0.05)
    : alpha(theme.palette.common.black, 0.035);
}

/**
 * Preenchimento translúcido para as superfícies de controle do quick-create
 * (URL input, composto de link curto) — véu sutil em vez do preenchimento
 * sólido/opaco (`darkNeutral.input`) que antes competia com o resto da
 * grade de superfícies do redesign. Deliberadamente um valor mais baixo que
 * `surfaceOverlayTokens.card` (o véu do card que agora envolve o cluster de
 * quick-create, ver `LinksQuickCreate`): os dois véus brancos/pretos
 * empilham (input sobre card), então o input ainda lê mais claro/presente
 * que o card ao redor mesmo com um alpha nominal menor — não precisa (nem
 * deve) igualar o token do card.
 *
 * @param theme - tema MUI ativo.
 * @returns cor de fundo translúcida.
 */
export function getLinksControlFillBg(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return isDark
    ? alpha(theme.palette.common.white, 0.03)
    : alpha(theme.palette.common.black, 0.02);
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
 * superfícies ("instrumento técnico"): preenchimento + borda hairline única,
 * sem drop shadow. Em dark é um véu branco translúcido, não a cor sólida de
 * `background.paper`: sobre o fundo escuro da página um preenchimento cinza
 * opaco lia "pesado", e o véu clareia na direção certa — sutil o bastante
 * para a hairline continuar sendo o sinal primário de que o card é um objeto
 * separado (não elevação por cinza: o véu não simula sombra/profundidade, só
 * calibra o peso visual do preenchimento). Em light o véu equivalente seria
 * PRETO e escureceria o card abaixo do canvas, então lá o preenchimento é
 * `background.paper` sólido — exatamente a mesma assimetria do `MuiCard`
 * global. O card fica direto sobre o fundo da página (o painel
 * externo que o envolvia foi achatado para nível 0 — ver
 * `LinksBrowseSection`). Hover só reforça a borda, sem mudar o fundo. A
 * animação de entrada suaviza o load da lista; o stagger vem do grid
 * ({@link getLinksBrowseGridSx}).
 */
export function getLinkCardShellSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    animation: `${cardEnter} 280ms ${motionTokens.easing.default} backwards`,
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    borderRadius: `${linksRadius.card}px`,
    // Hairline via token (`divider`), não um alpha próprio: os literais
    // 0.14/0.12 que moravam aqui empataram com — e, no light, ficaram abaixo
    // de — os tokens depois do bump global de 2026-08-17, deixando o card fora
    // de qualquer recalibração futura. Hover sobe para o degrau `strong` da
    // mesma escala, que é o "um passo acima" pretendido.
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden" as const,
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, surfaceOverlayTokens.card.dark)
      : // Light: `background.paper` sólido, NUNCA o véu preto translúcido —
        // sobre o canvas claro (#EAEDF2) o véu ESCURECE o card, invertendo a
        // elevação (o card nasce mais escuro que a página). É a mesma correção
        // que `MuiCard` e `getCardSurfaceSx` receberam em 2026-08-09 (F5/C3) e
        // que este shell — que não passa por nenhum dos dois — nunca tinha
        // recebido; com o bump de `surfaceOverlayTokens.card.light`
        // (0.03→0.045) a inversão ficaria ainda mais visível.
        theme.palette.background.paper,
    transition: `border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      borderColor: isDark
        ? darkNeutral.border.strong
        : lightNeutral.border.strong,
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
  const safe = sanitizeTagColor(color, theme.palette.primary.main);

  return {
    height: 20,
    flexShrink: 0,
    borderRadius: `${linksRadius.chip}px`,
    fontSize: "0.6875rem",
    fontWeight: 600,
    color: isDark ? theme.palette.common.white : darken(safe, 0.35),
    bgcolor: alpha(safe, isDark ? 0.25 : 0.12),
    border: `1px solid ${alpha(safe, isDark ? 0.4 : 0.32)}`,
    "& .MuiChip-label": { px: 0.75 },
  };
}

/** Diâmetro (px) do ponto de cor que identifica uma tag fora dos chips. */
const TAG_DOT_SIZE = 8;

/**
 * Tag dot — ponto de cor de {@link TAG_DOT_SIZE}px usado onde um chip tingido
 * seria ruído: os itens do select de tags e as opções do autocomplete do
 * formulário. Carrega a mesma informação do chip (qual tag é qual) com uma
 * fração da tinta, preservando a identidade "instrumento técnico".
 *
 * O anel de 1px em `divider` é o que garante contraste nos dois temas: sem
 * ele uma tag clara desaparece sobre o menu do tema claro e uma tag escura
 * some no tema escuro. Como `divider` é neutro, o anel nunca compete com a
 * cor da tag — só a delimita.
 *
 * @param theme - tema MUI ativo.
 * @param color - hex color of the tag (saneado contra valores inválidos).
 * @returns sx do `Box` do ponto.
 */
export function getTagDotSx(theme: Theme, color: string) {
  return {
    width: TAG_DOT_SIZE,
    height: TAG_DOT_SIZE,
    borderRadius: "50%",
    flexShrink: 0,
    bgcolor: sanitizeTagColor(color, theme.palette.primary.main),
    border: `1px solid ${theme.palette.divider}`,
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
