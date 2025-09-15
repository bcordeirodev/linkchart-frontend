import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetSessionRedirectUrl } from '@/lib/auth/sessionRedirectUrl';

interface UseRedirectWithDelayOptions {
	delay?: number;
	clearSession?: boolean;
	onRedirect?: () => void;
}

/**
 * Custom hook for handling delayed redirects with better UX
 */
export function useRedirectWithDelay(targetUrl: string, options: UseRedirectWithDelayOptions = {}) {
	const { delay = 1000, clearSession = false, onRedirect } = options;
	const navigate = useNavigate();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const startRedirect = useCallback(() => {
		setIsRedirecting(true);

		if (delay > 1000) {
			// Show countdown for delays longer than 1 second
			const countdownSeconds = Math.ceil(delay / 1000);
			setCountdown(countdownSeconds);

			const countdownInterval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(countdownInterval);
						return 0;
					}

					return prev - 1;
				});
			}, 1000);
		}

		const timer = setTimeout(() => {
			if (clearSession) {
				resetSessionRedirectUrl();
			}

			onRedirect?.();
			navigate(targetUrl);
		}, delay);

		return () => {
			clearTimeout(timer);

			if (delay > 1000) {
				setCountdown(0);
			}
		};
	}, [targetUrl, delay, clearSession, navigate, onRedirect]);

	const cancelRedirect = useCallback(() => {
		setIsRedirecting(false);
		setCountdown(0);
	}, []);

	const redirectImmediately = useCallback(() => {
		if (clearSession) {
			resetSessionRedirectUrl();
		}

		onRedirect?.();
		navigate(targetUrl);
	}, [targetUrl, clearSession, navigate, onRedirect]);

	return {
		isRedirecting,
		countdown,
		startRedirect,
		cancelRedirect,
		redirectImmediately
	};
}

export default useRedirectWithDelay;
