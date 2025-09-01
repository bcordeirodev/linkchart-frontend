/**
 * 🏗️ CONFIGURAÇÕES DE LAYOUT CENTRALIZADAS - LINK CHART
 * Configurações de layout migradas para estrutura centralizada
 */

import { ThemeLayoutDefaultsProps } from '../types/theme';

// ========================================
// 🏗️ CONFIGURAÇÕES DE LAYOUT
// ========================================

/**
 * Configurações de layout para compatibilidade com FuseSettings
 */
export const themeLayoutConfigs = {
    layout1: {
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
        } as ThemeLayoutDefaultsProps,
        form: {} // Form configs vazias para compatibilidade
    }
};

export default themeLayoutConfigs;
