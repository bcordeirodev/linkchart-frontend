import React from 'react';
import { useTheme } from '@mui/material';

// Styled Components
import {
	MetricCardContainer,
	CardContentStyled,
	CardLayout,
	CardContentArea,
	CardTitle,
	CardValue,
	CardSubtitle,
	TrendContainer,
	TrendValue,
	TrendLabel,
	CardIcon,
	DecorativeElement,
	BottomLine,
	getCardStyles
} from './MetricCard.styled';

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

/**
 * 📊 METRIC CARD COM STYLED COMPONENTS
 * Design moderno, responsivo e performático
 */
const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	subtitle,
	icon,
	color = 'primary',
	trend
}) => {
	const theme = useTheme();
	const styles = getCardStyles(theme, color);

	return (
		<MetricCardContainer
			sx={{
				background: styles.background,
				border: `1px solid ${styles.border}`,
				'&:hover': {
					boxShadow: styles.hoverShadow,
					borderColor: styles.iconColor,
				},
				'&::before': {
					background: styles.glowEffect,
				},
			}}
		>
			<CardContentStyled>
				<CardLayout>
					<CardContentArea>
						{/* Título */}
						<CardTitle variant="body2">
							{title}
						</CardTitle>

						{/* Valor principal com gradiente */}
						<CardValue
							variant="h3"
							sx={{
								background: `linear-gradient(135deg, ${styles.iconColor} 0%, ${styles.accent} 100%)`,
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								// Fallback para navegadores sem suporte
								'@supports not (background-clip: text)': {
									color: styles.iconColor,
									WebkitTextFillColor: 'unset',
								},
							}}
						>
							{typeof value === 'number' ? value.toLocaleString() : value}
						</CardValue>

						{/* Subtitle */}
						{subtitle && (
							<CardSubtitle variant="body2">
								{subtitle}
							</CardSubtitle>
						)}

						{/* Trend indicator */}
						{trend && (
							<TrendContainer
								sx={{
									backgroundColor: trend.isPositive ? 'success.main' : 'error.main',
									color: 'white',
								}}
							>
								<TrendValue>
									{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
								</TrendValue>
								<TrendLabel>
									vs. anterior
								</TrendLabel>
							</TrendContainer>
						)}
					</CardContentArea>

					{/* Icon */}
					<CardIcon
						sx={{
							bgcolor: styles.iconBg,
							color: styles.iconColor,
							border: `2px solid ${styles.border}`,
							boxShadow: `0 4px 20px ${styles.iconColor}25`,
						}}
					>
						{icon}
					</CardIcon>
				</CardLayout>
			</CardContentStyled>

			{/* Elemento decorativo */}
			<DecorativeElement
				sx={{
					background: styles.glowEffect,
				}}
			/>

			{/* Linha de destaque inferior */}
			<BottomLine
				sx={{
					background: styles.bottomLine,
				}}
			/>
		</MetricCardContainer>
	);
};

export default MetricCard;