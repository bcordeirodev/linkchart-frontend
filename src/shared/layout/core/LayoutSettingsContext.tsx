/**
 * 🏗️ LAYOUT SETTINGS CONTEXT - LINK CHART
 * Contexto para gerenciamento de configurações de layout
 *
 * @description
 * Este contexto fornece acesso às configurações de layout em toda
 * a aplicação, permitindo que componentes leiam e modifiquem
 * configurações de layout de forma centralizada.
 *
 * @since 2.0.0
 */

import { createContext } from 'react';
import { LayoutSettingsConfigType, LayoutThemesType } from './types';

/**
 * Tipo do contexto de configurações de layout
 * @interface LayoutSettingsContextType
 */
export interface LayoutSettingsContextType {
	/** Dados das configurações atuais */
	data: LayoutSettingsConfigType;
	/** Função para definir novas configurações */
	setSettings: (settings: Partial<LayoutSettingsConfigType>) => LayoutSettingsConfigType;
	/** Função para alterar tema */
	changeTheme: (theme: LayoutThemesType) => void;
	/** Configurações (compatibilidade com FuseSettings) */
	settings?: any;
}

/**
 * Contexto de configurações de layout
 * @constant {React.Context<LayoutSettingsContextType | undefined>}
 */
export const LayoutSettingsContext = createContext<LayoutSettingsContextType | undefined>(undefined);

export default LayoutSettingsContext;
