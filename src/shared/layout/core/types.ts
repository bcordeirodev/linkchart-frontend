/**
 * 🏗️ LAYOUT TYPES - LINK CHART
 * Tipos TypeScript simplificados para o sistema de layout
 *
 * @description
 * Tipos essenciais para o sistema de layout da aplicação Link Chart.
 * Simplificado para usar apenas layout1 e configurações necessárias.
 *
 * @since 2.0.0
 */

/**
 * Direção do layout
 */
export type LayoutDirection = 'ltr' | 'rtl';

/**
 * Estilo de layout - apenas layout1 é usado
 */
export type LayoutStyle = 'layout1';

/**
 * Configuração da navbar
 */
export interface NavbarConfig {
	/** Exibir navbar */
	display: boolean;
	/** Navbar recolhida */
	folded: boolean;
	/** Posição da navbar - sempre left */
	position: 'left';
}

/**
 * Configuração da toolbar
 */
export interface ToolbarConfig {
	/** Exibir toolbar */
	display: boolean;
	/** Estilo da toolbar */
	style: 'fixed' | 'static';
}

/**
 * Configuração do footer
 */
export interface FooterConfig {
	/** Exibir footer */
	display: boolean;
	/** Estilo do footer - sempre static */
	style: 'static';
}

/**
 * Configuração do layout
 */
export interface LayoutConfig {
	/** Configuração da navbar */
	navbar: NavbarConfig;
	/** Configuração da toolbar */
	toolbar: ToolbarConfig;
	/** Configuração do footer */
	footer: FooterConfig;
}

/**
 * Configuração de tema do layout - simplificado
 */
export interface LayoutTheme {
	/** Tema principal */
	main: string;
	/** Tema da navbar */
	navbar: string;
	/** Tema da toolbar */
	toolbar: string;
	/** Tema do footer */
	footer: string;
}

/**
 * Configuração completa do layout
 */
export interface LayoutSettingsConfigType {
	/** Configurações de layout */
	layout: {
		/** Estilo do layout - sempre layout1 */
		style: LayoutStyle;
		/** Configurações específicas */
		config: LayoutConfig;
	};
	/** Configurações de tema */
	theme: LayoutTheme;
	/** Direção do layout */
	direction: LayoutDirection;
	/** Configuração de auth padrão */
	defaultAuth?: string[] | [] | null | undefined;
	/** URL de redirecionamento de login */
	loginRedirectUrl?: string;
}

/**
 * Tipo para temas de layout
 */
export interface LayoutThemesType {
	/** Tema principal */
	main: string;
	/** Tema da navbar */
	navbar: string;
	/** Tema da toolbar */
	toolbar: string;
	/** Tema do footer */
	footer: string;
}

/**
 * Props para componentes de layout
 */
export interface LayoutComponentProps {
	/** Elementos filhos */
	children: React.ReactNode;
	/** Classe CSS adicional */
	className?: string;
}

/**
 * Props para o componente de layout principal
 */
export interface MainLayoutProps extends LayoutComponentProps {
	/** Configurações de layout */
	layouts: Record<string, React.ComponentType<LayoutComponentProps>>;
	/** Configurações forçadas */
	settings?: Partial<LayoutSettingsConfigType['layout']>;
}

/**
 * Configurações padrão de layout
 */
export interface LayoutDefaults {
	/** Configuração padrão */
	defaults: LayoutConfig;
}
