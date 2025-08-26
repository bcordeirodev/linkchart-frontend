'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import useRedirectWithDelay from '@/hooks/useRedirectWithDelay';
import LoadingWithRedirect from '../layout/LoadingWithRedirect';

interface SmartRedirectProps {
	to: string;
	delay?: number;
	title?: string;
	message?: string;
	showCountdown?: boolean;
	allowCancel?: boolean;
	onCancel?: () => void;
	onRedirect?: () => void;
	autoStart?: boolean;
}

/**
 * Smart redirect component with user-friendly interface and options
 */
function SmartRedirect({
	to,
	delay = 3000,
	title = 'Redirecting',
	message = 'You will be redirected automatically',
	showCountdown = true,
	allowCancel = false,
	onCancel,
	onRedirect,
	autoStart = true
}: SmartRedirectProps) {
	const { isRedirecting, countdown, startRedirect, cancelRedirect, redirectImmediately } = useRedirectWithDelay(to, {
		delay,
		clearSession: true,
		onRedirect
	});

	useEffect(() => {
		if (autoStart) {
			startRedirect();
		}
	}, [autoStart, startRedirect]);

	const handleCancel = () => {
		cancelRedirect();
		onCancel?.();
	};

	if (!isRedirecting && !autoStart) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-1 items-center justify-center p-4"
			>
				<Card className="max-w-md w-full">
					<CardContent className="text-center">
						<Typography
							variant="h6"
							gutterBottom
						>
							{title}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{message}
						</Typography>
					</CardContent>
					<CardActions className="justify-center">
						<Button
							variant="contained"
							onClick={startRedirect}
						>
							Continue
						</Button>
					</CardActions>
				</Card>
			</motion.div>
		);
	}

	if (isRedirecting) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="flex flex-1 items-center justify-center p-4"
			>
				<Card className="max-w-md w-full">
					<CardContent className="text-center">
						<LoadingWithRedirect
							message={title}
							showProgress={true}
						/>

						{showCountdown && countdown > 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-4"
							>
								<Typography
									variant="h4"
									color="primary"
									className="font-bold"
								>
									{countdown}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									seconds remaining
								</Typography>
							</motion.div>
						)}

						<Typography
							variant="body2"
							color="text.secondary"
							className="mt-2"
						>
							{message}
						</Typography>
					</CardContent>

					<CardActions className="justify-center gap-2">
						<Button
							variant="contained"
							onClick={redirectImmediately}
							size="small"
						>
							Go Now
						</Button>

						{allowCancel && (
							<Button
								variant="outlined"
								onClick={handleCancel}
								size="small"
							>
								Cancel
							</Button>
						)}
					</CardActions>
				</Card>
			</motion.div>
		);
	}

	// Fallback loading state
	return <LoadingWithRedirect message={title} />;
}

export default SmartRedirect;
