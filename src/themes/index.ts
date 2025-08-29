/**
 * 🎨 SISTEMA DE TEMAS CENTRALIZADO - Link Charts
 * Exportação única e otimizada de todos os recursos de tema
 */

// ========================================
// 🎨 CORE THEME COMPONENTS
// ========================================

export { default as FuseTheme } from '@fuse/core/FuseTheme';
export { default as MainThemeProvider } from '@/contexts/MainThemeProvider';

// ========================================
// 🎛️ THEME HOOKS
// ========================================

export {
    useMainTheme,
    useNavbarTheme,
    useToolbarTheme,
    useFooterTheme,
    useContrastMainTheme,
    useMainThemeDark,
    useMainThemeLight,
    changeThemeMode
} from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';

export { useThemeMediaQuery } from '@/hooks';
export { useResponsive } from './hooks/useResponsive';

// ========================================
// 🧭 NAVIGATION
// ========================================

export { default as useNavigation } from './navigation/useNavigation';
export { navigationSlice } from './store/navigationSlice';

// ========================================
// 🏗️ LAYOUT SYSTEM
// ========================================

export { default as themeLayouts } from './layouts/themeLayouts';

// Layout configs para compatibilidade com FuseSettings
export const themeLayoutConfigs = {
    layout1: {
        title: 'Layout Principal Link Charts',
        defaults: {
            mode: 'container',
            containerWidth: 1200,
            navbar: {
                display: true,
                style: 'style-1',
                folded: false,
                position: 'left'
            },
            toolbar: {
                display: true,
                style: 'fixed'
            },
            footer: {
                display: true,
                style: 'fixed'
            },
            leftSidePanel: {
                display: false
            },
            rightSidePanel: {
                display: false
            }
        },
        form: {} // Form configs vazias - não utilizadas
    }
};

// Types
export type { themeLayoutsType } from './layouts/themeLayouts';

export interface themeLayoutDefaultsProps {
    mode: 'container' | 'boxed';
    containerWidth: number;
    navbar: {
        display: boolean;
        style: string;
        folded: boolean;
        position: string;
    };
    toolbar: {
        display: boolean;
        style: string;
    };
    footer: {
        display: boolean;
        style: string;
    };
    leftSidePanel: {
        display: boolean;
    };
    rightSidePanel: {
        display: boolean;
    };
}

// ========================================
// 🎨 THEME SELECTORS
// ========================================

export { default as ThemeSelector } from './components/ThemeSelector';
export { default as FuseThemeSelector } from '@fuse/core/FuseThemeSelector';

// ========================================
// 📱 RESPONSIVE UTILITIES
// ========================================

export type { ResponsiveConfig } from './hooks/useResponsive';

// ========================================
// 🔧 THEME UTILITIES
// ========================================

// ========================================
// 🛠️ HELPER FUNCTIONS
// ========================================

/**
 * Converte hex para rgba
 */
const hexToRgba = (hex: string, alpha = 1): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Verifica se uma cor é escura
 */
const isDarkColor = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Fórmula para calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
};

/**
 * Gera paleta de cores baseada em uma cor principal
 */
const generateColorPalette = (mainColor: string) => ({
    50: hexToRgba(mainColor, 0.1),
    100: hexToRgba(mainColor, 0.2),
    200: hexToRgba(mainColor, 0.3),
    300: hexToRgba(mainColor, 0.4),
    400: hexToRgba(mainColor, 0.6),
    500: mainColor,
    600: hexToRgba(mainColor, 0.8),
    700: hexToRgba(mainColor, 0.9),
    800: hexToRgba(mainColor, 0.95),
    900: mainColor
});

/**
 * Cria configuração de tema personalizada
 */
const createCustomTheme = (config: {
    mode?: 'light' | 'dark';
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    paperColor?: string;
}) => ({
    mode: 'light' as const,
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    backgroundColor: '#f5f5f5',
    paperColor: '#ffffff',
    ...config
});

/**
 * Utilitários de tema consolidados
 */
export const themeUtils = {
    hexToRgba,
    isDarkColor,
    generateColorPalette,
    createCustomTheme
};

// ========================================
// 📋 THEME CONFIGURATION
// ========================================

export const defaultThemeConfig = {
    mode: 'light' as const,
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    backgroundColor: '#f5f5f5',
    paperColor: '#ffffff'
};

// ========================================
// 🔄 LEGACY EXPORTS (Deprecated)
// ========================================

/** @deprecated Use specific imports instead */
export { default as themesConfig } from '@/configs/themesConfig';
/** @deprecated Use specific imports instead */
export { default as themeOptions } from '@/configs/themeOptions';

// ========================================
// 📊 TYPE EXPORTS
// ========================================

export type { FuseThemeType, FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';
export type { FuseThemeOption } from '@fuse/core/FuseThemeSelector/ThemePreview';