import dynamic from "next/dynamic";

export { GeographicAnalysis } from "./GeographicAnalysis";
export { GeographicInsights } from "./GeographicInsights";
export { ContinentBreakdown } from "./ContinentBreakdown";
export { GeographicChart } from "./GeographicChart";

export const RealTimeHeatmapChart = dynamic(
  () =>
    import("./RealTimeHeatmapChart").then((m) => ({
      default: m.RealTimeHeatmapChart,
    })),
  { ssr: false, loading: () => null },
);

// The world choropleth pulls react-simple-maps + d3-geo (~100KB). Lazy-loaded
// (ssr:false) so the heavy map lib stays out of the static analytics chunk,
// mirroring the RealTimeHeatmapChart pattern above. It only ever renders on the
// "Mundo" sub-tab, so most sessions never pay for it.
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
