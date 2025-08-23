'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	CircularProgress,
	Chip,
	Stack,
	Paper,
	ThemeProvider,
	CssBaseline,
	createTheme
} from '@mui/material';
import {
	Launch as LaunchIcon,
	Link as LinkIcon,
	Visibility as VisibilityIcon,
	CheckCircle as CheckCircleIcon,
	Error as ErrorIcon,
	Speed as SpeedIcon
} from '@mui/icons-material';

// Tema profissional para a página de redirecionamento
const redirectTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#3b82f6',
			light: '#60a5fa',
			dark: '#2563eb',
		},
		secondary: {
			main: '#10b981',
			light: '#34d399',
			dark: '#059669',
		},
		background: {
			default: '#0f172a',
			paper: 'rgba(30, 41, 59, 0.9)',
		},
		success: {
			main: '#10b981',
		},
		error: {
			main: '#ef4444',
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h4: {
			fontWeight: 700,
		},
		h5: {
			fontWeight: 600,
		},
		h6: {
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8,
	},
});

interface LinkPreview {
	id: number;
	slug: string;
	original_url: string;
	title?: string;
	description?: string;
	clicks: number;
	is_active: boolean;
	expires_at?: string;
	starts_in?: string;
	created_at: string;
	shorted_url: string;
}

/**
 * Página de redirecionamento para links encurtados
 * Página pública sem autenticação, header ou footer
 */
