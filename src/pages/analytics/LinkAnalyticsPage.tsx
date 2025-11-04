'use client';

import { Alert } from '@mui/material';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { LinkAnalyticsTabsOptimized } from '@/features/links/components/analytics/LinkAnalyticsTabs';
import { useLinkAnalyticsOptimized } from '@/features/links/hooks/useLinkAnalytics';
import { AppIcon } from '@/shared/ui/icons';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';
import { PageHeader } from '@/shared/ui/base/PageHeader';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';

/**
 * 📊 Página de Analytics Individual de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, reutiliza componentes base
 * Estrutura: Header → Metrics → Tabs (seguindo template obrigatório)
 */
function LinkAnalyticsPage() {
	const { id } = useParams<{ id: string }>();
	const { linkInfo } = useLinkAnalyticsOptimized(id || '');

	// Memoizar props das tabs para evitar re-renders desnecessários
	const tabsProps = useMemo(
		() => ({
			linkId: id!,
			showHeader: false // Header será mostrado pela página
		}),
		[id]
	);

	// Early return para casos de erro
	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<ResponsiveContainer variant='page'>
						<Alert severity='error'>ID do link não fornecido na URL</Alert>
					</ResponsiveContainer>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer variant='page'>
					<PageHeader
						title={linkInfo?.title || `Analytics do Link`}
						subtitle={`Análise detalhada do desempenho do link ${linkInfo?.short_url || id}`}
						icon={
							<AppIcon
								intent='analytics'
								size={32}
							/>
						}
						variant='analytics'
					/>
					<LinkAnalyticsTabsOptimized {...tabsProps} />
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default memo(LinkAnalyticsPage);
