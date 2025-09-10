import { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface SimpleChartProps {
	type: 'area' | 'bar' | 'donut';
	height?: number;
	series: any[];
	options: any;
}

/**
 * Wrapper simples para ApexCharts sem lazy loading
 * Para debug e compatibilidade com Vite
 */
export function SimpleChart({ type, height = 300, series, options }: SimpleChartProps) {
	const chartRef = useRef<HTMLDivElement>(null);
	const [chartInstance, setChartInstance] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let ApexCharts: any = null;

		const initChart = async () => {
			try {
				// Import dinâmico do ApexCharts
				const module = await import('apexcharts');
				ApexCharts = module.default;

				if (chartRef.current && ApexCharts) {
					// Limpar chart anterior se existir
					if (chartInstance) {
						chartInstance.destroy();
					}

					// Criar novo chart
					const chart = new ApexCharts(chartRef.current, {
						chart: {
							type: type,
							height: height,
							background: 'transparent',
							fontFamily: 'Inter, system-ui, sans-serif',
							animations: {
								enabled: true,
								speed: 800
							},
							toolbar: {
								show: false
							}
						},
						...options,
						series: series
					});

					await chart.render();
					setChartInstance(chart);
					setLoading(false);

					// Chart renderizado com sucesso
				}
			} catch (err) {
				console.error(`❌ Erro ao renderizar SimpleChart ${type}:`, err);
				setError(err instanceof Error ? err.message : 'Erro desconhecido');
				setLoading(false);
			}
		};

		initChart();

		// Cleanup
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [type, height, series, options]);

	if (loading) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height={height}
			>
				<CircularProgress size={40} />
				<Typography
					variant="body2"
					sx={{ mt: 2 }}
				>
					Carregando {type}...
				</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height={height}
				border="2px dashed"
				borderColor="error.main"
				borderRadius={2}
				p={2}
			>
				<Typography
					variant="h6"
					color="error"
				>
					Erro no gráfico {type}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<div
				ref={chartRef}
				style={{ width: '100%', height }}
			/>
		</Box>
	);
}

export default SimpleChart;
