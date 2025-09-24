/**
 * Layout principal da aplicação com suporte a temas
 */
import { Box, useTheme } from '@mui/material';

import { useMainTheme, useResponsive } from '@/lib/theme';

import { Navbar, Footer } from './components';

interface MainLayoutProps {
	children: React.ReactNode;
	navbar?: boolean;
	footer?: boolean;
	className?: string;
}

function MainLayout({ children, navbar = true, footer = true, className }: MainLayoutProps) {
	const theme = useTheme();
	const mainTheme = useMainTheme();
	const { isMobile } = useResponsive();

	const showNavbar = navbar;
	const showFooter = footer;

	return (
		<Box
			className={className}
			sx={{
				minHeight: '100vh',
				width: '100vw',
				margin: 0,
				padding: 0,
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				transition: theme.transitions.create(['background-color', 'color'], {
					duration: theme.transitions.duration.standard
				}),
				'& .MuiAppBar-root': {
					backgroundColor: mainTheme?.palette?.primary?.main || theme.palette.primary.main,
					color: mainTheme?.palette?.primary?.contrastText || theme.palette.primary.contrastText
				},
				'&::-webkit-scrollbar': {
					width: '8px'
				},
				'&::-webkit-scrollbar-track': {
					backgroundColor: theme.palette.background.paper
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: theme.palette.divider,
					borderRadius: '4px',
					'&:hover': {
						backgroundColor: theme.palette.action.hover
					}
				}
			}}
		>
			{showNavbar ? (
				<Navbar isMobile={isMobile} />
			) : null}

			<Box
				component='main'
				sx={{
					flexGrow: 1,
					width: '100%',
					height: '100%',
					position: 'relative',
					overflow: 'auto',
					pt: showNavbar ? { xs: 7, sm: 8 } : 0,
					pb: 0,
					px: 0,
					minHeight: showNavbar ? 'calc(100vh - 64px)' : '100vh',
					'& > *': {
						width: '100%',
						minHeight: 'inherit',
						boxSizing: 'border-box'
					},
					'& > * > *': {
						margin: 0
					}
				}}
			>
				{children}
			</Box>

			{showFooter ? <Footer style="static" /> : null}
		</Box>
	);
}

export default MainLayout;
