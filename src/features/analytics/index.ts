/**
 * 📊 ANALYTICS FEATURE EXPORTS
 * Barrel exports para o módulo de analytics
 */

// Enhanced Components (with dedicated hooks)
export * from './components/dashboard';
export * from './components/geographic';
export * from './components/temporal';
export * from './components/insights';
export * from './components/audience';
export * from './components/heatmap';
export * from './components/perfomance';

// Hooks - apenas os que não são exportados pelos componentes
export * from './hooks/useLinkPerformance';
export * from './hooks/useDashboardData';

// Services
export * from '@/services/analytics.service';

// Types - Usar tipos centralizados de @/types/analytics
export type { ChartsProps, MetricsProps } from '@/types/analytics';

// Utils
export * from './utils/chartFormatters';
