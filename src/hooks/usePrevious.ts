'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook personalizado que retorna o valor anterior de uma variável
 * Útil para comparações e detecção de mudanças
 *
 * @example
 * ```tsx
 * const prevCount = usePrevious(count);
 * useEffect(() => {
 *   if (prevCount !== count) {
 *     console.log('Count mudou de', prevCount, 'para', count);
 *   }
 * }, [count, prevCount]);
 * ```
 */
function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T | undefined>(undefined);

	// Armazenar valor atual no ref
	useEffect(() => {
		ref.current = value;
	}, [value]);

	// Retornar valor anterior (acontece antes do update no useEffect acima)
	return ref.current;
}

export default usePrevious;
