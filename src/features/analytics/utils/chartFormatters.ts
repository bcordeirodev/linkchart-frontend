import { ChartOptions, ChartSeries } from '@/types';

/**
 * Utilitários para formatação de dados de gráficos
 * Centraliza a lógica de formatação para evitar duplicação
 */

/**
 * Configuração de tooltip adaptável ao tema - melhorada
 */
const getTooltipConfig = (isDark = false) => ({
	theme: isDark ? 'dark' : 'light',
	style: {
		fontSize: '14px',
		fontFamily: 'Inter, system-ui, sans-serif',
		borderRadius: '12px',
		boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
	},
	fillSeriesColor: false,
	x: {
		show: true,
		formatter: (value: string) => `<strong>${value}</strong>`
	},
	y: {
		formatter: (value: number) =>
			`<span style="color: #1976d2; font-weight: 600;">${value.toLocaleString()}</span> cliques`
	},
	marker: {
		show: true,
		radius: 6
	},
	fixed: {
		enabled: false
	},
	followCursor: true
});

/**
 * Configuração de textos adaptável ao tema - melhorada
 */
const getTextConfig = (isDark = false) => {
	const textColor = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)';
	const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
	const subtitleColor = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)';

	return {
		title: {
			style: {
				fontSize: '16px',
				fontWeight: '600',
				color: textColor,
				fontFamily: 'Inter, system-ui, sans-serif'
			}
		},
		subtitle: {
			style: {
				fontSize: '14px',
				color: subtitleColor,
				fontFamily: 'Inter, system-ui, sans-serif'
			}
		},
		xaxis: {
			labels: {
				style: {
					colors: textColor,
					fontSize: '12px',
					fontFamily: 'Inter, system-ui, sans-serif',
					fontWeight: '500'
				},
				rotate: 0,
				trim: true,
				maxHeight: 60
			},
			axisBorder: {
				color: gridColor,
				height: 1
			},
			axisTicks: {
				color: gridColor,
				height: 4
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: textColor,
					fontSize: '12px',
					fontFamily: 'Inter, system-ui, sans-serif',
					fontWeight: '500'
				},
				formatter: (value: number | string) => {
					// Para gráficos horizontais, o yaxis mostra os labels (países)
					// Para gráficos verticais, o yaxis mostra os valores numéricos
					if (typeof value === 'string') return value;

					return value.toLocaleString();
				}
			}
		},
		grid: {
			borderColor: gridColor,
			strokeDashArray: 2,
			xaxis: {
				lines: {
					show: false
				}
			},
			yaxis: {
				lines: {
					show: true
				}
			}
		},
		legend: {
			labels: {
				colors: textColor,
				useSeriesColors: false
			},
			fontFamily: 'Inter, system-ui, sans-serif',
			fontSize: '13px',
			fontWeight: '500'
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
): { series: ChartSeries[]; options: any } => {
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
						x: String(item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : ''),
						y: Number(item[yKey] || 0)
					}))
			}
		],
		options: {
			chart: {
				type: 'area',
				borderRadius: 12,
				toolbar: {
					show: false
				},
				animations: {
					enabled: true,
					easing: 'easeinout',
					speed: 800
				}
			},
			colors: [color],
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					type: 'vertical',
					shadeIntensity: 0.25,
					gradientToColors: [color],
					inverseColors: false,
					opacityFrom: 0.6,
					opacityTo: 0.1,
					stops: [0, 100]
				}
			},
			stroke: {
				curve: 'smooth',
				width: 3,
				lineCap: 'round'
			},
			markers: {
				size: 0,
				hover: {
					size: 8,
					sizeOffset: 2
				}
			},
			dataLabels: {
				enabled: false
			},
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
): { series: ChartSeries[]; options: any } => {
	// Validação de segurança
	if (!data || !Array.isArray(data) || data.length === 0) {
		return {
			series: [{ name: 'Cliques', data: [] }],
			options: {
				chart: { type: 'bar' },
				colors: [color],
				noData: { text: 'Nenhum dado disponível' }
			}
		};
	}

	// Processar dados de forma mais simples para ApexCharts
	const processedData = data
		.filter((item) => item && typeof item === 'object')
		.map((item, index) => ({
			x: String(item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : ''),
			y: Number(item[yKey] || 0)
		}));

	const categories = data
		.filter((item) => item && typeof item === 'object')
		.map((item) => String(item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : ''));

	// Configuração simplificada para barras horizontais
	if (horizontal) {
		return {
			series: [
				{
					name: 'Cliques',
					data: processedData
				}
			],
			options: {
				chart: {
					type: 'bar',
					height: 350,
					toolbar: { show: false },
					animations: {
						enabled: true,
						easing: 'easeinout',
						speed: 800
					}
				},
				colors: [color],
				plotOptions: {
					bar: {
						horizontal: true,
						borderRadius: 2,
						barHeight: '60%',
						distributed: false
					}
				},
				dataLabels: {
					enabled: true,
					style: {
						colors: ['#fff'],
						fontSize: '11px',
						fontWeight: 'bold'
					},
					formatter: function (val: number) {
						return val.toString();
					}
				},
				xaxis: {
					type: 'numeric',
					labels: {
						style: {
							colors: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
							fontSize: '12px'
						}
					}
				},
				yaxis: {
					labels: {
						style: {
							colors: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
							fontSize: '12px'
						}
					}
				},
				grid: {
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
					xaxis: {
						lines: {
							show: true
						}
					},
					yaxis: {
						lines: {
							show: false
						}
					}
				},
				tooltip: getTooltipConfig(isDark),
				fill: {
					opacity: 1
				},
				stroke: {
					show: true,
					width: 1,
					colors: ['transparent']
				}
			}
		};
	}

	// Configuração para barras verticais (original)
	const processedDataVertical = data
		.filter((item) => item && typeof item === 'object')
		.map((item) => ({
			x: String(item[xKey] !== undefined && item[xKey] !== null ? item[xKey] : ''),
			y: Number(item[yKey] || 0)
		}));

	return {
		series: [
			{
				name: 'Cliques',
				data: processedDataVertical
			}
		],
		options: {
			chart: {
				type: 'bar',
				height: 350,
				toolbar: { show: false },
				animations: {
					enabled: true,
					easing: 'easeinout',
					speed: 800
				}
			},
			colors: [color],
			plotOptions: {
				bar: {
					horizontal: false,
					borderRadius: 2,
					columnWidth: '60%',
					distributed: false
				}
			},
			dataLabels: {
				enabled: true,
				style: {
					colors: [isDark ? '#fff' : '#333'],
					fontSize: '11px',
					fontWeight: 'bold'
				},
				formatter: function (val: number) {
					return val.toString();
				},
				offsetY: -20
			},
			fill: {
				opacity: 1,
				type: 'solid'
			},
			stroke: {
				show: true,
				width: 1,
				colors: ['transparent']
			},
			xaxis: {
				type: 'category',
				categories: processedDataVertical.map(item => item.x),
				labels: {
					style: {
						colors: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
						fontSize: '12px'
					}
				}
			},
			yaxis: {
				labels: {
					style: {
						colors: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
						fontSize: '12px'
					},
					formatter: (value: number) => Math.round(value).toString()
				}
			},
			grid: {
				borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
				yaxis: {
					lines: {
						show: true
					}
				},
				xaxis: {
					lines: {
						show: false
					}
				}
			},
			tooltip: getTooltipConfig(isDark)
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
			chart: {
				type: 'donut',
				animations: {
					enabled: true,
					easing: 'easeinout',
					speed: 800
				}
			},
			labels: filteredData.map((item) => String(item[labelKey] || '')),
			colors: ['#1976d2', '#2e7d32', '#dc004e', '#9c27b0', '#ff9800', '#d32f2f', '#0288d1', '#7b1fa2'],
			plotOptions: {
				pie: {
					donut: {
						size: '70%',
						labels: {
							show: true,
							name: {
								show: true,
								fontSize: '14px',
								fontFamily: 'Inter, system-ui, sans-serif',
								fontWeight: 600,
								color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
							},
							value: {
								show: true,
								fontSize: '16px',
								fontFamily: 'Inter, system-ui, sans-serif',
								fontWeight: 700,
								color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
								formatter: (val: string) => parseInt(val).toLocaleString()
							}
						}
					}
				}
			},
			dataLabels: {
				enabled: false
			},
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
			tooltip: {
				...getTooltipConfig(isDark),
				y: {
					formatter: (value: number) =>
						`<span style="color: #1976d2; font-weight: 600;">${value.toLocaleString()}</span>`
				}
			},
			legend: {
				position: 'right',
				offsetY: 0,
				height: 230,
				labels: {
					colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
					useSeriesColors: false
				},
				fontFamily: 'Inter, system-ui, sans-serif',
				fontSize: '13px',
				fontWeight: '500'
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
