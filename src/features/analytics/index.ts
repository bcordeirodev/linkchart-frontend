/**
 * 📊 ANALYTICS FEATURE EXPORTS
 * Barrel exports para o módulo de analytics
 */

// Components
export { Analytics } from './components/Analytics';
export { AnalyticsContainer } from './components/AnalyticsContainer';
export * from './components/dashboard/charts/Charts';
export * from './components/Header';

// Enhanced Components (with dedicated hooks)
export * from './components/dashboard';
export * from './components/geographic';
export * from './components/temporal';
export * from './components/insights';
export * from './components/audience';
export * from './components/heatmap';
export * from './components/perfomance';

// Hooks
export * from './hooks/useLinkPerformance';
export * from './hooks/useHeatmapData';
export * from './hooks/useAudienceData';
export * from './hooks/useDashboardData';
export * from './hooks/useGeographicData';
export * from './hooks/useTemporalData';
export * from './hooks/useInsightsData';

// Services
export * from '@/services/analytics.service';

// Types - Usar tipos centralizados de @/types/analytics
export type { AnalyticsProps, ChartsProps, MetricsProps } from '@/types/analytics';

// Utils
export * from './utils/chartFormatters';
