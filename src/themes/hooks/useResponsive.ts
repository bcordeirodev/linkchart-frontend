/**
 * Hook responsivo centralizado para Link Charts
 * Simplifica o uso de breakpoints em toda a aplicação
 */

import { useThemeMediaQuery } from '@/hooks';

/**
 * Hook personalizado para breakpoints responsivos
 * Centraliza toda a lógica de responsividade
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 * if (isMobile) {
 *   return <MobileComponent />;
 * }
 * ```
 */
export function useResponsive() {
    return {
        // Breakpoints principais
        isMobile: useThemeMediaQuery((theme) => theme.breakpoints.down('md')),
        isTablet: useThemeMediaQuery((theme) => theme.breakpoints.between('md', 'lg')),
        isDesktop: useThemeMediaQuery((theme) => theme.breakpoints.up('lg')),

        // Breakpoints específicos
        isXSmall: useThemeMediaQuery((theme) => theme.breakpoints.down('sm')),
        isSmall: useThemeMediaQuery((theme) => theme.breakpoints.between('sm', 'md')),
        isMedium: useThemeMediaQuery((theme) => theme.breakpoints.between('md', 'lg')),
        isLarge: useThemeMediaQuery((theme) => theme.breakpoints.between('lg', 'xl')),
        isXLarge: useThemeMediaQuery((theme) => theme.breakpoints.up('xl')),

        // Orientação
        isLandscape: useThemeMediaQuery(() => '(orientation: landscape)'),
        isPortrait: useThemeMediaQuery(() => '(orientation: portrait)'),

        // Utilitários
        isLargeScreen: useThemeMediaQuery((theme) => theme.breakpoints.up('lg')),
        isMobileOrTablet: useThemeMediaQuery((theme) => theme.breakpoints.down('lg')),
        isTabletOrDesktop: useThemeMediaQuery((theme) => theme.breakpoints.up('md'))
    };
}

export default useResponsive;
