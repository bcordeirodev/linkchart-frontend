/**
 * @fileoverview Tipos específicos para análise temporal
 * @author Link Charts Team
 * @version 1.0.0
 */

import type {
  HourlyData,
  DayOfWeekData,
  ISODateString,
  BaseDataProps,
  BaseTitleProps,
  BaseConfigProps,
} from "../core";

/**
 * Dados de padrões de hora local
 */
export interface HourlyPatternData {
  /** Hora do dia (0-23) */
  hour: number;
  /** Número de cliques */
  clicks: number;
  /** Tempo médio de resposta */
  avg_response_time: number;
  /** Visitantes únicos */
  unique_visitors: number;
}

/**
 * Dados de comparação fim de semana vs dias úteis
 */
export interface WeekendVsWeekdayData {
  weekend: {
    clicks: number;
    unique_visitors?: number;
    avg_response_time?: number;
    percentage?: number;
  };
  weekday: {
    clicks: number;
    unique_visitors?: number;
    avg_response_time?: number;
    percentage?: number;
  };
}

/**
 * Dados de análise de horário comercial
 */
export interface BusinessHoursData {
  business_hours: {
    clicks: number;
    percentage: number;
  };
  after_hours: {
    clicks: number;
    percentage: number;
  };
}

/**
 * Análise de picos temporais
 */
export interface PeakAnalysis {
  /** Hora de pico (0-23) */
  peak_hour: number | null;
  /** Dia de pico (1-7, numérico) */
  peak_day: number | null;
  /** Nome do dia de pico */
  peak_day_name?: string | null;
  /** Cliques na hora de pico */
  peak_hour_clicks: number;
  /** Cliques no dia de pico */
  peak_day_clicks: number;
}

/**
 * Análise por timezone
 */
export interface TimezoneAnalysis {
  /** Nome do timezone */
  name: string;
  /** Número de cliques */
  clicks: number;
  /** Percentual do total */
  percentage?: number;
}

/**
 * Dados avançados de análise temporal
 * ✨ NOVO: Unificação com endpoint /temporal
 */
export interface WeeklyTrendEntry {
  week: string;
  clicks: number;
}

export interface MonthlyTrendEntry {
  month: string;
  clicks: number;
}

export interface HeatmapSeriesEntry {
  name: string;
  data: { x: string; y: number }[];
}

/** A single day entry in the daily click timeline. */
export interface DailyTimelineEntry {
  date: string;
  clicks: number;
  unique_visitors: number;
}

/**
 * Wraps the daily timeline array with cap metadata.
 *
 * When `capped` is `true` the backend returned only the last 90 days.
 * `earliest_available_at` is the actual earliest click date (YYYY-MM-DD)
 * and is `null` when there are no clicks at all.
 */
export interface DailyTimeline {
  /** Day-by-day click/visitor entries. */
  data: DailyTimelineEntry[];
  /** `true` when the 90-day cap was applied (no explicit `dateFrom` filter). */
  capped: boolean;
  /** ISO date string of the earliest available click, or `null`. */
  earliest_available_at: string | null;
}

/** Device usage aggregated by time-of-day period. Period key is one of `dawn | morning | afternoon | evening`. */
export interface DeviceByPeriodEntry {
  /** Period identifier key used for i18n lookup. */
  period: string;
  desktop: number;
  mobile: number;
  tablet: number;
}

/** A single velocity bucket returned by `getClickVelocityDistribution`. */
export interface VelocityBucket {
  /** Machine-readable bucket key (instant | very_fast | fast | moderate | slow). */
  bucket: string;
  /** i18n key path relative to the `temporal` namespace. */
  label_key: string;
  /** Lower bound in seconds (inclusive). */
  min_sec: number;
  /** Upper bound in seconds (exclusive), or `null` for the open-ended 'slow' bucket. */
  max_sec: number | null;
  /** Number of clicks in this bucket. */
  count: number;
}

/** Click velocity distribution returned by the temporal endpoint. */
export interface ClickVelocityData {
  velocity_distribution: VelocityBucket[];
  /**
   * `true` when ≥50 % of clicks have non-null `seconds_since_last_click`,
   * indicating Phase 2 tracking covers the majority of the data.
   */
  phase2_available: boolean;
  /** Count of clicks with non-null velocity data. */
  total_with_data: number;
}

export interface AdvancedTemporalData {
  weekly_trends: WeeklyTrendEntry[];
  monthly_trends: MonthlyTrendEntry[];
  peak_analysis: PeakAnalysis;
  timezone_analysis: TimezoneAnalysis[];
  heatmap_data?: HeatmapSeriesEntry[];
  /** Daily timeline with cap metadata. */
  daily_timeline?: DailyTimeline;
  device_by_period?: DeviceByPeriodEntry[];
}

/**
 * Dados completos de análise temporal - UNIFICADO
 * ✨ Agora inclui campo 'advanced' opcional com dados enriquecidos
 */
export interface TemporalData {
  // Dados base (compatibilidade)
  /** Cliques por hora do dia (legacy) */
  clicks_by_hour: HourlyData[];
  /** Cliques por dia da semana (legacy) */
  clicks_by_day_of_week: DayOfWeekData[];
  /** Cliques por data (opcional) */
  clicks_by_date?: DailyData[];
  /** Cliques por mês (opcional) */
  clicks_by_month?: MonthlyData[];

  // Análises contextuais
  /** Padrões de hora local com timezone */
  hourly_patterns_local?: HourlyPatternData[];
  /** Comparação fim de semana vs dias úteis */
  weekend_vs_weekday?: WeekendVsWeekdayData;
  /** Análise de horário comercial */
  business_hours_analysis?: BusinessHoursData;

