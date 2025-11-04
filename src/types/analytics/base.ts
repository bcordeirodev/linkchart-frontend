/**
 * @fileoverview Tipos base para o módulo de Analytics
 * @author Link Chart Team
 * @version 1.0.0
 */

import type {
	LinkInfo,
	OverviewMetrics,
	BusinessInsight,
	BaseDataProps,
	BaseTitleProps,
	BaseConfigProps
} from '../core';
import type { AudienceData } from './audience';
import type { GeographicData } from './geographic';
import type { TemporalData } from './temporal';

/**
 * Dados completos de analytics (estrutura principal)
 */
export interface AnalyticsData {
	/** Indica se há dados disponíveis */
	has_data?: boolean;
	/** Informações do link (para analytics específicos) */
	link_info?: LinkInfo;
	/** Métricas de overview */
	overview: OverviewMetrics;
	/** Dados geográficos */
	geographic: GeographicData;
	/** Dados temporais */
	temporal: TemporalData;
	/** Dados de audiência */
	audience: AudienceData;
	/** Insights de negócio */
	insights: BusinessInsight[];
}

/**
 * Props para o componente principal Analytics
 */
export interface AnalyticsProps extends BaseDataProps<AnalyticsData>, BaseTitleProps {
	/** ID do link específico (opcional - se não fornecido, modo global) */
	linkId?: string;
	/** Mostrar header do componente */
	showHeader?: boolean;
	/** Mostrar sistema de tabs */
	showTabs?: boolean;
	/** Dados de links para contexto adicional */
	linksData?: LinkInfo[];
	/** Mostrar tab de dashboard */
	showDashboardTab?: boolean;
	/** Tab ativa por padrão */
	defaultTab?: number;
}

/**
 * Props para componentes de métricas
 */
export interface MetricsProps extends BaseDataProps<AnalyticsData>, BaseTitleProps, BaseConfigProps {
	/** Dados de resumo específicos */
	summary?: OverviewMetrics;
	/** Mostrar apenas métricas essenciais */
	compact?: boolean;
}

/**
 * Props para componentes de gráficos
 */
export interface ChartsProps extends BaseDataProps<AnalyticsData>, BaseConfigProps {
	/** Variante do gráfico */
	variant?: 'analytics' | 'dashboard' | 'full' | 'compact';
	/** Mostrar todos os gráficos disponíveis */
	showAllCharts?: boolean;
	/** Configurações específicas de cores */
	colorScheme?: string[];
}

/**
 * Configuração de uma tab de analytics
 */
export interface AnalyticsTab {
	/** ID único da tab */
	id: string;
	/** Label exibido */
	label: string;
	/** Ícone da tab (emoji ou componente) */
	icon?: string;
	/** Descrição da tab */
	description?: string;
	/** Tab desabilitada */
	disabled?: boolean;
	/** Índice da tab */
	index: number;
}

/**
 * Opções para hooks de analytics
 */
export interface UseAnalyticsOptions {
	/** ID do link específico */
	linkId?: string;
	/** Modo global (todos os links) */

	/** Habilitar atualizações em tempo real */
	enableRealtime?: boolean;
	/** Intervalo de atualização (ms) */
	refreshInterval?: number;
	/** Incluir dados detalhados */
	includeDetails?: boolean;
	/** Período de dados */
	period?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

/**
 * Retorno padrão de hooks de analytics
 */
export interface UseAnalyticsReturn<T = AnalyticsData> {
	/** Dados de analytics */
	data: T | null;
	/** Estado de carregamento */
	loading: boolean;
	/** Mensagem de erro */
	error: string | null;
	/** Timestamp da última atualização */
	lastUpdate: Date | null;
	/** Função para recarregar dados */
	refresh: () => void;
	/** Indica se está em modo tempo real */
	isRealtime: boolean;
}

/**
 * Resposta da API de analytics
 */
export interface AnalyticsApiResponse {
	/** Sucesso da operação */
	success: boolean;
	/** Dados de analytics */
	data: AnalyticsData;
	/** Metadados adicionais */
	metadata?: {
		/** Período dos dados */
		period: string;
		/** Total de registros */
		total_records: number;
		/** Última atualização */
		last_updated: string;
		/** Tempo de processamento */
		processing_time_ms?: number;
	};
	/** Timestamp da resposta */
	timestamp?: string;
}
