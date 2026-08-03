/**
 * Paleta dark-first canônica do Link Charts.
 * Tom: adulto/negócios, alto contraste informacional, zero neon.
 */

// Neutros com leve tom slate (azul dessaturado) — profundidade de dashboard
// premium sem sair do "adulto/negócios"; cinza puro lia frio e chapado.
//
// `bg` foi recalibrado um passo mais profundo (redesign "instrumento técnico",
// 2026-08): era #0B0D12 (HSL ~223°, 24%, 5.7%), escurecido para ~1.7% de
// luminância mantendo matiz/saturação — o canvas fica quase preto e a
// elevação de `surface`/`elevated` passa a vir do hairline (`border.default`),
// não de um cinza mais claro. `border.default` foi recalibrado para um alpha
// mais baixo (0.10 → 0.08) para que a borda continue lendo como hairline de
// baixo contraste mesmo com o fundo mais escuro.
export const darkNeutral = {
  bg: "#030405",
  surface: "#12141B",
  elevated: "#181B23",
  input: "#1D2028",
  border: {
    subtle: "rgba(255, 255, 255, 0.06)",
    default: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
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
