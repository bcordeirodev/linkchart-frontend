import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para timeout
 * Útil para delays e timeouts controlados
 *
 * @example
 * ```tsx
 * useTimeout(() => {
 *   console.log('Executado após 1 segundo');
 * }, 1000);
 * ```
 */
function useTimeout(callback: () => void, delay: number) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (delay !== null && callback && typeof callback === 'function') {
			timer = setTimeout(callbackRef.current, delay);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [callback, delay]);
}

export default useTimeout;
