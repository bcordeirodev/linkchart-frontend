'use client';

import { Analytics } from '@/components/unified-analytics/Analytics';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { useLinks } from '@/hooks/useLinks';

/**
 * Página de analytics unificada COMPLETA
 * Analytics Rico com funcionalidades de dashboard integradas
 */
function AnalyticsPage() {
    const { data, loading, error, refetch } = useEnhancedAnalytics('1'); // ID 1 para analytics geral
    const { links } = useLinks();

    return (
        <Analytics
            data={data}
            loading={loading}
            error={error}
            showHeader={true}
            showTabs={true}
            linksData={links}
            showDashboardTab={true}
        />
    );
}

export default AnalyticsPage;
