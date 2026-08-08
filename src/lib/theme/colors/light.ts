/**
 * Paleta light "instrumento técnico" (modo secundário).
 *
 * Espelho da filosofia do dark recalibrado (2026-08): elevação por hairline,
 * não por sombra/cinza. Canvas cinza-papel com o mesmo matiz slate (~220°),
 * cards em branco puro separados pela mesma hairline — no dark o card
 * "acende" contra o canvas quase-preto; aqui é o inverso. Primary desce para
 * o degrau 700 da escala dark (#2C5AA0, ~6.3:1 sobre branco — AA em texto
 * normal); #4E82E6 (main do dark) vira o degrau `light`.
 */

export const lightNeutral = {
  bg: "#F6F7F9",
  surface: "#FFFFFF",
  elevated: "#FFFFFF",
  input: "#EEF0F4",
  border: {
    subtle: "rgba(16, 24, 40, 0.06)",
    default: "rgba(16, 24, 40, 0.10)",
    strong: "rgba(16, 24, 40, 0.18)",
  },
  text: {
    primary: "rgba(9, 14, 22, 0.92)",
    secondary: "rgba(9, 14, 22, 0.66)",
    tertiary: "rgba(9, 14, 22, 0.50)",
    disabled: "rgba(9, 14, 22, 0.34)",
  },
} as const;

export const lightPrimary = {
  50: "#EFF4FA",
  100: "#D6E3F1",
  200: "#AEC7E3",
  300: "#7DA3CF",
  400: "#4E82E6",
  500: "#2C5AA0", // main em light (mais escuro para contraste AA)
  600: "#234977",
  700: "#1C3A61",
  800: "#152C4A",
  900: "#0E1E33",
  main: "#2C5AA0",
  light: "#4E82E6",
  dark: "#1C3A61",
  contrastText: "#FFFFFF",
} as const;

export const lightPalette = {
  mode: "light" as const,
  neutral: lightNeutral,
  primary: lightPrimary,
  background: {
    default: lightNeutral.bg,
    paper: lightNeutral.surface,
  },
  text: {
    primary: lightNeutral.text.primary,
    secondary: lightNeutral.text.secondary,
    disabled: lightNeutral.text.disabled,
  },
  divider: lightNeutral.border.default,
} as const;

export default lightPalette;
