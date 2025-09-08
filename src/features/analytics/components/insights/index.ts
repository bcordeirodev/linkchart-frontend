export { BusinessInsights } from './BusinessInsights';
export { InsightsAnalysis } from './InsightsAnalysis';

// Hook específico
export { useInsightsData } from '../../hooks/useInsightsData';

// Tipos
export type {
    BusinessInsight,
    InsightsData,
    InsightsStats,
    UseInsightsDataOptions,
    UseInsightsDataReturn
} from '../../hooks/useInsightsData';

export type {
    InsightType,
    InsightPriority
} from '@/types/analytics';
