"use client";
import { useState } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { Flame, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useResponsive } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { AnalyticsSubTabs, resolveEnabledSubTab } from "@/shared/ui/navigation";
import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { GeographicChart } from "./GeographicChart";
import { GeographicFilterBar } from "./GeographicFilterBar";
import { GeographicInsights } from "./GeographicInsights";
// Both come from the barrel, where they are `dynamic(..., { ssr: false })`:
// both are Leaflet views (heat map + choropleth), kept out of the static
// analytics chunk so the tab pays for the map engine only once it's opened.
import { GeographicChoropleth, RealTimeHeatmapChart } from "./index";

/**
 * Loading skeleton that mirrors the sub-tabbed Geographic tab layout:
 * segmented sub-tab control → continent filter bar → a single content block
 * (the shape of whichever sub-tab loads first). Order matches the rendered
 * tab — navigation first, then the filter — so nothing shifts on load.
 */
function GeographicSkeleton() {
  return (
    <Box>
      {/* Level-2 segmented sub-tab control */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={44}
        sx={{ mb: 2, borderRadius: 2, maxWidth: 420 }}
      />

      {/* Level-3 continent filter bar */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={36}
        sx={{ mb: 2, borderRadius: 2, maxWidth: 560 }}
      />

      <Skeleton
        variant="rounded"
        animation="wave"
        height={360}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );
}

/** Props accepted by the {@link GeographicAnalysis} component. */
interface GeographicAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /** Server-side continent filter. `null` means all continents. */
  continent?: string | null;
  /** Callback to propagate `continent` changes to the parent (enables filter bar). */
  onContinentChange?: (v: string | null) => void;
  /**
   * Index of the active sub-tab (0=Mapa de calor, 1=Mundo). When provided the
   * component is controlled and the caller persists the value (URL param), so
   * it survives the RSC remount a filter change triggers.
   */
  subTabIndex?: number;
  /** Called when the user selects a different sub-tab. Pair with `subTabIndex`. */
  onSubTabChange?: (v: number) => void;
}

/**
 * "Lugares" tab — answers "where is my audience?" across two sub-tabs.
 *
 * **Mapa de calor** leads, because the city-level heat map is the most concrete
 * answer to the question: it points at places, not at shapes. The country,
 * state and city rankings read directly underneath it, and the market
 * recommendations — which are derived from those very rankings — close the
 * screen.
 *
 * **Mundo** holds the zoomed-out view: the choropleth and the continent
 * breakdown, which doubles as the continent filter.
 *
 * The heat map only mounts while its sub-tab is active — Leaflet and its map
 * tiles are never fetched while the user is on "Mundo".
 *
 * Renders an optional {@link GeographicFilterBar} below the sub-tabs when
 * `onContinentChange` is provided — navigation first, then the filter that
 * scopes whichever view is open.
 */
export function GeographicAnalysis({
  linkId,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  continent,
  onContinentChange,
  subTabIndex,
  onSubTabChange,
}: GeographicAnalysisProps) {
  const { t } = useTranslation("analytics");
  const { isMobile } = useResponsive();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Uncontrolled fallback — used only when `subTabIndex` is not provided.
  const [localSubTab, setLocalSubTab] = useState(0);
  const activeSubTab = subTabIndex ?? localSubTab;

  /**
   * Handles sub-tab changes (Mapa de calor / Mundo).
   *
   * @param newValue - Index of the newly selected sub-tab.
   */
  const handleSubTabChange = (newValue: number) => {
    if (onSubTabChange) {
      onSubTabChange(newValue);
    } else {
      setLocalSubTab(newValue);
    }
  };

  const { data, stats, loading, error, refresh } = useGeographicData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    continent,
    refreshInterval: 30000,
  });

  const hasHeatmap = (data?.heatmap_data?.length ?? 0) > 0;

  const subTabs = [
    {
      label: t("geographic.subtabs.heatmap"),
      icon: <Flame {...ICON_SM} />,
      disabled: !hasHeatmap,
    },
    {
      label: t("geographic.subtabs.world"),
      icon: <Globe2 {...ICON_SM} />,
    },
  ];

  // The URL can point at the heat sub-tab on a link with no geo points.
  const visibleSubTab = resolveEnabledSubTab(activeSubTab, subTabs);

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        skeleton={<GeographicSkeleton />}
        onRetry={refresh}
        loadingMessage={t("geographic.loading")}
        emptyMessage={t("geographic.empty")}
        minHeight={300}
      >
        <Box>
          <AnalyticsSubTabs
            value={visibleSubTab}
            onChange={handleSubTabChange}
            ariaLabel={t("tabs.places")}
            tabs={subTabs}
          >
            {/* Level-3 continent filter, *below* the level-2 view switch and
                  immediately above the content it scopes — navigation first,
                  then filtering. It used to sit above the sub-tabs, which put
                  two adjacent, near-identical pill rows at the top of the tab
                  with nothing saying which one moved you and which one narrowed
                  the data. `continent` reaches the backend query, so it scopes
                  both sub-tabs equally and belongs to neither in particular.
                  Only rendered when the parent supplies the callback. */}
            {onContinentChange && (
              <GeographicFilterBar
                continent={continent ?? null}
                onContinentChange={onContinentChange}
              />
            )}

            {/* Sub-tab 0: the city heat map leads — it is the most concrete
                  answer to "where are they?" — with the country/state/city
                  rankings reading underneath it. Only mounts while active, so
                  Leaflet and its tiles stay off the wire on the other sub-tab. */}
            {visibleSubTab === 0 && hasHeatmap ? (
              <Stack spacing={{ xs: 3, md: 4 }}>
                <RealTimeHeatmapChart
                  data={data?.heatmap_data || []}
                  loading={loading}
                  error={error}
                  onRefresh={refresh}
                  height={isMobile ? 960 : 700}
                  showControls
                  showStats={false}
                  stats={stats}
                />

                <GeographicChart
                  countries={data?.top_countries || []}
                  states={data?.top_states || []}
                  cities={data?.top_cities || []}
                  totalClicks={stats?.totalClicks || 0}
                  selectedCountry={selectedCountry}
                  onCountrySelect={setSelectedCountry}
                />

                {/* The recommendations are drawn from the very rankings above
                      them, so they close this screen rather than hiding behind
                      the other sub-tab. */}
                <GeographicInsights
                  countries={data?.top_countries || []}
                  states={data?.top_states || []}
                  cities={data?.top_cities || []}
                  totalCountries={stats?.totalCountries}
                />
              </Stack>
            ) : null}

            {/* Sub-tab 1: the world view — the choropleth and the continent
                  breakdown, which doubles as the continent filter. */}
            {visibleSubTab === 1 ? (
              <Stack spacing={{ xs: 3, md: 4 }}>
                {/* The choropleth renders bare (no chrome of its own) — it
                      used to sit inside the deleted toggle card. Standalone it
                      needs a surface and a title, like every other block. */}
                <ChartCard
                  title={t("geographic.choropleth.title")}
                  subtitle={t("geographic.choropleth.subtitle")}
                >
                  <GeographicChoropleth
                    countries={data?.top_countries || []}
                    selectedCountry={selectedCountry}
                    onCountrySelect={setSelectedCountry}
                  />
                </ChartCard>

                <ContinentBreakdown
                  continents={data?.continents || []}
                  activeContinentCode={continent ?? null}
                  onContinentSelect={onContinentChange}
                />
              </Stack>
            ) : null}
          </AnalyticsSubTabs>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
