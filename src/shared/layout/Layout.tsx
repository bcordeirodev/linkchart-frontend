/**
 * Layout principal para Link Charts
 * Substitui toda a complexidade do theme-layouts com uma estrutura limpa
 */

import { memo, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import FuseMessage from '@fuse/core/FuseMessage';
import { useThemeMediaQuery } from '@/themes';

// Componentes essenciais
import Navbar from './components/Navbar';
import TopToolbar from './components/TopToolbar';
import Footer from './components/Footer';

const Root = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	minHeight: '100vh',
	backgroundColor: theme.palette.background.default
}));

const Main = styled('main')(({ theme }) => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	minHeight: 0
}));

const Content = styled('div')(() => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
	zIndex: 1
}));

interface LayoutProps {
	children: ReactNode;
	showNavbar?: boolean;
	showFooter?: boolean;
}

/**
 * Layout principal para Link Charts
 * Remove toda a complexidade desnecessária mantendo funcionalidades essenciais
 */
function Layout({ children, showNavbar = true, showFooter = true }: LayoutProps) {
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<Root>
			{/* Navbar opcional */}
			{showNavbar && <Navbar />}

			{/* Toolbar principal */}
			<TopToolbar />

			{/* Conteúdo principal */}
			<Main>
				<Content>{children}</Content>
			</Main>

			{/* Footer opcional */}
			{showFooter && <Footer />}

			{/* Sistema de mensagens */}
			<FuseMessage />
		</Root>
	);
}

export default memo(Layout);
