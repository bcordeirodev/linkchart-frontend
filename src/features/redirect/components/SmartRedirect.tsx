import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import useRedirectWithDelay from '@/features/redirect/hooks/useRedirectWithDelay';
import LoadingWithRedirect from '@/shared/layout/LoadingWithRedirect';

// Styled Components
import {
	RedirectContainer,
	RedirectCard,
	RedirectContent,
	RedirectActions,
	RedirectTitle,
	RedirectMessage,
	CountdownDisplay,
	CountdownNumber,
	CountdownLabel,
	ContinueButton,
	GoNowButton,
	CancelRedirectButton,
	LoadingContainer,
	LoadingSpinner,
	LoadingText,
	RedirectDecoration
} from './styles/Redirect.styled';

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
			>
				<RedirectContainer>
					<RedirectCard>
						<RedirectDecoration />
						<RedirectContent>
							<RedirectTitle
								variant="h6"
								gutterBottom
							>
								{title}
							</RedirectTitle>
							<RedirectMessage variant="body2">{message}</RedirectMessage>
						</RedirectContent>
						<RedirectActions>
							<ContinueButton
								variant="contained"
								onClick={startRedirect}
							>
								Continue
							</ContinueButton>
						</RedirectActions>
					</RedirectCard>
				</RedirectContainer>
			</motion.div>
		);
	}

	if (isRedirecting) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<RedirectContainer>
					<RedirectCard>
						<RedirectDecoration />
						<RedirectContent>
							<LoadingContainer>
								<LoadingSpinner>
									<CircularProgress size={50} />
								</LoadingSpinner>
								<LoadingText>{title}</LoadingText>
							</LoadingContainer>

							{showCountdown && countdown > 0 && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<CountdownDisplay>
										<CountdownNumber>{countdown}</CountdownNumber>
										<CountdownLabel>segundos restantes</CountdownLabel>
									</CountdownDisplay>
								</motion.div>
							)}

							<RedirectMessage sx={{ mt: 2 }}>{message}</RedirectMessage>
						</RedirectContent>

						<RedirectActions>
							<GoNowButton
								variant="contained"
								onClick={redirectImmediately}
								size="small"
							>
								Ir Agora
							</GoNowButton>

							{allowCancel && (
								<CancelRedirectButton
									variant="outlined"
									onClick={handleCancel}
									size="small"
								>
									Cancelar
								</CancelRedirectButton>
							)}
						</RedirectActions>
					</RedirectCard>
				</RedirectContainer>
			</motion.div>
		);
	}

	// Fallback loading state
	return <LoadingWithRedirect message={title} />;
}

export default SmartRedirect;
