// === MÉTRICAS E VISÃO GERAL ===
export { DashboardMetrics } from './dashboard';
export { default as AnalyticsMetrics } from './dashboard/DashboardMetrics';

// === GRÁFICOS E VISUALIZAÇÕES ===
export { Charts } from './dashboard/Charts';

// === COMPONENTES ESPECIALIZADOS ORIGINAIS ===
export * from './audience';
export * from './geographic';
export * from './heatmap';
export * from './temporal';

// === ANÁLISES ESPECIALIZADAS ===
export { PerformanceAnalysis } from './perfomance/PerformanceAnalysis';
export { BusinessInsights } from './insights/BusinessInsights';
