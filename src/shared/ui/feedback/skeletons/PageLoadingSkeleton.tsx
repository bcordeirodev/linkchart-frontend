import { Box, Stack, Skeleton, Container } from '@mui/material';

import MainLayout from '@/shared/layout/MainLayout';

/**
 * Skeleton para carregamento de páginas via Suspense
 * Simula a estrutura básica de uma página da aplicação
 */
export function PageLoadingSkeleton() {
	return (
		<MainLayout>
			<Container maxWidth='xl' sx={{ py: 3 }}>
				<Stack spacing={3}>
					{/* Header da página */}
					<Box>
						<Skeleton variant='text' width={240} height={48} sx={{ mb: 1 }} />
						<Skeleton variant='text' width={380} height={28} />
					</Box>

					{/* Cards de métricas ou conteúdo principal */}
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: 'repeat(2, 1fr)',
								md: 'repeat(4, 1fr)'
							},
							gap: 2
						}}
					>
						{[1, 2, 3, 4].map((i) => (
							<Box key={i} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
								<Skeleton variant='text' width='60%' height={24} sx={{ mb: 1 }} />
								<Skeleton variant='text' width='80%' height={40} />
							</Box>
						))}
					</Box>

					{/* Conteúdo principal */}
					<Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
						<Stack spacing={2}>
							<Skeleton variant='text' width={200} height={32} />
							<Skeleton variant='rounded' height={300} />
						</Stack>
					</Box>
				</Stack>
			</Container>
		</MainLayout>
	);
}

export default PageLoadingSkeleton;

