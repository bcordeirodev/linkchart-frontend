/**
 * 🎨 SISTEMA DE TEMAS CENTRALIZADO - Link Charts
 * Exportação simplificada dos recursos essenciais de tema
 */

// ========================================
// 🎨 CORE THEME COMPONENTS
// ========================================
export { default as MainThemeProvider } from "./MainThemeProvider";

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
  layoutDimensions,
  // Novos utilitários responsivos
  createResponsiveSpacing,
  responsiveSpacing,
  createCustomSpacing,
  // Tokens SP2
  typographyScale,
  radiusTokens,
  elevationTokens,
  elevationLightTokens,
  motionTokens,
  zIndexTokens,
} from "./designSystem";

export type { ColorVariant, ColorIntensity } from "./designSystem";

// ========================================
// 🎛️ THEME HOOKS ESSENCIAIS
// ========================================
export { useMainTheme, useResponsive, useThemeMediaQuery } from "./hooks";

// ========================================
// 🎨 THEME CONFIGURATION
// ========================================
export { applyGlobalStyles } from "./globalStyles";
export {
  allThemes,
  themesConfig,
  defaultDarkTheme,
  defaultLightTheme,
} from "./themes";

// ========================================
// 🎨 COLORS
// ========================================
export {
  darkPalette,
  darkNeutral,
  darkPrimary,
  lightPalette,
  lightNeutral,
  lightPrimary,
  semanticDark,
  semanticLight,
  chartPalette,
  chartByType,
  getChartColor,
  getGradientColors,
  chartColors,
} from "./colors";

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
  breakpoints,
} from "./config";

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

  // Chart color utilities
  getStandardChartColors,
  getChartColorsByType,
  getContextColor,
  getMultiSeriesColors,

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
} from "./utils";

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
  BrandColor,
} from "./types";
