'use client';

import { Box, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { useLinkAnalyticsOptimized } from '@/features/links/hooks/useLinkAnalytics';
import { LinkAnalyticsHeader, LinkAnalyticsMetrics, LinkAnalyticsTabs } from '@/features/links/components/analytics';
import { EmptyState } from '@/shared/ui/base/EmptyState';

/**
 * 📊 Página de Analytics Individual de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, reutiliza componentes base
 * Estrutura: Header → Metrics → Tabs (seguindo template obrigatório)
 */
function LinkAnalyticsPage() {
	const { id } = useParams<{ id: string }>();
	const { data, linkInfo, loading, error, refetch } = useLinkAnalyticsOptimized(id || '');

	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<Alert severity="error">ID do link não fornecido na URL</Alert>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<EmptyState
							variant="data"
							icon="📊"
							title="Carregando Analytics"
							description="Preparando dados detalhados do link..."
							height={400}
						/>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (error) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<Alert
							severity="error"
							action={<button onClick={refetch}>Tentar Novamente</button>}
						>
							{error}
						</Alert>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Box sx={{ p: 3 }}>
					<LinkAnalyticsHeader
						linkId={id}
						linkInfo={linkInfo}
						loading={loading}
					/>
					<LinkAnalyticsMetrics
						data={data}
						loading={loading}
					/>
					<LinkAnalyticsTabs
						data={data}
						linkId={id}
						loading={loading}
					/>
				</Box>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkAnalyticsPage;
