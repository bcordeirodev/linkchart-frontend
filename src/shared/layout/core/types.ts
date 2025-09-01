/**
 * 🏗️ LAYOUT TYPES - LINK CHART
 * Tipos TypeScript para o sistema de layout
 * 
 * @description
 * Este arquivo define todos os tipos relacionados ao sistema de layout
 * da aplicação Link Chart, incluindo configurações, temas e estruturas
 * de dados utilizadas pelos componentes de layout.
 * 
 * @since 2.0.0
 */

/**
 * Direção do layout
 */
export type LayoutDirection = 'ltr' | 'rtl';

/**
 * Estilos de layout disponíveis
 */
export type LayoutStyle = 'layout1' | 'layout2' | 'layout3';

/**
 * Configuração da navbar
 * @interface NavbarConfig
 */
export interface NavbarConfig {
    /** Exibir navbar */
    display: boolean;
    /** Navbar recolhida */
    folded: boolean;
    /** Posição da navbar */
    position: 'left' | 'right' | 'top';
    /** Estilo da navbar (compatibilidade) */
    style?: string;
}

/**
 * Configuração da toolbar
 * @interface ToolbarConfig
 */
export interface ToolbarConfig {
    /** Exibir toolbar */
    display: boolean;
    /** Estilo da toolbar */
    style: 'fixed' | 'static' | 'sticky';
}

/**
 * Configuração do footer
 * @interface FooterConfig
 */
export interface FooterConfig {
    /** Exibir footer */
    display: boolean;
    /** Estilo do footer */
    style: 'fixed' | 'static' | 'sticky';
}

/**
 * Configuração do layout
 * @interface LayoutConfig
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
 * Configuração de tema do layout
 * @interface LayoutTheme
 */
export interface LayoutTheme {
    /** Tema principal */
    main: any;
    /** Tema da navbar */
    navbar: any;
    /** Tema da toolbar */
    toolbar: any;
    /** Tema do footer */
    footer: any;
}

/**
 * Configuração completa do layout
 * @interface LayoutSettingsConfigType
 */
export interface LayoutSettingsConfigType {
    /** Configurações de layout */
    layout: {
        /** Estilo do layout */
        style: LayoutStyle;
        /** Configurações específicas */
        config: LayoutConfig;
    };
    /** Configurações de tema */
    theme: LayoutTheme;
    /** Direção do layout */
    direction: LayoutDirection;
    /** Configurações adicionais (compatibilidade) */
    settings?: any;
    /** Configuração de auth padrão */
    defaultAuth?: string[] | [] | null | undefined;
    /** Scrollbars customizadas */
    customScrollbars?: boolean;
    /** URL de redirecionamento de login */
    loginRedirectUrl?: string;
}

/**
 * Tipo para temas de layout
 * @interface LayoutThemesType
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
 * @interface LayoutComponentProps
 */
export interface LayoutComponentProps {
    /** Elementos filhos */
    children: React.ReactNode;
    /** Classe CSS adicional */
    className?: string;
}

/**
 * Props para o componente de layout principal
 * @interface MainLayoutProps
 */
export interface MainLayoutProps extends LayoutComponentProps {
    /** Configurações de layout */
    layouts: Record<string, React.ComponentType<LayoutComponentProps>>;
    /** Configurações forçadas */
    settings?: Partial<LayoutSettingsConfigType['layout']>;
}

/**
 * Configurações padrão de layout
 * @interface LayoutDefaults
 */
export interface LayoutDefaults {
    /** Configuração padrão */
    defaults: LayoutConfig;
    /** Formulário de configuração */
    form?: any; // Tipo específico para formulários de configuração
}
