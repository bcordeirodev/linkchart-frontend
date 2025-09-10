'use client';

import { Container, Alert, Stack, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AppIcon } from '@/lib/icons';
import { EditLinkForm } from '@/features/links/edit';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

/**
 * 📝 Página de Edição de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, carrega dados iniciais
 * Estrutura: PageBreadcrumb → Loading/Error States → LinkForm.
 */
function LinkEditPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Validação de ID
	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Container maxWidth="md">
						<Stack
							spacing={3}
							sx={{ py: 4 }}
						>
							<PageBreadcrumb />

							<Alert
								severity="error"
								action={
									<Button
										size="small"
										startIcon={
											<AppIcon
												intent="back"
												size={16}
											/>
										}
										onClick={() => navigate(-1)}
									>
										Voltar
									</Button>
								}
							>
								<strong>ID do link não fornecido</strong>
								<br />O ID do link não foi fornecido na URL ou é inválido.
							</Alert>
						</Stack>
					</Container>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Container maxWidth="md">
					<Stack
						spacing={4}
						sx={{ py: 4 }}
					>
						<PageBreadcrumb />

						{/* Form Section */}
						<EditLinkForm
							linkId={id}
							showBackButton={true}
						/>
					</Stack>
				</Container>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkEditPage;
