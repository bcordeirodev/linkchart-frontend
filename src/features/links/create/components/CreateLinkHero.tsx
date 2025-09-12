/**
 * 🎨 CREATE LINK HERO
 * Seção hero para página de criação de links
 */

import { Typography, Fade, useTheme, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { createThemeGradient } from '@/lib/theme';
import { AppIcon } from '@/lib/icons';

/**
 * Componente hero otimizado para criação de links
 * Usa design tokens e gradientes do tema
 */
export function CreateLinkHero() {
	const theme = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Garante que o componente está montado antes de iniciar a animação
		const timer = setTimeout(() => setMounted(true), 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Box>
			<Fade
				in={mounted}
				timeout={600}
				mountOnEnter
				unmountOnExit
			>
				<Box>
					<EnhancedPaper variant="elevated">
						<Box sx={{ p: 4, textAlign: 'center' }}>
							{/* Icon + Title */}
							<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 80,
										height: 80,
										borderRadius: 3,
										mb: 2,
										background: createThemeGradient(theme, {
											variant: 'success',
											direction: 'to-bottom-right'
										})
									}}
								>
									<AppIcon
										intent="create"
										size={32}
										color="white"
									/>
								</Box>

								<Typography
									variant="h3"
									fontWeight={700}
									sx={{
										background: createThemeGradient(theme, {
											variant: 'primary',
											direction: 'to-right'
										}),
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text'
									}}
								>
									Criar Novo Link
								</Typography>
							</Box>

							{/* Subtitle */}
							<Typography
								variant="h6"
								color="text.secondary"
								gutterBottom
							>
								Transforme URLs longas em links curtos e rastreáveis
							</Typography>

							{/* Features */}
							<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<AppIcon
										intent="info"
										size={20}
										color={theme.palette.warning.main}
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Analytics detalhados
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<AppIcon
										intent="trending"
										size={20}
										color={theme.palette.success.main}
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Acompanhe performance
									</Typography>
								</Box>
							</Box>
						</Box>
					</EnhancedPaper>
				</Box>
			</Fade>
		</Box>
	);
}

export default CreateLinkHero;
