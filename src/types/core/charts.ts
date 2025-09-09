/**
 * @fileoverview Tipos relacionados a gráficos e visualizações
 * @author Link Chart Team
 * @version 1.0.0
 */

/**
 * Tipos de gráficos suportados
 */
export type ChartType =
	| 'line'
	| 'area'
	| 'bar'
	| 'column'
	| 'pie'
	| 'donut'
	| 'scatter'
	| 'bubble'
	| 'heatmap'
	| 'radar'
	| 'treemap';

/**
 * Ponto de dados em um gráfico
 */
export interface ChartPoint {
	/** Valor do eixo X */
	x: string | number | Date;
	/** Valor do eixo Y */
	y: number;
	/** Label opcional */
	label?: string;
	/** Cor específica do ponto */
	color?: string;
	/** Dados adicionais */
	meta?: Record<string, unknown>;
}

/**
 * Série de dados para gráficos
 */
export interface ChartSeries {
	/** Nome da série */
	name: string;
	/** Dados da série */
	data: ChartPoint[];
	/** Cor da série */
	color?: string;
	/** Tipo específico da série */
	type?: ChartType;
	/** Série visível */
	visible?: boolean;
}

/**
 * Configurações de um gráfico (compatível com ApexCharts)
 */
export interface ChartOptions extends Record<string, unknown> {
	/** Título do gráfico */
	title?: string;
	/** Subtítulo */
	subtitle?: string;
	/** Altura do gráfico */
	height?: number;
	/** Largura do gráfico */
	width?: number;
	/** Mostrar legenda */
	showLegend?: boolean;
	/** Mostrar grid */
	showGrid?: boolean;
	/** Mostrar tooltips */
	showTooltip?: boolean;
	/** Configurações dos eixos */
	axes?: {
		x?: AxisConfig;
		y?: AxisConfig;
	};
	/** Configurações específicas do ApexCharts */
	chart?: Record<string, unknown>;
	/** Configurações do eixo X (ApexCharts) */
	xaxis?: Record<string, unknown>;
	/** Configurações do eixo Y (ApexCharts) */
	yaxis?: Record<string, unknown>;
	/** Cores personalizadas */
	colors?: string[];
	/** Configurações de animação */
	animation?: {
		enabled: boolean;
		duration: number;
		easing: string;
	};
	/** Configurações responsivas (ApexCharts) */
	responsive?: unknown[];
}

/**
 * Configuração de um eixo
 */
export interface AxisConfig {
	/** Título do eixo */
	title?: string;
	/** Mostrar labels */
	showLabels?: boolean;
	/** Formato dos labels */
	labelFormat?: string;
	/** Valor mínimo */
	min?: number;
	/** Valor máximo */
	max?: number;
	/** Tipo de escala */
	type?: 'linear' | 'logarithmic' | 'datetime' | 'category';
}

/**
 * Dados completos para um gráfico
 */
export interface ChartData {
	/** Séries de dados */
	series: ChartSeries[];
	/** Configurações do gráfico */
	options?: ChartOptions;
	/** Tipo padrão do gráfico */
	type: ChartType;
}

/**
 * Props base para componentes de gráfico
 */
export interface BaseChartProps {
	/** Dados do gráfico */
	data: ChartData;
	/** Altura personalizada */
	height?: number;
	/** Largura personalizada */
	width?: number;
	/** Classe CSS adicional */
	className?: string;
	/** Callback quando o gráfico é clicado */
	onChartClick?: (point: ChartPoint, series: ChartSeries) => void;
}
