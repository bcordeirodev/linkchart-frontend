/**
 * 🧩 SHARED UI BASE COMPONENTS
 * Exportações centralizadas dos componentes base
 */

// Brand
export { AppLogo } from "./AppLogo";

// Layout & Structure
export { default as EnhancedPaper } from "./EnhancedPaper";

// Novos componentes unificados
export { ResponsiveContainer } from "./ResponsiveContainer";
export {
  PageSectionHeading,
  type PageSectionHeadingProps,
} from "./PageSectionHeading";
export {
  PublicBlockIcon,
  type PublicBlockIconVariant,
} from "./PublicBlockIcon";

// Data Display
export { default as MetricCardOptimized } from "./MetricCardOptimized";
export { default as EmptyState } from "./EmptyState";
export { default as AnalyticsEmptyState } from "./AnalyticsEmptyState";

// Form & Interaction
export { default as GradientButton } from "./GradientButton";
export { HelpHint, type HelpHintProps } from "./HelpHint";

// Re-export types
export type { MetricCardProps, BaseComponentProps } from "../components";
