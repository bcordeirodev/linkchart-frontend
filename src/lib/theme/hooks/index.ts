/**
 * 🎣 HOOKS DE TEMA CENTRALIZADOS - LINK CHART
 * Exportação única de todos os hooks relacionados ao tema
 */

// Hooks de tema Fuse
export {
	useMainTheme,
	useNavbarTheme,
	useToolbarTheme,
	useFooterTheme,
	changeThemeMode,
	useContrastMainTheme,
	useMainThemeDark,
	useMainThemeLight
} from './fuseThemeHooks';

// Hook de configurações Fuse
export { default as useFuseSettings } from './useFuseSettings';

// Hook responsivo
export { useResponsive } from './useResponsive';

// Re-export de hooks compartilhados
export { default as useThemeMediaQuery } from '@/shared/hooks/useThemeMediaQuery';
