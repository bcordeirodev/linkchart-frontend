import { Box, Stack, Skeleton } from '@mui/material';

import { ResponsiveContainer, EnhancedPaper } from '@/shared/ui/base';

export function QRCodeSkeleton() {
	return (
		<ResponsiveContainer variant='page'>
			<Stack spacing={3}>
				<EnhancedPaper variant='glass'>
					<Box sx={{ p: 4 }}>
						<Stack spacing={4} alignItems='center'>
							<Box sx={{ textAlign: 'center', width: '100%' }}>
								<Skeleton variant='text' width={200} height={32} sx={{ mx: 'auto', mb: 1 }} />
								<Skeleton variant='text' width={280} height={20} sx={{ mx: 'auto' }} />
							</Box>

							<Skeleton variant='rounded' width={280} height={280} sx={{ borderRadius: 2 }} />

							<Stack spacing={1} sx={{ width: '100%', maxWidth: 400 }}>
								<Skeleton variant='text' width='60%' height={20} />
								<Skeleton variant='text' width='100%' height={24} />
								<Skeleton variant='text' width='80%' height={20} />
							</Stack>

							<Stack direction='row' spacing={2}>
								<Skeleton variant='rounded' width={140} height={44} />
								<Skeleton variant='rounded' width={140} height={44} />
							</Stack>

							<Box sx={{ width: '100%', pt: 3, borderTop: 1, borderColor: 'divider' }}>
								<Skeleton variant='text' width={180} height={24} sx={{ mb: 2 }} />
								<Stack direction='row' spacing={2} flexWrap='wrap'>
									<Skeleton variant='rounded' width={100} height={36} />
									<Skeleton variant='rounded' width={100} height={36} />
									<Skeleton variant='rounded' width={100} height={36} />
								</Stack>
							</Box>
						</Stack>
					</Box>
				</EnhancedPaper>
			</Stack>
		</ResponsiveContainer>
	);
}

export default QRCodeSkeleton;

