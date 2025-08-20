'use client';

import { Box, useTheme } from '@mui/material';

interface ThemeAwareBackgroundProps {
	children: React.ReactNode;
	colorType?: 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'error';
	decorativeElement?: boolean;
	decorativePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Componente que cria backgrounds consistentes com o tema
 * Adapta automaticamente para modo dark/light
 */
export function ThemeAwareBackground({
	children,
	colorType = 'primary',
	decorativeElement = true,
	decorativePosition = 'top-right'
}: ThemeAwareBackgroundProps) {
	const theme = useTheme();

	// Mapear cores do tema
	const getThemeColor = () => {
		switch (colorType) {
			case 'primary':
				return theme.palette.primary.main;
			case 'secondary':
				return theme.palette.secondary.main;
			case 'warning':
				return theme.palette.warning?.main || '#ed6c02';
			case 'info':
				return theme.palette.info?.main || '#0288d1';
			case 'success':
				return theme.palette.success?.main || '#2e7d32';
			case 'error':
				return theme.palette.error.main;
			default:
				return theme.palette.primary.main;
		}
	};

	const themeColor = getThemeColor();

	// Posições do elemento decorativo
	const decorativePositions = {
		'top-right': { top: -25, right: -25 },
		'top-left': { top: -25, left: -25 },
		'bottom-right': { bottom: -25, right: -25 },
		'bottom-left': { bottom: -25, left: -25 }
	};

	return (
		<Box
			sx={{
				background:
					theme.palette.mode === 'dark'
						? `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}10 100%)`
						: `linear-gradient(135deg, ${themeColor}14 0%, ${themeColor}0A 100%)`,
				borderRadius: 3,
				p: 4,
				border: `1px solid ${themeColor}${theme.palette.mode === 'dark' ? '40' : '1A'}`,
				position: 'relative',
				overflow: 'hidden',
				backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none'
			}}
		>
			{/* Elemento decorativo */}
			{decorativeElement && (
				<Box
					sx={{
						position: 'absolute',
						...decorativePositions[decorativePosition],
						width: 120,
						height: 120,
						background:
							theme.palette.mode === 'dark'
								? `radial-gradient(circle, ${themeColor}30 0%, transparent 70%)`
								: `linear-gradient(135deg, ${themeColor}1A 0%, ${themeColor}0D 100%)`,
						borderRadius: '50%',
						opacity: theme.palette.mode === 'dark' ? 0.8 : 0.6
					}}
				/>
			)}

			{/* Conteúdo */}
			<Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
		</Box>
	);
}

export default ThemeAwareBackground;
