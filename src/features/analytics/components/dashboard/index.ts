export { default as DashboardAnalytics } from './DashboardAnalytics';
export { DashboardAnalytics as DashboardAnalysisEnhanced } from './DashboardAnalytics';
export { default as DashboardMetrics } from './DashboardMetrics';
export { default as TopLinks } from './TopLinks';
export { Charts } from './charts/Charts';

// Hook específico
export { useDashboardData } from '../../hooks/useDashboardData';

// Tipos
export type {
    DashboardData,
    DashboardStats,
    UseDashboardDataOptions,
    UseDashboardDataReturn
} from '../../hooks/useDashboardData';
