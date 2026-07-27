/**
 * 🏗️ LAYOUT CORE EXPORTS - LINK CHART
 * Exportação centralizada dos componentes core de layout
 *
 * @description
 * Este arquivo centraliza as exportações de todos os componentes
 * core do sistema de layout, incluindo providers, hooks, contextos
 * e tipos necessários para o funcionamento do layout.
 *
 * @since 2.0.0
 */

// ========================================
// 🏗️ LAYOUT COMPONENTS
// ========================================
export { Layout } from "./Layout";
export { LayoutProvider } from "./LayoutProvider";

// ========================================
// 🎣 HOOKS
// ========================================
export { useLayoutSettings } from "./useLayoutSettings";

// ========================================
// 🔗 CONTEXTS
// ========================================
export { LayoutSettingsContext } from "./LayoutSettingsContext";

// ========================================
// 📝 TYPES
// ========================================
export type {
  LayoutDirection,
  LayoutStyle,
  NavbarConfig,
  ToolbarConfig,
  FooterConfig,
  LayoutConfig,
  LayoutTheme,
  LayoutSettingsConfigType,
  LayoutThemesType,
  LayoutComponentProps,
  MainLayoutProps,
  LayoutDefaults,
} from "./types";

export type { LayoutSettingsContextType } from "./LayoutSettingsContext";
