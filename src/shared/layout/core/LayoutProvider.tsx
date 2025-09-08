/**
 * 🏗️ LAYOUT PROVIDER - LINK CHART
 * Provider de layout adaptado da estrutura Fuse para Link Chart
 *
 * @description
 * Este provider gerencia as configurações de layout da aplicação,
 * integrando com o sistema de temas e configurações de usuário.
 * Adaptado do FuseSettingsProvider para a arquitetura Link Chart.
 *
 * @features
 * - ✅ Gerenciamento de configurações de layout
 * - ✅ Integração com sistema de temas
 * - ✅ Suporte a configurações de usuário
 * - ✅ Persistência de preferências
 * - ✅ Performance otimizada
 *
 * @since 2.0.0
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';
import _ from 'lodash';
import useUser from '@/lib/auth/useUser';
import settingsConfig from '@/lib/settingsConfig';
import { LayoutSettingsContext } from './LayoutSettingsContext';
import { LayoutSettingsConfigType, LayoutThemesType } from './types';

/**
 * Configurações padrão do layout
 */
const defaultLayoutSettings: LayoutSettingsConfigType = {
	layout: {
		style: 'layout1',
		config: {
			navbar: { display: true, folded: false, position: 'left' },
			toolbar: { display: true, style: 'fixed' },
			footer: { display: true, style: 'static' }
		}
	},
	theme: {
		main: 'default',
		navbar: 'defaultDark',
		toolbar: 'default',
		footer: 'defaultDark'
	},
	direction: 'ltr' as const
};

/**
 * Gera configurações iniciais do layout
 */
const getInitialLayoutSettings = (): LayoutSettingsConfigType => {
	// Usa diretamente as configurações do settingsConfig
	return _.merge({}, defaultLayoutSettings, settingsConfig);
};

/**
 * Gera configurações de layout com base nas novas configurações
 */
const generateLayoutSettings = (
	defaultSettings: LayoutSettingsConfigType,
	newSettings: PartialDeep<LayoutSettingsConfigType>
): LayoutSettingsConfigType => {
	// Simplesmente mescla as configurações - sempre usa layout1
	return _.merge({}, defaultSettings, newSettings);
};

/**
 * Props do LayoutProvider
 * @interface LayoutProviderProps
 */
export interface LayoutProviderProps {
	/** Elementos filhos */
	children: ReactNode;
}

/**
 * Provider de configurações de layout da aplicação
 * @param {LayoutProviderProps} props - Props do componente
 * @returns {JSX.Element} Provider configurado
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
	const { data: user, isGuest } = useUser();

	// Configurações do usuário
	const userSettings = useMemo(() => user?.settings || {}, [user]);

	// Configurações iniciais
	const initialSettings = useMemo(() => getInitialLayoutSettings(), []);

	/**
	 * Calcula configurações baseadas no usuário
	 */
	const calculateSettings = useCallback(() => {
		const defaultSettings = _.merge({}, initialSettings);
		return isGuest ? defaultSettings : _.merge({}, defaultSettings, userSettings);
	}, [isGuest, userSettings, initialSettings]);

	// Estado das configurações
	const [data, setData] = useState<LayoutSettingsConfigType>(calculateSettings());

	/**
	 * Sincroniza dados com configurações do usuário
	 */
	useEffect(() => {
		const newSettings = calculateSettings();

		// Só atualiza se as configurações são diferentes
		if (!_.isEqual(data, newSettings)) {
			setData(newSettings);
		}
	}, [calculateSettings, data]);

	/**
	 * Define novas configurações de layout
	 */
	const setSettings = useCallback(
		(newSettings: Partial<LayoutSettingsConfigType>) => {
			const updatedSettings = generateLayoutSettings(data, newSettings);

			if (!_.isEqual(updatedSettings, data)) {
				setData(_.merge({}, updatedSettings));
			}

			return updatedSettings;
		},
		[data]
	);

	/**
	 * Altera tema do layout
	 */
	const changeTheme = useCallback(
		(newTheme: LayoutThemesType) => {
			const { navbar, footer, toolbar, main } = newTheme;

			const newSettings: LayoutSettingsConfigType = {
				...data,
				theme: {
					main,
					navbar,
					toolbar,
					footer
				}
			};

			setSettings(newSettings);
		},
		[data, setSettings]
	);

	/**
	 * Valor do contexto
	 */
	const contextValue = useMemo(
		() => ({
			data,
			setSettings,
			changeTheme,
			settings: data // Compatibilidade com FuseSettings
		}),
		[data, setSettings, changeTheme]
	);

	return <LayoutSettingsContext.Provider value={contextValue}>{children}</LayoutSettingsContext.Provider>;
}

export default LayoutProvider;
