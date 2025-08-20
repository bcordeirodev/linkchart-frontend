/**
 * Navbar principal para Link Charts
 * Versão limpa sem configurações complexas
 */

'use client';

import { memo, useState } from 'react';
import {
	AppBar,
	Toolbar,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	Divider,
	Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useThemeMediaQuery } from '@/themes';
import Logo from './Logo';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		width: 280,
		backgroundColor: theme.palette.background.default,
		borderRight: `1px solid ${theme.palette.divider}`
	}
}));

/**
 * Items de navegação consolidados
 */
const navigationItems = [
	{ id: 'analytics', title: 'Analytics', icon: 'heroicons-outline:chart-bar', url: '/analytics' },
	{ id: 'links', title: 'Gerenciar Links', icon: 'heroicons-outline:link', url: '/link' },
	{ id: 'profile', title: 'Perfil', icon: 'heroicons-outline:user-circle', url: '/profile' }
];

/**
 * Navbar que mantém funcionalidades essenciais
 */
function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const NavContent = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Logo */}
			<Box sx={{ p: 2 }}>
				<Logo />
			</Box>

			<Divider />

			{/* Navegação */}
			<List sx={{ flex: 1, py: 1 }}>
				{navigationItems.map((item) => (
					<ListItem
						key={item.id}
						disablePadding
						sx={{ mx: 1, mb: 0.5 }}
					>
						<ListItemButton
							component="a"
							href={item.url}
							sx={{
								borderRadius: 2,
								py: 1.5,
								'&:hover': {
									backgroundColor: 'action.hover'
								},
								'&.Mui-selected': {
									backgroundColor: 'primary.main',
									color: 'primary.contrastText',
									'&:hover': {
										backgroundColor: 'primary.dark'
									}
								}
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 40,
									color: 'inherit'
								}}
							>
								<FuseSvgIcon size={20}>{item.icon}</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText
								primary={item.title}
								primaryTypographyProps={{
									fontSize: '0.875rem',
									fontWeight: 500
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>

			{/* Espaçador para empurrar o conteúdo para cima */}
			<Box sx={{ flex: 1 }} />
		</Box>
	);

	if (!isMobile) {
		return (
			<StyledDrawer
				variant="permanent"
				open
			>
				<NavContent />
			</StyledDrawer>
		);
	}

	return (
		<>
			{/* Mobile toggle button */}
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<FuseSvgIcon>heroicons-outline:bars-3</FuseSvgIcon>
					</IconButton>
					<Logo />
				</Toolbar>
			</AppBar>

			{/* Mobile drawer */}
			<StyledDrawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
			>
				<NavContent />
			</StyledDrawer>
		</>
	);
}

export default memo(Navbar);
