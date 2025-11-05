'use client';

import { Download, Share } from '@mui/icons-material';
import { Box, Typography, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useLinks, LinkAnalyticsActions } from '@/features/links';
import { useShareAPI } from '@/features/links/hooks/useShareAPI';
import { QRCodeSkeleton } from '@/shared/ui/feedback/skeletons';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';

import type { LinkResponse } from '@/types';

const buildShortUrl = (slug: string): string => {
	const frontendUrl = window.location.origin || 'http://localhost:3000';
	return `${frontendUrl}/r/${slug}`;
};

function LinkQRPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getLink } = useLinks();
	const { shareOrCopy } = useShareAPI();
	const [linkInfo, setLinkInfo] = useState<LinkResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

	useEffect(() => {
		const fetchLink = async () => {
			if (!id) {
				return;
			}

			try {
				setLoading(true);
				const link = await getLink(id);

				// Construir short_url se não existir
				if (link && !link.short_url && link.slug) {
					link.short_url = buildShortUrl(link.slug);
				}

				setLinkInfo(link);

				// Gerar QR Code
				if (link?.short_url) {
					// Validar se a URL é válida
					try {
						new URL(link.short_url);
					} catch (_urlError) {
						setError('URL encurtada inválida');
						return;
					}

					try {
						// Import dinâmico da biblioteca QRCode
						const QRCode = await import('qrcode');
						const qrDataUrl = await QRCode.default.toDataURL(link.short_url, {
							width: 200,
							margin: 2,
							color: {
								dark: '#000000',
								light: '#FFFFFF'
							},
							errorCorrectionLevel: 'M'
						});
						setQrCodeDataUrl(qrDataUrl);
					} catch (qrError) {
						console.error('❌ Erro ao gerar QR Code:', qrError);
						setError(
							`Erro ao gerar QR Code: ${qrError instanceof Error ? qrError.message : 'Erro desconhecido'}`
						);
					}
				} else {
					setError('Link não possui URL encurtada válida');
				}
			} catch (err) {
				console.error('❌ Erro ao carregar link:', err);
				setError('Erro ao carregar informações do link');
			} finally {
				setLoading(false);
			}
		};

		fetchLink();
	}, [id]); // Removido getLink das dependências para evitar re-renders

	// Handler para quando o link for excluído com sucesso
	const handleDeleteSuccess = () => {
		navigate('/link');
	};

	const handleDownloadQR = () => {
		if (!qrCodeDataUrl || !linkInfo) {
			return;
		}

		// Criar link de download
		const link = document.createElement('a');
		link.download = `qr-code-${linkInfo.slug || linkInfo.id}.png`;
		link.href = qrCodeDataUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleShareQR = async () => {
		if (!linkInfo) {
			return;
		}

		await shareOrCopy({
			title: `QR Code - ${linkInfo.title || linkInfo.original_url}`,
			text: `Confira este QR Code para: ${linkInfo.title || linkInfo.original_url}`,
			url: linkInfo.short_url
		});
	};

	if (!id) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<ResponsiveContainer variant='page'>
						<Alert severity='error'>ID do link não fornecido na URL</Alert>
					</ResponsiveContainer>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<QRCodeSkeleton />
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	if (error || !linkInfo) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<ResponsiveContainer variant='page'>
						<Alert severity='error'>{error || 'Link não encontrado'}</Alert>
					</ResponsiveContainer>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer
					variant='page'
					maxWidth='md'
				>
					{/* Ações do Link */}
					<LinkAnalyticsActions
						linkId={id}
						shortUrl={linkInfo.slug || linkInfo.custom_slug}
						onDeleteSuccess={handleDeleteSuccess}
						currentPage='qr'
						actions={{
							showQR: false // Ocultar QR na página de QR Code
						}}
					/>

					{/* Header */}
					<Box sx={{ mb: 4, mt: 3 }}>
						<Typography
							variant='h4'
							component='h1'
							sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 2 }}
						>
							📱 QR Code do Link
						</Typography>

						<Typography
							variant='subtitle1'
							color='text.secondary'
							sx={{
								wordBreak: 'break-word',
								fontSize: { xs: '0.9rem', md: '1rem' }
							}}
						>
							{linkInfo.title || linkInfo.original_url}
						</Typography>
					</Box>

					{/* QR Code */}
					<Card sx={{ mb: 4, maxWidth: { xs: '100%', sm: 400 }, mx: 'auto' }}>
						<CardContent sx={{ textAlign: 'center', py: 4 }}>
							<Typography
								variant='h6'
								gutterBottom
							>
								QR Code
							</Typography>

							{/* QR Code Real */}
							{qrCodeDataUrl ? (
								<Box
									sx={{
										mx: 'auto',
										mb: 2,
										display: 'flex',
										justifyContent: 'center'
									}}
								>
									<img
										src={qrCodeDataUrl}
										alt='QR Code'
										style={{
											width: '100%',
											maxWidth: 200,
											height: 'auto',
											aspectRatio: '1/1',
											borderRadius: 8,
											border: '1px solid #e0e0e0'
										}}
									/>
								</Box>
							) : (
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
									<CircularProgress size={30} />
								</Box>
							)}

							<Typography
								variant='body2'
								color='text.secondary'
								sx={{
									mb: 3,
									wordBreak: 'break-all',
									fontSize: { xs: '0.8rem', md: '0.875rem' }
								}}
							>
								{linkInfo.short_url}
							</Typography>

							{/* Ações */}
							<Box
								sx={{
									display: 'flex',
									gap: { xs: 1, sm: 2 },
									justifyContent: 'center',
									flexWrap: 'wrap',
									flexDirection: { xs: 'column', sm: 'row' }
								}}
							>
								<Button
									variant='contained'
									startIcon={<Download />}
									onClick={handleDownloadQR}
									disabled={!qrCodeDataUrl}
									sx={{
										minWidth: { xs: '100%', sm: 140 },
										fontSize: { xs: '0.875rem', md: '0.875rem' }
									}}
								>
									Baixar QR
								</Button>
								<Button
									variant='outlined'
									startIcon={<Share />}
									onClick={handleShareQR}
									disabled={!linkInfo}
									sx={{
										minWidth: { xs: '100%', sm: 140 },
										fontSize: { xs: '0.875rem', md: '0.875rem' }
									}}
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
								variant='h6'
								gutterBottom
								sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
							>
								Informações do Link
							</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 1 } }}>
								<Typography
									variant='body2'
									sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
								>
									<strong>URL Original:</strong>{' '}
									<Box
										component='span'
										sx={{
											wordBreak: 'break-all',
											color: 'text.secondary'
										}}
									>
										{linkInfo.original_url}
									</Box>
								</Typography>
								<Typography
									variant='body2'
									sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
								>
									<strong>URL Encurtada:</strong>{' '}
									<Box
										component='span'
										sx={{
											wordBreak: 'break-all',
											color: 'primary.main',
											fontFamily: 'monospace'
										}}
									>
										{linkInfo.short_url}
									</Box>
								</Typography>
								<Typography
									variant='body2'
									sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
								>
									<strong>Status:</strong>{' '}
									<Box
										component='span'
										sx={{
											color: linkInfo.is_active ? 'success.main' : 'error.main',
											fontWeight: 600
										}}
									>
										{linkInfo.is_active ? 'Ativo' : 'Inativo'}
									</Box>
								</Typography>
								<Typography
									variant='body2'
									sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
								>
									<strong>Criado em:</strong>{' '}
									<Box
										component='span'
										sx={{ color: 'text.secondary' }}
									>
										{new Date(linkInfo.created_at).toLocaleDateString('pt-BR')}
									</Box>
								</Typography>
							</Box>
						</CardContent>
					</Card>
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkQRPage;
