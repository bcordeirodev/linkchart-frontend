'use client';

import React from 'react';
import { Button, ButtonProps, Box, Typography, alpha, useTheme } from '@mui/material';

interface GradientButtonProps extends Omit<ButtonProps, 'children'> {
	children: React.ReactNode;
	gradient?: 'primary' | 'success' | 'warning' | 'error';
	loading?: boolean;
	shimmerEffect?: boolean;
}

const gradients = {
	primary: {
		background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 50%, #6366F1 100%)',
		hover: 'linear-gradient(135deg, #0960C0 0%, #0090D1 50%, #5B5CE6 100%)'
	},
	success: {
		background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
		hover: 'linear-gradient(135deg, #45A049 0%, #7CB342 100%)'
	},
	warning: {
		background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
		hover: 'linear-gradient(135deg, #F57C00 0%, #FFA000 100%)'
	},
	error: {
		background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',
		hover: 'linear-gradient(135deg, #D32F2F 0%, #C2185B 100%)'
	}
};

/**
 * Botão com gradiente reutilizável
 * Suporta diferentes gradientes, loading state e efeito shimmer
 */
export function GradientButton({
	children,
	gradient = 'primary',
	loading = false,
	shimmerEffect = false,
	disabled,
	sx,
	...props
}: GradientButtonProps) {
	const theme = useTheme();
	const gradientConfig = gradients[gradient];

	return (
		<Button
			{...props}
			disabled={disabled || loading}
			sx={{
				borderRadius: 3,
				textTransform: 'none',
				fontWeight: 700,
				fontSize: '1rem',
				minHeight: 52,
				background: gradientConfig.background,
				boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
				border: 'none',
				position: 'relative',
				overflow: 'hidden',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'&:hover:not(:disabled)': {
					background: gradientConfig.hover,
					transform: 'translateY(-2px)',
					boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.45)}`
				},
				'&:active:not(:disabled)': {
					transform: 'translateY(-1px)',
					boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`
				},
				'&:disabled': {
					background: alpha(theme.palette.primary.main, 0.3),
					color: alpha(theme.palette.primary.contrastText, 0.7)
				},
				...(shimmerEffect && {
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: '-100%',
						width: '100%',
						height: '100%',
						background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
						transition: 'left 0.6s ease'
					},
					'&:hover:not(:disabled)::before': {
						left: '100%'
					}
				}),
				...sx
			}}
		>
			{loading ? (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
					<Box
						sx={{
							width: 20,
							height: 20,
							border: '2.5px solid transparent',
							borderTop: '2.5px solid currentColor',
							borderRadius: '50%',
							animation: 'spin 1s linear infinite',
							'@keyframes spin': {
								'0%': { transform: 'rotate(0deg)' },
								'100%': { transform: 'rotate(360deg)' }
							}
						}}
					/>
					<Typography
						variant="inherit"
						sx={{ fontWeight: 'inherit' }}
					>
						Carregando...
					</Typography>
				</Box>
			) : (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>{children}</Box>
			)}
		</Button>
	);
}

export default GradientButton;
