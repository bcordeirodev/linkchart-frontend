"use client";
import { useState } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { BarChart3, Globe2, Map as MapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useResponsive } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { AnalyticsSubTabs } from "@/shared/ui/navigation";
import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { GeographicFilterBar } from "./GeographicFilterBar";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMapAndList, RealTimeHeatmapChart } from "./index";

/**
 * Loading skeleton that mirrors the sub-tabbed Geographic tab layout: filter
 * bar → segmented sub-tab control → a single content block (the shape of
 * whichever sub-tab loads first).
 */
function GeographicSkeleton() {
  return (
    <Box>
      {/* Continent filter bar */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={52}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      {/* Segmented sub-tab control */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={40}
        sx={{ mb: 2, borderRadius: 2, maxWidth: 420 }}
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
   * Index of the currently active sub-tab (0=Mapa e ranking, 1=Continentes e
   * países, 2=Mapa de calor).
   *
   * When provided the component operates in **controlled mode** and the
   * caller is responsible for persisting this value (e.g. in URL search
   * params) so it survives RSC-triggered remounts on filter changes. When
   * omitted the component falls back to an internal `useState`.
   */
  subTabIndex?: number;
  /** Called when the user selects a different sub-tab. Pair with `subTabIndex`. */
  onSubTabChange?: (v: number) => void;
}

/**
 * "Lugares" tab — answers "where is my audience?" across three sub-tabs:
 * Mapa e ranking → Continentes e países → Mapa de calor.
 *
 * Renders an optional {@link GeographicFilterBar} above the sub-tabs when
 * `onContinentChange` is provided.
 *
 * Countries previously appeared three times on this tab — the choropleth
 * map, the ranked list (both inside `GeographicMapAndList`'s Mapa/Lista
 * toggle) and a `CountryDistributionChart` pie. The pie added no
 * information the map/list toggle didn't already have, so it was deleted
 * outright rather than converted — "Continentes e países" now holds only
 * `ContinentBreakdown`.
 *
 * The city heat map ({@link RealTimeHeatmapChart}) is the heaviest section on
 * the tab (Leaflet + tile layers) and used to collapse to 0px height on
 * mobile even when visible. It only renders while its sub-tab is active, so
 * the Leaflet chunk and tile requests are not fetched until the user
 * actually opens "Mapa de calor" — the same lazy-mount benefit the previous
 * collapsed accordion provided.
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
  /** The active sub-tab index: controlled (URL-persisted) when provided, otherwise local. */
  const activeSubTab = subTabIndex ?? localSubTab;

  const { data, stats, loading, error, refresh } = useGeographicData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    continent,
    refreshInterval: 30000,
  });

  /**
   * Handles sub-tab changes (Mapa e ranking / Continentes e países / Mapa de
   * calor).
   *
   * In controlled mode (`onSubTabChange` provided) the caller owns the state
   * (typically writing to URL search params); otherwise local state is
   * updated directly.
   *
   * @param newValue - The index of the newly selected sub-tab.
   */
  const handleSubTabChange = (newValue: number) => {
    if (onSubTabChange) {
      onSubTabChange(newValue);
    } else {
      setLocalSubTab(newValue);
    }
  };

  const hasHeatmapData = (data?.heatmap_data?.length ?? 0) > 0;
  const hasContinents = (data?.continents?.length ?? 0) > 0;
  const hasRankings =
    (data?.top_countries?.length ?? 0) > 0 ||
    (data?.top_states?.length ?? 0) > 0 ||
    (data?.top_cities?.length ?? 0) > 0;

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
          {/* Filter bar — only rendered when parent supplies the callback */}
          {onContinentChange && (
            <GeographicFilterBar
              continent={continent ?? null}
              onContinentChange={onContinentChange}
            />
          )}

          <Box sx={{ mt: onContinentChange ? 2 : 0 }}>
            <AnalyticsSubTabs
              value={activeSubTab}
              onChange={handleSubTabChange}
              ariaLabel={t("tabs.places")}
              tabs={[
                {
                  label: t("geographic.subtabs.mapAndRanking"),
                  icon: <MapIcon {...ICON_SM} />,
                  disabled: !hasRankings,
                },
                {
                  label: t("geographic.subtabs.continentsCountries"),
                  icon: <Globe2 {...ICON_SM} />,
                  disabled: !hasContinents,
                },
                {
                  label: t("geographic.subtabs.heatmap"),
                  icon: <BarChart3 {...ICON_SM} />,
                  disabled: !hasHeatmapData,
                },
              ]}
            >
              {/* Sub-tab 0: Mapa e ranking — the Mapa/Lista toggle card plus
                  the market-insights recommendations derived from the same
                  country/state/city data. */}
              {activeSubTab === 0 && (
                <Stack spacing={{ xs: 3, md: 4 }}>
                  <GeographicMapAndList
                    countries={data?.top_countries || []}
                    states={data?.top_states || []}
                    cities={data?.top_cities || []}
                    totalClicks={stats?.totalClicks || 0}
                    selectedCountry={selectedCountry}
                    onCountrySelect={setSelectedCountry}
                  />
                  <GeographicInsights
                    countries={data?.top_countries || []}
                    states={data?.top_states || []}
                    cities={data?.top_cities || []}
                    totalCountries={stats?.totalCountries}
                  />
                </Stack>
              )}

              {/* Sub-tab 1: Continentes e países — also the continent filter
                  (click a row). The former `CountryDistributionChart` pie
                  was deleted (redundant with the map/list toggle above), so
                  this sub-tab now holds only the continent breakdown. */}
              {activeSubTab === 1 && (
                <ContinentBreakdown
                  continents={data?.continents || []}
                  activeContinentCode={continent ?? null}
                  onContinentSelect={onContinentChange}
                />
              )}

              {/* Sub-tab 2: Mapa de calor por cidade — only mounts (and
                  fetches its Leaflet chunk + tiles) while this sub-tab is
                  active. */}
              {activeSubTab === 2 && hasHeatmapData ? (
                <RealTimeHeatmapChart
                  data={data?.heatmap_data || []}
                  loading={loading}
                  error={error}
                  onRefresh={refresh}
                  height={isMobile ? 760 : 700}
                  title={t("geographic.heatmap.titleDefault")}
                  showControls
                  showStats={false}
                  stats={stats}
                />
              ) : null}
            </AnalyticsSubTabs>
          </Box>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
