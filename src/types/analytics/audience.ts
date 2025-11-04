/**
 * @fileoverview Tipos específicos para análise de audiência
 * @author Link Chart Team
 * @version 1.0.0
 */

import type { DeviceData, ISODateString, Percentage, BaseDataProps, BaseTitleProps, BaseConfigProps } from '../core';

/**
 * Dados de navegador com informações de cliques
 */
export interface BrowserData {
	/** Nome do navegador (Chrome, Firefox, Safari, etc.) */
	browser: string;
	/** Número total de cliques deste navegador */
	clicks: number;
	/** Versão do navegador (opcional) */
	version?: string;
	/** Percentual em relação ao total (opcional) */
	percentage?: Percentage;
}

/**
 * Dados de sistema operacional
 */
export interface OSData {
	/** Nome do sistema operacional (Windows, macOS, Linux, etc.) */
	os: string;
	/** Número total de cliques deste OS */
	clicks: number;
	/** Versão do OS (opcional) */
	version?: string;
	/** Percentual em relação ao total (opcional) */
	percentage?: Percentage;
}

/**
 * Dados de referrer/origem do tráfego
 */
export interface ReferrerData {
	/** Domínio ou fonte do referrer */
	referrer: string;
	/** Número total de cliques desta fonte */
	clicks: number;
	/** Categoria do referrer */
	category?: 'social' | 'search' | 'direct' | 'email' | 'other';
	/** Percentual em relação ao total (opcional) */
	percentage?: Percentage;
}

/**
 * Dados de performance por dispositivo
 */
export interface DevicePerformanceData {
	/** Tipo de dispositivo */
	device: string;
	/** Tempo médio de resposta em ms */
	avg_response_time: number;
	/** Tempo mínimo de resposta em ms */
	min_response_time: number;
	/** Tempo máximo de resposta em ms */
	max_response_time: number;
	/** Total de cliques */
	total_clicks: number;
}

/**
 * Dados de distribuição de idiomas
 */
export interface LanguageData {
	/** Idioma (pt-BR, en, es, etc.) */
	language: string;
	/** Número total de cliques */
	clicks: number;
	/** Percentual em relação ao total */
	percentage: number;
}

/**
 * Dados completos de análise de audiência - ENHANCED
 */
export interface AudienceData {
	/** Breakdown por dispositivos (legacy) */
	device_breakdown: DeviceData[];
	/** Breakdown por navegadores (legacy) */
	browser_breakdown?: BrowserData[];
	/** Breakdown por sistemas operacionais (legacy) */
	os_breakdown?: OSData[];
	/** Breakdown por referrers (opcional) */
	referrer_breakdown?: ReferrerData[];
	/** Estatísticas agregadas (opcional) */
	stats?: AudienceStats;

	// NEW: Enhanced analytics data
	/** Distribuição detalhada de browsers com versões */
	browsers?: BrowserData[];
	/** Distribuição detalhada de sistemas operacionais com versões */
	operating_systems?: OSData[];
	/** Performance por tipo de dispositivo */
	device_performance?: DevicePerformanceData[];
	/** Distribuição de idiomas */
	languages?: LanguageData[];
}

/**
 * Estatísticas agregadas de audiência
 */
export interface AudienceStats {
	/** Total de cliques únicos */
	totalClicks: number;
	/** Total de visitantes únicos */
	uniqueVisitors: number;
	/** Dispositivo mais usado */
	primaryDevice: string;
	/** Navegador mais usado */
	primaryBrowser: string;
	/** Taxa de novos vs. retornantes */
	newVisitorRate: Percentage;
	/** Taxa de rejeição */
	bounceRate: Percentage;
	/** Tempo médio na página (em segundos) */
	avgSessionDuration: number;
	/** Timestamp da última atualização */
	lastUpdate: ISODateString;
}

/**
 * Props para componente de análise de audiência
 */
