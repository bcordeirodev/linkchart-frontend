import { CircularProgress, Typography, Box, Fade } from '@mui/material';

import { useResponsive } from '@/lib/theme/hooks/useResponsive';
import { EnhancedPaper } from '@/shared/ui/base';

interface RedirectingStateProps {
	isVisible: boolean;
}

/**
 * 🔄 COMPONENTE DE ESTADO DE REDIRECIONAMENTO - MOBILE FIRST
 *
 * Mostra feedback visual durante o redirecionamento
 * Otimizado para dispositivos móveis com design responsivo
 * Seguindo padrões arquiteturais do projeto
 */
export function RedirectingState({ isVisible }: RedirectingStateProps) {
	const { isMobile, isXSmall } = useResponsive();

	return (
		<Fade
			in={isVisible}
			timeout={isMobile ? 400 : 600} // Transição mais rápida em mobile
		>
			<Box>
				<EnhancedPaper
					variant='glass'
					sx={{
						textAlign: 'center',
						// Padding responsivo - mobile first
						p: {
							xs: 2,
							sm: 2.5,
							md: 3,
							lg: 4
						},
						mb: {
							xs: 2,
							sm: 2.5,
							md: 3,
							lg: 4
						},
						background: isMobile
							? 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(76, 175, 80, 0.04) 100%)'
							: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
						border: {
							xs: '1px solid',
							md: '2px solid'
						},
						borderColor: 'success.light',
						borderRadius: {
							xs: 2,
							sm: 2.5,
							md: 3
						},
						width: '100%'
					}}
				>
					<CircularProgress
						size={isMobile ? (isXSmall ? 40 : 48) : 56} // Tamanho responsivo
						thickness={isMobile ? 3.5 : 4} // Espessura menor em mobile
						sx={{
							mb: {
								xs: 2, // 16px - mobile
								sm: 2.5, // 20px - tablet pequeno
								md: 3 // 24px - desktop
							},
							color: 'success.main'
						}}
					/>

					<Typography
						variant={isMobile ? 'h6' : 'h5'} // Variante menor em mobile
						color='success.main'
						sx={{
							fontWeight: { xs: 600, md: 700 }, // Peso menor em mobile
							mb: {
								xs: 0.5, // 4px - mobile
								sm: 0.75, // 6px - tablet pequeno
								md: 1 // 8px - desktop
							},
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: { xs: 0.5, md: 1 }, // Gap menor em mobile
							// Responsividade do texto
							fontSize: {
								xs: '1.1rem', // 17.6px - mobile
								sm: '1.25rem', // 20px - tablet pequeno
								md: '1.5rem' // 24px - desktop
							},
							lineHeight: { xs: 1.3, md: 1.2 }, // Line height otimizado para mobile
							// Stack em mobile se necessário
							flexDirection: { xs: 'column', sm: 'row' },
							textAlign: 'center'
						}}
					>
						<Box
							component='span'
							sx={{
								fontSize: {
									xs: '1.2rem', // 19.2px - mobile
									sm: '1.3rem', // 20.8px - tablet pequeno
									md: '1.5rem' // 24px - desktop
								}
							}}
						>
							✅
						</Box>
						{isMobile && isXSmall ? 'Link criado!' : 'Link criado com sucesso!'}
					</Typography>

					<Typography
						variant={isMobile ? 'body2' : 'body1'} // Variante menor em mobile
						color='text.secondary'
						sx={{
							fontWeight: { xs: 400, md: 500 }, // Peso menor em mobile
							opacity: { xs: 0.9, md: 0.8 }, // Opacidade maior em mobile para melhor legibilidade
							// Responsividade do texto
							fontSize: {
								xs: '0.875rem', // 14px - mobile
								sm: '0.9375rem', // 15px - tablet pequeno
								md: '1rem' // 16px - desktop
							},
							lineHeight: { xs: 1.4, md: 1.3 }, // Line height otimizado para mobile
							px: { xs: 1, md: 0 } // Padding horizontal em mobile para melhor leitura
						}}
					>
						{isMobile && isXSmall ? 'Redirecionando...' : 'Redirecionando para analytics...'}
					</Typography>

					{/* Indicador de progresso visual - responsivo */}
					<Box
						sx={{
							mt: {
								xs: 2, // 16px - mobile
								sm: 2.5, // 20px - tablet pequeno
								md: 3 // 24px - desktop
							},
							height: {
								xs: 3, // 3px - mobile (mais fino)
								md: 4 // 4px - desktop
							},
							bgcolor: 'grey.200',
							borderRadius: {
								xs: 1.5, // 6px - mobile
								md: 2 // 8px - desktop
							},
							overflow: 'hidden',
							position: 'relative',
							// Margem horizontal em mobile para melhor visual
							mx: { xs: 1, md: 0 }
						}}
					>
						<Box
							sx={{
								height: '100%',
								bgcolor: 'success.main',
								borderRadius: {
									xs: 1.5, // 6px - mobile
									md: 2 // 8px - desktop
								},
								animation: isMobile
									? 'progressBarMobile 1s ease-in-out'
									: 'progressBar 1.2s ease-in-out',
								// Animações responsivas
								'@keyframes progressBarMobile': {
									'0%': { width: '0%' },
									'100%': { width: '100%' }
								},
								'@keyframes progressBar': {
									'0%': { width: '0%' },
									'100%': { width: '100%' }
								}
							}}
						/>
					</Box>
				</EnhancedPaper>
			</Box>
		</Fade>
	);
}
