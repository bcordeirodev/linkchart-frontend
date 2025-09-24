/**
 * Layout para páginas públicas (não autenticadas)
 */
import { Box, useTheme, Container } from '@mui/material';
import { useMemo } from 'react';

import { useMainTheme } from '@/lib/theme';

import type { ReactNode } from 'react';

interface PublicLayoutProps {
	children: ReactNode;
	showHeader?: boolean;
	showFooter?: boolean;
	variant?: 'landing' | 'shorter' | 'simple';
	className?: string;
}

function PublicLayout({
	children,
	showHeader = false,
	showFooter = false,
	variant = 'simple',
	className
}: PublicLayoutProps) {
	const theme = useTheme();
	const mainTheme = useMainTheme();

	const layoutConfig = useMemo(() => {
		const configs = {
			landing: {
				background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
				showPattern: true,
				containerMaxWidth: 'xl' as const
			},
			shorter: {
				background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
				showPattern: false,
				containerMaxWidth: 'lg' as const
			},
			simple: {
				background: theme.palette.background.default,
				showPattern: false,
				containerMaxWidth: 'md' as const
			}
		};
		return configs[variant];
	}, [variant, theme]);

	return (
		<Box
			className={className}
			sx={{
				minHeight: '100vh',
				width: '100vw',
				margin: 0,
				padding: 0,
				background: layoutConfig.background,
				color: theme.palette.text.primary,
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden',
				transition: theme.transitions.create(['background-color', 'color'], {
					duration: theme.transitions.duration.standard
				})
			}}
		>
			{layoutConfig.showPattern ? (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.05,
						backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.light} 0%, transparent 50%),
						                 radial-gradient(circle at 75% 75%, ${theme.palette.secondary.light} 0%, transparent 50%)`,
						pointerEvents: 'none'
					}}
				/>
			) : null}

			{showHeader ? (
				<Box
					component='header'
					sx={{
						position: 'relative',
						zIndex: 10,
						py: 2,
						borderBottom: `1px solid ${theme.palette.divider}`
					}}
				>
					<Container maxWidth={layoutConfig.containerMaxWidth}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<Box sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Link Chart</Box>
						</Box>
					</Container>
				</Box>
			) : null}

			<Box
				component='main'
				sx={{
					flexGrow: 1,
					position: 'relative',
					zIndex: 1,
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					minHeight: showHeader || showFooter ? 'calc(100vh - 120px)' : '100vh'
				}}
			>
				{children}
			</Box>

			{showFooter ? (
				<Box
					component='footer'
					sx={{
						position: 'relative',
						zIndex: 10,
						py: 3,
						borderTop: `1px solid ${theme.palette.divider}`,
						backgroundColor: theme.palette.background.paper
					}}
				>
					<Container maxWidth={layoutConfig.containerMaxWidth}>
						<Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
							© 2024 Link Chart. Todos os direitos reservados.
						</Box>
					</Container>
				</Box>
			) : null}
		</Box>
	);
}

export default PublicLayout;
