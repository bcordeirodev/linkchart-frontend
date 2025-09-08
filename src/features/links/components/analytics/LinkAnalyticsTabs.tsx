'use client';

import { Tabs, Tab } from '@mui/material';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { TabPanel } from '@/shared/ui/base/TabPanel';
// Removido: ícones Material-UI para usar emojis consistentes
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { LinkAnalyticsData } from '../../types/analytics';

// Importar componentes especializados reutilizáveis
import { PerformanceAnalysis } from '@/features/analytics/components/perfomance/PerformanceAnalysis';
import { BusinessInsights } from '@/features/analytics/components/insights/BusinessInsights';
import { AudienceAnalysis } from '@/features/analytics/components/audience/AudienceAnalysis';
import { GeographicChart, GeographicInsights } from '@/features/analytics/components/geographic';
import { HeatmapAnalysis } from '@/features/analytics/components/heatmap';
import { TemporalChart, TemporalInsights } from '@/features/analytics/components/temporal';

// Importar componentes do dashboard
import { Charts } from '@/features/analytics/components/dashboard/charts/Charts';
import { DashboardMetrics } from '@/features/analytics/components/dashboard/DashboardMetrics';
import TabDescription from '@/shared/ui/base/TabDescription';

interface LinkAnalyticsTabsProps {
	data: LinkAnalyticsData | null;
	linkId: string;
	loading?: boolean;
}

/**
 * 📋 Tabs específicas para analytics de link individual
 * Reutiliza componentes especializados do módulo analytics
 * Segue padrões arquiteturais: < 200 linhas, usa TabPanel base
 */
