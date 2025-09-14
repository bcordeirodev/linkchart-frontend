import { Container, CircularProgress, Typography, Box } from '@mui/material';
import { PublicLayout } from '@/shared/layout';

/**
 * ⏳ LOADING STATE
 *
 * Estado de carregamento para Basic Analytics
 * Segue padrões visuais do projeto
 * Corrigido para evitar erros de scroll
 */
export function LoadingState() {
	return (
		<PublicLayout>
			<Container
				maxWidth="md"
				sx={{ py: 8 }}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '60vh',
						textAlign: 'center'
					}}
				>
					<CircularProgress
						size={60}
						sx={{ mb: 2 }}
					/>
					<Typography
						variant="h6"
						color="text.secondary"
					>
						Carregando analytics do link...
					</Typography>
				</Box>
			</Container>
		</PublicLayout>
	);
}
