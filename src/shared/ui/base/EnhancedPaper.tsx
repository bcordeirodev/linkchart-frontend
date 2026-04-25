/**
 * 📄 ENHANCED PAPER - COMPONENTE BASE
 * Paper aprimorado com glass effect e animações
 */

import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { createPresetAnimations } from '@/lib/theme';
import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

import type { PaperProps } from '@mui/material';

interface EnhancedPaperProps extends Omit<PaperProps, 'variant'> {
	variant?: 'glass' | 'elevated' | 'outlined';
	animated?: boolean;
}

/**
 * Componente EnhancedPaper seguindo padrões arquiteturais
 * Paper aprimorado com efeitos visuais consistentes
 */
function EnhancedPaper({ variant = 'glass', animated = true, children, sx, ...other }: EnhancedPaperProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	const isDark = theme.palette.mode === 'dark';
	const elevation = isDark ? elevationTokens : elevationLightTokens;

	const variantStyles = {
		glass: {
			backgroundColor: theme.palette.background.paper,
			borderRadius: `${radiusTokens.md}px`,
			boxShadow: elevation.xs
		},
		elevated: {
			backgroundColor: theme.palette.background.paper,
			borderRadius: `${radiusTokens.lg}px`,
			boxShadow: elevation.sm
		},
		outlined: {
			backgroundColor: theme.palette.background.paper,
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: `${radiusTokens.lg}px`
		}
	};

	return (
		<Paper
			sx={
				{
					...variantStyles[variant],
					...(animated && animations.fadeIn),
					transition: `transform ${motionTokens.duration.base} ${motionTokens.easing.default}, box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
					'&:hover': animated
						? {
								transform: 'translateY(-1px)',
								boxShadow: elevation.md
							}
						: {},
					...sx
				} as any
			}
			{...other}
		>
			{children}
		</Paper>
	);
}

export default EnhancedPaper;
