/**
 * 🎣 HOOKS DE TEMA CENTRALIZADOS - LINK CHART
 * Hooks essenciais de tema simplificados
 */

import { createTheme } from "@mui/material/styles";
import _ from "lodash";

import { useLayoutSettings } from "@/shared/layout/core";

import {
  defaultThemeOptions,
  extendThemeWithMixins,
  mustHaveThemeOptions,
} from "../config/optimizedSettings";
import { allThemes } from "../themes";

import type { FuseThemeType } from "../types/theme";
import type { Theme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles/createTheme";

type Direction = "ltr" | "rtl";

// ========================================
// 🔧 RESOLUÇÃO DE TEMAS
// ========================================

/**
 * Resolve uma string de tema para o objeto FuseThemeType correspondente
 */
const resolveTheme = (themeKey: string | FuseThemeType): FuseThemeType => {
  if (typeof themeKey === "object") {
    return themeKey;
  }

  const theme = allThemes[themeKey];

  if (!theme) {
    // Tema não encontrado, usando tema padrão
    return allThemes.default;
  }

  return theme;
};

// ========================================
// 🎨 GERAÇÃO DE TEMA MUI
// ========================================

/**
 * Função para gerar tema MUI a partir do tema Fuse
 */
const generateMuiTheme = (
  theme: FuseThemeType,
  direction: Direction,
): Theme => {
  const mergedTheme = _.merge(
    {},
    defaultThemeOptions,
    theme,
    mustHaveThemeOptions,
  ) as ThemeOptions;
  const themeOptions = {
    ...mergedTheme,
    mixins: extendThemeWithMixins(mergedTheme),
    direction,
  } as ThemeOptions;
  return createTheme(themeOptions);
};

// ========================================
// 🎣 HOOKS DE TEMA ESSENCIAIS
// ========================================

/**
 * Hook para tema principal - ÚNICO HOOK USADO NA APLICAÇÃO
 */
export const useMainTheme = (): Theme => {
  const { data: current } = useLayoutSettings();
  const resolvedTheme = resolveTheme(current.theme.main);
  return generateMuiTheme(resolvedTheme, current.direction);
};
