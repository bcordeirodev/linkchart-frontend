import React from 'react';
import { ButtonProps, Typography } from '@mui/material';

// Styled Components
import { GradientButtonContainer, GradientButtonContent, GradientButtonSpinner } from './styles/UI.styled';

interface GradientButtonProps extends Omit<ButtonProps, 'children'> {
	children: React.ReactNode;
	gradient?: 'primary' | 'success' | 'warning' | 'error';
	loading?: boolean;
	shimmerEffect?: boolean;
}

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
	return (
		<GradientButtonContainer
			{...props}
			disabled={disabled || loading}
			gradient={gradient}
			shimmerEffect={shimmerEffect}
			isLoading={loading}
			sx={sx}
		>
			{loading ? (
				<GradientButtonContent>
					<GradientButtonSpinner />
					<Typography
						variant="inherit"
						sx={{ fontWeight: 'inherit' }}
					>
						Carregando...
					</Typography>
				</GradientButtonContent>
			) : (
				<GradientButtonContent>{children}</GradientButtonContent>
			)}
		</GradientButtonContainer>
	);
}

export default GradientButton;
