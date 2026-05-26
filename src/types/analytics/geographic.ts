/**
 * @fileoverview Tipos específicos para análise geográfica
 * @author Link Charts Team
 * @version 1.0.0
 */

import type {
  CountryData,
  StateData,
  CityData,
  HeatmapPoint,
  BaseDataProps,
  BaseTitleProps,
  BaseConfigProps,
} from "../core";

/**
 * Dados completos de análise geográfica
 */
export interface GeographicData {
  /** Dados do mapa de calor */
  heatmap_data: HeatmapPoint[];
  /** Top países por cliques */
  top_countries: CountryData[];
  /** Top estados/regiões por cliques */
  top_states: StateData[];
  /** Top cidades por cliques */
  top_cities: CityData[];
  /** Dados por continente (opcional) */
  continents?: ContinentData[];
}

/**
 * Dados de cliques por continente.
 *
 * The backend returns the raw 2-letter ISO code in both `continent` (legacy key
 * kept for backward-compat) and `continent_code`.  `continent_name` is no longer
 * emitted by the backend — continent labels are resolved on the frontend via the
 * `geographic.continents.<CODE>` i18n keys so they reflect the user's active locale.
 */
export interface ContinentData {
  /** Código ISO do continente (ex: "SA", "NA", "EU"). Primary lookup key. */
  continent_code: string;
  /**
   * Legacy alias for `continent_code` — the backend still emits this key for
   * backward compatibility with code that reads `c.continent`.
   */
  continent: string;
  /**
   * @deprecated The backend no longer emits `continent_name`.
   * Use `t(\`geographic.continents.${c.continent_code}\`)` instead.
   */
  continent_name?: string;
  /** Número total de cliques */
  clicks: number;
  /** Percentual em relação ao total */
  percentage?: number;
}

/**
 * Metadados retornados junto com /api/analytics/link/{id}/geographic
 */
export interface GeographicMeta {
  total_clicks: number;
  unique_countries: number;
  unique_states: number;
  unique_cities: number;
  max_clicks: number;
  /**
   * Number of distinct location groups returned in `heatmap_data`.
   * Capped at 500 — check `heatmap_capped` to know if more groups exist.
   */
  total_locations: number;
  /**
   * True when the heatmap reached the 500-row server-side cap.
   * When true, some locations are omitted from the heatmap data.
   */
  heatmap_capped: boolean;
  /**
   * Total distinct location groups available before the 500-row cap was applied.
   * Equals `total_locations` when `heatmap_capped` is false.
   */
  total_locations_available: number;
  /**
   * ISO 8601 timestamp of the most recent click matching the active filters.
   * `null` when no clicks exist for the current filter combination.
   */
  last_updated: string | null;
  link_info: {
    id: number;
    title: string;
    short_url: string;
    is_active: boolean;
  };
}

/**
 * Envelope completo da resposta /geographic.
 * Espelha exatamente { data, meta } retornado pelo backend.
 */
export interface GeographicResponse {
  data: GeographicData;
  meta: GeographicMeta;
}

/**
 * Props para componente de análise geográfica
 */
export interface GeographicAnalysisProps
  extends BaseDataProps<GeographicData>,
    BaseTitleProps {
  /** Dados geográficos */
  data?: GeographicData;
  /** Mostrar mapa de calor */
  showHeatmap?: boolean;
  /** Mostrar gráficos de distribuição */
  showCharts?: boolean;
  /** Mostrar insights geográficos */
  showInsights?: boolean;
}

/**
 * Props para gráficos geográficos
 */
export interface GeographicChartProps extends BaseConfigProps {
  /** Dados de países */
  countries: CountryData[];
  /** Dados de estados */
  states: StateData[];
  /** Dados de cidades */
  cities: CityData[];
  /** Total de cliques para cálculo de percentuais */
  totalClicks: number;
  /** Tipo de gráfico */
  chartType?: "bar" | "pie" | "map" | "treemap";
  /** Mostrar apenas top N itens */
  topN?: number;
}

/**
 * Props para insights geográficos
 */
export interface GeographicInsightsProps extends BaseTitleProps {
  /** Dados do heatmap */
  data: HeatmapPoint[];
  /** Dados de países */
  countries: CountryData[];
  /** Dados de estados */
  states: StateData[];
  /** Dados de cidades */
  cities: CityData[];
  /** Mostrar insights avançados */
  showAdvancedInsights?: boolean;
}

/**
 * Props para métricas geográficas
 */
export interface GeographicMetricsProps extends BaseDataProps, BaseTitleProps {
  /** Dados geográficos ou analytics completos */
  data: GeographicData | { geographic: GeographicData };
  /** Variante do layout */
  variant?: "default" | "compact" | "detailed";
}
