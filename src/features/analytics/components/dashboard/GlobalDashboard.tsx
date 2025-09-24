import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';

import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

import { useDashboardData } from '../../hooks/useDashboardData';
import { mapDashboardDataToCharts, mapLinksDataToTopLinks } from '../../utils/dataMappers';

import { Charts } from './shared/charts/Charts';
import { DashboardMetrics } from './shared/DashboardMetrics';
import { TopLinks } from './shared/TopLinks';

interface GlobalDashboardProps {
	showTitle?: boolean;
	title?: string;
	enableRealtime?: boolean;
	showTimeframeSelector?: boolean;
	compact?: boolean;
}

/**
 * 🌍 GLOBAL DASHBOARD - Dashboard para Analytics Global
 *
 * @description
 * Componente especializado para dashboard global que inclui:
 * - Métricas agregadas de todos os links
 * - Top Links com melhor performance
 * - Gráficos consolidados
 * - Seletor de timeframe
 *
 * @features
 * - Hook dedicado useDashboardData em modo global
 * - TopLinks sempre exibido
 * - Métricas consolidadas
 * - Gráficos de todos os links
 */
export function GlobalDashboard({
	showTitle = true,
	title = 'Dashboard Global',
	enableRealtime = false,
	showTimeframeSelector = true,
	compact = false
}: GlobalDashboardProps) {
	const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

	// Hook para dashboard global (sem linkId)
	const { data, stats, loading, error, refresh, isRealtime } = useDashboardData({
		globalMode: true, // Sempre global
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
			loadingMessage='Carregando dashboard global...'
			emptyMessage='Dashboard global indisponível'
			minHeight={compact ? 200 : 400}
			compact={compact}
		>
			<Box>
				{showTitle ? (
					<Box sx={{ mb: 3 }}>
						<TabDescription
							icon='🌍'
							title={title}
							description='Visão geral consolidada de todos os seus links com métricas essenciais e performance em tempo real.'
							highlight={`${data?.summary?.total_links || 0} links ativos`}
							metadata={isRealtime ? 'Tempo Real' : timeframe}
						/>

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

				<Box sx={{ mb: 3 }}>
					<DashboardMetrics
						summary={data?.summary}
						linksData={data?.top_links}
						showTitle={!compact}
						title='Métricas Globais'
						variant={compact ? 'compact' : 'detailed'}
					/>
				</Box>

				{!compact && (
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							lg={8}
						>
							<Charts
								data={data ? mapDashboardDataToCharts(data) : null}
								variant='dashboard'
								height={400}
								showAllCharts
							/>
						</Grid>

						<Grid
							item
							xs={12}
							lg={4}
						>
							<TopLinks
								links={mapLinksDataToTopLinks(data?.top_links || [])}
								maxItems={5}
								title='Top Links'
							/>
						</Grid>
					</Grid>
				)}

				{stats ? (
					<Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							Qualidade dos dados: {stats.dataQuality} • Última atualização:{' '}
							{new Date(stats.lastUpdate).toLocaleTimeString()}
							{isRealtime ? ' • Tempo Real' : null}
						</Typography>
					</Box>
				) : null}
			</Box>
		</AnalyticsStateManager>
	);
}

export default GlobalDashboard;
