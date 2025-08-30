/**
 * Layout principal simplificado para Link Charts
 * Substitui toda a complexidade do theme-layouts
 */

import { memo, ReactNode } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useMainTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';
import useUser from '@/lib/auth/useUser';

// Layout moderno
import ModernLayout from './ModernLayout';

interface LinkChartsLayoutProps {
	children: ReactNode;
}

/**
 * Layout principal do Link Charts
 * Usa ModernLayout com header apenas para usuários autenticados
 * Layout simples para usuários não autenticados
 */
function LinkChartsLayout({ children }: LinkChartsLayoutProps) {
	const mainTheme = useMainTheme();
	const { isGuest } = useUser();

	return (
		<ThemeProvider theme={mainTheme}>
			<CssBaseline />
			{isGuest ? (
				// Layout simples para usuários não autenticados (sem header/footer)
				<Box sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: 'background.default'
				}}>
					{children}
				</Box>
			) : (
				// Layout completo para usuários autenticados (com header, sem footer)
				<ModernLayout>
					{children}
				</ModernLayout>
			)}
		</ThemeProvider>
	);
}

export default memo(LinkChartsLayout);
