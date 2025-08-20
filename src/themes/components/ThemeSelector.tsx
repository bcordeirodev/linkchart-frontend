/**
 * Componente de seleção de tema simplificado para Link Charts
 * Substitui o FuseThemeSelector com uma interface mais limpa
 */

import { memo } from 'react';
import { Box, Grid, Card, CardActionArea, Typography, useTheme } from '@mui/material';
import { FuseThemeOption } from '@fuse/core/FuseThemeSelector/ThemePreview';

interface ThemeSelectorProps {
	options: FuseThemeOption[];
	onSelect?: (theme: FuseThemeOption) => void;
	selectedId?: string;
}

/**
 * Componente simplificado para seleção de temas
 */
function ThemeSelector({ options, onSelect, selectedId }: ThemeSelectorProps) {
	// const theme = useTheme();

	return (
		<Grid
			container
			spacing={2}
		>
			{options.map((option) => (
				<Grid
					item
					xs={6}
					sm={4}
					md={3}
					key={option.id}
				>
					<Card
						sx={{
							border: selectedId === option.id ? 2 : 1,
							borderColor: selectedId === option.id ? 'primary.main' : 'divider',
							transition: 'all 0.2s ease-in-out',
							'&:hover': {
								borderColor: 'primary.main',
								transform: 'scale(1.02)'
							}
						}}
					>
						<CardActionArea
							onClick={() => onSelect?.(option)}
							sx={{ p: 2 }}
						>
							<Box
								sx={{
									height: 80,
									borderRadius: 1,
									mb: 1,
									background: `linear-gradient(135deg, ${option.section.main.palette.primary.main} 0%, ${option.section.main.palette.secondary.main} 100%)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<Typography
									variant="caption"
									sx={{
										color: 'white',
										fontWeight: 'bold',
										textShadow: '0 1px 2px rgba(0,0,0,0.3)'
									}}
								>
									{option.id}
								</Typography>
							</Box>

							<Typography
								variant="body2"
								align="center"
								sx={{ fontWeight: 'medium' }}
							>
								{option.id}
							</Typography>
						</CardActionArea>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}

export default memo(ThemeSelector);
