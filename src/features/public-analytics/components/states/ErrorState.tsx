import { Home as HomeIcon } from '@mui/icons-material';
import { Container, Alert, Button, Box } from '@mui/material';

import { PublicLayout } from '@/shared/layout';

interface ErrorStateProps {
	error: string;
	debugInfo?: string;
	onCreateLink: () => void;
}

/**
 * ❌ ERROR STATE
 *
 * Estado de erro para Basic Analytics
 * Oferece ações de recuperação e debug info
 */
export function ErrorState({ error, debugInfo, onCreateLink }: ErrorStateProps) {
	return (
		<PublicLayout>
			<Container
				maxWidth='md'
				sx={{ py: 8 }}
			>
				<Alert
					severity='error'
					sx={{ mb: 4 }}
					action={
						<Button
							color='inherit'
							onClick={onCreateLink}
						>
							Criar Link
						</Button>
					}
				>
					{error}
					{debugInfo ? (
						<div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>Debug: {debugInfo}</div>
					) : null}
				</Alert>

				<Box textAlign='center'>
					<Button
						variant='contained'
						startIcon={<HomeIcon />}
						onClick={onCreateLink}
						size='large'
					>
						Voltar ao Encurtador
					</Button>
				</Box>
			</Container>
		</PublicLayout>
	);
}