export default function LinkPreviewPage() {
	const params = useParams();
	const slug = params?.slug as string;

	const [link, setLink] = useState<LinkPreview | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState(3);
	const [showPreview, setShowPreview] = useState(false);

	const startCountdown = () => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					handleRedirect();
					return 0;
				}
				return prev - 1;
			});
		}, 500);
	};

	const handleRedirect = async () => {
		if (!slug) return;

		try {
			// Chama o endpoint único que registra métricas e retorna URL
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/r/${slug}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();

			if (response.ok && data.success && data.redirect_url) {
				// Redireciona para a URL original
				window.location.href = data.redirect_url;
			} else {
				// Trata erros
				setError(data.message || 'Erro ao processar redirecionamento');
			}
		} catch (err) {
			setError('Erro de conexão ao processar redirecionamento');
		}
	};

	const handleShowPreview = () => {
		setShowPreview(true);
		setCountdown(0);
	};

	const handleCreateLink = () => {
		window.open(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/shorter`, '_blank');
	};

	useEffect(() => {
		if (!slug) {
			setError('Slug inválido');
			setLoading(false);
			return;
		}

		// Evitar múltiplas chamadas se já temos o link
		if (link) {
			return;
		}

		// Buscar informações do link usando endpoint unificado em modo preview (sem registrar clique)
		fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/r/${slug}?preview=true`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Preview-Mode': 'true'
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Link não encontrado');
				}
				return response.json();
			})
			.then((response) => {
				if (response.success && response.data) {
					setLink(response.data);
					setLoading(false);
				} else {
					setError(response.message || 'Link não encontrado');
					setLoading(false);
				}
			})
			.catch((err) => {
				setError(err.message || 'Link não encontrado');
				setLoading(false);
			});
	}, [slug, link]); // Adicionado link como dependência para evitar loops

	// useEffect separado para iniciar countdown quando link for carregado
	useEffect(() => {
		if (link && !loading && !error && !showPreview && countdown === 3) {
			const timer = setTimeout(() => {
				startCountdown();
			}, 100); // Pequeno delay para evitar conflitos

			return () => clearTimeout(timer);
		}
	}, [link, loading, error, showPreview, countdown]);

	// Componente de Loading
	if (loading) {
		return (
			<ThemeProvider theme={redirectTheme}>
				<CssBaseline />
				<Box sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
					p: 3
				}}>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Card sx={{
							background: 'rgba(30, 41, 59, 0.95)',
							backdropFilter: 'blur(20px)',
							border: '1px solid rgba(59, 130, 246, 0.2)',
							borderRadius: 4,
							p: 4,
							textAlign: 'center',
							minWidth: 320
						}}>
							<Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
								<CircularProgress
									sx={{
										color: '#3b82f6',
										'& .MuiCircularProgress-circle': {
											strokeLinecap: 'round',
										}
									}}
									size={60}
									thickness={4}
								/>
								<Box sx={{
									top: 0,
									left: 0,
									bottom: 0,
									right: 0,
									position: 'absolute',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<SpeedIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
								</Box>
							</Box>
							<Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
								Verificando link...
							</Typography>
							<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
								Aguarde um momento
							</Typography>
						</Card>
					</motion.div>
				</Box>
			</ThemeProvider>
		);
	}

	// Componente de Erro
	if (error || !link) {
		return (
			<ThemeProvider theme={redirectTheme}>
				<CssBaseline />
				<Box sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
					p: 3
				}}>
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Card sx={{
							background: 'rgba(30, 41, 59, 0.95)',
							backdropFilter: 'blur(20px)',
							border: '1px solid rgba(239, 68, 68, 0.3)',
							borderRadius: 4,
							p: 4,
							textAlign: 'center',
							maxWidth: 480
						}}>
							<ErrorIcon sx={{
								fontSize: 64,
								color: '#ef4444',
								mb: 3,
							}} />

							<Typography variant="h4" sx={{ color: '#ef4444', mb: 2 }}>
								Link não encontrado
							</Typography>

							<Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
								{error || 'O link que você está procurando não existe, expirou ou foi desativado.'}
							</Typography>

							<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
								Verifique se o link foi digitado corretamente ou entre em contato com quem compartilhou.
							</Typography>

							<Button
								variant="contained"
								onClick={handleCreateLink}
								sx={{
									background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
									borderRadius: 3,
									px: 4,
									py: 1.5,
									fontWeight: 600,
									textTransform: 'none',
									'&:hover': {
										background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
									},
								}}
							>
								Criar Meu Link
							</Button>
						</Card>
					</motion.div>
				</Box>
			</ThemeProvider>
		);
	}

	// Componente de Preview
	if (showPreview) {
		return (
			<ThemeProvider theme={redirectTheme}>
				<CssBaseline />
				<Box sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
					p: 3
				}}>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						style={{ width: '100%', maxWidth: 600 }}
					>
						<Card sx={{
							background: 'rgba(30, 41, 59, 0.95)',
							backdropFilter: 'blur(20px)',
							border: '1px solid rgba(59, 130, 246, 0.2)',
							borderRadius: 4,
							overflow: 'hidden'
						}}>
							{/* Header do Card */}
							<Box sx={{
								background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
								p: 3,
								textAlign: 'center'
							}}>
								<LinkIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
								<Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
									Preview do Link
								</Typography>
							</Box>

							<CardContent sx={{ p: 4 }}>
								<Stack spacing={3}>
									{/* Título e Descrição */}
									{link.title && (
										<Box sx={{ textAlign: 'center' }}>
											<Typography variant="h6" sx={{
												color: '#3b82f6',
												fontWeight: 600,
												mb: 1
											}}>
												{link.title}
											</Typography>
										</Box>
									)}

									{link.description && (
										<Typography variant="body1" sx={{
											color: 'rgba(255,255,255,0.8)',
											textAlign: 'center',
											fontStyle: 'italic'
										}}>
											"{link.description}"
										</Typography>
									)}

									{/* URL de Destino */}
									<Box>
										<Typography variant="overline" sx={{
											color: '#10b981',
											fontWeight: 600,
											fontSize: '0.8rem'
										}}>
											DESTINO
										</Typography>
										<Paper sx={{
											p: 3,
											mt: 1,
											background: 'rgba(16, 185, 129, 0.1)',
											border: '1px solid rgba(16, 185, 129, 0.3)',
											borderRadius: 2
										}}>
											<Typography sx={{
												color: '#10b981',
												fontWeight: 600,
												wordBreak: 'break-all',
												fontSize: '0.95rem'
											}}>
												{link.original_url}
											</Typography>
										</Paper>
									</Box>

									{/* Estatísticas */}
									<Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
										<Chip
											icon={<VisibilityIcon />}
											label={`${link.clicks.toLocaleString()} cliques`}
											sx={{
												background: 'rgba(59, 130, 246, 0.2)',
												color: '#60a5fa',
												border: '1px solid rgba(59, 130, 246, 0.3)',
												fontWeight: 600
											}}
										/>
										<Chip
											icon={link.is_active ? <CheckCircleIcon /> : <ErrorIcon />}
											label={link.is_active ? 'Ativo' : 'Inativo'}
											sx={{
												background: link.is_active
													? 'rgba(16, 185, 129, 0.2)'
													: 'rgba(239, 68, 68, 0.2)',
												color: link.is_active ? '#34d399' : '#f87171',
												border: `1px solid ${link.is_active
													? 'rgba(16, 185, 129, 0.3)'
													: 'rgba(239, 68, 68, 0.3)'}`,
												fontWeight: 600
											}}
										/>
									</Stack>

									{/* Botões de Ação */}
									<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
										<Button
											variant="contained"
											startIcon={<LaunchIcon />}
											onClick={handleRedirect}
											fullWidth
											sx={{
												background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
												borderRadius: 3,
												py: 1.5,
												fontWeight: 700,
												textTransform: 'none',
												fontSize: '1.1rem',
												'&:hover': {
													background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
												},
											}}
										>
											Ir para o link
										</Button>

										<Button
											variant="outlined"
											onClick={handleCreateLink}
											fullWidth
											sx={{
												borderColor: 'rgba(59, 130, 246, 0.5)',
												color: '#60a5fa',
												borderRadius: 3,
												py: 1.5,
												fontWeight: 600,
												textTransform: 'none',
												'&:hover': {
													borderColor: '#3b82f6',
													background: 'rgba(59, 130, 246, 0.1)',
												},
											}}
										>
											Criar Meu Link
										</Button>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</motion.div>
				</Box>
			</ThemeProvider>
		);
	}

	// Componente de Redirecionamento Automático
	return (
		<ThemeProvider theme={redirectTheme}>
			<CssBaseline />
			<Box sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
				p: 3
			}}>
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						style={{ textAlign: 'center', maxWidth: 500 }}
					>
						<Card sx={{
							background: 'rgba(30, 41, 59, 0.95)',
							backdropFilter: 'blur(20px)',
							border: '1px solid rgba(16, 185, 129, 0.3)',
							borderRadius: 4,
							p: 4,
							position: 'relative',
							overflow: 'hidden'
						}}>
							{/* Barra de progresso */}
							<Box sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '4px',
								background: 'rgba(16, 185, 129, 0.2)',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									height: '100%',
									width: `${((3 - countdown) / 3) * 100}%`,
									background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
									transition: 'width 1s linear'
								}
							}} />

							<LaunchIcon sx={{
								fontSize: 64,
								color: '#10b981',
								mb: 3,
							}} />

							<Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
								Redirecionando...
							</Typography>

							{link.title && (
								<Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
									{link.title}
								</Typography>
							)}

							<Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
								Você será redirecionado para:
							</Typography>

							<Paper sx={{
								p: 2,
								mb: 4,
								background: 'rgba(16, 185, 129, 0.1)',
								border: '1px solid rgba(16, 185, 129, 0.3)',
								borderRadius: 2
							}}>
								<Typography sx={{
									color: '#34d399',
									wordBreak: 'break-all',
									fontSize: '0.9rem',
									fontWeight: 500
								}}>
									{link.original_url}
								</Typography>
							</Paper>

							<motion.div
								key={countdown}
								initial={{ scale: 1.1, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<Typography variant="h2" sx={{
									color: '#10b981',
									fontWeight: 700,
									mb: 2,
								}}>
									{countdown}
								</Typography>
							</motion.div>

							<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
								Redirecionamento automático em {countdown} segundo{countdown !== 1 ? 's' : ''}
							</Typography>

							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
								<Button
									variant="contained"
									onClick={handleRedirect}
									fullWidth
									sx={{
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										borderRadius: 3,
										py: 1.2,
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
										}
									}}
								>
									Ir agora
								</Button>

								<Button
									variant="outlined"
									onClick={handleShowPreview}
									fullWidth
									sx={{
										borderColor: 'rgba(59, 130, 246, 0.5)',
										color: '#60a5fa',
										borderRadius: 3,
										py: 1.2,
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#3b82f6',
											background: 'rgba(59, 130, 246, 0.1)',
										}
									}}
								>
									Ver detalhes
								</Button>
							</Stack>
						</Card>
					</motion.div>
				</AnimatePresence>
			</Box>
		</ThemeProvider>
	);
}