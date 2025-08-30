import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import Chart from 'react-apexcharts';

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

// Chart importado diretamente para melhor debug

interface ApexChartWrapperProps {
	type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap';
	height?: number;
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
	height = 350,
	width = '100%',
	options,
	series
}) => {
	const [isClient, setIsClient] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Verificar se há dados válidos
	const hasValidData = series && Array.isArray(series) && series.length > 0;
	const hasDataPoints = hasValidData && series.some(s =>
		(Array.isArray(s) && s.length > 0) ||
		(typeof s === 'object' && s !== null && 'data' in s && Array.isArray(s.data) && s.data.length > 0)
	);

	// Debug em desenvolvimento
	if (import.meta.env.DEV) {
		console.log(`📊 ApexChart ${type} Debug:`, {
			hasValidData,
			hasDataPoints,
			seriesLength: series?.length || 0,
			seriesType: Array.isArray(series) ? 'array' : typeof series,
			firstSeries: series?.[0],
			options: !!options
		});
	}

	useEffect(() => {
		setIsClient(true);

		// Se não há dados, não é erro - é apenas sem dados
		if (!hasDataPoints) {
			setIsLoading(false);
			return;
		}

		// Timeout mais curto para detectar problemas
		const timeout = setTimeout(() => {
			if (isLoading) {
				setHasError(true);
				setIsLoading(false);
			}
		}, 5000); // 5 segundos

		return () => clearTimeout(timeout);
	}, [isLoading, hasDataPoints]);

	const handleChartLoad = useCallback(() => {
		setIsLoading(false);
		setHasError(false);
	}, []);

	const handleChartError = useCallback((error?: any) => {
		if (import.meta.env.DEV) {
			console.error('📊 ApexChart Error:', { type, error, series, options });
		}
		setHasError(true);
		setIsLoading(false);
	}, [type, series, options]);

	// Loading state durante hidratação
	if (!isClient) {
		return (
			<LoadingContainer style={{ height }}>
				<CircularProgress size={40} thickness={4} />
				<LoadingText>
					Preparando gráfico...
				</LoadingText>
			</LoadingContainer>
		);
	}

	// No data state
	if (!hasDataPoints) {
		return (
			<NoDataContainer style={{ height }}>
				<NoDataIcon>📈</NoDataIcon>
				<NoDataTitle variant="h6">
					Sem Dados Disponíveis
				</NoDataTitle>
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
				const allData = series.flatMap(s => {
					if (Array.isArray(s)) return s.filter(v => typeof v === 'number') as number[];
					if (typeof s === 'object' && s !== null && 'data' in s) {
						return Array.isArray(s.data) ? s.data.filter(v => typeof v === 'number') as number[] : [];
					}
					return [];
				});

				if (allData.length === 0) return null;

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
				<ErrorTitle variant="h6">
					Gráfico {type}
				</ErrorTitle>
				<ErrorDescription>
					Houve um problema ao carregar o gráfico.
					Visualização temporariamente indisponível.
				</ErrorDescription>

				{stats && (
					<ErrorStats>
						<div className="stat-row">
							<span className="stat-label">Total:</span>
							<span className="stat-value">{stats.sum.toLocaleString()} pontos</span>
						</div>
						<div className="stat-row">
							<span className="stat-label">Média:</span>
							<span className="stat-value">{stats.avg.toFixed(1)}</span>
						</div>
						<div className="stat-row">
							<span className="stat-label">Máximo:</span>
							<span className="stat-value">{stats.max}</span>
						</div>
						<div className="stat-row">
							<span className="stat-label">Mínimo:</span>
							<span className="stat-value">{stats.min}</span>
						</div>
					</ErrorStats>
				)}
			</ErrorContainer>
		);
	}

	// Loading state durante carregamento do chart
	if (isLoading) {
		return (
			<LoadingContainer style={{ height }}>
				<CircularProgress size={50} thickness={4} />
				<LoadingText>
					Carregando gráfico {type}...
				</LoadingText>
			</LoadingContainer>
		);
	}

	// Renderizar o gráfico
	return (
		<ChartContainer>
			<Suspense
				fallback={
					<LoadingContainer style={{ height }}>
						<CircularProgress size={40} />
						<LoadingText>Renderizando...</LoadingText>
					</LoadingContainer>
				}
			>
				<Chart
					type={type}
					height={height}
					width={width}
					options={{
						...options,
						chart: {
							...((options.chart as object) || {}),
							background: 'transparent',
							fontFamily: 'Inter, system-ui, sans-serif',
							animations: {
								enabled: true,
								speed: 800,
							},
						},
						theme: {
							mode: 'light', // Será sobrescrito pelo theme do MUI
						},
					}}
					series={series as ApexAxisChartSeries}
					onLoad={handleChartLoad}
					onError={handleChartError}
				/>
			</Suspense>
		</ChartContainer>
	);
}

export default ApexChartWrapper;