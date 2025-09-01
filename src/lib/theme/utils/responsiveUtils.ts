/**
 * 📱 RESPONSIVE UTILITIES - LINK CHART
 * Utilitários para design responsivo baseado no tema
 * 
 * @description
 * Funções para criar estilos responsivos consistentes,
 * baseados nos breakpoints do Material-UI.
 * 
 * @since 2.0.0
 */

import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

/**
 * Breakpoints disponíveis
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Configuração responsiva para valores
 */
export type ResponsiveValue<T> = {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
};

/**
 * Cria valores responsivos para qualquer propriedade
 */
export const createResponsiveValue = <T>(
    theme: Theme,
    property: string,
    values: ResponsiveValue<T>
): SxProps => {
    const result: any = {};

    // Valor base (xs)
    if (values.xs !== undefined) {
        result[property] = values.xs;
    }

    // Valores para breakpoints maiores
    (['sm', 'md', 'lg', 'xl'] as const).forEach((breakpoint) => {
        if (values[breakpoint] !== undefined) {
            result[theme.breakpoints.up(breakpoint)] = {
                [property]: values[breakpoint]
            };
        }
    });

    return result as SxProps;
};

/**
 * Cria tipografia responsiva
 */
export const createResponsiveTypography = (
    theme: Theme,
    sizes: ResponsiveValue<string | number>
): SxProps => {
    return createResponsiveValue(theme, 'fontSize', sizes);
};

/**
 * Cria espaçamento responsivo
 */
export const createResponsivePadding = (
    theme: Theme,
    values: ResponsiveValue<number | string>
): SxProps => {
    return createResponsiveValue(theme, 'padding', values);
};

/**
 * Cria margin responsivo
 */
export const createResponsiveMargin = (
    theme: Theme,
    values: ResponsiveValue<number | string>
): SxProps => {
    return createResponsiveValue(theme, 'margin', values);
};

/**
 * Cria dimensões responsivas
 */
export const createResponsiveDimensions = (
    theme: Theme,
    width?: ResponsiveValue<number | string>,
    height?: ResponsiveValue<number | string>
): SxProps => {
    let result: any = {};

    if (width) {
        result = { ...result, ...createResponsiveValue(theme, 'width', width) };
    }

    if (height) {
        result = { ...result, ...createResponsiveValue(theme, 'height', height) };
    }

    return result as SxProps;
};

/**
 * Utilitário para ocultar/mostrar elementos em breakpoints
 */
export const createVisibilityUtils = (theme: Theme) => {
    return {
        // Ocultar em mobile
        hiddenXs: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block'
            }
        },

        // Ocultar em tablet
        hiddenSm: {
            [theme.breakpoints.only('sm')]: {
                display: 'none'
            }
        },

        // Ocultar em desktop
        hiddenMd: {
            [theme.breakpoints.up('md')]: {
                display: 'none'
            }
        },

        // Mostrar apenas em mobile
        onlyXs: {
            display: 'block',
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },

        // Mostrar apenas em tablet
        onlySm: {
            display: 'none',
            [theme.breakpoints.only('sm')]: {
                display: 'block'
            }
        },

        // Mostrar apenas em desktop
        onlyMd: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'block'
            }
        }
    };
};

/**
 * Cria grid responsivo
 */
export const createResponsiveGrid = (
    theme: Theme,
    columns: ResponsiveValue<number>
): SxProps => {
    const gridTemplateColumns: ResponsiveValue<string> = {};

    Object.entries(columns).forEach(([breakpoint, cols]) => {
        if (cols) {
            gridTemplateColumns[breakpoint as Breakpoint] = `repeat(${cols}, 1fr)`;
        }
    });

    return {
        display: 'grid',
        ...createResponsiveValue(theme, 'gridTemplateColumns', gridTemplateColumns)
    };
};

/**
 * Cria flexbox responsivo
 */
export const createResponsiveFlex = (
    theme: Theme,
    direction: ResponsiveValue<'row' | 'column'>,
    gap?: ResponsiveValue<number>
): SxProps => {
    let result: SxProps = {
        display: 'flex',
        ...createResponsiveValue(theme, 'flexDirection', direction)
    };

    if (gap) {
        const gapStyles = createResponsiveValue(theme, 'gap', gap);
        result = { ...result, ...(gapStyles as any) };
    }

    return result;
};

/**
 * Utilitários de layout responsivo pré-definidos
 */
export const createResponsiveLayouts = (theme: Theme) => {
    return {
        // Container responsivo padrão
        container: {
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
            maxWidth: { xs: '100%', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }
        },

        // Grid de cards responsivo
        cardGrid: createResponsiveGrid(theme, {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4
        }),

        // Stack responsivo (vertical em mobile, horizontal em desktop)
        responsiveStack: createResponsiveFlex(theme, {
            xs: 'column',
            md: 'row'
        }, {
            xs: 2,
            md: 3
        }),

        // Sidebar layout
        sidebarLayout: {
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 },
            '& .sidebar': {
                width: { xs: '100%', md: '300px' },
                flexShrink: 0
            },
            '& .content': {
                flex: 1,
                minWidth: 0
            }
        },

        // Hero section responsivo
        hero: {
            py: { xs: 4, sm: 6, md: 8, lg: 10 },
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: { xs: 'center', md: 'left' }
        }
    };
};


