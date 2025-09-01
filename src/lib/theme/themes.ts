/**
 * 🎨 TEMAS CONSOLIDADOS E OTIMIZADOS - LINK CHART
 * Todos os temas da aplicação em um arquivo organizado e bem documentado
 * 
 * @description
 * Este arquivo centraliza todas as configurações de tema da aplicação Link Chart.
 * Inclui temas claros e escuros com diferentes paletas de cores, organizados
 * de forma modular e otimizada para performance.
 * 
 * @features
 * - ✅ Temas claros e escuros
 * - ✅ Múltiplas paletas de cores (Default, Sky Blue, Fuse Dark)
 * - ✅ Configurações otimizadas para performance
 * - ✅ TypeScript com tipagem completa
 * - ✅ Compatibilidade com Material-UI
 * 
 * @example
 * ```typescript
 * import { allThemes, themesConfig } from '@/lib/theme/themes';
 * 
 * // Usar tema padrão
 * const defaultTheme = allThemes.default;
 * 
 * // Usar tema escuro
 * const darkTheme = allThemes.defaultDark;
 * 
 * // Usar tema Sky Blue
 * const skyBlueTheme = allThemes.skyBlue;
 * ```
 * 
 * @since 1.0.0
 * @version 2.0.0
 */

import { FuseThemesType } from './types/theme';
import { brandColors, fuseDark, skyBlue } from './colors';

// ========================================
// 🎨 PALETAS BASE OTIMIZADAS
// ========================================

/**
 * Paleta base para temas claros
 */
const lightBasePalette = {
    mode: 'light' as const,
    divider: 'rgba(0, 0, 0, 0.12)',
    text: {
        primary: '#212121',
        secondary: '#5F6368'
    },
    common: {
        black: '#000000',
        white: '#FFFFFF'
    },
    background: {
        paper: '#FFFFFF',
        default: '#FAFAFA'
    }
};

/**
 * Paleta base para temas escuros
 */
const darkBasePalette = {
    mode: 'dark' as const,
    divider: 'rgba(255, 255, 255, 0.12)',
    text: {
        primary: '#FFFFFF',
        secondary: '#B3B3B3'
    },
    common: {
        black: '#000000',
        white: '#FFFFFF'
    },
    background: {
        paper: '#1E2125',
        default: '#121212'
    }
};

// ========================================
// 🎨 TEMAS PRINCIPAIS CONSOLIDADOS
// ========================================

/**
 * Todos os temas da aplicação consolidados
 */
export const allThemes: FuseThemesType = {
    // ========================================
    // 🌟 TEMAS PRINCIPAIS (Brand Colors)
    // ========================================
    default: {
        palette: {
            ...lightBasePalette,
            ...brandColors
        }
    },

    defaultDark: {
        palette: {
            ...darkBasePalette,
            ...brandColors
        }
    },

    // ========================================
    // 🌊 TEMAS SKY BLUE
    // ========================================
    skyBlue: {
        palette: {
            ...lightBasePalette,
            primary: {
                light: skyBlue[300],
                main: skyBlue[500],
                dark: skyBlue[700],
                contrastText: '#FFFFFF'
            },
            secondary: {
                light: skyBlue[200],
                main: skyBlue[400],
                dark: skyBlue[600],
                contrastText: '#000000'
            },
            error: brandColors.error,
            success: brandColors.success,
            warning: brandColors.warning,
            info: brandColors.info,
            background: {
                paper: '#FFFFFF',
                default: '#F8FAFC'
            }
        }
    },

    skyBlueDark: {
        palette: {
            ...darkBasePalette,
            primary: {
                light: skyBlue[300],
                main: skyBlue[500],
                dark: skyBlue[700],
                contrastText: '#FFFFFF'
            },
            secondary: {
                light: skyBlue[200],
                main: skyBlue[400],
                dark: skyBlue[600],
                contrastText: '#000000'
            },
            error: brandColors.error,
            success: brandColors.success,
            warning: brandColors.warning,
            info: brandColors.info
        }
    },

    // ========================================
    // 🌑 TEMAS FUSE DARK
    // ========================================
    fuseDarkLight: {
        palette: {
            ...lightBasePalette,
            primary: {
                light: fuseDark[300],
                main: fuseDark[500],
                dark: fuseDark[700],
                contrastText: '#FFFFFF'
            },
            secondary: {
                light: fuseDark[200],
                main: fuseDark[400],
                dark: fuseDark[600],
                contrastText: '#FFFFFF'
            },
            error: brandColors.error,
            success: brandColors.success,
            warning: brandColors.warning,
            info: brandColors.info
        }
    },

    fuseDarkDark: {
        palette: {
            ...darkBasePalette,
            primary: {
                light: fuseDark[300],
                main: fuseDark[500],
                dark: fuseDark[700],
                contrastText: '#FFFFFF'
            },
            secondary: {
                light: fuseDark[200],
                main: fuseDark[400],
                dark: fuseDark[600],
                contrastText: '#FFFFFF'
            },
            error: brandColors.error,
            success: brandColors.success,
            warning: brandColors.warning,
            info: brandColors.info
        }
    }
};

// ========================================
// 🎯 TEMAS SIMPLIFICADOS (COMPATIBILIDADE)
// ========================================

/**
 * Temas simplificados para compatibilidade
 * @deprecated Use allThemes instead
 */
export const simplifiedThemes: FuseThemesType = {
    default: allThemes.default,
    defaultDark: allThemes.defaultDark
};

/**
 * Temas estendidos para compatibilidade
 * @deprecated Use allThemes instead
 */
export const extendedThemes: FuseThemesType = {
    skyBlue: allThemes.skyBlue,
    skyBlueDark: allThemes.skyBlueDark,
    fuseDarkLight: allThemes.fuseDarkLight,
    fuseDarkDark: allThemes.fuseDarkDark
};

// ========================================
// 📤 EXPORTS PRINCIPAIS
// ========================================

/**
 * Configuração principal de temas (alias para allThemes)
 */
export const themesConfig = allThemes;

/**
 * Export padrão
 */
export default allThemes;
