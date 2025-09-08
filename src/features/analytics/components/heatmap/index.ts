/**
 * @fileoverview Exportações do módulo Heatmap
 * @author Link Chart Team
 * @version 2.0.0
 */

// Componentes principais
export { HeatmapAnalysis } from './HeatmapAnalysis';
export { RealTimeHeatmapChart } from './RealTimeHeatmapChart';
export { HeatmapMetrics } from './HeatmapMetrics';

// Componentes modulares
export { HeatmapControls } from './HeatmapControls';
export { HeatmapStats } from './HeatmapStats';
export { HeatmapMap } from './HeatmapMap';

// Tipos
export type { HeatmapPoint } from '@/types';

// Hook
export { useHeatmapData } from '../../hooks/useHeatmapData';
