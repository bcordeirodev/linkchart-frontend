/**
 * 🎨 THEME TOGGLE COMPONENT - LINK CHART
 * Componente para alternar entre temas claro/escuro com animações suaves
 * 
 * @description
 * Este componente fornece uma interface intuitiva para alternar entre
 * temas claro e escuro da aplicação. Inclui ícones animados e feedback
 * visual para melhor experiência do usuário.
 * 
 * @features
 * - ✅ Alternância claro/escuro
 * - ✅ Ícones animados (sol/lua)
 * - ✅ Tooltip informativo
 * - ✅ Persistência de preferência
 * - ✅ Transições suaves
 * 
 * @example
 * ```tsx
 * import { ThemeToggle } from '@/shared/components/ThemeToggle';
 * 
 * function Navbar() {
 *   return (
 *     <AppBar>
 *       <Toolbar>
 *         <ThemeToggle />
 *       </Toolbar>
 *     </AppBar>
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 * @version 2.0.0
 */

import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useMainTheme, useFuseSettings } from '@/lib/theme';
import { useCallback } from 'react';

/**
 * Props do componente ThemeToggle
 * @interface ThemeToggleProps
 */
export interface ThemeToggleProps {
    /** Tamanho do botão */
    size?: 'small' | 'medium' | 'large';
    /** Cor do botão */
    color?: 'inherit' | 'primary' | 'secondary' | 'default';
    /** Classe CSS adicional */
    className?: string;
    /** Callback executado após mudança de tema */
    onThemeChange?: (isDark: boolean) => void;
}

/**
 * Componente para alternar entre temas claro e escuro
 * @param {ThemeToggleProps} props - Props do componente
 * @returns {JSX.Element} Botão de toggle de tema
 */
export function ThemeToggle({
    size = 'medium',
    color = 'inherit',
    className,
    onThemeChange
}: ThemeToggleProps) {
    const theme = useTheme();
    const mainTheme = useMainTheme();
    const { settings, setSettings } = useFuseSettings();

    // Determinar se o tema atual é escuro
    const isDarkMode = mainTheme?.palette?.mode === 'dark' || theme.palette.mode === 'dark';

    /**
     * Alterna entre tema claro e escuro
     */
    const handleToggle = useCallback(() => {
        // Determinar novo tema baseado no atual
        const currentTheme = settings?.theme?.main || 'default';
        const newTheme = isDarkMode
            ? currentTheme.replace('Dark', '') || 'default'
            : currentTheme.includes('Dark') ? currentTheme : `${currentTheme}Dark`;

        // Atualizar configurações
        if (setSettings) {
            setSettings({
                ...settings,
                theme: {
                    ...settings.theme,
                    main: newTheme,
                    navbar: newTheme,
                    toolbar: newTheme,
                    footer: newTheme
                }
            });
        }

        // Salvar preferência no localStorage
        localStorage.setItem('linkChart_theme_mode', isDarkMode ? 'light' : 'dark');
        localStorage.setItem('linkChart_theme', newTheme);

        // Callback opcional
        onThemeChange?.(!isDarkMode);
    }, [isDarkMode, settings, setSettings, onThemeChange]);

    /**
     * Tooltip text baseado no modo atual
     */
    const tooltipText = isDarkMode
        ? 'Alternar para tema claro'
        : 'Alternar para tema escuro';

    /**
     * Ícone baseado no modo atual
     */
    const ThemeIcon = isDarkMode ? Brightness7 : Brightness4;

    return (
        <Tooltip title={tooltipText} arrow>
            <IconButton
                onClick={handleToggle}
                size={size}
                color={color}
                className={className}
                sx={{
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'rotate(180deg)',
                        backgroundColor: theme.palette.action.hover,
                    },
                    '& .MuiSvgIcon-root': {
                        transition: 'transform 0.3s ease-in-out',
                    }
                }}
                aria-label={tooltipText}
            >
                <ThemeIcon
                    sx={{
                        color: isDarkMode
                            ? theme.palette.warning.main
                            : theme.palette.info.main,
                        fontSize: {
                            small: '1.2rem',
                            medium: '1.5rem',
                            large: '1.8rem'
                        }[size]
                    }}
                />
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggle;
