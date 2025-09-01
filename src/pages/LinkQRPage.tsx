'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import { ArrowBack, Download, Share } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/shared/layout/MainLayout';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { useLinks } from '@/features/links/hooks/useLinks';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

/**
 * 📱 Página de QR Code para Link Individual
 * Gera e exibe QR Code do link encurtado
 */
function LinkQRPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getLink } = useLinks();
	const [linkInfo, setLinkInfo] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLink = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const link = await getLink(id);
				setLinkInfo(link);
			} catch (err) {
				setError('Erro ao carregar informações do link');
			} finally {
				setLoading(false);
			}
		};

		fetchLink();
	}, [id, getLink]);

	const handleBack = () => {
		navigate('/link');
	};

	const handleDownloadQR = () => {
		// Implementar download do QR Code
		console.log('Download QR Code');
	};

	const handleShareQR = () => {
		// Implementar compartilhamento do QR Code
		console.log('Share QR Code');
	};

	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<Alert severity="error">ID do link não fornecido na URL</Alert>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<Typography>Carregando...</Typography>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (error || !linkInfo) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<Box sx={{ p: 3 }}>
						<Alert severity="error">{error || 'Link não encontrado'}</Alert>
					</Box>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<Box sx={{ p: 3 }}>
					{/* Breadcrumb */}
					<Box sx={{ mb: 2 }}>
						<PageBreadcrumb skipHome />
					</Box>

					{/* Header */}
					<Box sx={{ mb: 4 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
							<Typography
								variant="h4"
								component="h1"
							>
								📱 QR Code do Link
							</Typography>
							<Button
								variant="outlined"
								startIcon={<ArrowBack />}
								onClick={handleBack}
							>
								Voltar para Lista
							</Button>
						</Box>

						<Typography
							variant="subtitle1"
							color="text.secondary"
						>
							{linkInfo.title || linkInfo.original_url}
						</Typography>
					</Box>

					{/* QR Code */}
					<Card sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
						<CardContent sx={{ textAlign: 'center', py: 4 }}>
							<Typography
								variant="h6"
								gutterBottom
							>
								QR Code
							</Typography>

							{/* Placeholder para o QR Code */}
							<Box
								sx={{
									width: 200,
									height: 200,
									bgcolor: 'grey.100',
									mx: 'auto',
									mb: 2,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 1
								}}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									QR Code será gerado aqui
								</Typography>
							</Box>

							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 3 }}
							>
								{linkInfo.shorted_url}
							</Typography>

							{/* Ações */}
							<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
								<Button
									variant="contained"
									startIcon={<Download />}
									onClick={handleDownloadQR}
								>
									Baixar QR
								</Button>
								<Button
									variant="outlined"
									startIcon={<Share />}
									onClick={handleShareQR}
								>
									Compartilhar
								</Button>
							</Box>
						</CardContent>
					</Card>

					{/* Informações do Link */}
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								Informações do Link
							</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Typography variant="body2">
									<strong>URL Original:</strong> {linkInfo.original_url}
								</Typography>
								<Typography variant="body2">
									<strong>URL Encurtada:</strong> {linkInfo.shorted_url}
								</Typography>
								<Typography variant="body2">
									<strong>Status:</strong> {linkInfo.is_active ? 'Ativo' : 'Inativo'}
								</Typography>
								<Typography variant="body2">
									<strong>Criado em:</strong>{' '}
									{new Date(linkInfo.created_at).toLocaleDateString('pt-BR')}
								</Typography>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkQRPage;
