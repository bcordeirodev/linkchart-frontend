/**
 * Cores semânticas (success, warning, error, info) para ambos os modos.
 * Tons adultos dessaturados — zero neon.
 */

export interface SemanticShade {
  main: string;
  light: string;
  dark: string;
  subtleBg: string;
  border: string;
  contrastText: string;
}

export interface SemanticPalette {
  success: SemanticShade;
  warning: SemanticShade;
  error: SemanticShade;
  info: SemanticShade;
}

/**
 * Para dark mode — cores vibram contra superfícies escuras.
 */
export const semanticDark: SemanticPalette = {
  success: {
    main: "#34D399",
    light: "#6EE7B7",
    dark: "#059669",
    subtleBg: "rgba(52, 211, 153, 0.10)",
    border: "rgba(52, 211, 153, 0.32)",
    contrastText: "#031810",
  },
  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#B45309",
    subtleBg: "rgba(245, 158, 11, 0.10)",
    border: "rgba(245, 158, 11, 0.32)",
    contrastText: "#1A1203",
  },
  error: {
    main: "#F87171",
    light: "#FCA5A5",
    dark: "#DC2626",
    subtleBg: "rgba(248, 113, 113, 0.10)",
    border: "rgba(248, 113, 113, 0.32)",
    contrastText: "#1A0404",
  },
  info: {
    main: "#60A5FA",
    light: "#93C5FD",
    dark: "#2563EB",
    subtleBg: "rgba(96, 165, 250, 0.10)",
    border: "rgba(96, 165, 250, 0.32)",
    contrastText: "#04101F",
  },
};

/**
 * Para light mode — ajustado para contraste.
 */
export const semanticLight: SemanticPalette = {
  success: {
    main: "#059669",
    light: "#34D399",
    dark: "#047857",
    subtleBg: "rgba(5, 150, 105, 0.08)",
    border: "rgba(5, 150, 105, 0.24)",
    contrastText: "#FFFFFF",
  },
  warning: {
    // Recalibrado em 2026-08-08: o antigo main (#D97706) caiu para ~2.7:1
    // contra o canvas light #EAEDF2 — abaixo do mínimo 3:1 para componente
    // não-textual. #C2410C mede 4.41:1 no mesmo canvas. O antigo main vira
    // o degrau `light`.
    main: "#C2410C",
    light: "#D97706",
    dark: "#B45309",
    subtleBg: "rgba(194, 65, 12, 0.08)",
    border: "rgba(194, 65, 12, 0.24)",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DC2626",
    light: "#EF4444",
    dark: "#B91C1C",
    subtleBg: "rgba(220, 38, 38, 0.08)",
    border: "rgba(220, 38, 38, 0.24)",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#2563EB",
    light: "#3B82F6",
    dark: "#1D4ED8",
    subtleBg: "rgba(37, 99, 235, 0.08)",
    border: "rgba(37, 99, 235, 0.24)",
    contrastText: "#FFFFFF",
  },
};
