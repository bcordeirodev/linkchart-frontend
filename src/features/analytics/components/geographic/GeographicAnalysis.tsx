"use client";
import { useState } from "react";
import { Globe, Map, BarChart3, Layers } from "lucide-react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG, ICON_SM } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import TabDescription from "@/shared/ui/base/TabDescription";

import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { GeographicChart } from "./GeographicChart";
import { GeographicChoropleth } from "./GeographicChoropleth";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMetrics } from "./GeographicMetrics";
import { RealTimeHeatmapChart } from "./index";

interface GeographicAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
  minClicks?: number;
}

export function GeographicAnalysis({
  linkId,
  title,
  enableRealtime = false,
  minClicks = 1,
}: GeographicAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("geographic.title");
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { data, stats, loading, error, refresh, isRealtime } =
    useGeographicData({
      linkId,
      enableRealtime,
      minClicks,
      refreshInterval: 30000,
    });

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

  return (
    <Box>
      {/* Cabeçalho do módulo */}
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Globe {...ICON_LG} />}
          title={displayTitle}
          description={t("geographic.description")}
          highlight={t("geographic.countriesReached", {
            count: stats?.totalCountries || 0,
          })}
          metadata={isRealtime ? t("dashboard.realtime") : undefined}
        />
      </Box>

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
          {/* 5 metric cards no topo, fora das sub-tabs */}
          <GeographicMetrics
            stats={stats}
            showTitle
            title={t("geographic.metrics.title")}
          />

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
                <ContinentBreakdown continents={data?.continents || []} />
              </Grid>
              <Grid item xs={12}>
                <GeographicInsights
                  countries={data?.top_countries || []}
                  states={data?.top_states || []}
                  cities={data?.top_cities || []}
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
            />
          )}

          {/* Sub-tab 2: Rankings com drill-down */}
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
