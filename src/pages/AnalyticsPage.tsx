import { Analytics } from '@/features/analytics/components/Analytics';
import { useLinks } from '@/features/links/hooks/useLinks';
import { ResponsiveContainer } from '@/shared/ui/base';
import { PageHeader } from '@/shared/ui/base/PageHeader';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { memo, useMemo } from 'react';
import { AppIcon } from '@/lib/icons';

/**
 * 📊 Página de Analytics Global - OTIMIZADA
 *
 * @description
 * Analytics global que usa componentes com hooks individuais.
 * Cada tab gerencia seus próprios dados de forma independente.
 *
 * @architecture
 * - Usa AnalyticsContainer com modo global
 * - Cada tab usa hook específico (useDashboardData, useGeographicData, etc.)
 * - Responsabilidades bem divididas
 * - Performance otimizada
 *
 * @features
 * - Layout padronizado com AnalyticsLayout
 * - Estados gerenciados individualmente
 * - Dados carregados sob demanda
 */
function AnalyticsPage() {
	const { links } = useLinks();

	// Memoizar props do Analytics para evitar re-renders desnecessários
	const analyticsProps = useMemo(
		() => ({
			data: null, // Não precisa mais de data centralizada
			loading: false, // Cada tab gerencia seu próprio loading
			error: null, // Cada tab gerencia seu próprio erro
			linkId: undefined, // Modo global - cada hook detecta automaticamente
			showHeader: false, // Header já mostrado pela página
			showTabs: true,
			linksData: links as never, // Compatibilidade de tipos
			showDashboardTab: true
		}),
		[links]
	);

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer variant="page">
					<PageHeader
						title="Analytics Global"
						subtitle="Visão completa do desempenho de todos os seus links"
						icon={
							<AppIcon
								intent="analytics"
								size={32}
							/>
						}
						variant="analytics"
					/>
					<Analytics {...analyticsProps} />
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default memo(AnalyticsPage);
