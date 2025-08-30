import { Analytics } from '@/features/analytics/components/Analytics';
import { useEnhancedAnalytics } from '@/features/analytics/hooks/useEnhancedAnalytics';
import { useLinks } from '@/features/links/hooks/useLinks';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';

/**
 * Página de analytics unificada COMPLETA
 * Analytics Rico com funcionalidades de dashboard integradas
 */
function AnalyticsPage() {
    const { links } = useLinks();
    const firstLinkId = links.length > 0 ? links[0].id.toString() : '1';
    const { data, loading, error, refetch } = useEnhancedAnalytics(firstLinkId);

    return (
        <AuthGuardRedirect auth={['user', 'admin']}>
            <MainLayout>
                <Analytics
                    data={data}
                    loading={loading}
                    error={error}
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
