import { Box, Stack, Skeleton, Grid } from '@mui/material';

import { ResponsiveContainer, EnhancedPaper } from '@/shared/ui/base';

interface LinkListSkeletonProps {
	isMobile?: boolean;
	count?: number;
}

export function LinkListSkeleton({ isMobile = false, count = 5 }: LinkListSkeletonProps) {
	return (
		<ResponsiveContainer variant='page'>
			<Stack spacing={3}>
				<Box>
					<Skeleton variant='text' width={200} height={40} sx={{ mb: 1 }} />
					<Skeleton variant='text' width={300} height={24} />
				</Box>

				<Grid container>
					{[1, 2, 3, 4].map((i) => (
						<Grid item xs={12} sm={6} md={3} key={i}>
							<EnhancedPaper variant='outlined'>
								<Stack spacing={1} sx={{ p: 2 }}>
									<Skeleton variant='text' width='60%' height={24} />
									<Skeleton variant='text' width='90%' height={32} />
								</Stack>
							</EnhancedPaper>
						</Grid>
					))}
				</Grid>

				<Box>
					<Stack direction='row' spacing={2} sx={{ mb: 2 }}>
						<Skeleton variant='rounded' width={200} height={40} />
						<Skeleton variant='rounded' width={150} height={40} />
					</Stack>
				</Box>

				{isMobile ? (
					<Stack spacing={2}>
						{Array.from({ length: count }).map((_, i) => (
							<EnhancedPaper key={i} variant='outlined'>
								<Stack spacing={2} sx={{ p: 2 }}>
									<Box>
										<Skeleton variant='text' width='70%' height={24} />
										<Skeleton variant='text' width='90%' height={20} />
									</Box>
									<Stack direction='row' spacing={1}>
										<Skeleton variant='rounded' width={60} height={32} />
										<Skeleton variant='rounded' width={60} height={32} />
										<Skeleton variant='rounded' width={60} height={32} />
									</Stack>
									<Stack direction='row' spacing={1}>
										<Skeleton variant='circular' width={32} height={32} />
										<Skeleton variant='circular' width={32} height={32} />
										<Skeleton variant='circular' width={32} height={32} />
									</Stack>
								</Stack>
							</EnhancedPaper>
						))}
					</Stack>
				) : (
					<EnhancedPaper variant='outlined'>
						<Box sx={{ p: 2 }}>
							<Stack spacing={1}>
								<Skeleton variant='text' height={40} />
								{Array.from({ length: count }).map((_, i) => (
									<Skeleton key={i} variant='rounded' height={60} />
								))}
							</Stack>
						</Box>
					</EnhancedPaper>
				)}
			</Stack>
		</ResponsiveContainer>
	);
}

export default LinkListSkeleton;

