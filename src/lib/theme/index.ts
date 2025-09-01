/**
 * 🎨 SISTEMA DE TEMAS CENTRALIZADO - Link Chart
 * Exportação única e otimizada de todos os recursos de tema
 */

// ========================================
// 🎨 CORE THEME COMPONENTS
// ========================================
export { default as MainThemeProvider } from './MainThemeProvider';

// ========================================
// 🎛️ THEME HOOKS ESSENCIAIS
// ========================================
export {
	useMainTheme,
	useNavbarTheme,
	useToolbarTheme,
	useFooterTheme,
	changeThemeMode,
	useContrastMainTheme,
	useMainThemeDark,
	useMainThemeLight,
	useFuseSettings,
	useResponsive,
	useThemeMediaQuery
} from './hooks';

// ========================================
// 🎨 THEME CONFIGURATION
// ========================================
export { applyGlobalStyles } from './globalStyles';
export { allThemes, allThemes as themesConfig, simplifiedThemes, extendedThemes } from './themes';
export { themeLayoutConfigs } from './config';

// ========================================
// 🎨 COLORS
// ========================================
export { fuseDark, skyBlue, lightPaletteText, darkPaletteText, brandColors } from './colors';

// ========================================
// ⚙️ CONFIGURATIONS
// ========================================
export {
	defaultSettings,
	defaultThemeOptions,
	mustHaveThemeOptions,
	defaultThemes,
	extendThemeWithMixins,
	optimizedSettings,
	optimizedThemeOptions,
	muiComponents,
	typography,
	breakpoints
} from './config';

// ========================================
// 🛠️ THEME UTILITIES
// ========================================
export {
	getThemeColor,
	getColorVariantMap,
	getStateColors,
	getBackgroundColors,
	getTextColors,
	getBorderColors,
	createGradient,
	createComponentColorSet,
	createGlassEffect,
	createGlassCard,
	createGlassNavbar,
	createGlassModal,
	createGlassButton,
	createThemeGradient,
	createPresetGradients,
	createTextGradient,
	getSpacing,
	createPadding,
	createMargin,
	createGap,
	createSpacingUtils,
	createResponsiveSpacing,
	createShadow,
	createPresetShadows,
	createStateShadows,
	createResponsiveValue,
	createResponsiveTypography,
	createVisibilityUtils,
	createTransition,
	createFadeAnimation,
	createSlideAnimation,
	createScaleAnimation,
	createPresetAnimations,
	createStateAnimations,
	createResponsiveAnimation
} from './utils';

// ========================================
// 📊 TYPE EXPORTS
// ========================================
export type {
	FuseThemeType,
	FuseThemesType,
	ThemeLayoutDefaultsProps,
	FuseSettingsConfigType,
	RadioOptionType,
	FormFieldBaseType,
	RadioFieldType,
	NumberFieldType,
	SwitchFieldType,
	GroupFieldType,
	GroupFieldChildrenType,
	AnyFormFieldType,
	ThemeFormConfigTypes,
	ColorPalette,
	TextColors,
	BrandColor
} from './types';

// ========================================
// 🔄 COMPATIBILITY EXPORTS
// ========================================
// Para compatibilidade com código existente
// export type { ThemeLayoutDefaultsProps as themeLayoutDefaultsProps };
