import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState, useCallback, Suspense } from 'react';

import { chartPalette } from '@/lib/theme/colors';
import { useChartHeight, type ChartSize } from '@/lib/theme/hooks/useChartHeight';

// Import dinâmico para compatibilidade com Vite
const Chart = React.lazy(() =>
	import('react-apexcharts').then((module) => ({
		default: module.default
	}))
);

// Styled Components
import {
	ChartContainer,
	LoadingContainer,
	LoadingText,
	ErrorContainer,
	ErrorIcon,
	ErrorTitle,
	ErrorDescription,
	ErrorStats,
	NoDataContainer,
	NoDataIcon,
	NoDataTitle,
	NoDataDescription
} from './ApexChartWrapper.styled';

// Chart importado diretamente

interface ApexChartWrapperProps {
	type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap';
	height?: number;       // explicit override — existing callers keep working unchanged
	size?: ChartSize;      // NEW: responsive size hint
	width?: string | number;
	options: Record<string, unknown>;
	series: unknown[];
}

/**
 * 📊 APEX CHART WRAPPER COM STYLED COMPONENTS
 * Wrapper melhorado com tratamento de erro e loading states
 */

const ApexChartWrapper: React.FC<ApexChartWrapperProps> = ({
	type,
	height: heightProp,
	size = 'standard',
	width = '100%',
	options,
	series
}) => {
	const theme = useTheme();
	const height = useChartHeight(size, heightProp);
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Verificar se há dados válidos
	const hasValidData = series && Array.isArray(series) && series.length > 0;
	const hasDataPoints =
		hasValidData &&
		series.some((s) => {
			// Para gráficos donut/pie: series é array de números [3599, 2113, 236]
			if (typeof s === 'number' && s > 0) {
				return true;
			}

			// Para gráficos line/area/bar: series é objeto {name: "Total", data: [...]}
			if (Array.isArray(s) && s.length > 0) {
				return true;
			}

			if (typeof s === 'object' && s !== null && 'data' in s) {
				const data = (s as any).data;

				// Verificar se data é array e tem elementos válidos
				if (Array.isArray(data) && data.length > 0) {
					// Para gráficos de barras, aceitar tanto números simples quanto objetos com x/y
					return data.some((item) => {
						// Número simples (ex: [289, 450, 180])
						if (typeof item === 'number' && item >= 0) {
							return true;
						}

						// Objeto com propriedades x ou y (ex: [{x: 'Jan', y: 100}])
						if (item && typeof item === 'object' && ('x' in item || 'y' in item)) {
							return true;
						}

						return false;
					});
				}
			}

			return false;
		});

	// Validação silenciosa de dados

	useEffect(() => {
		// Em React puro, inicializar imediatamente
		if (hasDataPoints) {
			setIsLoading(false);
		}
	}, [hasDataPoints]);

	const handleChartLoad = useCallback(() => {
		setIsLoading(false);
		setHasError(false);
	}, []);

	const handleChartError = useCallback(
		(error?: any) => {
			// Log apenas erros críticos
			if (error) {
				console.error('ApexChart Error:', error);
			}

			setHasError(true);
			setIsLoading(false);
		},
		[type, series, options]
	);

	// Removido: Loading state durante hidratação (não necessário em React puro)

	// No data state
	if (!hasDataPoints) {
		return (
			<NoDataContainer style={{ height }}>
				<NoDataIcon>📈</NoDataIcon>
				<NoDataTitle variant='h6'>Sem Dados Disponíveis</NoDataTitle>
				<NoDataDescription>
					Este gráfico será exibido quando houver dados suficientes para análise.
				</NoDataDescription>
			</NoDataContainer>
		);
	}

	// Error state
	if (hasError) {
		// Calcular estatísticas dos dados para mostrar algo útil
		const getDataStats = () => {
			try {
				const allData = series.flatMap((s) => {
					if (Array.isArray(s)) {
						return s.filter((v) => typeof v === 'number') as number[];
					}

					if (typeof s === 'object' && s !== null && 'data' in s) {
						return Array.isArray(s.data) ? (s.data.filter((v) => typeof v === 'number') as number[]) : [];
					}

					return [];
				});

				if (allData.length === 0) {
					return null;
				}

				const sum = allData.reduce((acc: number, val: number) => acc + val, 0);
				const avg = sum / allData.length;
				const max = Math.max(...allData);
				const min = Math.min(...allData);

				return { sum, avg, max, min, count: allData.length };
			} catch {
				return null;
			}
		};

		const stats = getDataStats();

		return (
			<ErrorContainer style={{ height }}>
				<ErrorIcon>📊</ErrorIcon>
				<ErrorTitle variant='h6'>Gráfico {type}</ErrorTitle>
				<ErrorDescription>
					Houve um problema ao carregar o gráfico. Visualização temporariamente indisponível.
				</ErrorDescription>

				{stats ? (
					<ErrorStats>
						<div className='stat-row'>
							<span className='stat-label'>Total:</span>
							<span className='stat-value'>{stats.sum.toLocaleString()} pontos</span>
						</div>
						<div className='stat-row'>
							<span className='stat-label'>Média:</span>
							<span className='stat-value'>{stats.avg.toFixed(1)}</span>
						</div>
						<div className='stat-row'>
							<span className='stat-label'>Máximo:</span>
							<span className='stat-value'>{stats.max}</span>
						</div>
						<div className='stat-row'>
							<span className='stat-label'>Mínimo:</span>
							<span className='stat-value'>{stats.min}</span>
						</div>
					</ErrorStats>
				) : null}
			</ErrorContainer>
		);
	}

	// Loading state durante carregamento do chart
	if (isLoading) {
		return (
			<LoadingContainer style={{ height }}>
				<CircularProgress
					size={50}
					thickness={4}
				/>
				<LoadingText>Carregando gráfico {type}...</LoadingText>
			</LoadingContainer>
		);
	}

	// Renderizar o gráfico diretamente (React puro - sem SSR)
	return (
		<ChartContainer>
			<Suspense
				fallback={
					<LoadingContainer style={{ height }}>
						<CircularProgress size={40} />
						<LoadingText>Carregando...</LoadingText>
					</LoadingContainer>
				}
			>
				<Chart
					type={type}
					height={height}
					width={width}
					options={{
						colors: [...chartPalette],
						...options,
						chart: {
							...((options.chart as object) || {}),
							type,
							background: 'transparent',
							foreColor: theme.palette.text.secondary,
							fontFamily: 'Inter, system-ui, sans-serif',
							toolbar: {
								show: false,
								...((options.chart as any)?.toolbar || {})
							},
							events: {
								mounted: () => {
									handleChartLoad();
								},
								...((options.chart as any)?.events || {})
							},
							animations: {
								enabled: true,
								easing: 'easeinout',
								speed: 800,
								animateGradually: {
									enabled: true,
									delay: 150
								},
								...((options.chart as any)?.animations || {})
							}
						},
						grid: {
							borderColor: theme.palette.divider,
							...((options.grid as object) || {})
						},
						theme: {
							mode: theme.palette.mode
						},
						responsive: [
							{
								breakpoint: 600,
								options: {
									legend: {
										position: 'bottom',
										offsetY: 0
									},
									chart: {
										toolbar: { show: false }
									}
								}
							},
							...(Array.isArray((options as any).responsive) ? (options as any).responsive : [])
						]
					}}
					series={series}
				/>
			</Suspense>
		</ChartContainer>
	);
};

export default ApexChartWrapper;
