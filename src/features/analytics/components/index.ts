// ========================================
// 📊 MÓDULO UNIFICADO DE ANALYTICS E DASHBOARD
// ========================================
// Combina funcionalidades de dashboard e analytics
// Mantém toda funcionalidade existente com melhor organização

// === COMPONENTES PRINCIPAIS ===
export { Analytics } from './Analytics';
export { Header } from './Header';

// === MÉTRICAS E VISÃO GERAL ===
// export { Metrics } from './metrics/Metrics'; // REMOVIDO - usar UnifiedMetrics
export { UnifiedMetrics } from './metrics/UnifiedMetrics';

// === GRÁFICOS E VISUALIZAÇÕES ===
export { Charts } from './charts/Charts';

// === COMPONENTES DE DASHBOARD ===
export { TopLinks } from './dashboard/TopLinks';

// === ANALYTICS ESPECIALIZADOS ===
export { EnhancedAnalytics } from './enhanced/EnhancedAnalytics';
export { DebugAnalytics } from './enhanced/DebugAnalytics';

// === COMPONENTES ESPECIALIZADOS ORIGINAIS ===
export * from './specialized/temporal';
export * from './specialized/geographic';
export * from './specialized/audience';
export * from './specialized/heatmap';
// Removed: insights não utilizados
export * from './specialized/common';

// === ANÁLISES ESPECIALIZADAS ===
export { GeographicAnalysis } from './analysis/GeographicAnalysis';
export { TemporalAnalysis } from './analysis/TemporalAnalysis';
export { AudienceAnalysis } from './analysis/AudienceAnalysis';
export { HeatmapAnalysis } from './analysis/HeatmapAnalysis';
export { BusinessInsights } from './insights/BusinessInsights';
export { PerformanceAnalysis } from './analysis/PerformanceAnalysis';

// === UTILITÁRIOS E COMMON ===
// Agora incluídos via export * from './specialized/common'

// === TIPOS ===
export type { AnalyticsProps, MetricsProps, ChartsProps } from './types';
