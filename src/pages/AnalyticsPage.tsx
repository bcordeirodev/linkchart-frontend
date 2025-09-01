import { Analytics } from '@/features/analytics/components/Analytics';
import { useEnhancedAnalytics } from '@/features/analytics/hooks/useEnhancedAnalytics';
import { useLinks } from '@/features/links/hooks/useLinks';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de analytics unificada COMPLETA
 * Analytics Rico com funcionalidades de dashboard integradas
 * Heatmap global quando não há linkId específico
 */
function AnalyticsPage() {
	const { links } = useLinks();
	const firstLinkId = links.length > 0 ? links[0].id.toString() : undefined;
	const { data, loading, error, refetch } = useEnhancedAnalytics(firstLinkId || '2');

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Analytics
					data={data}
					loading={loading}
					error={error}
					linkId={firstLinkId}
					showHeader={true}
					showTabs={true}
					linksData={links}
					showDashboardTab={true}
				/>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default AnalyticsPage;
