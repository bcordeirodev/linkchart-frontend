/**
 * 🏗️ LAYOUT COMPONENT - LINK CHART
 * Componente de layout principal adaptado da estrutura Fuse
 *
 * @description
 * Este componente gerencia o layout da aplicação, renderizando diferentes
 * estilos de layout baseados nas configurações atuais. Adaptado do
 * FuseLayout para a arquitetura Link Charts.
 *
 * @features
 * - ✅ Múltiplos estilos de layout
 * - ✅ Configurações dinâmicas
 * - ✅ Scroll automático em mudanças de rota
 * - ✅ Performance otimizada
 * - ✅ Integração com sistema de temas
 *
 * @since 2.0.0
 */

import _ from 'lodash';
import { useEffect, useMemo } from 'react';

import { usePathname } from '@/shared/hooks';

import { LayoutSettingsContext } from './LayoutSettingsContext';
import { useLayoutSettings } from './useLayoutSettings';

import type { MainLayoutProps } from './types';

/**
 * Componente de layout principal
 * @param {MainLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout renderizado
 */
export function Layout(props: MainLayoutProps) {
	const { layouts, children, settings: forcedSettings } = props;

	// Hooks
	const { data: current } = useLayoutSettings();
	const pathname = usePathname();

	// Configurações de layout
	const currentLayoutSetting = useMemo(() => current.layout, [current]);

	/**
	 * Mescla configurações atuais com configurações forçadas
	 */
	const layoutSetting = useMemo(
		() => _.merge({}, currentLayoutSetting, forcedSettings),
		[currentLayoutSetting, forcedSettings]
	);

	/**
	 * Estilo de layout atual
	 */
	const layoutStyle = useMemo(() => layoutSetting.style, [layoutSetting]);

	/**
	 * Scroll para o topo em mudanças de rota
	 */
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	/**
	 * Renderiza o conteúdo do layout
	 */
	const layoutContent = useMemo(() => {
		return Object.entries(layouts).map(([key, LayoutComponent]) => {
			if (key === layoutStyle) {
				return <LayoutComponent key={key}>{children}</LayoutComponent>;
			}

			return null;
		});
	}, [layoutStyle, layouts, children]);

	return (
		<LayoutSettingsContext.Provider
			value={{
				data: { ...current, layout: layoutSetting },
				setSettings: () => current,
				changeTheme: () => {
					// TODO: Implementar mudança de tema
				}
			}}
		>
			{layoutContent}
		</LayoutSettingsContext.Provider>
	);
}

export default Layout;
