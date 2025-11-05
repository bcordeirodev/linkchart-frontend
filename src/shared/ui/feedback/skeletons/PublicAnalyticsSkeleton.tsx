import { Box, Stack, Skeleton, Container, Grid } from '@mui/material';

import { PublicLayout } from '@/shared/layout';
import { EnhancedPaper } from '@/shared/ui/base';

export function PublicAnalyticsSkeleton() {
	return (
		<PublicLayout>
			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Stack spacing={4}>
					<Box sx={{ textAlign: 'center' }}>
						<Skeleton variant='text' width={280} height={48} sx={{ mx: 'auto', mb: 1 }} />
						<Skeleton variant='text' width={350} height={24} sx={{ mx: 'auto' }} />
					</Box>

					<Grid container spacing={3}>
						{[1, 2, 3, 4].map((i) => (
							<Grid item xs={12} sm={6} md={3} key={i}>
								<EnhancedPaper variant='outlined'>
									<Box sx={{ p: 2.5, textAlign: 'center' }}>
										<Skeleton variant='text' width='70%' height={24} sx={{ mx: 'auto', mb: 1 }} />
										<Skeleton variant='text' width='50%' height={40} sx={{ mx: 'auto' }} />
									</Box>
								</EnhancedPaper>
							</Grid>
						))}
					</Grid>

					<EnhancedPaper variant='outlined'>
						<Box sx={{ p: 3 }}>
							<Skeleton variant='text' width={200} height={32} sx={{ mb: 3 }} />
							<Skeleton variant='rounded' height={300} />
						</Box>
					</EnhancedPaper>

					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<EnhancedPaper variant='outlined'>
								<Box sx={{ p: 3 }}>
									<Skeleton variant='text' width={180} height={28} sx={{ mb: 2 }} />
									<Stack spacing={1.5}>
										{[1, 2, 3, 4, 5].map((i) => (
											<Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
												<Skeleton variant='text' width='60%' height={24} />
												<Skeleton variant='text' width='20%' height={24} />
											</Box>
										))}
									</Stack>
								</Box>
							</EnhancedPaper>
						</Grid>

						<Grid item xs={12} md={6}>
							<EnhancedPaper variant='outlined'>
								<Box sx={{ p: 3 }}>
									<Skeleton variant='text' width={180} height={28} sx={{ mb: 2 }} />
									<Skeleton variant='rounded' height={250} />
								</Box>
							</EnhancedPaper>
						</Grid>
					</Grid>

					<EnhancedPaper variant='outlined'>
						<Box sx={{ p: 3 }}>
							<Skeleton variant='text' width={200} height={28} sx={{ mb: 2 }} />
							<Grid container spacing={2}>
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<Grid item xs={12} sm={6} md={4} key={i}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
											<Skeleton variant='circular' width={40} height={40} />
											<Box sx={{ flex: 1 }}>
												<Skeleton variant='text' width='80%' height={20} />
												<Skeleton variant='text' width='50%' height={16} />
											</Box>
										</Box>
									</Grid>
								))}
							</Grid>
						</Box>
					</EnhancedPaper>
				</Stack>
			</Container>
		</PublicLayout>
	);
}

export default PublicAnalyticsSkeleton;

