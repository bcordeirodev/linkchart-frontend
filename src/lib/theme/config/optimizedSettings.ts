/**
 * Configurações otimizadas de tema
 */

import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import qs from "qs";

import { darkPrimary } from "../colors";

import { optimizedThemeOptions } from "./muiComponents";

import type { FuseSettingsConfigType } from "../types/theme";
import type { ThemeOptions } from "@mui/material/styles/createTheme";

// ========================================
// ⚙️ CONFIGURAÇÕES OTIMIZADAS
// ========================================

/**
 * Configurações padrão otimizadas do Fuse.
 *
 * Não carrega um bloco `theme` — o `theme` efetivo da aplicação vem de
 * `LayoutProvider`'s `defaultLayoutSettings` (`src/shared/layout/core/LayoutProvider.tsx`),
 * que referencia os temas nomeados em `allThemes` ("default"/"defaultDark"),
 * não este objeto. Um bloco `theme` local (com canvas light `#f6f7f9`, hoje
 * desalinhado do canvas real `#EAEDF2`) existiu aqui mas nunca era
 * consumido — nada importava `optimizedSettings`/`defaultSettings` além dos
 * próprios barrels de re-export — e foi removido em 2026-08-08.
 */
export const optimizedSettings = {
  customScrollbars: true,
  direction: "ltr" as const,
  layout: {},
};

/**
 * Função otimizada para obter configurações do query string
 */
export function getParsedQuerySettings():
  | FuseSettingsConfigType
  | object
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const parsedQueryString = qs.parse(window?.location?.search, {
    ignoreQueryPrefix: true,
  });
  const { defaultSettings = {} } = parsedQueryString;

  if (typeof defaultSettings === "string") {
    return JSON.parse(defaultSettings) as FuseSettingsConfigType;
  }

  return {};
}

// ========================================
// 🎨 TEMAS PADRÃO OTIMIZADOS
// ========================================

/**
 * Temas padrão otimizados da aplicação
 */
export const optimizedDefaultThemes = {
  default: {
    palette: {
      mode: "light",
      primary: darkPrimary,
      secondary: {
        light: "#E8E9EA",
        main: "#9E9E9E",
        dark: "#616161",
      },
      error: red,
    },
    status: {
      danger: "orange",
    },
  },
  defaultDark: {
    palette: {
      mode: "dark",
      primary: darkPrimary,
      secondary: {
        light: "#E8E9EA",
        main: "#9E9E9E",
        dark: "#616161",
      },
      error: red,
    },
    status: {
      danger: "orange",
    },
  },
};

/**
 * Função otimizada para estender tema com mixins
 */
export function extendThemeWithMixins(obj: ThemeOptions) {
  const theme = createTheme(obj);
  return {
    border: (width = 1) => ({
      borderWidth: width,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
    }),
    borderLeft: (width = 1) => ({
      borderLeftWidth: width,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
    }),
    borderRight: (width = 1) => ({
      borderRightWidth: width,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
    }),
    borderTop: (width = 1) => ({
      borderTopWidth: width,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
    }),
    borderBottom: (width = 1) => ({
      borderBottomWidth: width,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
    }),
  };
}

// ========================================
// 📤 EXPORTS PARA COMPATIBILIDADE
// ========================================

// Mantém compatibilidade com código existente
export const defaultSettings = optimizedSettings;
export const defaultThemeOptions = optimizedThemeOptions;
export { optimizedThemeOptions };
export const mustHaveThemeOptions = {
  typography: {
    fontSize: 13,
    body1: { fontSize: "0.8125rem" },
    body2: { fontSize: "0.8125rem" },
  },
};
export const defaultThemes = optimizedDefaultThemes;
