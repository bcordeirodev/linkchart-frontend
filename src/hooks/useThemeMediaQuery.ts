'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

/**
 * Hook personalizado para media queries baseadas no tema MUI
 * Retorna boolean indicando se a tela atual corresponde à query especificada
 *
 * @example
 * ```tsx
 * const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));
 * const isTablet = useThemeMediaQuery((theme) => theme.breakpoints.between('sm', 'lg'));
 * ```
 */
function useThemeMediaQuery(themeCallbackFunc: (theme: Theme) => string) {
	const theme = useTheme();

	const query = themeCallbackFunc(theme).replace('@media ', '');

	// Estado para rastrear se o componente foi montado
	const [hasMounted, setHasMounted] = useState(false);
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Após a montagem, podemos acessar o objeto `window` com segurança
		setHasMounted(true);
	}, []);

	useEffect(() => {
		if (hasMounted) {
			const mediaQuery = window.matchMedia(query);

			// Atualizar estado com valor atual
			setMatches(mediaQuery.matches);

			// Criar event listener para atualizar quando a query mudar
			const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
			mediaQuery.addEventListener('change', handler);

			// Cleanup do event listener ao desmontar
			return () => mediaQuery.removeEventListener('change', handler);
		}

		return undefined;
	}, [query, hasMounted]);

	// Prevenir renderização incompatível garantindo comportamento consistente SSR/client
	if (!hasMounted) {
		return false; // Previne incompatibilidade server-client evitando media queries até render client-side
	}

	return matches;
}

export default useThemeMediaQuery;
