// === MÉTRICAS E VISÃO GERAL ===
export { DashboardMetrics } from './dashboard';
export { default as AnalyticsMetrics } from './dashboard/shared/DashboardMetrics';

// === GRÁFICOS E VISUALIZAÇÕES ===
export { Charts } from './dashboard/shared/charts/Charts';

// === COMPONENTES ESPECIALIZADOS ORIGINAIS ===
export * from './audience';
export * from './geographic';
export * from './heatmap';
export * from './temporal';

// === ANÁLISES ESPECIALIZADAS ===
// GeographicAnalysis removido - usar GeographicChart e GeographicInsights diretamente
export { PerformanceAnalysis } from './perfomance/PerformanceAnalysis';
export { BusinessInsights } from './insights/BusinessInsights';
