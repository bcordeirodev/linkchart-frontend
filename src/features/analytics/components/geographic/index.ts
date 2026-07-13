import dynamic from "next/dynamic";

export { GeographicAnalysis } from "./GeographicAnalysis";
export { GeographicInsights } from "./GeographicInsights";
export { ContinentBreakdown } from "./ContinentBreakdown";
export { CountryDistributionChart } from "./CountryDistributionChart";

export const RealTimeHeatmapChart = dynamic(
  () =>
    import("./RealTimeHeatmapChart").then((m) => ({
      default: m.RealTimeHeatmapChart,
    })),
  { ssr: false, loading: () => null },
);

// Bundles the world choropleth (react-simple-maps + d3-geo, ~100KB) together
// with the ranked-list view behind a single toggle. Lazy-loaded (ssr:false)
// so the heavy map lib stays out of the static analytics chunk, mirroring
// the RealTimeHeatmapChart pattern above.
export const GeographicMapAndList = dynamic(
  () =>
    import("./GeographicMapAndList").then((m) => ({
      default: m.GeographicMapAndList,
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
