'use client';

import { Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { memo, useMemo } from 'react';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { useLinkAnalyticsOptimized } from '@/features/links/hooks/useLinkAnalytics';
import { LinkAnalyticsHeader, LinkAnalyticsMetrics } from '@/features/links/components/analytics';
import { LinkAnalyticsTabsOptimized } from '@/features/links/components/analytics/LinkAnalyticsTabs';
import AnalyticsLayout from '@/shared/ui/layout/AnalyticsLayout';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';

/**
 * 📊 Página de Analytics Individual de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, reutiliza componentes base
 * Estrutura: Header → Metrics → Tabs (seguindo template obrigatório)
 */
function LinkAnalyticsPage() {
	const { id } = useParams<{ id: string }>();
	const { data, linkInfo, loading, error, refetch } = useLinkAnalyticsOptimized(id || '');

	// Memoizar props estáveis para evitar re-renders desnecessários
	const stateManagerProps = useMemo(
		() => ({
			loading,
			error,
			hasData: !!data,
			onRetry: refetch,
			loadingMessage: 'Preparando dados detalhados do link...',
			errorMessage: error || undefined
		}),
		[loading, error, data, refetch]
	);

	const headerProps = useMemo(
		() => ({
			linkId: id!,
			linkInfo,
			loading
		}),
		[id, linkInfo, loading]
	);

	const metricsProps = useMemo(
		() => ({
			data,
			loading
		}),
		[data, loading]
	);

	const tabsProps = useMemo(
		() => ({
			data,
			linkId: id!,
			loading
		}),
		[data, id, loading]
	);

	// Early return para casos de erro
	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<AnalyticsLayout>
						<Alert severity="error">ID do link não fornecido na URL</Alert>
					</AnalyticsLayout>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<AnalyticsLayout>
					<AnalyticsStateManager {...stateManagerProps}>
						<LinkAnalyticsHeader {...headerProps} />
						<LinkAnalyticsMetrics {...metricsProps} />
						<LinkAnalyticsTabsOptimized {...tabsProps} />
					</AnalyticsStateManager>
				</AnalyticsLayout>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default memo(LinkAnalyticsPage);
