import dynamic from "next/dynamic";

export { GeographicAnalysis } from "./GeographicAnalysis";
export { GeographicChart } from "./GeographicChart";
export { GeographicChoropleth } from "./GeographicChoropleth";
export { GeographicInsights } from "./GeographicInsights";
export { GeographicMetrics } from "./GeographicMetrics";
export { ContinentBreakdown } from "./ContinentBreakdown";

export const RealTimeHeatmapChart = dynamic(
  () =>
    import("./RealTimeHeatmapChart").then((m) => ({
      default: m.RealTimeHeatmapChart,
    })),
  { ssr: false, loading: () => null },
);

// Hook
export { useGeographicData } from "../../hooks/useGeographicData";

// Tipos
export type {
  GeographicStats,
  UseGeographicDataOptions,
  UseGeographicDataReturn,
} from "../../hooks/useGeographicData";
