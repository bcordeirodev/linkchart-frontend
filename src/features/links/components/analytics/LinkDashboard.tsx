import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';

import { Charts } from '@/features/analytics/components/dashboard/shared/charts/Charts';
import { DashboardMetrics } from '@/features/analytics/components/dashboard/shared/DashboardMetrics';
import { useDashboardData } from '@/features/analytics/hooks/useDashboardData';
import { mapDashboardDataToCharts } from '@/features/analytics/utils/dataMappers';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

interface LinkDashboardProps {
	linkId: string;
	showTitle?: boolean;
	title?: string;
	enableRealtime?: boolean;
	showTimeframeSelector?: boolean;
	compact?: boolean;
}

/**
 * 🔗 LINK DASHBOARD - Dashboard para Link Individual
 *
 * @description
 * Componente especializado para dashboard de link individual que inclui:
 * - Métricas específicas do link
 * - Gráficos detalhados do link
 * - Informações do link
 * - SEM TopLinks (não faz sentido para link individual)
 *
 * @features
 * - Hook dedicado useDashboardData para link específico
 * - Métricas focadas no link
 * - Gráficos detalhados
 * - Informações do link
 */
export function LinkDashboard({
	linkId,
	showTitle = true,
	title = '🔗 Dashboard do Link',
	enableRealtime = false,
	showTimeframeSelector = true,
	compact = false
}: LinkDashboardProps) {
	const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

	// Hook para dashboard de link específico
	const { data, stats, loading, error, refresh, isRealtime } = useDashboardData({
		linkId,
		enableRealtime,
		timeframe,
		refreshInterval: 60000
	});

	const handleTimeframeChange = (
		_event: React.MouseEvent<HTMLElement>,
		newTimeframe: '1h' | '24h' | '7d' | '30d' | null
	) => {
		if (newTimeframe) {
			setTimeframe(newTimeframe);
		}
	};

	return (
		<AnalyticsStateManager
			loading={loading}
			error={error}
			hasData={!!data}
			onRetry={refresh}
			loadingMessage='Carregando dashboard do link...'
			emptyMessage='Dashboard do link indisponível'
			minHeight={compact ? 200 : 400}
			compact={compact}
		>
			<Box>
				{/* Título e controles */}
				{showTitle ? (
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon='🔗'
							title={title}
							description='Visão geral consolidada do link com métricas essenciais e performance detalhada.'
							highlight={`${data?.summary?.total_clicks || 0} cliques totais`}
							metadata={isRealtime ? 'Tempo Real' : timeframe}
						/>

						{/* Informações do link */}
						{data?.link_info ? (
							<Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
								<Typography
									variant='h6'
									sx={{ mb: 1 }}
								>
									{data.link_info.title || 'Link sem título'}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mb: 1 }}
								>
									{data.link_info.original_url}
								</Typography>
								<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
									<Typography
										variant='caption'
										sx={{
											px: 1,
											py: 0.5,
											bgcolor: data.link_info.is_active ? 'success.main' : 'error.main',
											color: 'white',
											borderRadius: 1
										}}
									>
										{data.link_info.is_active ? '✅ Ativo' : '❌ Inativo'}
									</Typography>
									<Typography
										variant='caption'
										color='text.secondary'
									>
										📊 {data.link_info.clicks} cliques
									</Typography>
								</Box>
							</Box>
						) : null}

						{/* Seletor de timeframe */}
						{showTimeframeSelector ? (
							<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
								<ToggleButtonGroup
									value={timeframe}
									exclusive
									onChange={handleTimeframeChange}
									size='small'
									sx={{
										'& .MuiToggleButton-root': {
											px: 2,
											py: 0.5,
											border: '1px solid rgba(255,255,255,0.2)',
											color: 'text.secondary',
											'&.Mui-selected': {
												backgroundColor: 'primary.main',
												color: 'white',
												'&:hover': {
													backgroundColor: 'primary.dark'
												}
											}
										}
									}}
								>
									<ToggleButton value='1h'>1h</ToggleButton>
									<ToggleButton value='24h'>24h</ToggleButton>
									<ToggleButton value='7d'>7d</ToggleButton>
									<ToggleButton value='30d'>30d</ToggleButton>
								</ToggleButtonGroup>
							</Box>
						) : null}
					</Box>
				) : null}

				{/* Conteúdo principal */}
				<Grid
					container
					spacing={3}
				>
					{/* Métricas principais */}
					<Grid
						item
						xs={12}
					>
						<DashboardMetrics
							summary={data?.summary}
							linksData={[]} // Link individual não precisa de linksData
							showTitle={!compact}
							title='📊 Métricas do Link'
							variant={compact ? 'compact' : 'detailed'}
						/>
					</Grid>

					{/* Charts - SEM TopLinks para link individual */}
					{!compact && (
						<Grid
							item
							xs={12}
						>
							<Charts
								data={data ? mapDashboardDataToCharts(data) : null}
								variant='dashboard'
								height={400}
								showAllCharts
							/>
						</Grid>
					)}
				</Grid>

				{/* Informações de qualidade dos dados */}
				{stats ? (
					<Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							Qualidade dos dados: {stats.dataQuality} • Última atualização:{' '}
							{new Date(stats.lastUpdate).toLocaleTimeString()}
							{isRealtime ? ' • 🔴 Tempo Real' : null}
						</Typography>
					</Box>
				) : null}
			</Box>
		</AnalyticsStateManager>
	);
}

export default LinkDashboard;
