/**
 * @fileoverview Tipos específicos para análise temporal
 * @author Link Chart Team
 * @version 1.0.0
 */

import type { HourlyData, DayOfWeekData, ISODateString, BaseDataProps, BaseTitleProps, BaseConfigProps } from '../core';

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
		unique_visitors: number;
		avg_response_time: number;
		percentage?: number;
	};
	weekday: {
		clicks: number;
		unique_visitors: number;
		avg_response_time: number;
		percentage?: number;
	};
}

/**
 * Dados de análise de horário comercial
 */
export interface BusinessHoursData {
	business_hours: {
		clicks: number;
		unique_visitors: number;
		avg_response_time: number;
		avg_session_depth: number;
		time_range: string;
	};
	non_business_hours: {
		clicks: number;
		unique_visitors: number;
		avg_response_time: number;
		avg_session_depth: number;
		time_range: string;
	};
}

/**
 * Dados completos de análise temporal - ENHANCED
 */
export interface TemporalData {
	/** Cliques por hora do dia (legacy) */
	clicks_by_hour: HourlyData[];
	/** Cliques por dia da semana (legacy) */
	clicks_by_day_of_week: DayOfWeekData[];
	/** Cliques por data (opcional) */
	clicks_by_date?: DailyData[];
	/** Cliques por mês (opcional) */
	clicks_by_month?: MonthlyData[];

	// NEW: Enhanced temporal analytics
	/** Padrões de hora local com timezone */
	hourly_patterns_local?: HourlyPatternData[];
	/** Comparação fim de semana vs dias úteis */
	weekend_vs_weekday?: WeekendVsWeekdayData;
	/** Análise de horário comercial */
	business_hours_analysis?: BusinessHoursData;
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
	most_active_period: 'morning' | 'afternoon' | 'evening' | 'night';
	/** Padrão semanal */
	weekly_pattern: 'weekdays' | 'weekends' | 'balanced';
	/** Consistência temporal (0-100) */
	temporal_consistency: number;
	/** Sazonalidade detectada */
	seasonality: boolean;
}

/**
 * Props para componente de análise temporal
 */
export interface TemporalAnalysisProps extends BaseDataProps<TemporalData>, BaseTitleProps {
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
	chartType?: 'line' | 'bar' | 'area' | 'heatmap';
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
	type: 'hour' | 'day' | 'week' | 'month' | 'year';
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
	globalMode?: boolean;
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
	type: 'peak' | 'valley' | 'trend' | 'cycle';
	/** Descrição do padrão */
	description: string;
	/** Confiança da detecção (0-100) */
	confidence: number;
	/** Período do padrão */
	period?: string;
	/** Recomendação baseada no padrão */
	recommendation?: string;
}
