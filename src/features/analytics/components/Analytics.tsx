import { useState } from 'react';
import { Box, CircularProgress, Button, useTheme, Tab, Tabs, Typography, Container, Grid } from '@mui/material';
import { Header } from './Header';
import { UnifiedMetrics } from './metrics/UnifiedMetrics';
import { Charts } from './charts/Charts';
import { GeographicAnalysis } from './analysis/GeographicAnalysis';
import { TemporalAnalysis } from './analysis/TemporalAnalysis';
import { AudienceAnalysis } from './analysis/AudienceAnalysis';
import { HeatmapAnalysis } from './analysis/HeatmapAnalysis';
import { BusinessInsights } from './insights/BusinessInsights';
import { PerformanceAnalysis } from './analysis/PerformanceAnalysis';
import { TopLinks } from './dashboard/TopLinks';
import { TabPanel } from '@/shared/ui/base/TabPanel';
import TabDescription from '@/shared/ui/base/TabDescription';
import { AnalyticsProps } from './types';
import { createGlassCard, createPresetAnimations } from '@/lib/theme';

/**
 * 🎨 ANALYTICS COMPLETAMENTE REDESENHADO
 * Interface moderna com melhor organização visual e UX
 */
export function Analytics({
	data,
	loading = false,
	error = null,
	linkId,
	showHeader = true,
	showTabs = true,
	linksData = [],
	showDashboardTab = true
}: AnalyticsProps) {
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme();

	// Usa utilitários de tema
	// Utilitários removidos temporariamente para corrigir linting
	const animations = createPresetAnimations(theme);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Loading state simplificado
	if (loading) {
		return (
			<Container
				maxWidth="xl"
				sx={{ py: 3 }}
			>
				<Box
					sx={{
						...(createGlassCard(theme, 'neutral') as any),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 400,
						textAlign: 'center',
						gap: 2,
						p: 4
					}}
				>
					<CircularProgress size={40} />
					<Typography
						variant="h6"
						sx={{ mt: 2 }}
					>
						Carregando Analytics
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Preparando seus dados...
					</Typography>
				</Box>
			</Container>
		);
	}

	// Error state simplificado
	if (error) {
		return (
			<Container
				maxWidth="xl"
				sx={{ py: 3 }}
			>
				<Box
					sx={{
						...(createGlassCard(theme, 'neutral') as any),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 400,
						textAlign: 'center',
						gap: 2,
						p: 4,
						borderColor: 'error.main'
					}}
				>
					<Typography
						variant="h6"
						sx={{ mb: 1 }}
					>
						⚠️ Erro ao carregar dados
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 2 }}
					>
						{error || 'Não foi possível carregar os analytics'}
					</Typography>
					<Button
						variant="outlined"
						onClick={() => window.location.reload()}
						sx={{ ...animations.buttonHover }}
					>
						Tentar Novamente
					</Button>
				</Box>
			</Container>
		);
	}

	// No data state simplificado
	if (!data) {
		return (
			<Container
				maxWidth="xl"
				sx={{ py: 3 }}
			>
				<Box>
					{showHeader && (
						<Header
							variant="analytics"
							title="Analytics"
							subtitle="Aguardando dados para análise"
						/>
					)}
					<Box
						sx={{
							...(createGlassCard(theme, 'neutral') as any),
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							minHeight: 400,
							textAlign: 'center',
							gap: 2,
							p: 4
						}}
					>
						<Typography
							variant="h6"
							sx={{ mb: 1 }}
						>
							📈 Analytics em Preparação
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Compartilhe seus links para desbloquear insights detalhados!
						</Typography>
					</Box>
				</Box>
			</Container>
		);
	}

	const tabLabels = [
		...(showDashboardTab ? [{ label: 'Dashboard', icon: '🎯', description: 'Visão geral consolidada' }] : []),
		{ label: 'Visão Geral', icon: '📊', description: 'Métricas principais' },
		{ label: 'Performance', icon: '⚡', description: 'Velocidade e disponibilidade' },
		{ label: 'Geografia', icon: '🌍', description: 'Análise geográfica' },
		{ label: 'Temporal', icon: '⏰', description: 'Tendências temporais' },
		{ label: 'Audiência', icon: '👥', description: 'Perfil da audiência' },
		{ label: 'Heatmap', icon: '🔥', description: 'Mapa de calor' },
		{ label: 'Insights', icon: '💡', description: 'Insights de negócio' }
	];

	// Calcular métricas dos links para Dashboard tab
	const totalLinks = linksData.length;
	const activeLinks = linksData.filter((link) => link.is_active).length;
	const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
	const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

	return (
		<Container
			maxWidth="xl"
			sx={{ py: 3 }}
		>
			<Box>
				{/* Header compacto */}
				{showHeader && (
					<Box sx={{ ...animations.fadeIn }}>
						<Header
							variant="analytics"
							title="Analytics Dashboard"
							subtitle="Análise detalhada e insights de performance dos seus links"
						/>
					</Box>
				)}

				{/* Tabs Navigation simplificada */}
				{showTabs && (
					<Box sx={{ ...(createGlassCard(theme, 'neutral') as any), mb: 3 }}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							variant="scrollable"
							scrollButtons="auto"
						>
							{tabLabels.map((tab, index) => (
								<Tab
									key={index}
									label={`${tab.icon} ${tab.label}`}
								/>
							))}
						</Tabs>
					</Box>
				)}

				{/* Content Panels */}
				<Box>
					{/* Dashboard Tab */}
					{showDashboardTab && (
						<TabPanel
							value={tabValue}
							index={0}
						>
							<Box sx={{ mb: 2 }}>
								<TabDescription
									icon="🎯"
									title="Dashboard Principal"
									description="Visão geral consolidada dos seus links com métricas essenciais e performance em tempo real."
									highlight="Perfeito para acompanhar o desempenho geral"
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
									<UnifiedMetrics
										data={data}
										linksData={linksData}
										categories={['dashboard']}
										showTitle={true}
										title="📊 Métricas Principais"
										maxCols={4}
									/>
								</Grid>

								{/* Charts e Top Links */}
								<Grid
									item
									xs={12}
									lg={8}
								>
									<Charts
										data={data}
										variant="dashboard"
										height={300}
										showAllCharts={false}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									lg={4}
								>
									<TopLinks
										links={linksData}
										maxItems={4}
										title="🏆 Top Links"
									/>
								</Grid>
							</Grid>
						</TabPanel>
					)}

					{/* Visão Geral Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 1 : 0}
					>
						<Box sx={{ mb: 2 }}>
							<TabDescription
								icon="📊"
								title="Visão Geral Analytics"
								description="Métricas detalhadas e análise completa do desempenho dos seus links."
								highlight="Dados essenciais para tomada de decisão"
							/>
						</Box>

						<Box sx={{ mb: 4 }}>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={12}
								>
									<UnifiedMetrics
										data={data}
										linksData={linksData}
										categories={['analytics']}
										showTitle={true}
										title="📈 Métricas Analytics"
										maxCols={4}
									/>
								</Grid>

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
						</Box>
					</TabPanel>

					{/* Performance Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 2 : 1}
					>
						<PerformanceAnalysis
							data={data}
							linksData={linksData}
						/>
					</TabPanel>

					{/* Geografia Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 3 : 2}
					>
						<GeographicAnalysis data={data} />
					</TabPanel>

					{/* Temporal Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 4 : 3}
					>
						<TemporalAnalysis data={data} />
					</TabPanel>

					{/* Audiência Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 5 : 4}
					>
						<AudienceAnalysis data={data} />
					</TabPanel>

					{/* Heatmap Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 6 : 5}
					>
						<HeatmapAnalysis
							data={data}
							linkId={linkId}
						/>
					</TabPanel>

					{/* Insights Tab */}
					<TabPanel
						value={tabValue}
						index={showDashboardTab ? 7 : 6}
					>
						<BusinessInsights insights={data?.insights || []} />
					</TabPanel>
				</Box>
			</Box>
		</Container>
	);
}

export default Analytics;
