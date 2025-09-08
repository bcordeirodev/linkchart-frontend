/**
 * @fileoverview Tipos específicos para análise geográfica
 * @author Link Chart Team
 * @version 1.0.0
 */

import type {
    CountryData,
    StateData,
    CityData,
    HeatmapPoint,
    BaseDataProps,
    BaseTitleProps,
    BaseConfigProps
} from '../core';

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
    /** Nome do continente */
    continent: string;
    /** Código do continente */
    continent_code: string;
    /** Número total de cliques */
    clicks: number;
    /** Percentual em relação ao total */
    percentage?: number;
    /** Países inclusos */
    countries_count: number;
}

/**
 * Estatísticas agregadas geográficas
 */
export interface GeographicStats {
    /** Total de países alcançados */
    total_countries: number;
    /** Total de estados alcançados */
    total_states: number;
    /** Total de cidades alcançadas */
    total_cities: number;
    /** Total de continentes alcançados */
    total_continents: number;
    /** País com mais cliques */
    top_country: string;
    /** Concentração geográfica (0-100) */
    geographic_concentration: number;
    /** Diversidade geográfica (0-100) */
    geographic_diversity: number;
}

/**
 * Props para componente de análise geográfica
 */
export interface GeographicAnalysisProps extends BaseDataProps<GeographicData>, BaseTitleProps {
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
    chartType?: 'bar' | 'pie' | 'map' | 'treemap';
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
    variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Configurações do mapa de calor
 */
export interface HeatmapConfig {
    /** Zoom inicial do mapa */
    initialZoom?: number;
    /** Centro inicial do mapa */
    initialCenter?: [number, number];
    /** Raio dos pontos de calor */
    radius?: number;
    /** Intensidade máxima */
    maxIntensity?: number;
    /** Gradiente de cores */
    gradient?: Record<string, string>;
    /** Mostrar controles do mapa */
    showControls?: boolean;
}

/**
 * Opções para análise geográfica
 */
export interface UseGeographicDataOptions {
    /** ID do link específico */
    linkId?: string;
    /** Modo global */
    globalMode?: boolean;
    /** Incluir dados de heatmap */
    includeHeatmap?: boolean;
    /** Incluir dados de continentes */
    includeContinents?: boolean;
    /** Limite de resultados por categoria */
    limit?: number;
}

/**
 * Retorno do hook de dados geográficos
 */
export interface UseGeographicDataReturn {
    /** Dados geográficos */
    data: GeographicData | null;
    /** Estatísticas agregadas */
    stats: GeographicStats | null;
    /** Estado de carregamento */
    loading: boolean;
    /** Mensagem de erro */
    error: string | null;
    /** Função para recarregar */
    refresh: () => void;
}
