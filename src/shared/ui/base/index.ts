/**
 * 🧩 SHARED UI BASE COMPONENTS
 * Exportações centralizadas dos componentes base
 */

// Brand
export { AppLogo } from "./AppLogo";

// Layout & Structure
export { default as EnhancedPaper } from "./EnhancedPaper";
export { getCardSurfaceSx } from "./cardSurface";
export { getFilterSegmentSx, getSegmentedControlSx } from "./segmentedControl";

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
export { SectionLabel, type SectionLabelProps } from "./SectionLabel";

// Data Display
export {
  OverviewMetricRow,
  type OverviewMetric,
  type OverviewMetricRowProps,
} from "./OverviewMetricRow";
export {
  MetricDelta,
  getMetricDeltaColor,
  type MetricDeltaProps,
} from "./MetricDelta";
export { default as EmptyState } from "./EmptyState";
export { default as AnalyticsEmptyState } from "./AnalyticsEmptyState";

// Re-export types
export type { BaseComponentProps } from "../components";
