/**
 * 📄 ENHANCED PAPER - COMPONENTE BASE
 * Paper aprimorado com glass effect e animações
 */

import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { createPresetAnimations } from '@/lib/theme';

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

	const variantStyles = {
		glass: {
			backgroundColor: theme.palette.background.paper, // Background sólido consistente
			borderRadius: 2,
			boxShadow: theme.shadows[2]
		},
		elevated: {
			backgroundColor: theme.palette.background.paper,
			boxShadow: theme.shadows[4],
			borderRadius: theme.spacing(1.5)
		},
		outlined: {
			backgroundColor: theme.palette.background.paper,
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: theme.spacing(1.5)
		}
	};

	return (
		<Paper
			sx={
				{
					...variantStyles[variant],
					...(animated && animations.fadeIn),
					transition: theme.transitions.create(['transform', 'box-shadow']),
					'&:hover': animated
						? {
								transform: 'translateY(-1px)',
								boxShadow: theme.shadows[8]
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
