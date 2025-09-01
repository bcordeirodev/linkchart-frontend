import { Box, Typography, useTheme } from '@mui/material';
import { createGlassCard, createTextGradient, createThemeGradient, createPresetAnimations } from '@/lib/theme';

/**
 * Cabeçalho da página de perfil
 * Inclui breadcrumb e título da seção com utilitários de tema
 */
export function ProfileHeader() {
	const theme = useTheme();

	// Usa utilitários de tema
	const animations = createPresetAnimations(theme);
	return (
		<Box sx={{ mb: 5 }}>
			{/* <PageBreadcrumb /> */}
			<Box
				sx={{
					// Usa glassmorphism padronizado
					...(createGlassCard(theme, 'secondary') as any),
					borderRadius: 3,
					p: 4,
					position: 'relative',
					overflow: 'hidden',
					// Usa animações padronizadas
					...animations.fadeIn
				}}
			>
				{/* Elemento decorativo */}
				<Box
					sx={{
						position: 'absolute',
						top: -30,
						right: -30,
						width: 150,
						height: 150,
						// Usa gradiente de tema
						background: createThemeGradient(theme, {
							variant: 'secondary',
							direction: 'to-bottom-right',
							opacity: 0.3
						}),
						borderRadius: '50%',
						opacity: 0.6
					}}
				/>

				<Box sx={{ position: 'relative', zIndex: 1 }}>
					<Typography
						variant="h3"
						component="h1"
						sx={{
							fontWeight: 700,
							// Usa gradiente de texto padronizado
							...createTextGradient(theme, 'secondary'),
							mb: 2
						}}
					>
						👤 Meu Perfil
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							fontWeight: 400,
							opacity: 0.8
						}}
					>
						Gerencie suas informações pessoais e configurações de conta
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default ProfileHeader;
