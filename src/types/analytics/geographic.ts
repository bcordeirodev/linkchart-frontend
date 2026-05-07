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
 * Dados de cliques por continente
 */
export interface ContinentData {
  /** Código do continente (ex: "SA", "NA") */
  continent: string;
  /** Nome completo do continente */
  continent_name: string;
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
  total_locations: number;
  last_updated: string;
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

