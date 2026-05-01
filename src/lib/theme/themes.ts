/**
 * Temas canônicos do Link Charts — dark (primário) e light (secundário).
 */

import {
  darkPalette,
  lightPalette,
  semanticDark,
  semanticLight,
} from "./colors";

import type { FuseThemesType } from "./types/theme";

// ========================================
// 🌙 TEMA DARK (CANÔNICO)
// ========================================

export const defaultDarkTheme = {
  palette: {
    ...darkPalette,
    success: {
      light: semanticDark.success.light,
      main: semanticDark.success.main,
      dark: semanticDark.success.dark,
      contrastText: semanticDark.success.contrastText,
    },
    warning: {
      light: semanticDark.warning.light,
      main: semanticDark.warning.main,
      dark: semanticDark.warning.dark,
      contrastText: semanticDark.warning.contrastText,
    },
    error: {
      light: semanticDark.error.light,
      main: semanticDark.error.main,
      dark: semanticDark.error.dark,
      contrastText: semanticDark.error.contrastText,
    },
    info: {
      light: semanticDark.info.light,
      main: semanticDark.info.main,
      dark: semanticDark.info.dark,
      contrastText: semanticDark.info.contrastText,
    },
    secondary: {
      light: darkPalette.neutral.border.strong,
      main: darkPalette.neutral.text.secondary,
      dark: darkPalette.neutral.text.tertiary,
      contrastText: darkPalette.neutral.text.primary,
    },
  },
};

// ========================================
// 🌞 TEMA LIGHT (SECUNDÁRIO)
// ========================================

export const defaultLightTheme = {
  palette: {
    ...lightPalette,
    success: {
      light: semanticLight.success.light,
      main: semanticLight.success.main,
      dark: semanticLight.success.dark,
      contrastText: semanticLight.success.contrastText,
    },
    warning: {
      light: semanticLight.warning.light,
      main: semanticLight.warning.main,
      dark: semanticLight.warning.dark,
      contrastText: semanticLight.warning.contrastText,
    },
    error: {
      light: semanticLight.error.light,
      main: semanticLight.error.main,
      dark: semanticLight.error.dark,
      contrastText: semanticLight.error.contrastText,
    },
    info: {
      light: semanticLight.info.light,
      main: semanticLight.info.main,
      dark: semanticLight.info.dark,
      contrastText: semanticLight.info.contrastText,
    },
    secondary: {
      light: lightPalette.neutral.border.strong,
      main: lightPalette.neutral.text.secondary,
      dark: lightPalette.neutral.text.tertiary,
      contrastText: lightPalette.neutral.text.primary,
    },
  },
};

// ========================================
// 📤 EXPORTS
// ========================================

export const allThemes: FuseThemesType = {
  default: defaultLightTheme,
  defaultDark: defaultDarkTheme,
};

export const themesConfig = allThemes;

export default allThemes;
