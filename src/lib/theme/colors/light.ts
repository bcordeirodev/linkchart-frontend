/**
 * Paleta light derivada (modo secundário).
 * Invertida em neutros, primary ajustado para contrastar contra bg claro.
 */

export const lightNeutral = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  elevated: "#FFFFFF",
  input: "#F4F4F5",
  border: {
    subtle: "rgba(0, 0, 0, 0.06)",
    default: "rgba(0, 0, 0, 0.10)",
    strong: "rgba(0, 0, 0, 0.16)",
  },
  text: {
    primary: "rgba(0, 0, 0, 0.92)",
    secondary: "rgba(0, 0, 0, 0.64)",
    tertiary: "rgba(0, 0, 0, 0.48)",
    disabled: "rgba(0, 0, 0, 0.32)",
  },
} as const;

export const lightPrimary = {
  50: "#EFF4FA",
  100: "#D6E3F1",
  200: "#AEC7E3",
  300: "#7DA3CF",
  400: "#4E82E6",
  500: "#2C5AA0", // main em light (mais escuro para contraste)
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