  // Dados avançados (NOVO) ✨
  /** Dados avançados de análise temporal (trends, peaks, timezones) */
  advanced?: AdvancedTemporalData;

  /** Holiday impact analysis (Phase 2) */
  holiday_impact?: {
    holiday_clicks: number;
    non_holiday_clicks: number;
    holiday_percentage: number;
    top_holidays: Array<{
      holiday: string;
      clicks: number;
      percentage: number;
    }>;
  };
  /** Seasonal distribution by hemisphere (Phase 2) */
  seasonal_distribution?: Array<{
    season: string;
    clicks: number;
    percentage: number;
  }>;
  /**
   * Viral rank per day — peak rank and click count.
   * Days where all clicks have NULL viral_rank (pre-Phase 2) are mapped to 'unranked'.
   */
  viral_rank_by_day?: Array<{
    date: string;
    peak_rank: "cold" | "warming" | "trending" | "viral" | "unranked";
    click_count: number;
  }>;
  /** Click velocity distribution (seconds between consecutive clicks). */
  click_velocity?: ClickVelocityData;
}

/**
 * Dados de cliques por data específica
 */
export interface DailyData {
  /** Data no formato YYYY-MM-DD */
  date: string;
  /** Número de cliques nesta data */
  clicks: number;
  /** Dia da semana (0-6) */
  day_of_week: number;
  /** Nome do dia da semana */
  day_name: string;
}

/**
 * Dados de cliques por mês
 */
export interface MonthlyData {
  /** Ano */
  year: number;
  /** Mês (1-12) */
  month: number;
  /** Nome do mês */
  month_name: string;
  /** Número de cliques no mês */
  clicks: number;
  /** Número de dias com cliques */
  active_days: number;
}

/**
 * Estatísticas temporais agregadas
 */
export interface TemporalStats {
  /** Hora de pico */
  peak_hour: number;
  /** Dia da semana de pico */
  peak_day: number;
  /** Período mais ativo */
  most_active_period: "morning" | "afternoon" | "evening" | "night";
  /** Padrão semanal */
  weekly_pattern: "weekdays" | "weekends" | "balanced";
  /** Consistência temporal (0-100) */
  temporal_consistency: number;
  /** Sazonalidade detectada */
  seasonality: boolean;
}

/**
 * Props para componente de análise temporal
 */
export interface TemporalAnalysisProps
  extends BaseDataProps<TemporalData>,
    BaseTitleProps {
  /** Dados temporais */
  data?: TemporalData;
  /** Mostrar gráfico por horas */
  showHourlyChart?: boolean;
  /** Mostrar gráfico semanal */
  showWeeklyChart?: boolean;
  /** Mostrar insights temporais */
  showInsights?: boolean;
}

/**
 * Props para gráficos temporais
 */
export interface TemporalChartProps extends BaseConfigProps {
  /** Dados por hora */
  hourlyData?: HourlyData[];
  /** Dados semanais */
  weeklyData?: DayOfWeekData[];
  /** Dados diários */
  dailyData?: DailyData[];
  /** Tipo de gráfico */
  chartType?: "line" | "bar" | "area" | "heatmap";
  /** Mostrar tendência */
  showTrend?: boolean;
  /** Mostrar média */
  showAverage?: boolean;
}

/**
 * Props para insights temporais
 */
export interface TemporalInsightsProps extends BaseTitleProps {
  /** Dados por hora */
  hourlyData: HourlyData[];
  /** Dados semanais */
  weeklyData: DayOfWeekData[];
  /** Mostrar insights avançados */
  showAdvancedInsights?: boolean;
  /** Mostrar recomendações */
  showRecommendations?: boolean;
}

/**
 * Configurações de período temporal
 */
export interface TemporalPeriodConfig {
  /** Tipo de período */
  type: "hour" | "day" | "week" | "month" | "year";
  /** Data de início */
  start?: ISODateString;
  /** Data de fim */
  end?: ISODateString;
  /** Número de períodos para trás */
  lookback?: number;
  /** Incluir período atual */
  includeCurrent?: boolean;
}

/**
 * Opções para análise temporal
 */
export interface UseTemporalDataOptions {
  /** ID do link específico */
  linkId?: string;
  /** Modo global */

  /** Configuração do período */
  period?: TemporalPeriodConfig;
  /** Incluir dados diários */
  includeDailyData?: boolean;
  /** Incluir dados mensais */
  includeMonthlyData?: boolean;
  /** Fuso horário */
  timezone?: string;
}

/**
 * Retorno do hook de dados temporais
 */
export interface UseTemporalDataReturn {
  /** Dados temporais */
  data: TemporalData | null;
  /** Estatísticas agregadas */
  stats: TemporalStats | null;
  /** Estado de carregamento */
  loading: boolean;
  /** Mensagem de erro */
  error: string | null;
  /** Função para recarregar */
  refresh: () => void;
  /** Alterar período */
  changePeriod: (config: TemporalPeriodConfig) => void;
}

/**
 * Padrões temporais detectados
 */
export interface TemporalPattern {
  /** Tipo do padrão */
  type: "peak" | "valley" | "trend" | "cycle";
  /** Descrição do padrão */
  description: string;
  /** Confiança da detecção (0-100) */
  confidence: number;
  /** Período do padrão */
  period?: string;
  /** Recomendação baseada no padrão */
  recommendation?: string;
}
