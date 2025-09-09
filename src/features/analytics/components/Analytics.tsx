import { Container } from '@mui/material';
import { AnalyticsProps } from '@/types/analytics';
import { AnalyticsHeader } from './shared/AnalyticsHeader';
import { AnalyticsContent } from './shared/AnalyticsContent';
import { AnalyticsStates } from './shared/AnalyticsStates';

/**
 * 🎯 ANALYTICS - COMPONENTE PRINCIPAL UNIFICADO
 *
 * @description
 * Componente principal que gerencia o layout e estados do módulo de analytics.
 * Unifica funcionalidades que antes estavam divididas entre Analytics.tsx e AnalyticsContainer.tsx.
 * Segue o padrão de responsabilidade única:
 * - Gerencia layout geral e container
 * - Delega estados para AnalyticsStates
 * - Delega header para AnalyticsHeader
 * - Delega conteúdo para AnalyticsContent
 *
 * @architecture
 * Analytics (89 linhas)
 * ├── AnalyticsStates (loading/error/empty)
 * ├── AnalyticsHeader (opcional)
 * └── AnalyticsContent (tabs e conteúdo)
 *
 * @usage
 * ```tsx
 * <Analytics
 *   data={analyticsData}
 *   loading={loading}
 *   error={error}
 *   showHeader={true}
 *   showTabs={true}
 * />
 * ```
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
	// Estados especiais apenas para loading/error globais
	// Cada tab agora gerencia seu próprio estado
	if (loading || error) {
		return (
			<Container
				maxWidth="xl"
				sx={{ py: 3 }}
			>
				<AnalyticsStates
					loading={loading}
					error={error}
					hasData={true} // Sempre true, cada tab verifica individualmente
					showHeader={showHeader}
				/>
			</Container>
		);
	}

	// Renderização normal com dados
	return (
		<Container
			maxWidth="xl"
			sx={{ py: 3 }}
		>
			{/* Header opcional */}
			{showHeader && (
				<AnalyticsHeader
					variant="analytics"
					title="Analytics Dashboard"
					subtitle="Análise detalhada e insights de performance dos seus links"
				/>
			)}

			{/* Conteúdo principal com tabs */}
			<AnalyticsContent
				data={data}
				linkId={linkId}
				linksData={linksData}
				showTabs={showTabs}
				showDashboardTab={showDashboardTab}
			/>
		</Container>
	);
}

/**
 * @compatibility Alias para compatibilidade com código existente
 */
export const AnalyticsContainer = Analytics;

export default Analytics;
