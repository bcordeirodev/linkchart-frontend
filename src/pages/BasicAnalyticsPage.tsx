import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';

// Components
import { PublicLayout } from '@/shared/layout';
import {
	BasicAnalyticsHeader,
	LinkInfoCard,
	BasicMetrics,
	BasicCharts,
	AnalyticsInfo,
	LoadingState,
	ErrorState,
	GoogleAdsSpace
} from '@/features/basic-analytics';

// Hooks
import { useBasicAnalytics } from '@/features/basic-analytics';

/**
 * 📊 PÁGINA DE ANALYTICS BÁSICOS PÚBLICOS - REFATORADA
 *
 * FUNCIONALIDADE:
 * - Exibe analytics básicos de um link público
 * - Não requer autenticação
 * - Layout público com informações limitadas
 * - Componentizada seguindo padrões do projeto
 *
 * ARQUITETURA:
 * - Hook customizado para gerenciamento de estado
 * - Componentes modulares e reutilizáveis
 * - Estados de loading e error dedicados
 * - Seguindo regra de < 100 linhas por página
 */
function BasicAnalyticsPage() {
	const { slug } = useParams<{ slug: string }>();

	// Hook customizado que gerencia todo o estado e lógica
	const { linkData, analyticsData, loading, error, debugInfo, handleCopyLink, handleCreateLink, handleVisitLink } =
		useBasicAnalytics({ slug });

	// Estados de loading e error
	if (loading) {
		return <LoadingState />;
	}

	if (error || !linkData || !analyticsData) {
		return (
			<ErrorState
				error={error || 'Link não encontrado'}
				debugInfo={debugInfo}
				onCreateLink={handleCreateLink}
			/>
		);
	}

	// Ações agrupadas para passar aos componentes
	const actions = {
		handleCopyLink,
		handleCreateLink,
		handleVisitLink
	};

	return (
		<PublicLayout>
			<Container
				maxWidth="lg"
				sx={{
					py: 4,
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				{/* Header */}
				<BasicAnalyticsHeader />

				{/* Google Ads - Leaderboard Superior */}
				<GoogleAdsSpace
					variant="leaderboard"
					sx={{ mb: 4 }}
				/>

				{/* Link Info Card */}
				<LinkInfoCard
					linkData={linkData}
					actions={actions}
				/>

				{/* Metrics */}
				<BasicMetrics analyticsData={analyticsData} />

				{/* Google Ads - Banner Horizontal */}
				<GoogleAdsSpace
					variant="banner"
					sx={{ my: 4 }}
				/>

				{/* Basic Charts */}
				<BasicCharts analyticsData={analyticsData} />

				{/* Google Ads - Rectangle Premium (só exibe se há dados de analytics) */}
				{analyticsData.has_analytics && (
					<GoogleAdsSpace
						variant="rectangle"
						sx={{
							my: 5,
							display: { xs: 'none', sm: 'flex' } // Ocultar em mobile
						}}
					/>
				)}

				{/* Analytics Info */}
				<AnalyticsInfo
					analyticsData={analyticsData}
					actions={actions}
				/>

				{/* Google Ads - Mobile Banner (só em mobile e se há analytics) */}
				{analyticsData.has_analytics && (
					<GoogleAdsSpace
						variant="banner"
						sx={{
							mt: 4,
							display: { xs: 'flex', sm: 'none' } // Só em mobile
						}}
					/>
				)}
			</Container>
		</PublicLayout>
	);
}

export default BasicAnalyticsPage;
