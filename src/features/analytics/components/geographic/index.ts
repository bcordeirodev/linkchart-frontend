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

// The world choropleth is a Leaflet GeoJSON layer — the same engine as
// RealTimeHeatmapChart above, so the tab never loads two separate mapping
// stacks. Lazy-loaded (ssr:false) so Leaflet stays out of the static
// analytics chunk; it only ever renders on the "Mundo" sub-tab, so most
// sessions never pay for it.
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
