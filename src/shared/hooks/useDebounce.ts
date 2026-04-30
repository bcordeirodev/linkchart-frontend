import { useCallback, useRef } from 'react';

/**
 * Hook personalizado para debounce de funções
 * Versão simplificada para evitar conflitos de ESLint
 */
function useDebounce<T extends (...args: never[]) => void>(callback: T, delay: number): T {
	const timeoutRef = useRef<NodeJS.Timeout>();

	const debouncedFn = useCallback(
		(...args: never[]) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay]
	) as T;

	return debouncedFn;
}

export default useDebounce;
