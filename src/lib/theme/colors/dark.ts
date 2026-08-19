/**
 * Paleta dark-first canônica do Link Charts.
 * Tom: adulto/negócios, alto contraste informacional, zero neon.
 */

// Neutros com leve tom slate (azul dessaturado) — profundidade de dashboard
// premium sem sair do "adulto/negócios"; cinza puro lia frio e chapado.
//
// Histórico do `bg`: o redesign "instrumento técnico" (2026-08-05) escureceu
// o canvas de #0B0D12 para #030405 (~1.7% de luminância). Em 2026-08-08, na
// entrega do tema claro, o Bruno pediu a volta ("preto muito forte"): o
// canvas retorna ao slate profundo #0B0D12 (HSL ~223°, 24%, 5.7%), que já
// tinha rodado meses em produção. `border.default` volta junto para 0.10 —
// os dois foram recalibrados em par (o alpha 0.08 existia para o hairline
// não gritar contra o fundo quase-preto) e devem continuar andando juntos.
//
// 2026-08-17: bordas sobem mais um degrau (subtle 0.06→0.08, default
// 0.10→0.14, strong 0.16→0.20) a pedido do Bruno ("bordas mais concisas,
// caixas mais visíveis" no dark). Sobe em par com
// `surfaceOverlayTokens.card.dark` (0.07→0.09 em `designSystem.ts`) — o
// degrau de superfície e o hairline continuam sendo calibrados juntos.
export const darkNeutral = {
  bg: "#0B0D12",
  surface: "#12141B",
  elevated: "#181B23",
  input: "#1D2028",
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    default: "rgba(255, 255, 255, 0.14)",
    strong: "rgba(255, 255, 255, 0.20)",
  },
  text: {
    primary: "rgba(255, 255, 255, 0.95)",
    secondary: "rgba(255, 255, 255, 0.68)",
    tertiary: "rgba(255, 255, 255, 0.52)",
    disabled: "rgba(255, 255, 255, 0.32)",
  },
} as const;

/**
 * Azul dessaturado business — shines against dark bg.
 */
export const darkPrimary = {
  50: "#EFF4FA",
  100: "#D6E3F1",
  200: "#AEC7E3",
  300: "#7DA3CF",
  400: "#5B8DEF", // main hover
  500: "#4E82E6", // main
  600: "#3C6CCC",
  700: "#2C5AA0",
  800: "#1F3F74",
  900: "#152C4A",
  main: "#4E82E6",
  light: "#7DA3CF",
  dark: "#2C5AA0",
  contrastText: "#FFFFFF",
} as const;

export const darkPalette = {
  mode: "dark" as const,
  neutral: darkNeutral,
  primary: darkPrimary,
  background: {
    default: darkNeutral.bg,
    paper: darkNeutral.surface,
  },
  text: {
    primary: darkNeutral.text.primary,
    secondary: darkNeutral.text.secondary,
    disabled: darkNeutral.text.disabled,
  },
  divider: darkNeutral.border.default,
} as const;

export default darkPalette;
