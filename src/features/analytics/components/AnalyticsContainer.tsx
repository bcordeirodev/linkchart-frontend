import { Container } from '@mui/material';
import { AnalyticsProps } from '@/types/analytics';
import { AnalyticsHeader } from './shared/AnalyticsHeader';
import { AnalyticsContent } from './shared/AnalyticsContent';
import { AnalyticsStates } from './shared/AnalyticsStates';

/**
 * 🎯 ANALYTICS CONTAINER - ORQUESTRADOR PRINCIPAL
 * 
 * @description
 * Componente orquestrador que gerencia o layout e estados principais
 * do módulo de analytics. Segue o padrão de responsabilidade única:
 * - Gerencia layout geral e container
 * - Delega estados para AnalyticsStates
 * - Delega header para AnalyticsHeader
 * - Delega conteúdo para AnalyticsContent
 * 
 * @architecture
 * AnalyticsContainer (89 linhas)
 * ├── AnalyticsStates (loading/error/empty)
 * ├── AnalyticsHeader (opcional)
 * └── AnalyticsContent (tabs e conteúdo)
 * 
 * @usage
 * ```tsx
 * <AnalyticsContainer
 *   data={analyticsData}
 *   loading={loading}
 *   error={error}
 *   showHeader={true}
 *   showTabs={true}
 * />
 * ```
 */
export function AnalyticsContainer({
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
			<Container maxWidth="xl" sx={{ py: 3 }}>
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
		<Container maxWidth="xl" sx={{ py: 3 }}>
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
 * @deprecated Use AnalyticsContainer instead
 * Mantido para compatibilidade, será removido na v3.0
 */
export const Analytics = AnalyticsContainer;

export default AnalyticsContainer;
