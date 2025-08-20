'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	TextField,
	Button,
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	Switch,
	FormControlLabel,
	Alert,
	InputAdornment,
	IconButton,
	Tooltip,
	CircularProgress
} from '@mui/material';
import {
	ArrowBack,
	Link as LinkIcon,
	ContentCopy,
	Schedule,
	Public,
	Analytics,
	Refresh,
	Save,
	Edit
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { findOne, update } from '@/services/link.service';

/**
 * Schema de validação para edição de links
 */
const linkSchema = z.object({
	original_url: z.string().min(1, 'URL é obrigatória').url('URL deve ser válida (ex: https://exemplo.com)'),
	title: z.string().optional().or(z.literal('')),
	slug: z
		.string()
		.optional()
		.refine((val) => !val || /^[a-zA-Z0-9-_]+$/.test(val), {
			message: 'Slug deve conter apenas letras, números, hífens e underscores'
		}),
	description: z.string().optional().or(z.literal('')),
	expires_at: z.date().optional().nullable(),
	starts_in: z.date().optional().nullable(),
	is_active: z.boolean().default(true),
	click_limit: z
		.number()
		.int()
		.min(1, 'Limite deve ser pelo menos 1')
		.max(1000000, 'Limite máximo é 1.000.000')
		.optional(),
	// UTM Parameters
	utm_source: z.string().optional().or(z.literal('')),
	utm_medium: z.string().optional().or(z.literal('')),
	utm_campaign: z.string().optional().or(z.literal('')),
	utm_term: z.string().optional().or(z.literal('')),
	utm_content: z.string().optional().or(z.literal(''))
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkEditProps {
	id: string;
}

function LinkEdit({ id }: LinkEditProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showUTM, setShowUTM] = useState(false);
	const [originalData, setOriginalData] = useState<ILinkResponse | null>(null);

	const { control, handleSubmit, formState, setValue, reset } = useForm<LinkFormData>({
		resolver: zodResolver(linkSchema),
		mode: 'onChange'
	});

	const { errors, isValid, isDirty } = formState;

	// Carregar dados do link
	useEffect(() => {
		const fetchLinkData = async () => {
			try {
				setInitialLoading(true);
				const response = await findOne(id);
				const linkData = response.data;
				setOriginalData(linkData);

				// Preencher formulário com dados existentes
				const formData = {
					original_url: linkData.original_url,
					title: linkData.title || '',
					slug: linkData.slug,
					description: linkData.description || '',
					expires_at: linkData.expires_at ? new Date(linkData.expires_at) : null,
					starts_in: linkData.starts_in ? new Date(linkData.starts_in) : null,
					is_active: linkData.is_active,
					click_limit: linkData.click_limit,
					utm_source: linkData.utm_source || '',
					utm_medium: linkData.utm_medium || '',
					utm_campaign: linkData.utm_campaign || '',
					utm_term: linkData.utm_term || '',
					utm_content: linkData.utm_content || ''
				};

				// Form data loaded successfully
				reset(formData);

				// Mostrar seções avançadas se houver dados
				if (linkData.expires_at || linkData.starts_in || !linkData.is_active) {
					setShowAdvanced(true);
				}

				if (linkData.utm_source || linkData.utm_medium || linkData.utm_campaign) {
					setShowUTM(true);
				}
			} catch (error) {
				// Error handled by user feedback
				dispatch(
					showMessage({
						message: `Erro ao carregar dados do link: ${error.message || 'Erro desconhecido'}`,
						variant: 'error'
					})
				);
				router.push('/link');
			} finally {
				setInitialLoading(false);
			}
		};

		fetchLinkData();
	}, [id, reset, dispatch, router]);

	// Gerar slug aleatório
	const generateRandomSlug = () => {
		const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 8; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setValue('slug', result, { shouldDirty: true });
	};

	const onSubmit = async (data: LinkFormData) => {
		setLoading(true);
		try {
			// Preparar dados para envio, removendo campos vazios
			const linkData = {
				original_url: data.original_url,
				title: data.title || undefined,
				slug: data.slug || undefined,
				description: data.description || undefined,
				expires_at: data.expires_at?.toISOString() || undefined,
				starts_in: data.starts_in?.toISOString() || undefined,
				is_active: data.is_active,
				utm_source: data.utm_source || undefined,
				utm_medium: data.utm_medium || undefined,
				utm_campaign: data.utm_campaign || undefined,
				utm_term: data.utm_term || undefined,
				utm_content: data.utm_content || undefined
			};

			// Remover propriedades undefined
			const cleanedData = Object.fromEntries(
				Object.entries(linkData).filter(([_, value]) => value !== undefined)
			);

			// Sending data to API
			await update(id, cleanedData);

			dispatch(
				showMessage({
					message: 'Link atualizado com sucesso!',
					variant: 'success'
				})
			);

			// Redirecionar para a visualização
			router.push(`/link/${id}/view`);
		} catch (error) {
			// Error handled by user feedback
			dispatch(
				showMessage({
					message: `Erro ao atualizar link: ${error.message || 'Tente novamente.'}`,
					variant: 'error'
				})
			);
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		dispatch(
			showMessage({
				message: `${label} copiado para a área de transferência!`,
				variant: 'success'
			})
		);
	};

	if (initialLoading) {
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

	if (!originalData) {
		return <Alert severity="error">Link não encontrado</Alert>;
	}

	return (
		<Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
			{/* Header */}
			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
				<IconButton onClick={() => router.push(`/link/${id}/view`)}>
					<ArrowBack />
				</IconButton>
				<Box sx={{ flexGrow: 1 }}>
					<Typography
						variant="h4"
						component="h1"
					>
						Editar Link
					</Typography>
					<Typography
						variant="subtitle1"
						color="text.secondary"
					>
						Atualize as informações do seu link encurtado
					</Typography>
				</Box>
				{originalData && (
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Tooltip title="Copiar link encurtado">
							<IconButton
								onClick={() => copyToClipboard(originalData.shorted_url, 'Link encurtado')}
								color="primary"
							>
								<ContentCopy />
							</IconButton>
						</Tooltip>
					</Box>
				)}
			</Box>

			{/* Preview do Link Atual */}
			{originalData && (
				<Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<LinkIcon />
							Link Atual
						</Typography>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								md={6}
							>
								<Typography
									variant="body2"
									sx={{ opacity: 0.8, mb: 1 }}
								>
									URL Encurtada:
								</Typography>
								<Typography
									variant="body1"
									sx={{ fontWeight: 'bold', wordBreak: 'break-all' }}
								>
									{originalData.shorted_url}
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
							>
								<Typography
									variant="body2"
									sx={{ opacity: 0.8, mb: 1 }}
								>
									Cliques:
								</Typography>
								<Typography
									variant="h5"
									sx={{ fontWeight: 'bold' }}
								>
									{originalData.clicks || 0}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)}

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid
					container
					spacing={3}
				>
					{/* Informações Básicas */}
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
								>
									<Edit color="primary" />
									Informações Básicas
								</Typography>

								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
									>
										<Controller
											name="original_url"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="URL Original"
													placeholder="https://exemplo.com/pagina-muito-longa"
													fullWidth
													error={!!errors.original_url}
													helperText={errors.original_url?.message}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Public color="action" />
															</InputAdornment>
														)
													}}
												/>
											)}
										/>
									</Grid>

									<Grid
										item
										xs={12}
										md={8}
									>
										<Controller
											name="title"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Título do Link"
													placeholder="Descrição amigável do seu link"
													fullWidth
													error={!!errors.title}
													helperText={errors.title?.message}
												/>
											)}
										/>
									</Grid>

									<Grid
										item
										xs={12}
										md={4}
									>
										<Controller
											name="slug"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Slug Personalizado"
													placeholder="meu-link"
													fullWidth
													error={!!errors.slug}
													helperText={
														errors.slug?.message ||
														'Altere com cuidado - pode quebrar links existentes'
													}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<Tooltip title="Gerar slug aleatório">
																	<IconButton onClick={generateRandomSlug}>
																		<Refresh />
																	</IconButton>
																</Tooltip>
															</InputAdornment>
														)
													}}
												/>
											)}
										/>
									</Grid>

									<Grid
										item
										xs={12}
									>
										<Controller
											name="description"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Descrição (Opcional)"
													placeholder="Adicione uma descrição para organizar seus links"
													fullWidth
													multiline
													rows={2}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					{/* Configurações Avançadas */}
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										mb: 2
									}}
								>
									<Typography
										variant="h6"
										sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
									>
										<Schedule color="primary" />
										Configurações Avançadas
									</Typography>
									<Button
										variant="text"
										onClick={() => setShowAdvanced(!showAdvanced)}
									>
										{showAdvanced ? 'Ocultar' : 'Mostrar'}
									</Button>
								</Box>

								{showAdvanced && (
									<Grid
										container
										spacing={2}
									>
										<Grid
											item
											xs={12}
										>
											<Controller
												name="is_active"
												control={control}
												render={({ field }) => (
													<FormControlLabel
														control={
															<Switch
																checked={field.value}
																onChange={field.onChange}
																color="primary"
															/>
														}
														label="Link ativo (pode ser acessado)"
													/>
												)}
											/>
										</Grid>

										<Grid
											item
											xs={12}
											md={6}
										>
											<Controller
												name="starts_in"
												control={control}
												render={({ field }) => (
													<DateTimePicker
														label="Data de Início (Opcional)"
														value={field.value}
														onChange={field.onChange}
														slotProps={{
															textField: {
																fullWidth: true,
																helperText: 'Link ficará ativo a partir desta data'
															}
														}}
													/>
												)}
											/>
										</Grid>

										<Grid
											item
											xs={12}
											md={6}
										>
											<Controller
												name="expires_at"
												control={control}
												render={({ field }) => (
													<DateTimePicker
														label="Data de Expiração (Opcional)"
														value={field.value}
														onChange={field.onChange}
														slotProps={{
															textField: {
																fullWidth: true,
																helperText: 'Link expirará nesta data'
															}
														}}
													/>
												)}
											/>
										</Grid>

										<Grid
											item
											xs={12}
											md={6}
										>
											<Controller
												name="click_limit"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="Limite de Cliques (Opcional)"
														type="number"
														placeholder="Ex: 1000"
														fullWidth
														error={!!errors.click_limit}
														helperText={
															errors.click_limit?.message ||
															'Deixe vazio para cliques ilimitados'
														}
														value={field.value || ''}
														onChange={(e) => {
															const value = e.target.value;
															field.onChange(value ? parseInt(value, 10) : undefined);
														}}
														InputProps={{
															inputProps: {
																min: 1,
																max: 1000000
															}
														}}
													/>
												)}
											/>
										</Grid>
									</Grid>
								)}
							</CardContent>
						</Card>
					</Grid>

					{/* Parâmetros UTM */}
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										mb: 2
									}}
								>
									<Typography
										variant="h6"
										sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
									>
										<Analytics color="primary" />
										Parâmetros UTM (Tracking)
									</Typography>
									<Button
										variant="text"
										onClick={() => setShowUTM(!showUTM)}
									>
										{showUTM ? 'Ocultar' : 'Mostrar'}
									</Button>
								</Box>

								{showUTM && (
									<>
										<Alert
											severity="info"
											sx={{ mb: 2 }}
										>
											Os parâmetros UTM ajudam a rastrear a origem do tráfego nos seus analytics
										</Alert>
										<Grid
											container
											spacing={2}
										>
											<Grid
												item
												xs={12}
												md={6}
											>
												<Controller
													name="utm_source"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="UTM Source"
															placeholder="google, facebook, newsletter"
															fullWidth
															helperText="Origem do tráfego"
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												md={6}
											>
												<Controller
													name="utm_medium"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="UTM Medium"
															placeholder="cpc, email, social"
															fullWidth
															helperText="Meio de marketing"
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												md={4}
											>
												<Controller
													name="utm_campaign"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="UTM Campaign"
															placeholder="summer_sale, product_launch"
															fullWidth
															helperText="Nome da campanha"
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												md={4}
											>
												<Controller
													name="utm_term"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="UTM Term"
															placeholder="keyword1, keyword2"
															fullWidth
															helperText="Termos de busca"
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												md={4}
											>
												<Controller
													name="utm_content"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="UTM Content"
															placeholder="banner_top, text_link"
															fullWidth
															helperText="Conteúdo do anúncio"
														/>
													)}
												/>
											</Grid>
										</Grid>
									</>
								)}
							</CardContent>
						</Card>
					</Grid>

					{/* Botões de Ação */}
					<Grid
						item
						xs={12}
					>
						<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								onClick={() => router.push(`/link/${id}/view`)}
								disabled={loading}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								variant="contained"
								disabled={!isValid || !isDirty || loading}
								startIcon={<Save />}
								sx={{ minWidth: 150 }}
							>
								{loading ? 'Salvando...' : 'Salvar Alterações'}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
}

export default LinkEdit;
