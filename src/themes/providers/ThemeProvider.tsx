/**
 * Provider de tema centralizado para Link Charts
 * Substitui e simplifica o MainThemeProvider
 */

import { memo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { useMainTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Estilos globais para Link Charts
 */
const globalStyles = (
    <GlobalStyles
        styles={(theme) => ({
            html: {
                backgroundColor: `${theme.palette.background.default}!important`,
                color: `${theme.palette.text.primary}!important`
            },
            body: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                margin: 0,
                padding: 0
            },
            // Scrollbar personalizada
            '::-webkit-scrollbar': {
                width: '8px',
                height: '8px'
            },
            '::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.background.default
            },
            '::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.divider,
                borderRadius: '4px',
                '&:hover': {
                    backgroundColor: theme.palette.text.disabled
                }
            },
            // Links
            a: {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline'
                }
            },
            // Seleção de texto
            '::selection': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
            }
        })}
    />
);

/**
 * Provider de tema simplificado para Link Charts
 * Centraliza toda a lógica de tema em um componente
 */
function ThemeProvider({ children }: ThemeProviderProps) {
    const mainTheme = useMainTheme();

    return (
        <MuiThemeProvider theme={mainTheme}>
            <CssBaseline />
            {globalStyles}
            {children}
        </MuiThemeProvider>
    );
}

export default memo(ThemeProvider);
