import { useEffect, useRef } from 'react';

/**
 * Hook para timeout controlado
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
