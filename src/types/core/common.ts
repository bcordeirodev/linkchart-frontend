/**
 * @fileoverview Tipos comuns compartilhados em toda a aplicação
 * @author Link Chart Team
 * @version 1.0.0
 */

/**
 * Identificador único genérico
 */
export type ID = string | number;

/**
 * Timestamp ISO string
 */
export type ISODateString = string;

/**
 * Percentual (0-100)
 */
export type Percentage = number;

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = unknown> {
	/** Indica se a operação foi bem-sucedida */
	success: boolean;
	/** Dados da resposta */
	data?: T;
	/** Mensagem de erro ou informação */
	message?: string;
	/** Código de status HTTP */
	status?: number;
	/** Timestamp da resposta */
	timestamp?: ISODateString;
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
	/** Página atual */
	current_page: number;
	/** Total de páginas */
	last_page: number;
	/** Itens por página */
	per_page: number;
	/** Total de itens */
	total: number;
	/** Próxima página (se existir) */
	next_page_url?: string;
	/** Página anterior (se existir) */
	prev_page_url?: string;
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	/** Metadados de paginação */
	meta: PaginationMeta;
}

/**
 * Estados de carregamento comuns
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Prioridades genéricas
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Tendências de dados
 */
export type Trend = 'up' | 'down' | 'stable';

/**
 * Período de tempo comum
 */
export interface TimePeriod {
	/** Data de início */
	start: ISODateString;
	/** Data de fim */
	end: ISODateString;
	/** Label do período */
	label?: string;
}

/**
 * Configurações de filtro genérico
 */
export interface FilterConfig {
	/** Campo a ser filtrado */
	field: string;
	/** Operador de comparação */
	operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
	/** Valor do filtro */
	value: unknown;
}

/**
 * Configurações de ordenação
 */
export interface SortConfig {
	/** Campo para ordenação */
	field: string;
	/** Direção da ordenação */
	direction: 'asc' | 'desc';
}

/**
 * Props base para componentes de dados
 */
export interface BaseDataProps<T = unknown> {
	/** Dados do componente */
	data?: T | null;
	/** Estado de carregamento */
	loading?: boolean;
	/** Mensagem de erro */
	error?: string | null;
	/** Função para recarregar dados */
	onRefresh?: () => void;
}

/**
 * Props base para componentes com título
 */
export interface BaseTitleProps {
	/** Mostrar título */
	showTitle?: boolean;
	/** Título customizado */
	title?: string;
	/** Subtítulo */
	subtitle?: string;
}

/**
 * Props base para componentes configuráveis
 */
export interface BaseConfigProps {
	/** Variante do componente */
	variant?: string;
	/** Altura customizada */
	height?: number;
	/** Largura customizada */
	width?: number;
	/** Classe CSS adicional */
	className?: string;
}
