/**
 * @fileoverview Exports do módulo Audience
 * @author Link Charts Team
 * @version 2.0.0
 */

// Componentes principais
export { AudienceAnalysis } from "./AudienceAnalysis";
export { AudienceChart } from "./AudienceChart";
export { AudienceExtraCharts } from "./AudienceExtraCharts";
export { AudienceInsights } from "./AudienceInsights";
export { AudienceMetrics } from "./AudienceMetrics";
export { BehaviorSection } from "./BehaviorSection";
export { FetchDestChart } from "./FetchDestChart";
export { LanguageBreakdownChart } from "./LanguageBreakdownChart";
export { QualitySection } from "./QualitySection";

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
