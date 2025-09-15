import { useParams } from 'react-router-dom';
import { Box, Fade, Stack } from '@mui/material';
import { memo, useMemo } from 'react';

// Components
import { PublicLayout } from '@/shared/layout';
import { ResponsiveContainer } from '@/shared/ui/base';
import {
	BasicAnalyticsHeader,
	LinkInfoCard,
	BasicMetrics,
	BasicCharts,
	AnalyticsInfo,
	LoadingState,
	ErrorState
} from '@/features/basic-analytics';

// Hooks
import { useBasicAnalytics } from '@/features/basic-analytics';
// import { GoogleAdsSpace } from '@/lib/ads';

/**
 * 📊 PÁGINA DE ANALYTICS BÁSICOS PÚBLICOS - OTIMIZADA
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
 * - Performance otimizada com memo e useMemo
 * - Layout responsivo com ResponsiveContainer
 * - Animações suaves com Fade
 * - Seguindo regra de < 100 linhas por página
 */
function BasicAnalyticsPage() {
	const { slug } = useParams<{ slug: string }>();

	// Hook customizado que gerencia todo o estado e lógica
	const { linkData, analyticsData, loading, error, debugInfo, handleCopyLink, handleCreateLink, handleVisitLink } =
		useBasicAnalytics({ slug });

	// Memoizar ações para evitar re-renders desnecessários
	const actions = useMemo(
		() => ({
			handleCopyLink,
			handleCreateLink,
			handleVisitLink
		}),
		[handleCopyLink, handleCreateLink, handleVisitLink]
	);

	// Memoizar props dos componentes para otimização (com type assertion para garantir que não são null)
	const linkInfoProps = useMemo(
		() => ({
			linkData: linkData!,
			actions
		}),
		[linkData, actions]
	);

	const analyticsInfoProps = useMemo(
		() => ({
			analyticsData: analyticsData!,
			actions
		}),
		[analyticsData, actions]
	);

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

	return (
		<PublicLayout
			variant="shorter"
			showHeader={true}
			showFooter={true}
		>
			<ResponsiveContainer
				variant="page"
				maxWidth="lg"
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<Stack
					spacing={{ xs: 2, sm: 3 }}
					sx={{ width: '100%' }}
				>
					{/* Header com animação */}
					<Fade
						in
						timeout={600}
					>
						<Box>
							<BasicAnalyticsHeader />
						</Box>
					</Fade>

					{/* Link Info Card com animação */}
					<Fade
						in
						timeout={1000}
					>
						<Box>
							<LinkInfoCard {...linkInfoProps} />
						</Box>
					</Fade>

					{/* Metrics com animação */}
					<Fade
						in
						timeout={1200}
					>
						<Box>
							<BasicMetrics analyticsData={analyticsData} />
						</Box>
					</Fade>

					{/* Basic Charts com animação */}
					{analyticsData && (
						<Fade
							in
							timeout={1600}
						>
							<Box>
								<BasicCharts analyticsData={analyticsData} />
							</Box>
						</Fade>
					)}

					{/* Analytics Info com animação*/}
					<Fade
						in
						timeout={2000}
					>
						<Box sx={{ mt: 0, mb: 0 }}>
							<AnalyticsInfo {...analyticsInfoProps} />
						</Box>
					</Fade>
				</Stack>
			</ResponsiveContainer>
		</PublicLayout>
	);
}

export default memo(BasicAnalyticsPage);
