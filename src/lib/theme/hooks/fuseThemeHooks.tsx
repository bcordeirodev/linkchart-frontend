/**
 * 🎣 HOOKS DE TEMA CENTRALIZADOS - LINK CHART
 * Migração dos hooks do Fuse para estrutura centralizada
 */

import { FuseThemeType } from '../types/theme';
import { createTheme, getContrastRatio, Theme } from '@mui/material/styles';
import _ from 'lodash';
import { defaultThemeOptions, extendThemeWithMixins, mustHaveThemeOptions } from '../config/optimizedSettings';
import { ThemeOptions } from '@mui/material/styles/createTheme';
import { darkPaletteText, lightPaletteText } from '../colors';
import { useLayoutSettings } from '@/shared/layout/core';
import { allThemes } from '../themes';

type Direction = 'ltr' | 'rtl';

// ========================================
// 🔧 RESOLUÇÃO DE TEMAS
// ========================================

/**
 * Resolve uma string de tema para o objeto FuseThemeType correspondente
 */
const resolveTheme = (themeKey: string | FuseThemeType): FuseThemeType => {
    if (typeof themeKey === 'object') {
        return themeKey;
    }

    const theme = allThemes[themeKey as keyof typeof allThemes];
    if (!theme) {
        console.warn(`Tema '${themeKey}' não encontrado, usando tema padrão`);
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
const generateMuiTheme = (theme: FuseThemeType, direction: Direction): Theme => {
    const mergedTheme = _.merge({}, defaultThemeOptions, theme, mustHaveThemeOptions) as ThemeOptions;
    const themeOptions = {
        ...mergedTheme,
        mixins: extendThemeWithMixins(mergedTheme),
        direction
    } as ThemeOptions;
    return createTheme(themeOptions);
};

// ========================================
// 🎣 HOOKS DE TEMA
// ========================================

/**
 * Hook para tema principal
 */
export const useMainTheme = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.main);
    return generateMuiTheme(resolvedTheme, current.direction);
};

/**
 * Hook para tema da navbar
 */
export const useNavbarTheme = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.navbar);
    return generateMuiTheme(resolvedTheme, current.direction);
};

/**
 * Hook para tema da toolbar
 */
export const useToolbarTheme = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.toolbar);
    return generateMuiTheme(resolvedTheme, current.direction);
};

/**
 * Hook para tema do footer
 */
export const useFooterTheme = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.footer);
    return generateMuiTheme(resolvedTheme, current.direction);
};

// ========================================
// 🔄 FUNÇÕES DE MUDANÇA DE MODO
// ========================================

/**
 * Função para alterar modo do tema (dark/light)
 */
export const changeThemeMode = (theme: FuseThemeType, mode: 'dark' | 'light'): FuseThemeType => {
    const modes = {
        dark: {
            palette: {
                mode: 'dark',
                divider: 'rgba(241,245,249,.12)',
                background: {
                    paper: '#1E2125',
                    default: '#121212'
                },
                text: darkPaletteText
            }
        },
        light: {
            palette: {
                mode: 'light',
                divider: '#e2e8f0',
                background: {
                    paper: '#FFFFFF',
                    default: '#F7F7F7'
                },
                text: lightPaletteText
            }
        }
    };
    return _.merge({}, theme, modes[mode]);
};

// ========================================
// 🎨 HOOKS DE CONTRASTE
// ========================================

/**
 * Hook para tema de contraste baseado na cor de fundo
 */
export const useContrastMainTheme = (bgColor: string): Theme => {
    const isDark = (color: string): boolean => getContrastRatio(color, '#ffffff') >= 3;
    const darkTheme = useMainThemeDark();
    const lightTheme = useMainThemeLight();

    return isDark(bgColor) ? darkTheme : lightTheme;
};

/**
 * Hook para tema principal escuro
 */
export const useMainThemeDark = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.main);
    return generateMuiTheme(changeThemeMode(resolvedTheme, 'dark'), current.direction);
};

/**
 * Hook para tema principal claro
 */
export const useMainThemeLight = (): Theme => {
    const { data: current } = useLayoutSettings();
    const resolvedTheme = resolveTheme(current.theme.main);
    return generateMuiTheme(changeThemeMode(resolvedTheme, 'light'), current.direction);
};
