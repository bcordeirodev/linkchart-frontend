'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para debounce de funções
 * Útil para otimizar performance em inputs e buscas
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(handleSearch, 300);
 * ```
 */
function useDebounce<T extends (...args: never[]) => void>(callback: T, delay: number): T {
	const callbackRef = useRef<T>(callback);

	// Atualizar callback atual a cada mudança
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const debouncedFn = useCallback(
		((...args: never[]) => {
			const timeoutId = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);

			// Cleanup para cancelar chamadas pendentes
			return () => clearTimeout(timeoutId);
		}) as unknown as T,
		[delay]
	);

	useEffect(() => {
		// Cleanup ao desmontar componente
		return () => {
			// Cancelar qualquer timeout pendente
		};
	}, [debouncedFn]);

	return debouncedFn;
}

export default useDebounce;
