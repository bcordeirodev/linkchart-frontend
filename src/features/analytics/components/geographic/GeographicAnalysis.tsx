"use client";
import { useState } from "react";
import { Map, BarChart3, Layers } from "lucide-react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useResponsive } from "@/lib/theme";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
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
   * Index of the currently active sub-tab (0 = Overview, 1 = Heatmap, 2 = Rankings).
   *
   * When provided the component operates in **controlled mode** and the caller
   * is responsible for persisting this value (e.g. in URL search params) so it
   * survives RSC-triggered remounts on filter changes.  When omitted the
   * component falls back to an internal `useState`.
   */
  subTabIndex?: number;
  /** Called when the user selects a different sub-tab. Pair with `subTabIndex`. */
  onSubTabChange?: (v: number) => void;
}

/**
 * Componente de análise geográfica com mapa, rankings e breakdown por continente.
 *
 * Renders an optional {@link GeographicFilterBar} when `onContinentChange` is
 * provided.
 *
 * Sub-tab state can be managed externally via `subTabIndex` + `onSubTabChange`
 * (controlled mode, recommended) or internally via `useState` (uncontrolled
 * fallback).  The controlled mode is required when the parent persists state in
 * the URL so the selected sub-tab survives RSC-triggered remounts on filter
 * changes.
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

  // Uncontrolled fallback — used only when `subTabIndex` is not provided.
  const [localSubTab, setLocalSubTab] = useState(0);
  /** The active sub-tab index: controlled (URL-persisted) when provided, otherwise local. */
  const activeSubTab = subTabIndex ?? localSubTab;

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
   * Handles sub-tab changes (Overview / Heatmap / Rankings).
   *
   * In controlled mode (`onSubTabChange` provided) the caller owns the state
   * (typically writing to URL search params).  In uncontrolled mode the local
   * state is updated directly.
   *
   * @param _event - Unused synthetic event.
   * @param newValue - The index of the newly selected tab.
   */
  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    if (onSubTabChange) {
      onSubTabChange(newValue);
    } else {
      setLocalSubTab(newValue);
    }
  };

  const hasHeatmapData = (data?.heatmap_data?.length ?? 0) > 0;
  const hasRankings =
    (data?.top_countries?.length ?? 0) > 0 ||
    (data?.top_states?.length ?? 0) > 0 ||
    (data?.top_cities?.length ?? 0) > 0;
  const hasContinents = (data?.continents?.length ?? 0) > 0;

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        skeleton={<AnalyticsTabSkeleton hasFilter metricCards={5} />}
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={8}>
                <GeographicChoropleth
                  countries={data?.top_countries || []}
                  selectedCountry={selectedCountry}
                  onCountrySelect={setSelectedCountry}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <ContinentBreakdown
                    continents={data?.continents || []}
                    activeContinentCode={continent ?? null}
                  />
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

          {/* Sub-tab 1: Mapa de calor — height is capped on mobile to avoid consuming the full viewport */}
          {activeSubTab === 1 && hasHeatmapData && (
            <RealTimeHeatmapChart
              data={data?.heatmap_data || []}
              loading={loading}
              error={error}
              onRefresh={refresh}
              height={isMobile ? 380 : 700}
              title={t("geographic.subtabs.heatmap")}
              showControls
              showStats={false}
              stats={stats}
            />
          )}

          {/* Sub-tab 2: Rankings */}
          {activeSubTab === 2 && (
            <GeographicChart
              countries={data?.top_countries || []}
              states={data?.top_states || []}
              cities={data?.top_cities || []}
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
