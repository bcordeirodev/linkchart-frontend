import dynamic from "next/dynamic";

export { GeographicAnalysis } from "./GeographicAnalysis";
export { GeographicChart } from "./GeographicChart";
export { GeographicInsights } from "./GeographicInsights";
export { GeographicMetrics } from "./GeographicMetrics";
export { ContinentBreakdown } from "./ContinentBreakdown";
export { CountryDistributionChart } from "./CountryDistributionChart";

export const RealTimeHeatmapChart = dynamic(
  () =>
    import("./RealTimeHeatmapChart").then((m) => ({
      default: m.RealTimeHeatmapChart,
    })),
  { ssr: false, loading: () => null },
);

// react-simple-maps + d3-geo is ~100KB; lazy-load it (ssr:false) so it stays out
// of the static analytics chunk, mirroring the RealTimeHeatmapChart pattern above.
export const GeographicChoropleth = dynamic(
  () =>
    import("./GeographicChoropleth").then((m) => ({
      default: m.GeographicChoropleth,
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
