// ========================================
// 📊 MÓDULO UNIFICADO DE ANALYTICS E DASHBOARD
// ========================================
// Combina funcionalidades de dashboard e analytics
// Mantém toda funcionalidade existente com melhor organização

// === COMPONENTES PRINCIPAIS ===
export { Analytics, AnalyticsContainer } from './Analytics';
export { Header } from './Header';

// === MÉTRICAS E VISÃO GERAL ===
export { DashboardMetrics } from './dashboard';
export { default as AnalyticsMetrics } from './dashboard/shared/DashboardMetrics';
export { GeographicMetrics } from './geographic';
export { AudienceMetrics } from './audience';

// === GRÁFICOS E VISUALIZAÇÕES ===
export { Charts } from './dashboard/shared/charts/Charts';

// === COMPONENTES DE DASHBOARD ===
export { TopLinks } from './dashboard/shared/TopLinks';

// === COMPONENTES ESPECIALIZADOS ORIGINAIS ===
export * from './audience';
export * from './geographic';
export * from './heatmap';
export * from './temporal';

// === ANÁLISES ESPECIALIZADAS ===
// GeographicAnalysis removido - usar GeographicChart e GeographicInsights diretamente
export { PerformanceAnalysis } from './perfomance/PerformanceAnalysis';
export { BusinessInsights } from './insights/BusinessInsights';
// === UTILITÁRIOS E COMMON ===
// Agora incluídos via export * from './specialized/common'

// === TIPOS ===
export type { AnalyticsProps, ChartsProps, MetricsProps } from './types';
