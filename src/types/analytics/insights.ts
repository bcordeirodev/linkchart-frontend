/**
 * @fileoverview Tipos relacionados aos insights de negócio
 * Centraliza interfaces para insights automáticos e recomendações
 */

/**
 * Insight individual de negócio
 */
export interface BusinessInsight {
	type: InsightType;
	title: string;
	description: string;
	priority: InsightPriority;
	actionable: boolean;
	recommendation?: string;
	impact_score?: number;
	confidence?: number;
	data_points?: Record<string, any>;
	created_at: string;
	expires_at?: string;
}

/**
 * Tipos de insight disponíveis
 */
export type InsightType =
	| 'geographic'
	| 'temporal'
	| 'audience'
	| 'performance'
	| 'conversion'
	| 'engagement'
	| 'optimization'
	| 'security'
	| 'growth';

/**
 * Prioridades de insight
 */
export type InsightPriority = 'high' | 'medium' | 'low';

/**
 * Dados completos de insights
 */
export interface InsightsData {
	insights: BusinessInsight[];
	summary: InsightsSummary;
	categories: InsightCategories;
	trends: InsightTrend[];
	generated_at: string;
	next_update_at?: string;
}

/**
 * Resumo dos insights
 */
export interface InsightsSummary {
	total_insights: number;
	high_priority: number;
	medium_priority: number;
	low_priority: number;
	actionable_insights: number;
	avg_confidence: number;
	avg_impact_score: number;
}

/**
 * Categorização dos insights
 */
export interface InsightCategories {
	geographic: number;
	temporal: number;
	audience: number;
	performance: number;
	conversion: number;
	engagement: number;
	optimization: number;
	security: number;
	growth: number;
}

/**
 * Tendência de insights ao longo do tempo
 */
export interface InsightTrend {
	date: string;
	total_insights: number;
	high_priority: number;
	actionable: number;
	avg_confidence: number;
}

/**
 * Estatísticas calculadas dos insights
 */
export interface InsightsStats {
	totalInsights: number;
	highPriorityCount: number;
	actionableCount: number;
	avgConfidence: number;
	avgImpactScore: number;
	topCategory: InsightType;
	lastGenerated: string;
	nextUpdate: string;
}

/**
 * Opções para o hook useInsightsData
 */
export interface UseInsightsDataOptions {
	linkId?: string;
	
	refreshInterval?: number;
	enableRealtime?: boolean;
	minConfidence?: number;
	categories?: InsightType[];
	priorities?: InsightPriority[];
	actionableOnly?: boolean;
}

/**
 * Retorno do hook useInsightsData
 */
export interface UseInsightsDataReturn {
	data: InsightsData | null;
	stats: InsightsStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	isRealtime: boolean;
}

/**
 * Props para componentes de insights
 */
export interface BusinessInsightsProps {
	insights?: BusinessInsight[];
	data?: InsightsData;
	loading?: boolean;
	error?: string | null;
	showTitle?: boolean;
	title?: string;
	maxItems?: number;
	priorityFilter?: InsightPriority[];
	categoryFilter?: InsightType[];
	onInsightClick?: (insight: BusinessInsight) => void;
}

/**
 * Props para cards individuais de insight
 */
export interface InsightCardProps {
	insight: BusinessInsight;
	onClick?: (insight: BusinessInsight) => void;
	showActions?: boolean;
	compact?: boolean;
}

/**
 * Props para métricas de insights
 */
export interface InsightsMetricsProps {
	summary?: InsightsSummary;
	stats?: InsightsStats;
	loading?: boolean;
	showTitle?: boolean;
	title?: string;
	variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Ação recomendada para um insight
 */
export interface InsightAction {
	id: string;
	type: 'optimize' | 'investigate' | 'expand' | 'fix' | 'monitor';
	title: string;
	description: string;
	effort: 'low' | 'medium' | 'high';
	impact: 'low' | 'medium' | 'high';
	timeframe: 'immediate' | 'short' | 'medium' | 'long';
	resources?: string[];
}

/**
 * Configuração de geração de insights
 */
export interface InsightGenerationConfig {
	enabledCategories: InsightType[];
	minConfidenceThreshold: number;
	maxInsightsPerCategory: number;
	updateFrequency: number;
	includeTrends: boolean;
	includeRecommendations: boolean;
}

/**
 * Filtros para insights
 */
export interface InsightsFilters {
	categories?: InsightType[];
	priorities?: InsightPriority[];
	minConfidence?: number;
	minImpactScore?: number;
	actionableOnly?: boolean;
	dateRange?: {
		start: string;
		end: string;
	};
}

/**
 * Resposta da API de insights
 */
export interface InsightsApiResponse {
	success: boolean;
	data: InsightsData | BusinessInsight[];
	metadata?: {
		generated_at: string;
		processing_time: number;
		confidence_threshold: number;
		total_data_points: number;
		algorithm_version: string;
	};
}

/**
 * Contexto de insight (dados que geraram o insight)
 */
export interface InsightContext {
	data_source: string;
	time_period: string;
	sample_size: number;
	methodology: string;
	limitations?: string[];
	related_insights?: string[];
}
