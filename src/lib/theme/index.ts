/**
 * 🎨 SISTEMA DE TEMAS CENTRALIZADO - Link Chart
 * Exportação simplificada dos recursos essenciais de tema
 */

// ========================================
// 🎨 CORE THEME COMPONENTS
// ========================================
export { default as MainThemeProvider } from './MainThemeProvider';

// ========================================
// 🎯 DESIGN SYSTEM
// ========================================
export {
	createDesignTokens,
	useDesignTokens,
	applySpacing,
	applyBorderRadius,
	createColorVariation,
	spacingTokens,
	borderRadiusTokens,
	layoutSpacing,
	animationDurations,
	animationEasings,
	layoutDimensions
} from './designSystem';

export type { ColorVariant, ColorIntensity } from './designSystem';

// ========================================
// 🎛️ THEME HOOKS ESSENCIAIS
// ========================================
export {
	useMainTheme,
	useResponsive,
	useThemeMediaQuery
} from './hooks';

// ========================================
// 🎨 THEME CONFIGURATION
// ========================================
export { applyGlobalStyles } from './globalStyles';
export { allThemes, allThemes as themesConfig, simplifiedThemes, extendedThemes } from './themes';

// ========================================
// 🎨 COLORS
// ========================================
export { fuseDark, skyBlue, lightPaletteText, darkPaletteText, brandColors } from './colors';

// ========================================
// ⚙️ CONFIGURATIONS ESSENCIAIS
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
// 🛠️ THEME UTILITIES USADOS
// ========================================
export {
	// Color utilities
	getThemeColor,
	getColorVariantMap,
	getStateColors,
	getBackgroundColors,
	getTextColors,
	getBorderColors,
	createComponentColorSet,

	// Glass effects - usado em vários componentes
	createGlassEffect,
	createGlassCard,
	createGlassNavbar,
	createGlassModal,
	createGlassButton,

	// Gradients - usado em vários componentes
	createGradient,
	createThemeGradient,
	createPresetGradients,
	createTextGradient,

	// Spacing - usado no design system
	getSpacing,
	createPadding,
	createMargin,
	createGap,
	createSpacingUtils,
	createResponsiveSpacing,

	// Shadows - usado no design system
	createShadow,
	createPresetShadows,
	createStateShadows,

	// Responsive - usado no design system
	createResponsiveValue,
	createResponsiveTypography,
	createVisibilityUtils,

	// Animations - usado em vários componentes
	createTransition,
	createFadeAnimation,
	createSlideAnimation,
	createScaleAnimation,
	createPresetAnimations,
	createStateAnimations,
	createResponsiveAnimation,

} from './utils';

// ========================================
// 📊 TYPE EXPORTS ESSENCIAIS
// ========================================
export type {
	FuseThemeType,
	FuseThemesType,
	ThemeLayoutDefaultsProps,
	FuseSettingsConfigType,
	ColorPalette,
	TextColors,
	BrandColor
} from './types';