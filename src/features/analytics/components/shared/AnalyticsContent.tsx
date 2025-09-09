import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { TabPanel } from '@/shared/ui/base/TabPanel';
import TabDescription from '@/shared/ui/base/TabDescription';
import { createGlassCard, createPresetAnimations } from '@/lib/theme';
import { useTheme } from '@mui/material/styles';

// Componentes integrados com hooks
import { GlobalDashboard } from '../dashboard/GlobalDashboard';
import { GeographicAnalysis } from '../geographic/GeographicAnalysis';
import { TemporalAnalysis } from '../temporal';
import { InsightsAnalysis } from '../insights/InsightsAnalysis';
import { AudienceAnalysis } from '../audience/AudienceAnalysis';
import { HeatmapAnalysis } from '../heatmap/HeatmapAnalysis';
import { PerformanceAnalysis } from '../perfomance/PerformanceAnalysis';

interface AnalyticsContentProps {
	data: any;
	linkId?: string;
	linksData?: any[];
	showTabs?: boolean;
	showDashboardTab?: boolean;
}

/**
 * 🎯 ANALYTICS CONTENT - GERENCIADOR DE CONTEÚDO
 *
 * @description
 * Componente responsável por renderizar o conteúdo principal
 * do analytics com sistema de tabs e componentes integrados.
 *
 * @responsibilities
 * - Gerenciar navegação entre tabs
 * - Renderizar componentes com hooks dedicados
 * - Manter estado das tabs
 * - Fornecer dados consistentes para todos os módulos
 *
 * @usage
 * ```tsx
 * <AnalyticsContent
 *   data={analyticsData}
 *   linkId="123"
 *   showTabs={true}
 *   showDashboardTab={true}
 * />
 * ```
 */
export function AnalyticsContent({
	data,
	linkId,
	linksData = [],
	showTabs = true,
	showDashboardTab = true
}: AnalyticsContentProps) {
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Configuração das tabs
	const tabLabels = [
		...(showDashboardTab ? [{ label: 'Dashboard', icon: '🎯', description: 'Visão geral consolidada' }] : []),
		{ label: 'Performance', icon: '⚡', description: 'Velocidade e disponibilidade' },
		{ label: 'Geografia', icon: '🌍', description: 'Análise geográfica' },
		{ label: 'Temporal', icon: '⏰', description: 'Tendências temporais' },
		{ label: 'Audiência', icon: '👥', description: 'Perfil da audiência' },
		{ label: 'Heatmap', icon: '🔥', description: 'Mapa de calor' },
		{ label: 'Insights', icon: '💡', description: 'Insights de negócio' }
	];

	// Função helper para calcular índice correto
	const getTabIndex = (baseIndex: number) => {
		return showDashboardTab ? baseIndex : baseIndex - 1;
	};

	// Determinar modo global baseado na presença de linkId
	const globalMode = !linkId;

	return (
		<Box>
			{/* Tabs Navigation */}
			{showTabs && (
				<Box sx={{ ...createGlassCard(theme, 'neutral'), mb: 3 }}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						variant="scrollable"
						scrollButtons="auto"
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
								iconPosition="start"
							/>
						))}
					</Tabs>
				</Box>
			)}

			{/* Content Panels */}
			<Box sx={{ ...animations.fadeIn }}>
				{/* Dashboard Tab */}
				{showDashboardTab && (
					<TabPanel
						value={tabValue}
						index={0}
					>
						<GlobalDashboard
							showTitle={false} // Título já mostrado no container
							enableRealtime={true}
							showTimeframeSelector={true}
						/>
					</TabPanel>
				)}

				{/* Performance Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(1)}
				>
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon="⚡"
							title="Análise de Performance"
							description="Velocidade de resposta, disponibilidade e performance por região dos seus links."
							highlight="Otimize a experiência do usuário"
						/>
					</Box>
					<PerformanceAnalysis
						linkId={linkId}
						globalMode={globalMode}
					/>
				</TabPanel>

				{/* Geografia Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(2)}
				>
					<GeographicAnalysis
						linkId={linkId}
						globalMode={globalMode}
						showTitle={false} // Título já mostrado na tab
						enableRealtime={true}
						minClicks={1}
					/>
				</TabPanel>

				{/* Temporal Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(3)}
				>
					<TemporalAnalysis
						linkId={linkId}
						globalMode={globalMode}
						showTitle={false}
						enableRealtime={true}
						timeRange="7d"
						showAdvancedControls={true}
					/>
				</TabPanel>

				{/* Audiência Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(4)}
				>
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon="👥"
							title="Análise de Audiência"
							description="Perfil detalhado da sua audiência com dispositivos, navegadores e comportamento."
							highlight="Conheça melhor seus usuários"
						/>
					</Box>
					<AudienceAnalysis
						linkId={linkId}
						globalMode={globalMode}
						showTitle={false}
					/>
				</TabPanel>

				{/* Heatmap Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(5)}
				>
					<HeatmapAnalysis
						linkId={linkId}
						globalMode={!linkId}
					/>
				</TabPanel>

				{/* Insights Tab */}
				<TabPanel
					value={tabValue}
					index={getTabIndex(6)}
				>
					<InsightsAnalysis
						linkId={linkId}
						globalMode={globalMode}
						showTitle={false}
						enableRealtime={false} // Insights não precisam de tempo real
						maxInsights={15}
					/>
				</TabPanel>
			</Box>
		</Box>
	);
}

export default AnalyticsContent;
