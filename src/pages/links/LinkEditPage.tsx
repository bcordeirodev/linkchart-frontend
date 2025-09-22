'use client';

import { Alert, Stack, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AppIcon } from '@/lib/icons';
import { EditLinkForm } from '@/features/links/edit';
import { ResponsiveContainer } from '@/shared/ui/base';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
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
					<ResponsiveContainer
						variant="form"
						maxWidth="md"
					>
						<Stack spacing={3}>
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
					</ResponsiveContainer>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer
					variant="form"
					maxWidth="md"
				>
					<Stack spacing={4}>
						{/* Form Section */}
						<EditLinkForm
							linkId={id}
							showBackButton={true}
						/>
					</Stack>
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkEditPage;
