/**
 * Utilitários para temas do Link Charts
 * Centraliza funções auxiliares para manipulação de temas
 */

import { FuseThemeType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * Cores padrão para diferentes tipos de tema
 */
export const themeColors = {
    light: {
        primary: '#1976d2',
        secondary: '#dc004e',
        background: '#f5f5f5',
        paper: '#ffffff',
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)'
        }
    },
    dark: {
        primary: '#90caf9',
        secondary: '#f48fb1',
        background: '#121212',
        paper: '#1e1e1e',
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)'
        }
    }
};

/**
 * Gera um tema personalizado baseado em configurações
 */
export function createCustomTheme(
    mode: 'light' | 'dark' = 'light',
    primaryColor?: string,
    secondaryColor?: string
): FuseThemeType {
    const baseColors = themeColors[mode];

    return {
        palette: {
            mode,
            primary: {
                main: primaryColor || baseColors.primary
            },
            secondary: {
                main: secondaryColor || baseColors.secondary
            },
            background: {
                default: baseColors.background,
                paper: baseColors.paper
            },
            text: baseColors.text
        }
    };
}

/**
 * Converte uma cor hex para rgba
 */
export function hexToRgba(hex: string, alpha = 1): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Verifica se uma cor é escura
 */
export function isDarkColor(color: string): boolean {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Fórmula para calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
}

/**
 * Gera uma paleta de cores baseada em uma cor principal
 */
export function generateColorPalette(mainColor: string) {
    return {
        50: hexToRgba(mainColor, 0.1),
        100: hexToRgba(mainColor, 0.2),
        200: hexToRgba(mainColor, 0.3),
        300: hexToRgba(mainColor, 0.4),
        400: hexToRgba(mainColor, 0.6),
        500: mainColor,
        600: hexToRgba(mainColor, 0.8),
        700: hexToRgba(mainColor, 0.9),
        800: hexToRgba(mainColor, 0.95),
        900: hexToRgba(mainColor, 1)
    };
}

export default {
    createCustomTheme,
    hexToRgba,
    isDarkColor,
    generateColorPalette,
    themeColors
};
