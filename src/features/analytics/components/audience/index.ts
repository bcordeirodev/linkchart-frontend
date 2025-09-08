/**
 * @fileoverview Exports do módulo Audience
 * @author Link Chart Team
 * @version 2.0.0
 */

// Componentes principais
export { AudienceAnalysis } from './AudienceAnalysis';
export { AudienceChart } from './AudienceChart';
export { AudienceInsights } from './AudienceInsights';
export { AudienceMetrics } from './AudienceMetrics';

// Hook personalizado
export { useAudienceData } from '../../hooks/useAudienceData';

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
    AudienceInsightsProps
} from '@/types/analytics';
