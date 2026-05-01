/**
 * @fileoverview Exportações do módulo Heatmap
 * @author Link Charts Team
 * @version 2.0.0
 */

import dynamic from "next/dynamic";

// Componentes principais
export { HeatmapAnalysis } from "./HeatmapAnalysis";
export { HeatmapMetrics } from "./HeatmapMetrics";

export const RealTimeHeatmapChart = dynamic(
  () =>
    import("./RealTimeHeatmapChart").then((m) => ({
      default: m.RealTimeHeatmapChart,
    })),
  { ssr: false, loading: () => null },
);

// Componentes modulares
export { HeatmapControls } from "./HeatmapControls";
export { HeatmapStats } from "./HeatmapStats";

export const HeatmapMap = dynamic(
  () => import("./HeatmapMap").then((m) => ({ default: m.HeatmapMap })),
  { ssr: false, loading: () => null },
);

// Tipos
export type { HeatmapPoint } from "@/types";

// Hook
export { useHeatmapData } from "../../hooks/useHeatmapData";