export interface AudienceAnalysisProps extends BaseDataProps, BaseTitleProps {
	/** Dados de analytics (pode ser de diferentes tipos) */
	data?: unknown;
	/** ID do link específico (opcional) */
	linkId?: string;
	/** Modo global - todos os links ativos (padrão: false) */
}

/**
 * Props para gráficos de audiência
 */
export interface AudienceChartProps extends BaseConfigProps {
	/** Dados de dispositivos */
	deviceBreakdown: DeviceData[];
	/** Dados de navegadores (opcional) */
	browserBreakdown?: BrowserData[];
	/** Dados de sistemas operacionais (opcional) */
	osBreakdown?: OSData[];
	/** Total de cliques */
	totalClicks: number;
	/** Mostrar gráfico de pizza (padrão: true) */
	showPieChart?: boolean;
	/** Mostrar gráfico de barras (padrão: true) */
	showBarChart?: boolean;
}

/**
 * Props para insights de audiência
 */
export interface AudienceInsightsProps extends BaseTitleProps {
	/** Dados de dispositivos */
	deviceBreakdown: DeviceData[];
	/** Dados de navegadores (opcional) */
	browserBreakdown?: BrowserData[];
	/** Total de cliques */
	totalClicks: number;
	/** Mostrar insights avançados (padrão: true) */
	showAdvancedInsights?: boolean;
}

/**
 * Props para métricas de audiência
 */
export interface AudienceMetricsProps extends BaseDataProps, BaseTitleProps {
	/** Dados de audiência ou analytics completos */
	data: unknown;
	/** Variante do layout (padrão: 'default') */
	variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Opções para hook de dados de audiência
 */
export interface UseAudienceDataOptions {
	/** ID do link específico */
	linkId: string;
	/** Habilitar atualizações em tempo real (padrão: true) */
	enableRealtime?: boolean;
	/** Intervalo de atualização em milissegundos (padrão: 60000) */
	refreshInterval?: number;
	/** Incluir dados detalhados de browser/OS (padrão: false) */
	includeDetails?: boolean;
}

/**
 * Retorno do hook de dados de audiência
 */
export interface UseAudienceDataReturn {
	/** Dados de audiência */
	data: AudienceData | null;
	/** Estatísticas agregadas */
	stats: AudienceStats | null;
	/** Estado de carregamento */
	loading: boolean;
	/** Mensagem de erro (se houver) */
	error: string | null;
	/** Timestamp da última atualização */
	lastUpdate: Date | null;
	/** Função para atualizar manualmente os dados */
	refresh: () => void;
	/** Indica se está em modo tempo real */
	isRealtime: boolean;
}

/**
 * Resposta da API para endpoints de audiência
 */
export interface AudienceApiResponse {
	/** Indica se a requisição foi bem-sucedida */
	success: boolean;
	/** Dados de audiência */
	data: AudienceData;
	/** Metadados adicionais (opcional) */
	metadata?: {
		total_clicks: number;
		unique_visitors: number;
		primary_device: string;
		primary_browser: string;
		last_updated: ISODateString;
	};
	/** Timestamp da resposta (opcional) */
	timestamp?: ISODateString;
	/** Mensagem de erro (opcional) */
	error?: string;
}

/**
 * Segmentação de audiência
 */
export interface AudienceSegment {
	/** ID único do segmento */
	id: string;
	/** Nome do segmento */
	name: string;
	/** Descrição do segmento */
	description: string;
	/** Critérios de segmentação */
	criteria: {
		/** Dispositivos inclusos */
		devices?: string[];
		/** Navegadores inclusos */
		browsers?: string[];
		/** Sistemas operacionais inclusos */
		operating_systems?: string[];
		/** Fontes de tráfego inclusas */
		referrers?: string[];
	};
	/** Tamanho do segmento */
	size: number;
	/** Percentual da audiência total */
	percentage: Percentage;
}
