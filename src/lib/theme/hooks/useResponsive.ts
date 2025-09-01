/**
 * 📱 HOOK RESPONSIVO CENTRALIZADO
 * Simplifica o uso de breakpoints em toda a aplicação
 */

import useThemeMediaQuery from '@/shared/hooks/useThemeMediaQuery';

// ========================================
// 📊 TYPES
// ========================================

export interface ResponsiveConfig {
	// Breakpoints principais
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;

	// Breakpoints específicos
	isXSmall: boolean;
	isSmall: boolean;
	isMedium: boolean;
	isLarge: boolean;
	isXLarge: boolean;

	// Orientação
	isLandscape: boolean;
	isPortrait: boolean;

	// Utilitários
	isLargeScreen: boolean;
	isMobileOrTablet: boolean;
	isTabletOrDesktop: boolean;

	// Breakpoint atual
	currentBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ========================================
// 🎣 HOOK
// ========================================

/**
 * Hook personalizado para breakpoints responsivos
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive();
 *
 * if (isMobile) {
 *   return <MobileComponent />;
 * }
 *
 * // Ou usando o breakpoint atual
 * const columns = currentBreakpoint === 'xs' ? 1 :
 *                currentBreakpoint === 'sm' ? 2 :
 *                currentBreakpoint === 'md' ? 3 : 4;
 * ```
 */
export function useResponsive(): ResponsiveConfig {
	// Breakpoints individuais
	const isXSmall = useThemeMediaQuery((theme) => theme.breakpoints.only('xs'));
	const isSmall = useThemeMediaQuery((theme) => theme.breakpoints.only('sm'));
	const isMedium = useThemeMediaQuery((theme) => theme.breakpoints.only('md'));
	const isLarge = useThemeMediaQuery((theme) => theme.breakpoints.only('lg'));
	const isXLarge = useThemeMediaQuery((theme) => theme.breakpoints.only('xl'));

	// Breakpoints principais
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));
	const isTablet = useThemeMediaQuery((theme) => theme.breakpoints.between('md', 'lg'));
	const isDesktop = useThemeMediaQuery((theme) => theme.breakpoints.up('lg'));

	// Orientação
	const isLandscape = useThemeMediaQuery(() => '(orientation: landscape)');
	const isPortrait = useThemeMediaQuery(() => '(orientation: portrait)');

	// Utilitários
	const isLargeScreen = useThemeMediaQuery((theme) => theme.breakpoints.up('lg'));
	const isMobileOrTablet = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const isTabletOrDesktop = useThemeMediaQuery((theme) => theme.breakpoints.up('md'));

	// Determinar breakpoint atual
	const currentBreakpoint: ResponsiveConfig['currentBreakpoint'] = isXSmall
		? 'xs'
		: isSmall
			? 'sm'
			: isMedium
				? 'md'
				: isLarge
					? 'lg'
					: 'xl';

	return {
		// Breakpoints principais
		isMobile,
		isTablet,
		isDesktop,

		// Breakpoints específicos
		isXSmall,
		isSmall,
		isMedium,
		isLarge,
		isXLarge,

		// Orientação
		isLandscape,
		isPortrait,

		// Utilitários
		isLargeScreen,
		isMobileOrTablet,
		isTabletOrDesktop,

		// Breakpoint atual
		currentBreakpoint
	};
}

export default useResponsive;
