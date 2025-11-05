import { Box, Stack, Skeleton } from '@mui/material';

import { ResponsiveContainer, EnhancedPaper } from '@/shared/ui/base';

interface LinkFormSkeletonProps {
	isEdit?: boolean;
}

export function LinkFormSkeleton({ isEdit = false }: LinkFormSkeletonProps) {
	return (
		<ResponsiveContainer variant='form' maxWidth='md'>
			<EnhancedPaper variant='glass' animated>
				<Box sx={{ p: 3, pb: 2 }}>
					<Skeleton variant='text' width={isEdit ? 150 : 180} height={40} sx={{ mb: 1 }} />
					<Skeleton variant='text' width={280} height={24} />
				</Box>

				<Box sx={{ px: 3, pb: 3 }}>
					<Stack spacing={2.5}>
						<Skeleton variant='rounded' height={56} />
						<Skeleton variant='rounded' height={56} />
						<Skeleton variant='rounded' height={100} />

						<Box sx={{ mt: 1 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
								<Skeleton variant='text' width={200} height={24} />
								<Skeleton variant='rounded' width={80} height={28} />
							</Box>
						</Box>

						<Box sx={{ mt: 1 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
								<Skeleton variant='text' width={150} height={24} />
								<Skeleton variant='rounded' width={80} height={28} />
							</Box>
						</Box>
					</Stack>
				</Box>

				<Box
					sx={{
						px: 3,
						py: 2.5,
						borderTop: 1,
						borderColor: 'divider',
						backgroundColor: 'action.hover'
					}}
				>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={2}
						justifyContent='space-between'
					>
						<Skeleton variant='rounded' width={100} height={40} />
						<Skeleton variant='rounded' width={isEdit ? 150 : 120} height={40} />
					</Stack>
				</Box>
			</EnhancedPaper>
		</ResponsiveContainer>
	);
}

export default LinkFormSkeleton;