export function LinkAnalyticsTabs({ data, linkId, loading: _loading = false }: LinkAnalyticsTabsProps) {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Configuração padronizada de tabs (EXATO mesmo padrão do Analytics.tsx)
	const tabLabels = [
		{ label: 'Dashboard', icon: '🎯', description: 'Visão geral consolidada' },
		{ label: 'Performance', icon: '⚡', description: 'Velocidade e disponibilidade' },
		{ label: 'Geografia', icon: '🌍', description: 'Análise geográfica' },
		{ label: 'Temporal', icon: '⏰', description: 'Tendências temporais' },
		{ label: 'Audiência', icon: '👥', description: 'Perfil da audiência' },
		{ label: 'Heatmap', icon: '🔥', description: 'Mapa de calor' },
		{ label: 'Insights', icon: '💡', description: 'Insights de negócio' }
	];

	if (!data?.has_data) {
		return (
			<EmptyState
				variant="charts"
				icon="🚀"
				title="Analytics Detalhados em Preparação"
				description="Compartilhe seu link para desbloquear análises geográficas, temporais e de audiência!"
				height={400}
			/>
		);
	}

	return (
		<Box sx={{ position: 'relative' }}>
			<Box>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					variant="scrollable"
					scrollButtons="auto"
					sx={{
						'& .MuiTabs-indicator': {
							backgroundColor: 'primary.main',
							height: 3,
							borderRadius: '3px 3px 0 0'
						},
						'& .MuiTab-root': {
							minHeight: 48,
							textTransform: 'none',
							fontWeight: 500,
							fontSize: '0.875rem',
							'&.Mui-selected': {
								color: 'primary.main'
							}
						}
					}}
				>
					{tabLabels.map((tab, index) => (
						<Tab
							key={index}
							label={tab.label}
							icon={<span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>}
							iconPosition="start"
							sx={{
								gap: 1,
								'& .MuiTab-iconWrapper': {
									marginBottom: 0
								}
							}}
						/>
					))}
				</Tabs>
			</Box>

			{/* Tab Panels */}
			{/* Dashboard Tab */}
			<TabPanel
				value={tabValue}
				index={0}
			>
				<Box sx={{ mb: 2 }}>
					<TabDescription
						icon="🎯"
						title="Dashboard do Link"
						description="Visão geral consolidada do link com métricas essenciais e performance em tempo real."
						highlight="Perfeito para acompanhar o desempenho individual"
					/>
				</Box>

				<Grid
					container
					spacing={3}
				>
					{/* Métricas Unificadas */}
					<Grid
						item
						xs={12}
					>
						<DashboardMetrics
							summary={data?.overview}
							showTitle={true}
							title="Métricas Principais"
						/>
					</Grid>

					{/* Charts */}
					<Grid
						item
						xs={12}
					>
						<Charts
							data={data}
							variant="analytics"
							height={450}
							showAllCharts={true}
						/>
					</Grid>
				</Grid>
			</TabPanel>

			{/* Performance Tab */}
			<TabPanel
				value={tabValue}
				index={1}
			>
				<PerformanceAnalysis
					data={data as unknown as import('@/types').AnalyticsData}
					linksData={[]}
				/>
			</TabPanel>

			<TabPanel
				value={tabValue}
				index={2}
			>
				<Box>
					<GeographicChart
						countries={
							data?.geographic?.top_countries?.map((c) => ({
								...c,
								iso_code: c.iso_code || '',
								currency: c.currency || ''
							})) || []
						}
						states={
							data?.geographic?.top_states?.map((s) => ({
								...s,
								country: s.country || '',
								state_name: s.state_name || s.state
							})) || []
						}
						cities={
							data?.geographic?.top_cities?.map((c) => ({
								...c,
								state: c.state || '',
								country: c.country || ''
							})) || []
						}
						totalClicks={data?.overview?.total_clicks || 0}
					/>
					<Box sx={{ mt: 3 }}>
						<GeographicInsights
							data={data?.geographic?.heatmap_data || []}
							countries={
								data?.geographic?.top_countries?.map((c) => ({
									country: c.country,
									iso_code: c.iso_code || '',
									clicks: c.clicks,
									currency: c.currency || ''
								})) || []
							}
							states={
								data?.geographic?.top_states?.map((s) => ({
									country: s.country || '',
									state: s.state,
									state_name: s.state_name || s.state,
									clicks: s.clicks
								})) || []
							}
							cities={
								data?.geographic?.top_cities?.map((c) => ({
									city: c.city,
									state: c.state || '',
									country: c.country || '',
									clicks: c.clicks
								})) || []
							}
						/>
					</Box>
				</Box>
			</TabPanel>

			<TabPanel
				value={tabValue}
				index={3}
			>
				<Box>
					<TemporalChart
						hourlyData={data?.temporal?.clicks_by_hour || []}
						weeklyData={
							data?.temporal?.clicks_by_day_of_week?.map((d) => ({
								day: typeof d.day === 'string' ? parseInt(d.day) || 0 : d.day || 0,
								clicks: d.clicks,
								day_name: d.day_name || String(d.day)
							})) || []
						}
					/>
					<Box sx={{ mt: 3 }}>
						<TemporalInsights
							hourlyData={data?.temporal?.clicks_by_hour || []}
							weeklyData={
								data?.temporal?.clicks_by_day_of_week?.map((d) => ({
									day: typeof d.day === 'string' ? parseInt(d.day) || 0 : d.day || 0,
									clicks: d.clicks,
									day_name: d.day_name || String(d.day)
								})) || []
							}
						/>
					</Box>
				</Box>
			</TabPanel>

			<TabPanel
				value={tabValue}
				index={4}
			>
				<AudienceAnalysis data={data} />
			</TabPanel>

			{/* Heatmap Tab */}
			<TabPanel
				value={tabValue}
				index={5}
			>
				<HeatmapAnalysis
					linkId={linkId}
				/>
			</TabPanel>

			<TabPanel
				value={tabValue}
				index={6}
			>
				<BusinessInsights insights={data?.insights || []} />
			</TabPanel>
		</Box>
	);
}

export default LinkAnalyticsTabs;
