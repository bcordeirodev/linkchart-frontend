'use client';

import { Box, Alert, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { useLinkAnalyticsOptimized } from '@/features/links/hooks/useLinkAnalyticsOptimized';
import { LinkAnalyticsHeader, LinkAnalyticsMetrics, LinkAnalyticsTabs } from '@/features/links/components/analytics';

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
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: 400,
							flexDirection: 'column',
							gap: 2
						}}
					>
						<CircularProgress size={60} />
						<Box sx={{ typography: 'h6' }}>Carregando analytics do link...</Box>
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
				<Box>
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
