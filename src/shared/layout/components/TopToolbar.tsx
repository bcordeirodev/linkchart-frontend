/**
 * Toolbar principal para Link Charts
 * Versão limpa da toolbar
 */

import { memo } from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useThemeMediaQuery } from '@/lib/theme';

// Componentes essenciais do toolbar
// import LightDarkModeToggle from '@/components/settings/LightDarkModeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import FullScreenToggle from './FullScreenToggle';
import UserMenu from './UserMenu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderBottom: `1px solid ${theme.palette.divider}`,
	color: theme.palette.text.primary
}));

/**
 * Toolbar com funcionalidades essenciais
 */
function TopToolbar() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));

	return (
		<StyledAppBar
			position="sticky"
			elevation={0}
		>
			<Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
				{/* Espaçador esquerdo */}
				<Box sx={{ flex: 1 }} />

				{/* Controles principais */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						px: { xs: 1, sm: 2 }
					}}
				>
					{/* Busca rápida - apenas desktop */}
					{!isMobile && (
						<IconButton
							size="small"
							sx={{
								border: 1,
								borderColor: 'divider',
								borderRadius: 1
							}}
						>
							<FuseSvgIcon size={18}>heroicons-outline:magnifying-glass</FuseSvgIcon>
						</IconButton>
					)}

					{/* Seletor de idioma */}
					<LanguageSwitcher />

					{/* Toggle fullscreen */}
					<FullScreenToggle />

					{/* Toggle tema claro/escuro
					<LightDarkModeToggle
						lightTheme={{ id: 'light', section: {} as any }}
						darkTheme={{ id: 'dark', section: {} as any }}
					/> */}

					{/* Menu do usuário */}
					{!isMobile && <UserMenu />}
				</Box>
			</Toolbar>
		</StyledAppBar>
	);
}

export default memo(TopToolbar);
