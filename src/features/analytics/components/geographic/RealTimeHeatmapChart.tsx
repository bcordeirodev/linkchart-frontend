"use client";
/**
 * Componente de mapa de calor interativo
 */

import {
  RefreshCw,
  Maximize2,
  Info,
  Zap,
  MapPin,
  LineChart,
} from "lucide-react";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getSegmentedControlSx } from "@/shared/ui/base";
import { chartByType } from "@/lib/theme/colors/chart";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { HeatmapPoint } from "@/types";
import type { SxProps, Theme } from "@mui/material";
import type React from "react";

// ========================================
// 🏗️ INTERFACES E TIPOS
// ========================================

/**
 * Props do componente RealTimeHeatmapChart
 */
interface HeatmapChartProps {
  /** Dados dos pontos do mapa de calor */
  data: HeatmapPoint[];
  /** Estado de carregamento */
  loading?: boolean;
  /** Mensagem de erro */
  error?: string | null;
  /** Altura do mapa em pixels */
  height?: number;
  /** Callback quando um ponto é clicado */
  onPointClick?: (point: HeatmapPoint) => void;
  /** Estatísticas agregadas */
  stats?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Callback para refresh dos dados */
  onRefresh?: () => void;
  /** Título do componente */
  title?: string;
  /** Mostrar controles de filtro */
  showControls?: boolean;
  /** Mostrar estatísticas */
  showStats?: boolean;
  /**
   * Renderiza sem a moldura de `ChartCard` (borda e título/subtítulo
   * próprios). Use quando o gráfico já vive **dentro** de outro card, onde a
   * moldura própria viraria uma borda dupla e o título, um título dentro do
   * outro. Na aba Lugares ele é standalone, então `bare` fica em `false`.
   */
  bare?: boolean;
}

/**
 * Componentes do Leaflet carregados dinamicamente (SSR safe)
 */
