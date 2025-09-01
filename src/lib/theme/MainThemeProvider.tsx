/**
 * 🎨 MAIN THEME PROVIDER - LINK CHART
 * Provider principal de tema da aplicação com suporte a RTL e otimizações
 *
 * @description
 * Este provider é responsável por aplicar o tema selecionado em toda a aplicação.
 * Inclui suporte para direção de texto (RTL/LTR), cache de estilos otimizado
 * e integração completa com Material-UI.
 *
 * @features
 * - ✅ Suporte a RTL/LTR
 * - ✅ Cache de estilos otimizado com Emotion
 * - ✅ Integração com Material-UI
 * - ✅ Aplicação automática de temas Fuse
 * - ✅ Layers CSS para organização
 *
 * @example
 * ```tsx
 * import { MainThemeProvider } from '@/lib/theme';
 *
 * function App() {
 *   return (
 *     <MainThemeProvider>
 *       <YourAppContent />
 *     </MainThemeProvider>
 *   );
 * }
 * ```
 *
 * @since 1.0.0
 * @version 2.0.0
 */

import * as React from 'react';
import { useMemo } from 'react';
import rtlPlugin from 'stylis-plugin-rtl';
import { useMainTheme } from './hooks/fuseThemeHooks';
import createCache, { Options, StylisPlugin } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

/**
 * Props do MainThemeProvider
 * @interface MainThemeProviderProps
 */
type MainThemeProviderProps = {
	/** Elementos filhos que receberão o tema */
	children: React.ReactNode;
};

/**
 * Plugin Stylis para envolver estilos em CSS layers
 * @param {string} layerName - Nome da layer CSS
 * @returns {StylisPlugin} Plugin configurado
 */
const wrapInLayer: (layerName: string) => StylisPlugin = (layerName) => (node) => {
	if (node.root) {
		return;
	}

	// Se estamos na raiz, substituir node por `@layer layerName { node }`
	const child = { ...node, parent: node, root: node };
	Object.assign(node, {
		children: [child],
		length: 6,
		parent: null,
		props: [layerName],
		return: '',
		root: null,
		type: '@layer',
		value: `@layer ${layerName}`
	});
};

/**
 * Opções de cache do Emotion para diferentes direções de texto
 * @constant {Record<string, Options>}
 */
const emotionCacheOptions: Record<string, Options> = {
	/** Configuração para texto RTL (Right-to-Left) */
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin, wrapInLayer('mui')],
		prepend: false
	},
	/** Configuração para texto LTR (Left-to-Right) */
	ltr: {
		key: 'muiltr',
		stylisPlugins: [wrapInLayer('mui')],
		prepend: false
	}
};

/**
 * Provider principal de tema da aplicação
 * @param {MainThemeProviderProps} props - Props do componente
 * @returns {JSX.Element} Provider configurado com tema e cache
 */
function MainThemeProvider({ children }: MainThemeProviderProps) {
	// Obter tema principal atual
	const mainTheme = useMainTheme();
	const langDirection = mainTheme?.direction || 'ltr';

	// Cache otimizado baseado na direção do texto
	const cacheProviderValue = useMemo(() => createCache(emotionCacheOptions[langDirection]), [langDirection]);

	// Criar tema Material-UI a partir do tema Fuse
	const muiTheme = useMemo(() => {
		if (!mainTheme) {
			console.warn('MainTheme não encontrado, usando tema padrão');
			return createTheme();
		}
		return createTheme(mainTheme);
	}, [mainTheme]);

	return (
		<CacheProvider value={cacheProviderValue}>
			<ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
		</CacheProvider>
	);
}

export default MainThemeProvider;
