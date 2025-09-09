import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
	Box,
	useTheme,
	Typography,
	CircularProgress,
	Button,
	Paper,
	Stack,
	GlobalStyles,
	Fade,
	Grow
} from '@mui/material';
import { Launch as LaunchIcon, Error as ErrorIcon, Security as SecurityIcon } from '@mui/icons-material';

/**
 * 🚀 PÁGINA DE REDIRECIONAMENTO - CORAÇÃO DO SISTEMA
 *
 * FLUXO OTIMIZADO:
 * 1. Busca dados do link via API (sem autenticação)
 * 2. Exibe countdown para UX
 * 3. Redireciona para URL original
 * 4. Backend registra clique automaticamente
 */
function RedirectPage() {
	const theme = useTheme();
	const { shortCode } = useParams<{ shortCode: string }>();

	// Estados
	const [targetUrl, setTargetUrl] = useState<string>('');
	const [linkTitle, setLinkTitle] = useState<string>('');
	const [isValidLink, setIsValidLink] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [countdown, setCountdown] = useState<number>(0);
	const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
	const [showContent, setShowContent] = useState<boolean>(false);

	// CSS para animações
	const animations = `
		@keyframes pulse {
			0% { transform: scale(1); opacity: 1; }
			50% { transform: scale(1.1); opacity: 0.7; }
			100% { transform: scale(1); opacity: 1; }
		}
		@keyframes fadeInUp {
			from { opacity: 0; transform: translateY(30px); }
			to { opacity: 1; transform: translateY(0); }
		}
		@keyframes spin {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}
	`;

	// Função para validar URL externa
	const isExternalUrl = useCallback((url: string): boolean => {
		try {
			const urlObj = new URL(url);
			return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
		} catch {
			return false;
		}
	}, []);

	// Função para redirecionar com segurança
	const performRedirect = useCallback(
		(url: string) => {
			if (!isExternalUrl(url)) {
				setError('URL inválida ou insegura');
				return;
			}

			// Redireciona para URL externa
			window.location.href = url;
		},
		[isExternalUrl]
	);

	// Sistema de countdown personalizado
	const startCountdown = useCallback(
		(initialCount = 3) => {
			setCountdown(initialCount);
			setIsRedirecting(true);

			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						performRedirect(targetUrl);
						return 0;
					}

					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(interval);
		},
		[targetUrl, performRedirect]
	);

	useEffect(() => {
		const fetchRedirectData = async () => {
			if (!shortCode) {
				setError('Código de redirecionamento não fornecido');
				return;
			}

			try {
				// ÚNICA REQUISIÇÃO NECESSÁRIA - Backend coleta métricas e retorna URL
				const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
				const response = await fetch(`${backendUrl}/api/r/${shortCode}`, {
					method: 'GET',
					headers: {
						Accept: 'application/json'
					}
				});

				if (!response.ok) {
					throw new Error(`Link não encontrado: ${response.status}`);
				}

				const data = await response.json();

				if (data.success && data.redirect_url) {
					setTargetUrl(data.redirect_url);
					setLinkTitle(data.title || data.redirect_url); // Usa título ou URL como fallback
					setIsValidLink(true);
					setShowContent(true);
				} else {
					setError(data.message || 'Link inválido');
				}
			} catch {
				setError('Link não encontrado ou erro no servidor');
			}
		};

		fetchRedirectData();
	}, [shortCode]);

	// Inicia o countdown quando targetUrl é definido
	useEffect(() => {
		if (targetUrl && isValidLink && !isRedirecting) {
			const timer = setTimeout(() => {
				startCountdown(3);
			}, 500); // Pequeno delay para melhor UX

			return () => clearTimeout(timer);
		}
	}, [targetUrl, isValidLink, isRedirecting, startCountdown]);

	if (error) {
		return (
			<>
				<GlobalStyles styles={animations} />
				<Box
					sx={{
						minHeight: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background:
							theme.palette.mode === 'dark'
								? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
								: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
						p: 3
					}}
				>
					<Fade
						in
						timeout={800}
					>
						<Paper
							elevation={12}
							sx={{
								p: 4,
								borderRadius: 4,
								textAlign: 'center',
								maxWidth: 450,
								width: '100%',
								animation: 'fadeInUp 0.6s ease-out'
							}}
						>
							<Stack
								spacing={3}
								alignItems="center"
							>
								<ErrorIcon
									sx={{
										fontSize: 72,
										color: theme.palette.error.main,
										animation: 'pulse 2s infinite'
									}}
								/>
								<Typography
									variant="h4"
									fontWeight="bold"
									color="error"
								>
									Oops! Link não encontrado
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{ textAlign: 'center' }}
								>
									{error}
								</Typography>
								<Button
									variant="contained"
									size="large"
									onClick={() => (window.location.href = '/')}
									sx={{
										mt: 2,
										borderRadius: 2,
										px: 4,
										py: 1.5
									}}
								>
									Voltar ao início
								</Button>
							</Stack>
						</Paper>
					</Fade>
				</Box>
			</>
		);
	}

	return (
		<>
			<GlobalStyles styles={animations} />
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						theme.palette.mode === 'dark'
							? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
							: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
					p: 3
				}}
			>
				<Fade
					in={showContent || !isValidLink}
					timeout={600}
				>
					<Paper
						elevation={16}
						sx={{
							p: 5,
							borderRadius: 4,
							textAlign: 'center',
							maxWidth: 550,
							width: '100%',
							animation: 'fadeInUp 0.8s ease-out',
							backdropFilter: 'blur(10px)',
							background:
								theme.palette.mode === 'dark'
									? 'rgba(255, 255, 255, 0.05)'
									: 'rgba(255, 255, 255, 0.95)'
						}}
					>
						{isValidLink && targetUrl ? (
							<Stack
								spacing={4}
								alignItems="center"
							>
								<Grow
									in
									timeout={800}
								>
									<Box>
										<SecurityIcon
											sx={{
												fontSize: 80,
												color: theme.palette.success.main,
												animation: 'pulse 2s infinite',
												mb: 1
											}}
										/>
									</Box>
								</Grow>

								<Typography
									variant="h3"
									fontWeight="bold"
									color="primary"
								>
									Redirecionamento Seguro
								</Typography>

								<Typography
									variant="h6"
									color="text.secondary"
									sx={{ maxWidth: 400 }}
								>
									Você será redirecionado com segurança para:
								</Typography>

								<Paper
									variant="outlined"
									sx={{
										p: 3,
										backgroundColor: theme.palette.action.hover,
										borderRadius: 3,
										maxWidth: '100%',
										overflow: 'hidden',
										border: `2px solid ${theme.palette.primary.main}`,
										animation: 'fadeInUp 1s ease-out 0.3s both'
									}}
								>
									<Typography
										variant="h6"
										sx={{
											color: theme.palette.primary.main,
											fontWeight: 'bold',
											fontSize: '1.2rem',
											textAlign: 'center',
											mb: linkTitle !== targetUrl ? 1 : 0
										}}
									>
										{linkTitle}
									</Typography>
									{linkTitle !== targetUrl && (
										<Typography
											variant="body2"
											sx={{
												color: theme.palette.text.secondary,
												fontSize: '0.9rem',
												textAlign: 'center',
												wordBreak: 'break-all',
												opacity: 0.8
											}}
										>
											{targetUrl}
										</Typography>
									)}
								</Paper>

								{countdown > 0 && (
									<Grow
										in
										timeout={500}
									>
										<Box sx={{ position: 'relative', display: 'inline-flex', mt: 3 }}>
											<CircularProgress
												variant="determinate"
												value={((3 - countdown) / 3) * 100}
												size={80}
												thickness={6}
												sx={{
													color: theme.palette.primary.main,
													'& .MuiCircularProgress-circle': {
														strokeLinecap: 'round'
													}
												}}
											/>
											<Box
												sx={{
													top: 0,
													left: 0,
													bottom: 0,
													right: 0,
													position: 'absolute',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<Typography
													variant="h4"
													component="div"
													color="primary"
													fontWeight="bold"
												>
													{countdown}
												</Typography>
											</Box>
										</Box>
									</Grow>
								)}

								<Stack
									direction="row"
									spacing={2}
									sx={{ mt: 3 }}
								>
									<Button
										variant="contained"
										size="large"
										onClick={() => performRedirect(targetUrl)}
										startIcon={<LaunchIcon />}
										sx={{
											borderRadius: 3,
											px: 4,
											py: 1.5,
											fontSize: '1.1rem'
										}}
									>
										Ir Agora
									</Button>
								</Stack>
							</Stack>
						) : (
							<Stack
								spacing={4}
								alignItems="center"
							>
								<CircularProgress
									size={80}
									thickness={4}
									sx={{
										color: theme.palette.primary.main,
										animation: 'spin 1s linear infinite'
									}}
								/>
								<Typography
									variant="h4"
									fontWeight="bold"
								>
									Verificando Link...
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
								>
									Aguarde enquanto validamos o redirecionamento
								</Typography>
							</Stack>
						)}
					</Paper>
				</Fade>
			</Box>
		</>
	);
}

export default RedirectPage;
