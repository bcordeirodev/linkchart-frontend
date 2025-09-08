import { Analytics } from '@/features/analytics/components/Analytics';
import { useLinks } from '@/features/links/hooks/useLinks';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de analytics global REFATORADA
 * 
 * @description
 * Agora usa modo global sem depender do endpoint comprehensive.
 * Cada tab carrega seus dados individualmente através de hooks específicos.
 * 
 * @architecture
 * - Não precisa mais de useEnhancedAnalytics
 * - Cada componente de tab usa seu próprio hook
 * - Modo global ativado por linkId=undefined
 */
function AnalyticsPage() {
	const { links } = useLinks();

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Analytics
					data={null} // Não precisa mais de data centralizada
					loading={false} // Cada tab gerencia seu próprio loading
					error={null} // Cada tab gerencia seu próprio erro
					linkId={undefined} // Modo global - cada hook detecta automaticamente
					showHeader={true}
					showTabs={true}
					linksData={links as any} // Compatibilidade de tipos
					showDashboardTab={true}
				/>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default AnalyticsPage;
