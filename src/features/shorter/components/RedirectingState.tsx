import { CircularProgress, Typography, Box, Fade } from '@mui/material';
import { memo } from 'react';
import { EnhancedPaper } from '@/shared/ui/base';

interface RedirectingStateProps {
	isVisible: boolean;
}

/**
 * 🔄 COMPONENTE DE ESTADO DE REDIRECIONAMENTO
 *
 * Mostra feedback visual durante o redirecionamento
 * Seguindo padrões arquiteturais do projeto
 */
export function RedirectingState({ isVisible }: RedirectingStateProps) {
	return (
		<Fade
			in={isVisible}
			timeout={600}
		>
			<Box>
				<EnhancedPaper
					variant="glass"
					sx={{
						textAlign: 'center',
						p: 4,
						mb: 4,
						background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
						border: '2px solid',
						borderColor: 'success.light',
						borderRadius: 3
					}}
				>
					<CircularProgress
						size={56}
						thickness={4}
						sx={{
							mb: 3,
							color: 'success.main'
						}}
					/>

					<Typography
						variant="h5"
						color="success.main"
						sx={{
							fontWeight: 700,
							mb: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1
						}}
					>
						<Box
							component="span"
							sx={{ fontSize: '1.5rem' }}
						>
							✅
						</Box>
						Link criado com sucesso!
					</Typography>

					<Typography
						variant="body1"
						color="text.secondary"
						sx={{
							fontWeight: 500,
							opacity: 0.8
						}}
					>
						Redirecionando para analytics...
					</Typography>

					{/* Indicador de progresso visual */}
					<Box
						sx={{
							mt: 3,
							height: 4,
							bgcolor: 'grey.200',
							borderRadius: 2,
							overflow: 'hidden',
							position: 'relative'
						}}
					>
						<Box
							sx={{
								height: '100%',
								bgcolor: 'success.main',
								borderRadius: 2,
								animation: 'progressBar 1.2s ease-in-out',
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

export default memo(RedirectingState);
