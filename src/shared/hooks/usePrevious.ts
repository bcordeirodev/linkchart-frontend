import { useEffect, useRef } from 'react';

/**
 * Hook que retorna o valor anterior de uma variável
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
