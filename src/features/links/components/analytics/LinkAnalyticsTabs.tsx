'use client';

import { Tabs, Tab, Box, useTheme } from '@mui/material';
import { useState } from 'react';

import { AudienceAnalysis } from '@/features/analytics/components/audience/AudienceAnalysis';
import { GeographicAnalysis } from '@/features/analytics/components/geographic/GeographicAnalysis';
import { HeatmapAnalysis } from '@/features/analytics/components/heatmap/HeatmapAnalysis';
import { InsightsAnalysis } from '@/features/analytics/components/insights/InsightsAnalysis';
import { PerformanceAnalysis } from '@/features/analytics/components/perfomance/PerformanceAnalysis';
import { TemporalAnalysis } from '@/features/analytics/components/temporal';
import TabDescription from '@/shared/ui/base/TabDescription';
import { TabPanel } from '@/shared/ui/base/TabPanel';

import { LinkDashboard } from './LinkDashboard';

import type { LinkAnalyticsData } from '../../types/analytics';

// Importar componentes especializados que usam hooks próprios

interface LinkAnalyticsTabsOptimizedProps {
	data?: LinkAnalyticsData | null;
	linkId: string;
	loading?: boolean;
	showHeader?: boolean;
}

/**
 * 📋 Tabs otimizadas para analytics de link individual
 *
 * @description
 * Versão otimizada que usa componentes com hooks próprios,
 * seguindo o mesmo padrão do analytics global.
 *
 * @features
 * - Cada tab usa seu próprio hook específico
 * - Componentes reutilizáveis do módulo analytics
 * - Estrutura limpa e consistente
 * - Menos de 150 linhas
 */
export function LinkAnalyticsTabsOptimized({
	data,
	linkId,
	loading: _loading = false,
	showHeader = true
}: LinkAnalyticsTabsOptimizedProps) {
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme();

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Configuração padronizada de tabs
	const tabLabels = [
		{ label: 'Dashboard', icon: '🎯', description: 'Visão geral consolidada' },
		{ label: 'Performance', icon: '⚡', description: 'Velocidade e disponibilidade' },
		{ label: 'Geografia', icon: '🌍', description: 'Análise geográfica' },
		{ label: 'Temporal', icon: '⏰', description: 'Tendências temporais' },
		{ label: 'Audiência', icon: '👥', description: 'Perfil da audiência' },
		{ label: 'Heatmap', icon: '🔥', description: 'Mapa de calor' },
		{ label: 'Insights', icon: '💡', description: 'Insights de negócio' }
	];

	return (
		<Box>
			{/* Tabs Navigation */}
			<Box
				className='link-analytics-tabs-container'
				sx={{
					backgroundColor: theme.palette.background.paper,
					borderRadius: 2,
					mb: 3
				}}
			>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					variant='scrollable'
					scrollButtons='auto'
					sx={{
						'& .MuiTab-root': {
							textTransform: 'none',
							'&.Mui-selected': {
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								borderRadius: 1
							}
						}
					}}
				>
					{tabLabels.map((tab, index) => (
						<Tab
							key={index}
							label={tab.label}
							icon={<span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>}
							iconPosition='start'
						/>
					))}
				</Tabs>
			</Box>

			{/* Tab Panels - LAZY LOADING: Apenas a tab ativa é renderizada */}

			{/* Dashboard Tab */}
			<TabPanel
				value={tabValue}
				index={0}
			>
				{showHeader ? (
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon='🎯'
							title='Dashboard do Link'
							description='Visão geral consolidada do link com métricas essenciais e performance.'
							highlight={`${data?.overview?.total_clicks || 0} cliques totais`}
						/>
					</Box>
				) : null}
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 0 && (
					<LinkDashboard
						linkId={linkId}
						showTitle={false}
						enableRealtime={false}
						showTimeframeSelector
						compact={false}
					/>
				)}
			</TabPanel>

			{/* Performance Tab */}
			<TabPanel
				value={tabValue}
				index={1}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 1 && (
					<PerformanceAnalysis
						linkId={linkId}
						globalMode={false}
					/>
				)}
			</TabPanel>

			{/* Geografia Tab */}
			<TabPanel
				value={tabValue}
				index={2}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 2 && (
					<GeographicAnalysis
						linkId={linkId}
						globalMode={false}
						enableRealtime={false}
						minClicks={1}
					/>
				)}
			</TabPanel>

			{/* Temporal Tab */}
			<TabPanel
				value={tabValue}
				index={3}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 3 && (
					<TemporalAnalysis
						linkId={linkId}
						globalMode={false}
						enableRealtime={false}
						timeRange='7d'
					/>
				)}
			</TabPanel>

			{/* Audiência Tab */}
			<TabPanel
				value={tabValue}
				index={4}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 4 && (
					<AudienceAnalysis
						linkId={linkId}
						globalMode={false}
					/>
				)}
			</TabPanel>

			{/* Heatmap Tab */}
			<TabPanel
				value={tabValue}
				index={5}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 5 && (
					<HeatmapAnalysis
						linkId={linkId}
						globalMode={false}
					/>
				)}
			</TabPanel>

			{/* Insights Tab */}
			<TabPanel
				value={tabValue}
				index={6}
			>
				{/* Renderizar apenas se a tab está ativa */}
				{tabValue === 6 && (
					<InsightsAnalysis
						linkId={linkId}
						globalMode={false}
						enableRealtime={false}
						maxInsights={10}
					/>
				)}
			</TabPanel>
		</Box>
	);
}

export default LinkAnalyticsTabsOptimized;
