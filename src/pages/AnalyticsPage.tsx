import { Analytics } from '@/components/unified-analytics/Analytics';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { useLinks } from '@/hooks/useLinks';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

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
