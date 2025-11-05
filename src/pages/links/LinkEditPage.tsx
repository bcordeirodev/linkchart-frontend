'use client';

import { Alert, Stack, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { EditLinkForm, LinkAnalyticsActions } from '@/features/links';
import { AppIcon } from '@/shared/ui/icons';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';
import { linkService } from '@/services';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';

/**
 * 📝 Página de Edição de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, carrega dados iniciais
 * Estrutura: PageBreadcrumb → Actions → LinkForm.
 */
function LinkEditPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [linkData, setLinkData] = useState<{ short_url?: string } | null>(null);

	// Carregar dados do link para a barra de ações
	useEffect(() => {
		const fetchLinkData = async () => {
			if (!id) {
				return;
			}

			try {
				const response = await linkService.findOne(id);

				if (response?.data) {
					setLinkData({
						short_url: response.data.slug || response.data.custom_slug
					});
				}
			} catch (_error) {
				// Erro ao carregar dados do link - não é crítico para a página
			}
		};

		fetchLinkData();
	}, [id]);

	const handleDeleteSuccess = () => {
		navigate('/link');
	};

	// Validação de ID
	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<ResponsiveContainer
						variant='form'
						maxWidth='md'
					>
						<Stack spacing={3}>
							<PageBreadcrumb />

							<Alert
								severity='error'
								action={
									<Button
										size='small'
										startIcon={
											<AppIcon
												intent='back'
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
					variant='form'
					maxWidth='md'
				>
					<Stack spacing={3}>
						{/* Ações do Link */}
						{linkData ? (
							<LinkAnalyticsActions
								linkId={id}
								shortUrl={linkData.short_url}
								onDeleteSuccess={handleDeleteSuccess}
								currentPage='edit'
								actions={{
									showEdit: false // Ocultar editar na página de edição
								}}
							/>
						) : null}

						{/* Form Section */}
						<EditLinkForm
							linkId={id}
							showBackButton
						/>
					</Stack>
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkEditPage;
