import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

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
			className="flex flex-1 flex-col items-center justify-center p-8 min-h-[400px]"
		>
			<div className="text-center max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: (delay + 200) / 1000 }
					}}
				>
					<FuseLoading />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: (delay + 400) / 1000 }
					}}
					className="mt-6"
				>
					<Typography
						variant="h6"
						className="text-gray-700 dark:text-gray-300 mb-2"
					>
						{message}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						className="mb-4"
					>
						Please wait while we redirect you
					</Typography>

					{showProgress && (
						<motion.div
							initial={{ opacity: 0, scaleX: 0 }}
							animate={{
								opacity: 1,
								scaleX: 1,
								transition: { delay: (delay + 600) / 1000, duration: 0.5 }
							}}
							className="w-full max-w-xs mx-auto"
						>
							<LinearProgress
								variant="indeterminate"
								className="rounded-full"
								sx={{
									'& .MuiLinearProgress-bar': {
										borderRadius: '4px'
									}
								}}
							/>
						</motion.div>
					)}
				</motion.div>
			</div>
		</motion.div>
	);
}

export default LoadingWithRedirect;
