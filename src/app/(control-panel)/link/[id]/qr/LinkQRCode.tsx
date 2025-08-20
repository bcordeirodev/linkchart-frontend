'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
	Box,
	Typography,
	Grid,
	Button,
	Paper,
	IconButton,
	Alert,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	TextField,
	Divider,
	Chip,
	Stack,
	Fade,
	Tooltip
} from '@mui/material';
import {
	ArrowBack,
	QrCode,
	Download,
	ContentCopy,
	Share,
	Print,
	Refresh,
	Palette,
	Settings,
	Link as LinkIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { findOne } from '@/services/link.service';
import QRCode from 'qrcode';
import NextImage from 'next/image';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';
import EnhancedPaper from '@/components/ui/EnhancedPaper';

interface LinkQRCodeProps {
	id: string;
}

interface QRConfig {
	size: number;
	errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
	type: 'image/png' | 'image/jpeg' | 'image/webp';
	quality: number;
	margin: number;
	color: {
		dark: string;
		light: string;
	};
}

const defaultQRConfig: QRConfig = {
	size: 300,
	errorCorrectionLevel: 'M',
	type: 'image/png',
	quality: 0.92,
	margin: 4,
	color: {
		dark: '#000000',
		light: '#FFFFFF'
	}
};

const colorPresets = [
	{ name: 'Clássico', dark: '#000000', light: '#FFFFFF' },
	{ name: 'Azul', dark: '#1976d2', light: '#e3f2fd' },
	{ name: 'Verde', dark: '#388e3c', light: '#e8f5e9' },
	{ name: 'Roxo', dark: '#7b1fa2', light: '#f3e5f5' },
	{ name: 'Laranja', dark: '#f57c00', light: '#fff3e0' },
	{ name: 'Vermelho', dark: '#d32f2f', light: '#ffebee' }
];

function LinkQRCode({ id }: LinkQRCodeProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [linkData, setLinkData] = useState<ILinkResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [qrDataURL, setQrDataURL] = useState<string>('');
	const [qrConfig, setQrConfig] = useState<QRConfig>(defaultQRConfig);
	const [showAdvanced, setShowAdvanced] = useState(false);

	// Carregar dados do link
	useEffect(() => {
		const fetchLinkData = async () => {
			try {
				// console.log('QR Code: Carregando dados do link...', { id });
				setLoading(true);
				const response = await findOne(id);
				// console.log('QR Code: Dados do link carregados:', response.data);
				setLinkData(response.data);
			} catch (error) {
				console.error('QR Code: Erro ao carregar dados do link:', error);
				dispatch(
					showMessage({
						message: 'Erro ao carregar dados do link',
						variant: 'error'
					})
				);
				router.push('/link');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchLinkData();
		}
	}, [id, dispatch, router]);

	// Gerar QR Code quando os dados ou configurações mudarem
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const generateQRCodeEffect = async () => {
			if (!linkData?.shorted_url) {
				// console.log('QR Code: Aguardando dados do link...');
				return;
			}

			// console.log('QR Code: Iniciando geração...', linkData.shorted_url);

			// Timeout de segurança
			timeoutId = setTimeout(() => {
				console.error('QR Code: Timeout na geração');
				dispatch(
					showMessage({
						message: 'Timeout na geração do QR Code. Tente novamente.',
						variant: 'warning'
					})
				);
			}, 10000); // 10 segundos

			try {
				const options = {
					errorCorrectionLevel: qrConfig.errorCorrectionLevel,
					type: 'image/png' as const,
					quality: qrConfig.quality,
					margin: qrConfig.margin,
					color: qrConfig.color,
					width: qrConfig.size
				};

				const dataURL = await QRCode.toDataURL(linkData.shorted_url, options);

				// Limpar timeout se chegou até aqui
				clearTimeout(timeoutId);

				// console.log('QR Code: Gerado com sucesso!');
				setQrDataURL(dataURL);

				// Também desenhar no canvas para funcionalidades avançadas (opcional)
				if (canvasRef.current) {
					const canvas = canvasRef.current;
					const ctx = canvas.getContext('2d');

					if (ctx) {
						const img = new Image();
						img.onload = () => {
							canvas.width = qrConfig.size;
							canvas.height = qrConfig.size;
							ctx.drawImage(img, 0, 0);
							// console.log('QR Code: Canvas atualizado');
						};
						img.onerror = (err) => {
							console.error('QR Code: Erro ao carregar imagem no canvas:', err);
						};
						img.src = dataURL;
					}
				}
			} catch (error) {
				clearTimeout(timeoutId);
				console.error('Erro ao gerar QR Code:', error);
				dispatch(
					showMessage({
						message: `Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
						variant: 'error'
					})
				);
			}
		};

		generateQRCodeEffect();

		// Cleanup
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [linkData?.shorted_url, qrConfig, dispatch]);

	const downloadQRCode = useCallback(() => {
		if (!qrDataURL || !linkData) return;

		const link = document.createElement('a');
		link.download = `qr-code-${linkData.slug}.${qrConfig.type.split('/')[1]}`;
		link.href = qrDataURL;
		link.click();

		dispatch(
			showMessage({
				message: 'QR Code baixado com sucesso!',
				variant: 'success'
			})
		);
	}, [qrDataURL, linkData, qrConfig.type, dispatch]);

	const copyQRCodeImage = useCallback(async () => {
		if (!qrDataURL) return;

		try {
			const response = await fetch(qrDataURL);
			const blob = await response.blob();

			await navigator.clipboard.write([
				new ClipboardItem({
					[blob.type]: blob
				})
			]);

			dispatch(
				showMessage({
					message: 'QR Code copiado para a área de transferência!',
					variant: 'success'
				})
			);
		} catch (_error) {
			dispatch(
				showMessage({
					message: 'Erro ao copiar QR Code. Tente fazer o download.',
					variant: 'warning'
				})
			);
		}
	}, [qrDataURL, dispatch]);

	const printQRCode = useCallback(() => {
		if (!qrDataURL || !linkData) return;

		const printWindow = window.open('', '_blank');

		if (printWindow) {
			printWindow.document.write(`
				<html>
					<head>
						<title>QR Code - ${linkData.title || 'Link'}</title>
						<style>
							body { 
								font-family: Arial, sans-serif; 
								text-align: center; 
								padding: 20px;
							}
							.qr-container { 
								margin: 20px 0; 
							}
							.link-info { 
								margin: 20px 0; 
								padding: 15px;
								border: 1px solid #ddd;
								border-radius: 8px;
							}
						</style>
					</head>
					<body>
						<h2>${linkData.title || 'QR Code'}</h2>
						<div class="link-info">
							<p><strong>Link:</strong> ${linkData.shorted_url}</p>
							<p><strong>Destino:</strong> ${linkData.original_url}</p>
						</div>
						<div class="qr-container">
							<img src="${qrDataURL}" alt="QR Code" style="max-width: 100%; height: auto;" />
						</div>
						<p><small>Gerado em ${new Date().toLocaleString('pt-BR')}</small></p>
					</body>
				</html>
			`);
			printWindow.document.close();
			printWindow.print();
		}
	}, [qrDataURL, linkData]);

	const shareQRCode = useCallback(async () => {
		if (!qrDataURL || !linkData) return;

		try {
			const response = await fetch(qrDataURL);
			const blob = await response.blob();
			const file = new File([blob], `qr-code-${linkData.slug}.png`, { type: 'image/png' });

			if (navigator.share && navigator.canShare({ files: [file] })) {
				await navigator.share({
					title: `QR Code - ${linkData.title || 'Link'}`,
					text: `QR Code para: ${linkData.shorted_url}`,
					files: [file]
				});
			} else {
				// Fallback: copiar link
				await navigator.clipboard.writeText(linkData.shorted_url);
				dispatch(
					showMessage({
						message: 'Link copiado para compartilhar!',
						variant: 'success'
					})
				);
			}
		} catch (_error) {
			dispatch(
				showMessage({
					message: 'Erro ao compartilhar. Link copiado para a área de transferência.',
					variant: 'warning'
				})
			);
		}
	}, [qrDataURL, linkData, dispatch]);

	const applyColorPreset = useCallback((preset: (typeof colorPresets)[0]) => {
		setQrConfig((prev) => ({
			...prev,
			color: {
				dark: preset.dark,
				light: preset.light
			}
		}));
	}, []);

	const forceRegenerateQR = useCallback(() => {
		// console.log('QR Code: Forçando regeneração...');
		setQrDataURL(''); // Limpar QR atual para forçar regeneração

		// Pequeno delay para garantir que o estado foi atualizado
		setTimeout(() => {
			if (linkData?.shorted_url) {
				// console.log('QR Code: Tentando gerar novamente...');
				// O useEffect será executado automaticamente devido à mudança em qrDataURL
			}
		}, 100);
	}, [linkData?.shorted_url]);

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: 400
				}}
			>
				<CircularProgress size={60} />
				<Typography
					variant="h6"
					sx={{ mt: 2 }}
				>
					Carregando dados do link...
				</Typography>
			</Box>
		);
	}

	if (!linkData) {
		return <Alert severity="error">Link não encontrado</Alert>;
	}

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
			{/* Breadcrumb */}
			<Box sx={{ mb: 3 }}>
				<PageBreadcrumb skipHome />
			</Box>

			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
					<Tooltip title="Voltar">
						<IconButton
							onClick={() => router.push(`/link/${id}/view`)}
							sx={{
								bgcolor: 'action.hover',
								'&:hover': { bgcolor: 'action.selected' }
							}}
						>
							<ArrowBack />
						</IconButton>
					</Tooltip>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
					>
						QR Code Generator
					</Typography>
				</Box>
				<Typography
					variant="subtitle1"
					color="text.secondary"
				>
					Gere, personalize e compartilhe QR Codes para seu link encurtado
				</Typography>
			</Box>

			<Grid
				container
				spacing={4}
			>
				{/* Preview do QR Code */}
				<Grid
					item
					xs={12}
					lg={7}
				>
					<Fade
						in
						timeout={600}
					>
						<EnhancedPaper sx={{ position: 'relative', overflow: 'hidden' }}>
							{/* Header da seção */}
							<Box
								sx={{
									background:
										'linear-gradient(135deg, rgba(10, 116, 218, 0.03) 0%, rgba(0, 164, 239, 0.01) 100%)',
									p: 3,
									borderBottom: 1,
									borderColor: 'divider'
								}}
							>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 600,
										display: 'flex',
										alignItems: 'center',
										gap: 1.5
									}}
								>
									<Box
										sx={{
											width: 32,
											height: 32,
											borderRadius: 1.5,
											background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<QrCode sx={{ color: 'white', fontSize: 20 }} />
									</Box>
									QR Code Preview
								</Typography>
							</Box>

							{/* Conteúdo principal */}
							<Box sx={{ p: 4, textAlign: 'center' }}>
								{qrDataURL && qrDataURL.length > 0 ? (
									<Box sx={{ mb: 4 }}>
										<Paper
											elevation={0}
											sx={{
												p: 3,
												display: 'inline-block',
												bgcolor: qrConfig.color.light,
												borderRadius: 3,
												border: '2px solid',
												borderColor: 'divider',
												transition: 'all 0.3s ease',
												'&:hover': {
													boxShadow: '0 8px 32px rgba(10, 116, 218, 0.15)',
													transform: 'translateY(-2px)'
												}
											}}
										>
											<NextImage
												src={qrDataURL}
												alt="QR Code"
												width={qrConfig.size}
												height={qrConfig.size}
												style={{
													maxWidth: '100%',
													height: 'auto',
													borderRadius: '8px'
												}}
												priority
											/>
										</Paper>
										<canvas
											ref={canvasRef}
											style={{ display: 'none' }}
										/>
									</Box>
								) : linkData?.shorted_url ? (
									<Box sx={{ py: 8 }}>
										<CircularProgress size={60} />
										<Typography
											variant="h6"
											sx={{ mt: 2 }}
										>
											Gerando QR Code...
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ mt: 1, display: 'block' }}
										>
											URL: {linkData.shorted_url}
										</Typography>
										<Button
											variant="outlined"
											startIcon={<Refresh />}
											onClick={forceRegenerateQR}
											sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}
											size="small"
										>
											Tentar Novamente
										</Button>
									</Box>
								) : (
									<Box sx={{ py: 8 }}>
										<CircularProgress size={60} />
										<Typography
											variant="h6"
											sx={{ mt: 2 }}
										>
											Carregando dados do link...
										</Typography>
									</Box>
								)}

								{/* Informações do Link */}
								<Box sx={{ mb: 4 }}>
									<Typography
										variant="h6"
										sx={{
											mb: 2,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 1
										}}
									>
										<LinkIcon color="primary" />
										Informações do Link
									</Typography>
									<Stack spacing={2}>
										<Box
											sx={{
												p: 2,
												bgcolor: 'success.50',
												borderRadius: 2,
												border: '1px solid',
												borderColor: 'success.200'
											}}
										>
											<Typography
												variant="caption"
												color="success.dark"
												sx={{ fontWeight: 600 }}
											>
												LINK ENCURTADO
											</Typography>
											<Typography
												variant="body1"
												sx={{
													fontFamily: 'monospace',
													fontWeight: 600,
													color: 'success.dark',
													wordBreak: 'break-all'
												}}
											>
												{linkData.shorted_url}
											</Typography>
										</Box>
										<Box
											sx={{
												p: 2,
												bgcolor: 'info.50',
												borderRadius: 2,
												border: '1px solid',
												borderColor: 'info.200'
											}}
										>
											<Typography
												variant="caption"
												color="info.dark"
												sx={{ fontWeight: 600 }}
											>
												DESTINO
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: 'info.dark',
													wordBreak: 'break-all'
												}}
											>
												{linkData.original_url}
											</Typography>
										</Box>
									</Stack>
								</Box>

								{/* Botões de Ação */}
								<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
									<Tooltip title="Baixar QR Code">
										<Button
											variant="contained"
											startIcon={<Download />}
											onClick={downloadQRCode}
											disabled={!qrDataURL}
											sx={{
												borderRadius: 2,
												textTransform: 'none',
												fontWeight: 600,
												px: 3,
												background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
												'&:hover': {
													background: 'linear-gradient(135deg, #0960C0 0%, #0090D1 100%)'
												}
											}}
										>
											Baixar
										</Button>
									</Tooltip>
									<Tooltip title="Copiar para área de transferência">
										<Button
											variant="outlined"
											startIcon={<ContentCopy />}
											onClick={copyQRCodeImage}
											disabled={!qrDataURL}
											sx={{
												borderRadius: 2,
												textTransform: 'none',
												fontWeight: 600,
												px: 3
											}}
										>
											Copiar
										</Button>
									</Tooltip>
									<Tooltip title="Compartilhar QR Code">
										<Button
											variant="outlined"
											startIcon={<Share />}
											onClick={shareQRCode}
											disabled={!qrDataURL}
											sx={{
												borderRadius: 2,
												textTransform: 'none',
												fontWeight: 600,
												px: 3
											}}
										>
											Compartilhar
										</Button>
									</Tooltip>
									<Tooltip title="Imprimir QR Code">
										<Button
											variant="outlined"
											startIcon={<Print />}
											onClick={printQRCode}
											disabled={!qrDataURL}
											sx={{
												borderRadius: 2,
												textTransform: 'none',
												fontWeight: 600,
												px: 3
											}}
										>
											Imprimir
										</Button>
									</Tooltip>
								</Box>
							</Box>
						</EnhancedPaper>
					</Fade>
				</Grid>

				{/* Configurações */}
				<Grid
					item
					xs={12}
					lg={5}
				>
					<Stack spacing={3}>
						{/* Configurações Básicas */}
						<Fade
							in
							timeout={800}
						>
							<EnhancedPaper>
								<Box
									sx={{
										background:
											'linear-gradient(135deg, rgba(156, 39, 176, 0.03) 0%, rgba(186, 104, 200, 0.01) 100%)',
										p: 3,
										borderBottom: 1,
										borderColor: 'divider'
									}}
								>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 600,
											display: 'flex',
											alignItems: 'center',
											gap: 1.5
										}}
									>
										<Box
											sx={{
												width: 28,
												height: 28,
												borderRadius: 1,
												background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Settings sx={{ color: 'white', fontSize: 16 }} />
										</Box>
										Configurações
									</Typography>
								</Box>

								<Box sx={{ p: 3 }}>
									<Stack spacing={3}>
										{/* Tamanho */}
										<Box>
											<Typography
												variant="subtitle2"
												gutterBottom
												sx={{ fontWeight: 600 }}
											>
												Tamanho: {qrConfig.size}px
											</Typography>
											<Slider
												value={qrConfig.size}
												onChange={(_, value) =>
													setQrConfig((prev) => ({ ...prev, size: value as number }))
												}
												min={200}
												max={800}
												step={50}
												marks={[
													{ value: 200, label: '200px' },
													{ value: 400, label: '400px' },
													{ value: 600, label: '600px' },
													{ value: 800, label: '800px' }
												]}
												sx={{
													'& .MuiSlider-thumb': {
														bgcolor: 'primary.main'
													},
													'& .MuiSlider-track': {
														bgcolor: 'primary.main'
													}
												}}
											/>
										</Box>

										{/* Nível de Correção de Erro */}
										<FormControl fullWidth>
											<InputLabel>Correção de Erro</InputLabel>
											<Select
												value={qrConfig.errorCorrectionLevel}
												label="Correção de Erro"
												onChange={(e) =>
													setQrConfig((prev) => ({
														...prev,
														errorCorrectionLevel: e.target
															.value as QRConfig['errorCorrectionLevel']
													}))
												}
											>
												<MenuItem value="L">Baixa (7%)</MenuItem>
												<MenuItem value="M">Média (15%)</MenuItem>
												<MenuItem value="Q">Alta (25%)</MenuItem>
												<MenuItem value="H">Muito Alta (30%)</MenuItem>
											</Select>
										</FormControl>

										{/* Margem */}
										<Box>
											<Typography
												variant="subtitle2"
												gutterBottom
												sx={{ fontWeight: 600 }}
											>
												Margem: {qrConfig.margin}
											</Typography>
											<Slider
												value={qrConfig.margin}
												onChange={(_, value) =>
													setQrConfig((prev) => ({ ...prev, margin: value as number }))
												}
												min={0}
												max={10}
												step={1}
												marks
												sx={{
													'& .MuiSlider-thumb': {
														bgcolor: 'primary.main'
													},
													'& .MuiSlider-track': {
														bgcolor: 'primary.main'
													}
												}}
											/>
										</Box>
									</Stack>
								</Box>
							</EnhancedPaper>
						</Fade>

						{/* Esquemas de Cores */}
						<Fade
							in
							timeout={1000}
						>
							<EnhancedPaper>
								<Box sx={{ p: 3 }}>
									<Typography
										variant="h6"
										gutterBottom
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1.5,
											mb: 3,
											fontWeight: 600
										}}
									>
										<Box
											sx={{
												width: 28,
												height: 28,
												borderRadius: 1,
												background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Palette sx={{ color: 'white', fontSize: 16 }} />
										</Box>
										Esquemas de Cores
									</Typography>
									<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
										{colorPresets.map((preset, index) => (
											<Chip
												key={index}
												label={preset.name}
												onClick={() => applyColorPreset(preset)}
												variant={qrConfig.color.dark === preset.dark ? 'filled' : 'outlined'}
												sx={{
													borderRadius: 2,
													fontWeight: 600,
													'& .MuiChip-label': {
														color:
															qrConfig.color.dark === preset.dark ? 'white' : preset.dark
													},
													...(qrConfig.color.dark === preset.dark && {
														background: `linear-gradient(135deg, ${preset.dark} 0%, ${preset.dark}CC 100%)`
													})
												}}
											/>
										))}
									</Box>
								</Box>
							</EnhancedPaper>
						</Fade>

						{/* Configurações Avançadas */}
						<Fade
							in
							timeout={1200}
						>
							<EnhancedPaper>
								<Box sx={{ p: 3 }}>
									<Button
										variant="text"
										onClick={() => setShowAdvanced(!showAdvanced)}
										sx={{
											mb: 2,
											textTransform: 'none',
											fontWeight: 600,
											'&:hover': { bgcolor: 'action.hover' }
										}}
									>
										{showAdvanced ? 'Ocultar' : 'Mostrar'} Configurações Avançadas
									</Button>

									{showAdvanced && (
										<Stack spacing={2}>
											<Grid
												container
												spacing={2}
											>
												<Grid
													item
													xs={6}
												>
													<TextField
														label="Cor Principal"
														type="color"
														value={qrConfig.color.dark}
														onChange={(e) =>
															setQrConfig((prev) => ({
																...prev,
																color: { ...prev.color, dark: e.target.value }
															}))
														}
														fullWidth
														size="small"
													/>
												</Grid>
												<Grid
													item
													xs={6}
												>
													<TextField
														label="Cor de Fundo"
														type="color"
														value={qrConfig.color.light}
														onChange={(e) =>
															setQrConfig((prev) => ({
																...prev,
																color: { ...prev.color, light: e.target.value }
															}))
														}
														fullWidth
														size="small"
													/>
												</Grid>
												<Grid
													item
													xs={6}
												>
													<FormControl
														fullWidth
														size="small"
													>
														<InputLabel>Formato</InputLabel>
														<Select
															value={qrConfig.type}
															label="Formato"
															onChange={(e) =>
																setQrConfig((prev) => ({
																	...prev,
																	type: e.target.value as QRConfig['type']
																}))
															}
														>
															<MenuItem value="image/png">PNG</MenuItem>
															<MenuItem value="image/jpeg">JPEG</MenuItem>
															<MenuItem value="image/webp">WebP</MenuItem>
														</Select>
													</FormControl>
												</Grid>
												<Grid
													item
													xs={6}
												>
													<Box>
														<Typography
															variant="subtitle2"
															gutterBottom
														>
															Qualidade: {Math.round(qrConfig.quality * 100)}%
														</Typography>
														<Slider
															value={qrConfig.quality}
															onChange={(_, value) =>
																setQrConfig((prev) => ({
																	...prev,
																	quality: value as number
																}))
															}
															min={0.1}
															max={1}
															step={0.05}
															size="small"
														/>
													</Box>
												</Grid>
											</Grid>

											<Divider />

											<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
												<Button
													variant="outlined"
													startIcon={<Refresh />}
													onClick={() => setQrConfig(defaultQRConfig)}
													size="small"
													sx={{
														borderRadius: 2,
														textTransform: 'none',
														fontWeight: 600
													}}
												>
													Restaurar Padrão
												</Button>
											</Box>
										</Stack>
									)}
								</Box>
							</EnhancedPaper>
						</Fade>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
}

export default LinkQRCode;
