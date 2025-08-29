'use client';

import React, { useEffect, useState } from 'react';
import { lazy, Suspense } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ChartFallback } from './ChartFallback';

// Importação dinâmica do ApexCharts com tratamento de erro melhorado
const Chart = lazy(() => import('react-apexcharts').then((mod) => ({ default: mod.default })));

interface ApexChartWrapperProps {
	type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap';
	height?: number;
	width?: string | number;
	options: Record<string, unknown>;
	series: unknown[];
}

const ApexChartWrapper: React.FC<ApexChartWrapperProps> = ({ type, height = 350, width = '100%', options, series }) => {
	const [isClient, setIsClient] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsClient(true);

		// Timeout para detectar problemas de carregamento
		const timeout = setTimeout(() => {
			if (isLoading) {
				setHasError(true);
				setIsLoading(false);
			}
		}, 10000); // 10 segundos

		return () => clearTimeout(timeout);
	}, [isLoading]);

	// Se não está no cliente, mostrar loader
	if (!isClient) {
		return (
			<Box
				sx={{
					height,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Se há erro, mostrar componente de fallback
	if (hasError) {
		return (
			<ChartFallback
				height={height}
				title={`Gráfico ${type}`}
				series={series}
				error="Houve um problema ao carregar o gráfico"
			/>
		);
	}

	// Renderizar o gráfico com tratamento de erro
	try {
		return (
			<Box onLoad={() => setIsLoading(false)}>
				<Chart
					type={type}
					height={height}
					width={width}
					options={options}
					series={series as ApexAxisChartSeries}
					onError={() => {
						setHasError(true);
						setIsLoading(false);
					}}
				/>
			</Box>
		);
	} catch (error) {
		setHasError(true);
		setIsLoading(false);

		return (
			<ChartFallback
				height={height}
				title={`Gráfico ${type}`}
				series={series}
				error="Não foi possível renderizar o gráfico"
			/>
		);
	}
};

export default ApexChartWrapper;
