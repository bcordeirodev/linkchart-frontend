/**
 * 🏗️ USE LAYOUT SETTINGS HOOK - LINK CHART
 * Hook para acessar configurações de layout
 *
 * @description
 * Este hook fornece acesso às configurações de layout da aplicação,
 * permitindo que componentes leiam e modifiquem configurações de
 * layout de forma segura e tipada.
 *
 * @example
 * ```tsx
 * import { useLayoutSettings } from '@/shared/layout/core';
 *
 * function MyComponent() {
 *   const { data, setSettings, changeTheme } = useLayoutSettings();
 *
 *   const toggleNavbar = () => {
 *     setSettings({
 *       layout: {
 *         ...data.layout,
 *         config: {
 *           ...data.layout.config,
 *           navbar: {
 *             ...data.layout.config.navbar,
 *             display: !data.layout.config.navbar.display
 *           }
 *         }
 *       }
 *     });
 *   };
 *
 *   return <button onClick={toggleNavbar}>Toggle Navbar</button>;
 * }
 * ```
 *
 * @since 2.0.0
 */

import { useContext } from 'react';

import { LayoutSettingsContext } from './LayoutSettingsContext';

import type { LayoutSettingsContextType } from './LayoutSettingsContext';

/**
 * Hook para acessar configurações de layout
 * @returns {LayoutSettingsContextType} Configurações de layout
 * @throws {Error} Se usado fora do LayoutProvider
 */
export const useLayoutSettings = (): LayoutSettingsContextType => {
	const context = useContext(LayoutSettingsContext);

	if (!context) {
		throw new Error('useLayoutSettings must be used within a LayoutProvider');
	}

	return context;
};

export default useLayoutSettings;
