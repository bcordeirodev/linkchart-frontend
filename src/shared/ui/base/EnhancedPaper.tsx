import React from 'react';
import { Paper, PaperProps, useTheme } from '@mui/material';

interface EnhancedPaperProps extends Omit<PaperProps, 'variant'> {
	variant?: 'elevated' | 'outlined' | 'glass';
}

const EnhancedPaper: React.FC<EnhancedPaperProps> = ({ variant = 'elevated', children, sx = {}, ...props }) => {
	const theme = useTheme();

	const variantStyles = {
		elevated: {
			borderRadius: 3,
			boxShadow: theme.shadows[4],
			border: `1px solid ${theme.palette.divider}`,
			transition: 'all 0.2s ease-in-out',
			'&:hover': {
				boxShadow: theme.shadows[8],
				transform: 'translateY(-1px)'
			}
		},
		outlined: {
			borderRadius: 2,
			border: `2px solid ${theme.palette.divider}`,
			boxShadow: 'none',
			transition: 'all 0.2s ease-in-out',
			'&:hover': {
				borderColor: theme.palette.primary.main,
				boxShadow: `0 0 0 1px ${theme.palette.primary.main}20`
			}
		},
		glass: {
			borderRadius: 3,
			background:
				theme.palette.mode === 'dark' ? `${theme.palette.background.paper}CC` : 'rgba(255, 255, 255, 0.9)',
			backdropFilter: 'blur(20px)',
			border: `1px solid ${
				theme.palette.mode === 'dark' ? `${theme.palette.primary.main}20` : `${theme.palette.divider}80`
			}`,
			boxShadow:
				theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
			transition: 'all 0.3s ease-in-out',
			'&:hover': {
				background:
					theme.palette.mode === 'dark' ? `${theme.palette.background.paper}E6` : 'rgba(255, 255, 255, 0.95)',
				boxShadow:
					theme.palette.mode === 'dark'
						? '0 12px 40px rgba(0, 0, 0, 0.5)'
						: '0 12px 40px rgba(0, 0, 0, 0.15)',
				transform: 'translateY(-2px)',
				borderColor: theme.palette.primary.main
			}
		}
	};

	return (
		<Paper
			{...props}
			sx={{
				...variantStyles[variant],
				...sx
			}}
		>
			{children}
		</Paper>
	);
};

export default EnhancedPaper;
