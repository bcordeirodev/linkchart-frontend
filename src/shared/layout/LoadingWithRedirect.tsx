import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import { Loading } from '@/shared/components';

interface LoadingWithRedirectProps {
	message?: string;
	showProgress?: boolean;
	delay?: number;
}

/**
 * Enhanced loading component for redirects with better UX
 */
function LoadingWithRedirect({ message = 'Redirecting...', showProgress = true, delay = 0 }: LoadingWithRedirectProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{
				opacity: 1,
				scale: 1,
				transition: { delay: delay / 1000 }
			}}
			style={{
				display: 'flex',
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 32,
				minHeight: 400
			}}
		>
			<Box sx={{ textAlign: 'center', maxWidth: 448 }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: (delay + 200) / 1000 }
					}}
				>
					<Loading />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: (delay + 400) / 1000 }
					}}
					style={{ marginTop: 24 }}
				>
					<Typography
						variant='h6'
						sx={(theme) => ({
							color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[700],
							mb: 1
						})}
					>
						{message}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ mb: 2 }}
					>
						Please wait while we redirect you
					</Typography>

					{showProgress ? (
						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{
								opacity: 1,
								scaleX: 1,
								transition: { delay: (delay + 600) / 1000, duration: 0.5 }
							}}
							style={{
								width: '100%',
								maxWidth: 320,
								marginLeft: 'auto',
								marginRight: 'auto'
							}}
						>
							<LinearProgress
								variant='indeterminate'
								sx={{
									borderRadius: 9999,
									'& .MuiLinearProgress-bar': {
										borderRadius: '4px'
									}
								}}
							/>
						</motion.div>
					) : null}
				</motion.div>
			</Box>
		</motion.div>
	);
}

export default LoadingWithRedirect;
