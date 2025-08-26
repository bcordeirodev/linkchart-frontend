/**
 * Configurações centralizadas de tema para Link Charts
 * Centraliza toda a lógica de temas em um local único
 */

// Re-exports dos hooks de tema
export { useThemeMediaQuery } from '@/hooks';
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

// Re-exports dos tipos de tema
export type { FuseThemeType, FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';

export type { FuseThemeOption } from '@fuse/core/FuseThemeSelector/ThemePreview';

// Re-exports dos componentes de tema
export { default as FuseTheme } from '@fuse/core/FuseTheme';
export { default as FuseThemeSelector } from '@fuse/core/FuseThemeSelector';

// Configurações de tema
export { default as themesConfig } from '@/configs/themesConfig';
export { default as themeOptions } from '@/configs/themeOptions';

// Providers de tema
export { default as MainThemeProvider } from '@/contexts/MainThemeProvider';

// Re-export do hook responsivo
export { useResponsive } from './hooks/useResponsive';

// Configurações de layout
export { default as themeLayoutConfigs } from './config/layoutConfigs';
export type { themeLayoutDefaultsProps } from './config/layoutConfigs';
export { default as themeLayouts } from './layouts/themeLayouts';
export type { themeLayoutsType } from './layouts/themeLayouts';

// Navigation
export { default as useNavigation } from './navigation/useNavigation';
export { navigationSlice } from './store/navigationSlice';

/**
 * Configurações padrão de tema para Link Charts
 */
export const defaultThemeConfig = {
    mode: 'light' as const,
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    backgroundColor: '#f5f5f5',
    paperColor: '#ffffff'
};

/**
 * Utilitários de tema
 */
export const themeUtils = {
    /**
     * Gera uma configuração de tema personalizada
     */
    createCustomTheme: (config: Partial<typeof defaultThemeConfig>) => ({
        ...defaultThemeConfig,
        ...config
    }),

    /**
     * Converte configuração para formato FuseTheme
     */
    toFuseTheme: (config: typeof defaultThemeConfig) => ({
        palette: {
            mode: config.mode,
            primary: { main: config.primaryColor },
            secondary: { main: config.secondaryColor },
            background: {
                default: config.backgroundColor,
                paper: config.paperColor
            }
        }
    })
};
