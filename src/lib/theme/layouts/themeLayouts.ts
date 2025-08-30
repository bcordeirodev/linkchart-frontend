/**
 * Layouts de tema centralizados para Link Charts
 * Movido de theme-layouts para centralizar em src/themes
 */

import React, { ComponentType } from 'react';
import { LinkChartsLayout } from '@/shared/layout';

/**
 * Tipo para layouts de tema
 */
export type themeLayoutsType = Record<string, ComponentType<{ children: React.ReactNode }>>;

/**
 * Layouts disponíveis para Link Charts
 * Usa apenas o layout principal simplificado
 */
const themeLayouts: themeLayoutsType = {
    layout1: LinkChartsLayout
};

export default themeLayouts;
