/**
 * 🏗️ MAIN LAYOUT - LINK CHART
 * Layout principal da aplicação com suporte completo a temas
 *
 * @description
 * Este componente serve como o layout base da aplicação, fornecendo
 * estrutura consistente e aplicando temas de forma inteligente em
 * todas as seções (navbar, toolbar, footer, main).
 *
 * @features
 * - ✅ Suporte completo a temas dinâmicos
 * - ✅ Layout responsivo otimizado
 * - ✅ Configurações flexíveis de seções
 * - ✅ Performance otimizada com useMemo
 * - ✅ Integração com FuseLayout
 *
 * @since 1.0.0
 * @version 2.0.0
 */

import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { useMainTheme, useResponsive } from '@/lib/theme';
import { Layout, MainLayoutProps as CoreMainLayoutProps } from './core';
import { Navbar, Footer } from './components';

/**
 * Props do MainLayout
 * @interface MainLayoutProps
 */
type MainLayoutProps = Omit<CoreMainLayoutProps, 'layouts'> & {
	/** Exibir navbar */
	navbar?: boolean;
	/** Exibir toolbar */
	toolbar?: boolean;
	/** Exibir footer */
	footer?: boolean;
	/** Classe CSS adicional */
	className?: string;
};

/**
 * Layout principal da aplicação com suporte a temas
 * @param {MainLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout configurado
 */
function MainLayout(props: MainLayoutProps) {
	const { children, navbar, toolbar, footer, settings = {}, className, ...rest } = props;

	// Hooks de tema
	const theme = useTheme();
	const mainTheme = useMainTheme();
	const { isMobile, isTablet } = useResponsive();

	/**
	 * Configurações mescladas com tema e responsividade
	 */
	const mergedSettings = useMemo(() => {
		const shorthandSettings = {
			config: {
				...(navbar !== undefined && { navbar: { display: navbar } }),
				...(toolbar !== undefined && { toolbar: { display: toolbar } }),
				...(footer !== undefined && { footer: { display: footer } })
			}
		};

		// Configurações responsivas baseadas no tema
		const responsiveSettings = {
			layout: {
				style: 'layout1' as const,
				config: {
					navbar: {
						display: navbar !== undefined ? navbar : true,
						folded: isMobile ? true : false,
						position: 'left' as const
					},
					toolbar: {
						display: toolbar !== undefined ? toolbar : true,
						style: isMobile ? ('fixed' as const) : ('static' as const)
					},
					footer: {
						display: footer !== undefined ? footer : true,
						style: 'static' as const
					}
				}
			}
		};

		return responsiveSettings.layout;
	}, [settings, navbar, toolbar, footer, isMobile]);

	/**
	 * Layouts com tema aplicado
	 */
	const themedLayouts = useMemo(
		() => ({
			layout1: ({ children }: { children: React.ReactNode }) => {
				const showNavbar = mergedSettings.config?.navbar?.display !== false;
				const showFooter = mergedSettings.config?.footer?.display !== false;
				const footerStyle = (mergedSettings.config?.footer?.style || 'static') as 'fixed' | 'static' | 'sticky';

				return (
					<Box
						className={className}
						sx={{
							minHeight: '100vh',
							backgroundColor: theme.palette.background.default,
							color: theme.palette.text.primary,
							display: 'flex',
							flexDirection: 'column',
							transition: theme.transitions.create(['background-color', 'color'], {
								duration: theme.transitions.duration.standard
							}),
							// Suporte para temas escuros
							'& .MuiAppBar-root': {
								backgroundColor: mainTheme?.palette?.primary?.main || theme.palette.primary.main,
								color: mainTheme?.palette?.primary?.contrastText || theme.palette.primary.contrastText
							},
							// Estilização de scrollbars para tema escuro
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
						{/* Navbar */}
						{showNavbar && (
							<Navbar
								isMobile={isMobile}
								onMobileMenuToggle={() => {
									// TODO: Implementar toggle do menu mobile
									console.log('Toggle mobile menu');
								}}
							/>
						)}

						{/* Main Content */}
						<Box
							component="main"
							sx={{
								flexGrow: 1,
								pt: showNavbar ? { xs: 7, sm: 8 } : 0, // Espaço para navbar fixa
								pb: showFooter && footerStyle === 'fixed' ? 8 : 0, // Espaço para footer fixo
								minHeight: showNavbar ? 'calc(100vh - 64px)' : '100vh'
							}}
						>
							{children}
						</Box>

						{/* Footer */}
						{showFooter && <Footer style={footerStyle as 'fixed' | 'static' | 'sticky'} />}
					</Box>
				);
			}
		}),
		[theme, mainTheme, className, mergedSettings, isMobile]
	);

	return (
		<Layout
			{...rest}
			layouts={themedLayouts}
			settings={mergedSettings}
		>
			{children}
		</Layout>
	);
}

export default MainLayout;
