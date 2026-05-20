"use client";
import { useState } from "react";
import { Map, BarChart3, Layers } from "lucide-react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import type { GeoLevel } from "@/features/links/hooks/useAnalyticsFilters";

import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { CountryDistributionChart } from "./CountryDistributionChart";
import { GeographicChart } from "./GeographicChart";
import { GeographicChoropleth } from "./GeographicChoropleth";
import { GeographicFilterBar } from "./GeographicFilterBar";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMetrics } from "./GeographicMetrics";
import { RealTimeHeatmapChart } from "./index";

/** Props accepted by the {@link GeographicAnalysis} component. */
interface GeographicAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Override the section title text. */
  title?: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /** Filters results to a specific continent code (e.g. `"EU"`, `"NA"`). */
  continent?: string | null;
  /** Server-side threshold — hides locations with fewer clicks than this value. */
  minClicks?: number;
  /**
   * Frontend-only display control — which geographic level to highlight
   * in the rankings tab (country / state / city).
   */
  geoLevel?: GeoLevel;
  /** Callback to propagate `continent` changes to the parent. */
  onContinentChange?: (v: string | null) => void;
  /** Callback to propagate `minClicks` changes to the parent. */
  onMinClicksChange?: (v: number) => void;
  /** Callback to propagate `geoLevel` changes to the parent. */
  onGeoLevelChange?: (v: GeoLevel) => void;
}

/**
 * Componente de análise geográfica com mapa, rankings e breakdown por continente.
 *
 * Renders an optional {@link GeographicFilterBar} when the three change
 * callbacks are provided.  The `geoLevel` prop selects which rankings tier
 * (country / state / city) is initially visible inside the rankings tab.
 */
export function GeographicAnalysis({
  linkId,
  title: _title,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  continent,
  minClicks = 1,
  geoLevel,
  onContinentChange,
  onMinClicksChange,
  onGeoLevelChange,
}: GeographicAnalysisProps) {
  const { t } = useTranslation("analytics");
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const {
    data,
    stats,
    loading,
    error,
    refresh,
    isRealtime: _isRealtime,
  } = useGeographicData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    continent,
    minClicks,
    refreshInterval: 30000,
  });

  /**
   * Handles sub-tab changes (Overview / Heatmap / Rankings).
   *
   * @param _event - Unused synthetic event.
   * @param newValue - The index of the newly selected tab.
   */
  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setActiveSubTab(newValue);
  };

  const hasHeatmapData = (data?.heatmap_data?.length ?? 0) > 0;
  const hasRankings =
    (data?.top_countries?.length ?? 0) > 0 ||
    (data?.top_states?.length ?? 0) > 0 ||
    (data?.top_cities?.length ?? 0) > 0;
  const hasContinents = (data?.continents?.length ?? 0) > 0;

  /** Resolved geoLevel with default fallback. */
  const resolvedGeoLevel = geoLevel ?? "country";

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        onRetry={refresh}
        loadingMessage={t("geographic.loading")}
        emptyMessage={t("geographic.empty")}
        minHeight={300}
      >
        <Box>
          {/* Filter bar — only rendered when parent supplies all three callbacks */}
          {onContinentChange && onMinClicksChange && onGeoLevelChange && (
            <GeographicFilterBar
              continent={continent ?? null}
              minClicks={minClicks ?? 1}
              geoLevel={resolvedGeoLevel}
              onContinentChange={onContinentChange}
              onMinClicksChange={onMinClicksChange}
              onGeoLevelChange={onGeoLevelChange}
            />
          )}

          {/* 5 metric cards no topo, fora das sub-tabs */}
          <GeographicMetrics stats={stats} />

          {/* Sub-tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeSubTab}
              onChange={handleSubTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label={t("geographic.subtabs.overview")}
                icon={<Layers {...ICON_SM} />}
                iconPosition="start"
                disabled={!hasContinents && !hasRankings}
              />
              <Tab
                label={t("geographic.subtabs.heatmap")}
                icon={<Map {...ICON_SM} />}
                iconPosition="start"
                disabled={!hasHeatmapData}
              />
              <Tab
                label={t("geographic.subtabs.rankings")}
                icon={<BarChart3 {...ICON_SM} />}
                iconPosition="start"
                disabled={!hasRankings}
              />
            </Tabs>
          </Box>

          {/* Sub-tab 0: Visão geral */}
          {activeSubTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <GeographicChoropleth
                  countries={data?.top_countries || []}
                  selectedCountry={selectedCountry}
                  onCountrySelect={setSelectedCountry}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <ContinentBreakdown continents={data?.continents || []} />
                  <CountryDistributionChart
                    countries={data?.top_countries || []}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <GeographicInsights
                  countries={data?.top_countries || []}
                  states={data?.top_states || []}
                  cities={data?.top_cities || []}
                  totalCountries={stats?.totalCountries}
                />
              </Grid>
            </Grid>
          )}

          {/* Sub-tab 1: Mapa de calor */}
          {activeSubTab === 1 && hasHeatmapData && (
            <RealTimeHeatmapChart
              data={data?.heatmap_data || []}
              loading={loading}
              error={error}
              onRefresh={refresh}
              height={700}
              title={t("geographic.subtabs.heatmap")}
              showControls
              showStats={false}
              stats={stats}
            />
          )}

          {/* Sub-tab 2: Rankings com drill-down — geoLevel controls initial view */}
          {activeSubTab === 2 && (
            <GeographicChart
              countries={
                resolvedGeoLevel === "country" ? data?.top_countries || [] : []
              }
              states={
                resolvedGeoLevel === "state" ? data?.top_states || [] : []
              }
              cities={resolvedGeoLevel === "city" ? data?.top_cities || [] : []}
              totalClicks={stats?.totalClicks || 0}
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
            />
          )}
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
