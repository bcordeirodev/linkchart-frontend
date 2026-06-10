/**
 * @fileoverview Exports do módulo Audience
 * @author Link Charts Team
 * @version 2.0.0
 */

// Componentes principais
export { AudienceAnalysis } from "./AudienceAnalysis";
export { AudienceChart } from "./AudienceChart";
export { AudienceInsights } from "./AudienceInsights";
export { AudienceMetrics } from "./AudienceMetrics";
export { BehaviorSection } from "./BehaviorSection";
export { ConnectionTypeCard } from "./ConnectionTypeCard";
export { FetchDestChart } from "./FetchDestChart";
export { LanguageBreakdownCard } from "./LanguageBreakdownCard";
export { LanguageBreakdownChart } from "./LanguageBreakdownChart";
export { PlatformBreakdownCard } from "./PlatformBreakdownCard";
export { QualitySection } from "./QualitySection";
export { SocialPlatformSection } from "./SocialPlatformSection";

// Hook personalizado
export { useAudienceData } from "../../hooks/useAudienceData";

// Tipos (re-exports)
export type {
  DeviceData,
  BrowserData,
  OSData,
  ReferrerData,
  AudienceData,
  AudienceStats,
  UseAudienceDataOptions,
  UseAudienceDataReturn,
  AudienceAnalysisProps,
  AudienceChartProps,
  AudienceMetricsProps,
  AudienceInsightsProps,
} from "@/types/analytics";
