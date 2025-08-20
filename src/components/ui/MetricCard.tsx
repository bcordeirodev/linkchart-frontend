'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme, Theme } from '@mui/material';

interface MetricCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

const getColorVariants = (theme: Theme) => ({
	primary: {
		background: `linear-gradient(135deg, ${theme.palette.primary.main}1A 0%, ${theme.palette.primary.main}0D 100%)`,
		border: `${theme.palette.primary.main}33`,
		iconBg: `${theme.palette.primary.main}1A`,
		iconColor: theme.palette.primary.main
	},
	secondary: {
		background: `linear-gradient(135deg, ${theme.palette.secondary.main}1A 0%, ${theme.palette.secondary.main}0D 100%)`,
		border: `${theme.palette.secondary.main}33`,
		iconBg: `${theme.palette.secondary.main}1A`,
		iconColor: theme.palette.secondary.main
	},
	success: {
		background: `linear-gradient(135deg, ${theme.palette.success?.main || '#2e7d32'}1A 0%, ${theme.palette.success?.main || '#2e7d32'}0D 100%)`,
		border: `${theme.palette.success?.main || '#2e7d32'}33`,
		iconBg: `${theme.palette.success?.main || '#2e7d32'}1A`,
		iconColor: theme.palette.success?.main || '#2e7d32'
	},
	warning: {
		background: `linear-gradient(135deg, ${theme.palette.warning?.main || '#ed6c02'}1A 0%, ${theme.palette.warning?.main || '#ed6c02'}0D 100%)`,
		border: `${theme.palette.warning?.main || '#ed6c02'}33`,
		iconBg: `${theme.palette.warning?.main || '#ed6c02'}1A`,
		iconColor: theme.palette.warning?.main || '#ed6c02'
	},
	error: {
		background: `linear-gradient(135deg, ${theme.palette.error.main}1A 0%, ${theme.palette.error.main}0D 100%)`,
		border: `${theme.palette.error.main}33`,
		iconBg: `${theme.palette.error.main}1A`,
		iconColor: theme.palette.error.main
	},
	info: {
		background: `linear-gradient(135deg, ${theme.palette.info?.main || '#0288d1'}1A 0%, ${theme.palette.info?.main || '#0288d1'}0D 100%)`,
		border: `${theme.palette.info?.main || '#0288d1'}33`,
		iconBg: `${theme.palette.info?.main || '#0288d1'}1A`,
		iconColor: theme.palette.info?.main || '#0288d1'
	}
});

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color = 'primary', trend }) => {
	const theme = useTheme();
	const colorVariants = getColorVariants(theme);
	const variant = colorVariants[color];

	return (
		<Card
			sx={{
				background: variant.background,
				border: `1px solid ${variant.border}`,
				borderRadius: 2,
				height: '100%',
				position: 'relative',
				overflow: 'hidden',
				transition: 'all 0.2s ease-in-out',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: theme.shadows[8],
					borderColor: variant.iconColor
				}
			}}
		>
			<CardContent sx={{ p: 3 }}>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
					<Box sx={{ flexGrow: 1 }}>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								mb: 1,
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: 0.5,
								fontSize: '0.75rem'
							}}
						>
							{title}
						</Typography>

						<Typography
							variant="h3"
							sx={{
								fontWeight: 700,
								mb: 0.5,
								color: 'text.primary',
								lineHeight: 1.2
							}}
						>
							{typeof value === 'number' ? value.toLocaleString() : value}
						</Typography>

						{subtitle && (
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ fontSize: '0.875rem' }}
							>
								{subtitle}
							</Typography>
						)}

						{trend && (
							<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
								<Typography
									variant="body2"
									sx={{
										color: trend.isPositive ? 'success.main' : 'error.main',
										fontWeight: 600,
										fontSize: '0.75rem'
									}}
								>
									{trend.isPositive ? '+' : ''}
									{trend.value}%
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ ml: 1, fontSize: '0.75rem' }}
								>
									vs. mês anterior
								</Typography>
							</Box>
						)}
					</Box>

					<Avatar
						sx={{
							bgcolor: variant.iconBg,
							color: variant.iconColor,
							width: 56,
							height: 56,
							ml: 2,
							border: `1px solid ${variant.border}`
						}}
					>
						{icon}
					</Avatar>
				</Box>
			</CardContent>

			{/* Decorative element */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					width: '100px',
					height: '100px',
					background: `radial-gradient(circle, ${variant.iconColor}20 0%, transparent 70%)`,
					borderRadius: '50%',
					transform: 'translate(30px, -30px)'
				}}
			/>
		</Card>
	);
};

export default MetricCard;
