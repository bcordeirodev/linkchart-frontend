export { BusinessInsights } from './BusinessInsights';
export { InsightsAnalysis } from './InsightsAnalysis';

// ETAPA 3: INSIGHTS ENHANCEMENTS - Novos componentes
export { RetentionAnalysisChart } from './RetentionAnalysisChart';
export { SessionDepthChart } from './SessionDepthChart';
export { TrafficSourceChart } from './TrafficSourceChart';

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

export type { InsightType, InsightPriority } from '@/types/analytics';
