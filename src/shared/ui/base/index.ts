/**
 * 🧩 SHARED UI BASE COMPONENTS
 * Exportações centralizadas dos componentes base
 */

// Layout & Structure
export { default as TabPanel } from './TabPanel';
export { default as TabDescription } from './TabDescription';
export { default as EnhancedPaper } from './EnhancedPaper';

// Novos componentes unificados
export { ResponsiveContainer, PageContainer, SectionContainer, FormContainer } from './ResponsiveContainer';
export { default as PageHeader } from './PageHeader';

// Data Display
export { default as MetricCardOptimized } from './MetricCardOptimized';
export { default as ChartCard } from './ChartCard';
export { default as EmptyState } from './EmptyState';

// Form & Interaction
export { default as GradientButton } from './GradientButton';

// Typography & Content
export { default as SafeTypography } from './SafeTypography';

// Re-export types
export type { TabPanelProps, MetricCardProps, BaseComponentProps } from '../components';
