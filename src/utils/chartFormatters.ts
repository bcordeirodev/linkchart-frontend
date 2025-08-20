import { ChartOptions, ChartSeries } from '@/types/analytics';

/**
 * Utilitários para formatação de dados de gráficos
 * Centraliza a lógica de formatação para evitar duplicação
 */

/**
 * Configuração de tooltip adaptável ao tema
 */
const getTooltipConfig = (isDark = false) => ({
	theme: isDark ? 'dark' : 'light',
	style: {
		fontSize: '14px',
		fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
	},
	fillSeriesColor: false,
	x: {
		show: true
	},
	y: {
		formatter: (value: number) => `${value.toLocaleString()} cliques`
	},
	marker: {
		show: true
	}
});

/**
 * Configuração de textos adaptável ao tema
 */
const getTextConfig = (isDark = false) => {
	const textColor = isDark ? '#ffffff' : '#000000';
	const gridColor = isDark ? '#374151' : '#e5e7eb';

	return {
		xaxis: {
			labels: {
				style: {
					colors: textColor,
					fontSize: '12px',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
				}
			},
			axisBorder: {
				color: gridColor
			},
			axisTicks: {
				color: gridColor
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: textColor,
					fontSize: '12px',
					fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
				}
			}
		},
		grid: {
			borderColor: gridColor,
			strokeDashArray: 3
		}
	};
};

/**
 * Formata dados para gráfico de área
 */
export const formatAreaChart = (
	data: Record<string, unknown>[],
	xKey: string,
	yKey: string,
	color = '#1976d2',
	isDark = false
): { series: ChartSeries[]; options: ChartOptions } => {
	// Validação de segurança
	if (!data || !Array.isArray(data) || data.length === 0) {
		return {
			series: [{ name: 'Total', data: [] }],
			options: {
				chart: { type: 'area' },
				colors: [color],
				noData: { text: 'Nenhum dado disponível' },
				tooltip: getTooltipConfig(isDark),
				...getTextConfig(isDark)
			}
		};
	}

	return {
		series: [
			{
				name: 'Total',
				data: data
					.filter((item) => item && typeof item === 'object')
					.map((item) => ({
						x: String(item[xKey] || ''),
						y: Number(item[yKey] || 0)
					}))
			}
		],
		options: {
			chart: { type: 'area' },
			colors: [color],
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9
				}
			},
			stroke: { curve: 'smooth', width: 2 },
			tooltip: getTooltipConfig(isDark),
			...getTextConfig(isDark)
		}
	};
};

/**
 * Formata dados para gráfico de barras
 */
export const formatBarChart = (
	data: Record<string, unknown>[],
	xKey: string,
	yKey: string,
	color = '#1976d2',
	horizontal = false,
	isDark = false
): { series: ChartSeries[]; options: ChartOptions } => {
	// Validação de segurança
	if (!data || !Array.isArray(data) || data.length === 0) {
		return {
			series: [{ name: 'Cliques', data: [] }],
			options: {
				chart: { type: 'bar' },
				colors: [color],
				noData: { text: 'Nenhum dado disponível' },
				tooltip: getTooltipConfig(isDark),
				...getTextConfig(isDark)
			}
		};
	}

	return {
		series: [
			{
				name: 'Cliques',
				data: data
					.filter((item) => item && typeof item === 'object')
					.map((item) => ({
						x: String(item[xKey] || ''),
						y: Number(item[yKey] || 0)
					}))
			}
		],
		options: {
			chart: { type: 'bar' },
			colors: [color],
			plotOptions: {
				bar: {
					horizontal,
					borderRadius: 4
				}
			},
			tooltip: getTooltipConfig(isDark),
			...getTextConfig(isDark)
		}
	};
};

/**
 * Formata dados para gráfico de pizza/donut
 */
export const formatPieChart = (
	data: Record<string, unknown>[],
	labelKey: string,
	valueKey: string,
	isDark = false
): { series: number[]; options: ChartOptions } => {
	// Validação de segurança
	if (!data || !Array.isArray(data) || data.length === 0) {
		return {
			series: [],
			options: {
				chart: { type: 'donut' },
				labels: [],
				noData: { text: 'Nenhum dado disponível' },
				tooltip: getTooltipConfig(isDark)
			}
		};
	}

	const filteredData = data.filter((item) => item && typeof item === 'object');

	return {
		series: filteredData.map((item) => Number(item[valueKey] || 0)),
		options: {
			chart: { type: 'donut' },
			labels: filteredData.map((item) => String(item[labelKey] || '')),
			colors: ['#1976d2', '#dc004e', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'],
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}
			],
			tooltip: getTooltipConfig(isDark),
			legend: {
				labels: {
					colors: isDark ? '#ffffff' : '#000000'
				}
			}
		}
	};
};

/**
 * Limpa e formata URL para exibição
 */
export const formatUrlForDisplay = (url: string): string => {
	return (
		url
			?.replace(/^https?:\/\//, '')
			?.replace(/^www\./, '')
			?.replace(/\.com\.br$/, '')
			?.replace(/\.com$/, '') || url
	);
};

/**
 * Capitaliza primeira letra de uma string
 */
export const capitalizeFirst = (str: string): string => {
	if (!str) return '';

	return str.charAt(0).toUpperCase() + str.slice(1);
};
