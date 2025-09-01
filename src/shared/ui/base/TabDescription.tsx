/**
 * Componente para descrições das tabs
 * Exibe uma descrição elegante explicando o objetivo de cada aba
 */

import { memo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { SvgIcon } from '@/shared/components';
import {
	createThemeGradient,
	createSpacingUtils,
	createResponsiveValue,
	getBorderColors
} from '@/lib/theme';

interface TabDescriptionProps {
	icon: string;
	title: string;
	description: string;
	highlight?: string;
}

/**
 * Componente de descrição para tabs do Analytics
 */
function TabDescription({ icon, title, description, highlight }: TabDescriptionProps) {
	const theme = useTheme();
	const spacing = createSpacingUtils(theme);
	const borders = getBorderColors(theme, 'primary');

	return (
		<Box
			sx={{
				background: createThemeGradient(theme, {
					variant: 'primary',
					opacity: 0.05,
					direction: 'to-bottom-right'
				}),
				border: `1px solid ${(borders as any).accent || borders.default}`,
				borderRadius: 2,
				p: { xs: 2, sm: 3 },
				mb: { xs: 2, sm: 3 },
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '4px',
					height: '100%',
					background: createThemeGradient(theme, {
						variant: 'primary',
						direction: 'to-bottom'
					})
				}
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
				{/* Ícone */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 48,
						height: 48,
						borderRadius: 2,
						background: createThemeGradient(theme, {
							variant: 'primary',
							direction: 'to-bottom-right'
						}),
						color: 'primary.contrastText',
						boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
						flexShrink: 0
					}}
				>
					<SvgIcon size={24}>{icon}</SvgIcon>
				</Box>

				{/* Conteúdo */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							fontSize: '1.1rem',
							color: 'text.primary',
							mb: 1,
							lineHeight: 1.3
						}}
					>
						{title}
					</Typography>

					<Typography
						variant="body2"
						sx={{
							color: 'text.secondary',
							lineHeight: 1.5,
							fontSize: '0.875rem'
						}}
					>
						{description}
						{highlight && (
							<>
								{' '}
								<Typography
									component="span"
									sx={{
										fontWeight: 600,
										color: 'primary.main',
										fontSize: '0.875rem'
									}}
								>
									{highlight}
								</Typography>
							</>
						)}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default memo(TabDescription);
