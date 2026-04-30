/**
 * 🚫 EMPTY STATE - COMPONENTE BASE
 * Componente para estados vazios padronizado
 */

import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { BaseComponentProps } from '../components';
import type React from 'react';

interface EmptyStateProps extends BaseComponentProps {
	variant?: 'default' | 'charts' | 'data' | 'search';
	icon?: string | React.ReactNode;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	height?: number | string;
}

/**
 * Componente EmptyState seguindo padrões arquiteturais
 * Usado para exibir estados vazios de forma consistente
 */
export function EmptyState({
	variant = 'default',
	icon,
	title,
	description,
	action,
	height = 300,
	sx,
	...other
}: EmptyStateProps) {
	const _theme = useTheme();

	const variantConfig = {
		default: { icon: '📭', color: 'text.secondary' },
		charts: { icon: '📊', color: 'primary.main' },
		data: { icon: '📄', color: 'info.main' },
		search: { icon: '🔍', color: 'warning.main' }
	};

	const config = variantConfig[variant];
	const displayIcon = icon || config.icon;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: typeof height === 'number' ? `${height}px` : height,
				textAlign: 'center',
				py: 4,
				px: 2,
				...sx
			}}
			{...other}
		>
			<Box
				sx={{
					fontSize: '3rem',
					mb: 2,
					opacity: 0.7
				}}
			>
				{typeof displayIcon === 'string' ? displayIcon : displayIcon}
			</Box>

			<Typography
				variant='h6'
				component='h3'
				sx={{
					mb: 1,
					color: config.color,
					fontWeight: 600
				}}
			>
				{title}
			</Typography>

			{description ? (
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ mb: 3, maxWidth: 400 }}
				>
					{description}
				</Typography>
			) : null}

			{action ? (
				<Button
					variant='outlined'
					onClick={action.onClick}
					sx={{ mt: 1 }}
				>
					{action.label}
				</Button>
			) : null}
		</Box>
	);
}

export default EmptyState;