interface SafeMapComponents {
  MapContainer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  TileLayer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  CircleMarker: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  Popup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  LayersControl: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  LayerGroup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Chooses the outer chrome for the heat map: a full {@link ChartCard} (own
 * title, description subtitle and header actions) when the chart is
 * standalone, or a bare `Box` when it is embedded inside another
 * component's own card — avoids a title nested inside a title and a double
 * hairline border.
 *
 * Kept as a module-level component (not declared inside
 * {@link RealTimeHeatmapChart}) so its identity is stable across renders —
 * declaring it inline would give React a new component type on every
 * render (e.g. every slider drag), forcing a remount instead of a
 * reconciliation.
 *
 * @param props.bare - When `true`, skips the `ChartCard` chrome entirely.
 * @param props.title - Card title, shown only when `bare` is `false`.
 * @param props.subtitle - Card description, shown only when `bare` is `false`.
 * @param props.action - Header action slot (chip + refresh/fullscreen buttons), shown only when `bare` is `false`.
 * @param props.sx - Extra styles merged onto the outer element (used for the fullscreen overlay state).
 * @param props.children - Card body.
 */
function HeatmapShell({
  bare,
  title,
  subtitle,
  action,
  sx,
  children,
}: {
  bare: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}) {
  if (bare) {
    return <Box sx={sx}>{children}</Box>;
  }

  return (
    <ChartCard title={title} subtitle={subtitle} action={action} sx={sx}>
      {children}
    </ChartCard>
  );
}

/**
 * Componente de mapa de calor interativo com suporte a tempo real

 * Renderiza um mapa interativo com:
 * - Pontos de calor baseados em cliques geográficos
 * - Controles para filtros e visualização
 * - Atualizações em tempo real
 * - Suporte para modo global e específico por link
 *
 */
export function RealTimeHeatmapChart({
  data,
  stats,
  loading = false,
  error = null,
  onRefresh,
  height = 600,
  title,
  showControls = true,
  showStats = true,
  bare = false,
}: HeatmapChartProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("analytics");
  const displayTitle = title ?? t("geographic.heatmap.titleDefault");
  const heatmapDescription = t("geographic.heatmap.description");

  // Estados do mapa
  const [mapComponents, setMapComponents] = useState<SafeMapComponents>({
    MapContainer: null,
    TileLayer: null,
    CircleMarker: null,
    Popup: null,
    LayersControl: null,
    LayerGroup: null,
  });
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Estados de controle
  const [minClicksFilter, setMinClicksFilter] = useState(1);
  // "Dark" é o tile default — combina com o tema "instrumento técnico"
  // dark-first; Ruas/Satélite continuam disponíveis no controle.
  const [mapStyle, setMapStyle] = useState<"street" | "satellite" | "dark">(
    "dark",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Aplica filtro local de cliques mínimos nos pontos do mapa
  const filteredData = useMemo(
    () => data.filter((p) => p.clicks >= minClicksFilter),
    [data, minClicksFilter],
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Verificar se o Leaflet CSS já foi carregado
        const existingCss = document.querySelector('link[href*="leaflet"]');

        if (!existingCss) {
          const leafletCss = document.createElement("link");
          leafletCss.rel = "stylesheet";
          leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          leafletCss.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          leafletCss.crossOrigin = "";
          document.head.appendChild(leafletCss);
        }

        // Importar componentes React-Leaflet
        const [reactLeaflet] = await Promise.all([import("react-leaflet")]);

        setMapComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          CircleMarker: reactLeaflet.CircleMarker,
          Popup: reactLeaflet.Popup,
          LayersControl: reactLeaflet.LayersControl,
          LayerGroup: reactLeaflet.LayerGroup,
        });

        setMapReady(true);
      } catch (_error) {
        // Erro ao carregar Leaflet tratado

        setMapError(true);
      }
    };

    if (isClient) {
      loadLeaflet();
    }
  }, [isClient]);

  /**
   * Calcular centro do mapa baseado nos dados
   */
  const getMapCenter = useCallback((): [number, number] => {
    const points = filteredData.length > 0 ? filteredData : data;
    if (points.length === 0) return [0, 0];
    const totalLat = points.reduce((sum, p) => sum + p.lat, 0);
    const totalLng = points.reduce((sum, p) => sum + p.lng, 0);
    return [totalLat / points.length, totalLng / points.length];
  }, [data, filteredData]);

  /**
   * Calcular raio do marcador baseado no número de cliques
   */
  const getMarkerRadius = useCallback((clicks: number, maxClicks: number) => {
    const minRadius = 12;
    const maxRadius = 35;
    const normalizedClicks = maxClicks > 0 ? clicks / maxClicks : 0;
    return minRadius + normalizedClicks * (maxRadius - minRadius);
  }, []);

  /**
   * Calcular cor do marcador baseado no número de cliques (paleta SP2 chartByType.heatmap)
   */
  const getMarkerColor = useCallback((clicks: number, maxClicks: number) => {
    const normalizedClicks = clicks / maxClicks;

    if (normalizedClicks > 0.6) {
      return chartByType.heatmap.intense;
    }

    if (normalizedClicks > 0.4) {
      return chartByType.heatmap.high;
    }

    if (normalizedClicks > 0.2) {
      return chartByType.heatmap.medium;
    }

    return chartByType.heatmap.low;
  }, []);

  /**
   * URLs dos tiles baseado no estilo
   */
  const getTileUrl = useCallback((style: string) => {
    switch (style) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "dark":
        return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  }, []);

  // Sobreposta em tela cheia: cobre o viewport inteiro (sem sombra — nada
  // fica visível ao redor das bordas quando o overlay já é edge-to-edge).
  const fullscreenSx: SxProps<Theme> = isFullscreen
    ? {
        bgcolor: "background.paper",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }
    : {};

  const centeredStateSx = {
    minHeight: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  } as const;

  // Estado de loading
  if (!isClient || !mapReady) {
    return (
      <HeatmapShell
        bare={bare}
        title={displayTitle}
        subtitle={heatmapDescription}
      >
        <Box sx={centeredStateSx}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {t("geographic.heatmap.mapLoading")}
          </Typography>
        </Box>
      </HeatmapShell>
    );
  }

  // Renderizar estado de erro
  if (mapError) {
    return (
      <HeatmapShell
        bare={bare}
        title={displayTitle}
        subtitle={heatmapDescription}
      >
        <Box sx={centeredStateSx}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {t("geographic.heatmap.mapError")}
          </Alert>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t("geographic.heatmap.mapErrorText")}
            <br />
            {t("geographic.heatmap.mapErrorInternet")}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            {t("geographic.heatmap.reload")}
          </Button>
        </Box>
      </HeatmapShell>
    );
  }

  // Renderizar estado vazio
  if (!loading && (!data || data.length === 0)) {
    return (
      <HeatmapShell
        bare={bare}
        title={displayTitle}
        subtitle={heatmapDescription}
      >
        <Box sx={{ ...centeredStateSx, textAlign: "center" }}>
          <MapPin
            size={60}
            strokeWidth={1.5}
            style={{ opacity: 0.5, marginBottom: 16 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("geographic.heatmap.noGeoData")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("geographic.heatmap.noGeoDataSub")}
          </Typography>
          {onRefresh ? (
            <Chip
              label={t("geographic.heatmap.realtimeActive")}
              color="success"
              size="small"
              sx={{ mt: 2 }}
              icon={<Zap {...ICON_MD} />}
            />
          ) : null}
        </Box>
      </HeatmapShell>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = mapComponents;

  if (!MapContainer || !TileLayer || !CircleMarker || !Popup) {
    return (
      <HeatmapShell
        bare={bare}
        title={displayTitle}
        subtitle={heatmapDescription}
      >
        <Box sx={centeredStateSx}>
          <CircularProgress />
        </Box>
      </HeatmapShell>
    );
  }

  // Chip "Tempo real" + ações de refresh/fullscreen — vivem no slot `action`
  // do ChartCard (só quando os controles estão habilitados, como no header
  // manual que substituem).
  const headerActions = showControls ? (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      {onRefresh ? (
        <Chip
          label={t("geographic.heatmap.realtime")}
          color="success"
          size="small"
          icon={<Zap {...ICON_MD} />}
        />
      ) : null}
      <Tooltip title={t("geographic.heatmap.refresh")}>
        <IconButton
          onClick={onRefresh}
          disabled={loading || !onRefresh}
          aria-label={t("geographic.heatmap.refresh")}
        >
          <RefreshCw {...ICON_MD} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={
          isFullscreen
            ? t("geographic.heatmap.exitFullscreen")
            : t("geographic.heatmap.fullscreen")
        }
      >
        <IconButton
          onClick={() => setIsFullscreen(!isFullscreen)}
          aria-label={
            isFullscreen
              ? t("geographic.heatmap.exitFullscreen")
              : t("geographic.heatmap.fullscreen")
          }
        >
          <Maximize2 {...ICON_MD} />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : null;

  return (
    <HeatmapShell
      bare={bare}
      title={displayTitle}
      subtitle={heatmapDescription}
      action={headerActions}
      sx={fullscreenSx}
    >
      {showControls ? (
        <Box sx={{ mb: 2 }}>
          {/* Banner explicativo */}
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: "action.hover",
              borderRadius: `${radiusTokens.sm}px`,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Info
              size={14}
              strokeWidth={1.5}
              style={{ marginTop: 2, flexShrink: 0, opacity: 0.6 }}
            />
            <Typography variant="body2" color="text.secondary">
              {t("geographic.heatmap.banner")}
            </Typography>
          </Box>

          {/* Estatísticas */}
          {showStats && stats ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                label={`${stats.totalClicks.toLocaleString(i18n.language)} ${t("geographic.heatmap.clicks")}`}
                color="primary"
                size="small"
              />
              <Chip
                label={`${stats.uniqueCountries} ${t("geographic.heatmap.countries")}`}
                color="secondary"
                size="small"
              />
              <Chip
                label={`${stats.uniqueCities} ${t("geographic.heatmap.cities")}`}
                color="info"
                size="small"
              />
              <Chip
                label={t("geographic.heatmap.avgClicks", {
                  count: Math.round(stats.avgClicksPerLocation),
                })}
                color="success"
                size="small"
              />
              {stats?.lastUpdate ? (
                <Chip
                  label={`${t("geographic.heatmap.updated")} ${new Date(stats.lastUpdate).toLocaleTimeString()}`}
                  variant="outlined"
                  size="small"
                  icon={<LineChart {...ICON_MD} />}
                />
              ) : null}
            </Stack>
          ) : null}

          {/* Controles de filtro */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t("geographic.heatmap.minClicksFilter", {
                  count: minClicksFilter,
                })}
              </Typography>
              <Slider
                value={minClicksFilter}
                onChange={(_, value) => {
                  setMinClicksFilter(value as number);
                }}
                min={1}
                max={Math.max(2, stats?.maxClicks || 2)}
                size="small"
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Tracked segmented control — the same primitive as the
                Analytics/Editar/QR view switcher on the link pages, and for
                the same reason: Ruas/Satélite/Escuro swaps the base layer
                the same markers are drawn on, it does not narrow the data.
                It briefly wore the trackless outlined grammar of the level-3
                filters, which reads as "this changes what you are counting"
                and put it in the same visual class as the continent filter
                sitting a few pixels away. A view switch belongs in a track:
                the pill that looks pressed in is the layer you are on. */}
            <ToggleButtonGroup
              size="small"
              exclusive
              value={mapStyle}
              aria-label={t("geographic.heatmap.styleGroupLabel")}
              sx={getSegmentedControlSx(theme)}
              onChange={(_, next: "street" | "satellite" | "dark" | null) => {
                if (next) {
                  setMapStyle(next);
                }
              }}
            >
              <ToggleButton value="street">
                {t("geographic.heatmap.styleStreet")}
              </ToggleButton>
              <ToggleButton value="satellite">
                {t("geographic.heatmap.styleSatellite")}
              </ToggleButton>
              <ToggleButton value="dark">
                {t("geographic.heatmap.styleDark")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Legenda de intensidade + contagem de localizações */}
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {t("geographic.heatmap.legendIntensity")}
            </Typography>
            {(
              [
                { key: "legendIntense", color: chartByType.heatmap.intense },
                { key: "legendHigh", color: chartByType.heatmap.high },
                { key: "legendMedium", color: chartByType.heatmap.medium },
                { key: "legendLow", color: chartByType.heatmap.low },
              ] as const
            ).map(({ key, color }) => (
              <Box
                key={key}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {t(`geographic.heatmap.${key}`)}
                </Typography>
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary">
              {t("geographic.heatmap.legendSizeNote")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              {t("geographic.heatmap.showingLocations", {
                shown: filteredData.length,
                total: data.length,
              })}
            </Typography>
          </Box>

          {error ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {t("geographic.heatmap.errorSample", { error })}
            </Alert>
          ) : null}

          {stats?.heatmapCapped ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {t("geographic.heatmap.cappedWarning")}
            </Alert>
          ) : null}
        </Box>
      ) : null}

      {/* Mapa — altura própria (não depende de flex-fill de um container
          ancestral, necessário para o Leaflet resolver sua altura). */}
      <Box
        sx={{
          position: "relative",
          height: isFullscreen ? "calc(100vh - 240px)" : height,
          borderRadius: bare ? 0 : `${radiusTokens.md}px`,
          overflow: "hidden",
          // Enlarge Leaflet's default 30px zoom controls for touch.
          "@media (pointer: coarse)": {
            "& .leaflet-control-zoom a": {
              width: 40,
              height: 40,
              lineHeight: "40px",
              fontSize: "1.25rem",
            },
          },
        }}
      >
        <MapContainer
          center={getMapCenter()}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl(mapStyle)}
          />

          {filteredData.map((point: HeatmapPoint, index: number) => {
            return (
              <CircleMarker
                key={`${point.lat}-${point.lng}-${index}-${point.clicks}`}
                center={[point.lat, point.lng]}
                radius={getMarkerRadius(point.clicks, stats?.maxClicks || 1)}
                fillColor={getMarkerColor(point.clicks, stats?.maxClicks || 1)}
                color={getMarkerColor(point.clicks, stats?.maxClicks || 1)}
                weight={3}
                opacity={1.0}
                fillOpacity={0.8}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                      gutterBottom
                    >
                      <MapPin size={16} strokeWidth={1.5} />
                      {point.city}, {point.country}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      gutterBottom
                      sx={{
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {t("geographic.heatmap.popupClicks", {
                        n: point.clicks.toLocaleString(i18n.language),
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("geographic.heatmap.popupCoords", {
                        lat: point.lat.toFixed(4),
                        lng: point.lng.toFixed(4),
                      })}
                    </Typography>
                    {point.state_name ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {t("geographic.heatmap.popupStateRegion", {
                          name: point.state_name,
                        })}
                      </Typography>
                    ) : null}
                    {point.iso_code ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {t("geographic.heatmap.popupCode", {
                          code: point.iso_code,
                          currency: point.currency,
                        })}
                      </Typography>
                    ) : null}
                    {point.continent ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {t("geographic.heatmap.popupContinent", {
                          name: point.continent,
                        })}
                      </Typography>
                    ) : null}
                    {point.last_click ? (
                      <Typography
                        variant="caption"
                        color="primary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        {t("geographic.heatmap.popupLastClick", {
                          time: new Date(point.last_click).toLocaleString(
                            i18n.language,
                          ),
                        })}
                      </Typography>
                    ) : null}
                  </Box>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </Box>
    </HeatmapShell>
  );
}
