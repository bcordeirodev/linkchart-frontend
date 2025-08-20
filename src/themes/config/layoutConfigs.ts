/**
 * Configurações de layout centralizadas para Link Charts
 * Movido de theme-layouts para centralizar em src/themes
 */

import ThemeFormConfigTypes from '@fuse/core/FuseSettings/ThemeFormConfigTypes';

export type themeLayoutDefaultsProps = {
    mode: 'container' | 'boxed';
    containerWidth: number;
    navbar: {
        display: boolean;
        style: string;
        folded: boolean;
        position: string;
    };
    toolbar: {
        display: boolean;
        style: string;
    };
    footer: {
        display: boolean;
        style: string;
    };
    leftSidePanel: {
        display: boolean;
    };
    rightSidePanel: {
        display: boolean;
    };
};

/**
 * Configuração padrão do layout principal
 */
const layout1Config = {
    title: 'Layout Principal Link Charts',
    defaults: {
        mode: 'container',
        containerWidth: 1200,
        navbar: {
            display: true,
            style: 'style-1',
            folded: false,
            position: 'left'
        },
        toolbar: {
            display: true,
            style: 'fixed'
        },
        footer: {
            display: true,
            style: 'fixed'
        },
        leftSidePanel: {
            display: false
        },
        rightSidePanel: {
            display: false
        }
    } as themeLayoutDefaultsProps,
    form: {} as ThemeFormConfigTypes
};

/**
 * Configurações de layout disponíveis
 * Mantém apenas o layout principal para Link Charts
 */
const themeLayoutConfigs = {
    layout1: layout1Config
};

export { layout1Config };
export type { themeLayoutDefaultsProps };
export default themeLayoutConfigs;
