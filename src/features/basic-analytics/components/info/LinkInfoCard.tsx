import { Launch as LaunchIcon, ContentCopy as CopyIcon, Add as AddIcon } from '@mui/icons-material';
import {
	Box,
	Typography,
	CardContent,
	Grid,
	Button,
	Chip,
	Divider,
	Stack,
	IconButton,
	Tooltip,
	useTheme,
	alpha
} from '@mui/material';

import { AppIcon } from '@/lib/icons';
import { createPresetShadows, createPresetAnimations } from '@/lib/theme';
import { EnhancedPaper } from '@/shared/ui/base';

import type { BasicLinkData, BasicAnalyticsActions } from '../../types';

interface LinkInfoCardProps {
	linkData: BasicLinkData;
	actions: BasicAnalyticsActions;
}

/**
 * 🔗 CARD DE INFORMAÇÕES DO LINK
 *
 * Componente enriquecido com todas as informações do link
 * Segue padrões de design e componentização do projeto
 */
export function LinkInfoCard({ linkData, actions }: LinkInfoCardProps) {
	const { handleCopyLink, handleCreateLink, handleVisitLink } = actions;
	const theme = useTheme();

	// Usa utilitários de tema seguindo padrão do shorter
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	return (
		<EnhancedPaper
			variant='glass'
			sx={{
				mb: 1,
				// Aplicando padrão de cores do UpgradeCTA
				background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
				border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
				borderRadius: 2,
				position: 'relative',
				// Adiciona animações e efeitos seguindo padrão do shorter
				...animations.cardHover,
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: shadows.cardHover,
					borderColor: alpha(theme.palette.primary.main, 0.4)
				}
			}}
		>
			<CardContent sx={{ p: 2 }}>
				{/* Header com ações */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 2
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<AppIcon
							intent='link'
							size={24}
							color={theme.palette.primary.main}
							style={{ marginRight: 8 }}
						/>
						<Typography variant='h6'>Informações do Link</Typography>
						{linkData.is_public ? (
							<Chip
								label='Público'
								color='primary'
								size='small'
								sx={{ ml: 2 }}
							/>
						) : null}
					</Box>

					{/* Ações rápidas */}
					<Stack
						direction='row'
						spacing={1}
					>
						<Tooltip title='Copiar Link'>
							<IconButton
								onClick={handleCopyLink}
								color='primary'
								size='small'
							>
								<CopyIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title='Criar Outro Link'>
							<IconButton
								onClick={handleCreateLink}
								color='secondary'
								size='small'
							>
								<AddIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Box>

				{/* URL Curta - Destaque Principal */}
				<Box
					sx={{
						mb: 2,
						p: 1.5,
						background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
						borderRadius: 2,
						border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
						position: 'relative'
					}}
				>
					<Typography
						variant='body2'
						color='text.secondary'
						gutterBottom
						sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<AppIcon
							intent='link'
							size={16}
						/>
						Seu link encurtado:
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							flexWrap: 'wrap'
						}}
					>
						<Typography
							variant='h6'
							sx={{
								fontFamily: 'monospace',
								color: 'primary.main',
								fontWeight: 600,
								wordBreak: 'break-all',
								flex: 1,
								minWidth: 0
							}}
						>
							{linkData.short_url}
						</Typography>
						<Stack
							direction='row'
							spacing={1}
							sx={{ flexShrink: 0 }}
						>
							<Button
								variant='contained'
								size='small'
								startIcon={<CopyIcon />}
								onClick={handleCopyLink}
								sx={{
									background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
									'&:hover': {
										background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
										transform: 'translateY(-1px)',
										boxShadow: 2
									},
									transition: 'all 0.3s ease',
									fontWeight: 600
								}}
							>
								Copiar
							</Button>
							<Button
								variant='outlined'
								size='small'
								startIcon={<LaunchIcon />}
								onClick={handleVisitLink}
								sx={{
									borderColor: theme.palette.success.main,
									color: theme.palette.success.main,
									'&:hover': {
										borderColor: theme.palette.success.dark,
										backgroundColor: alpha(theme.palette.success.main, 0.1),
										transform: 'translateY(-1px)',
										boxShadow: 1
									},
									transition: 'all 0.3s ease',
									fontWeight: 600
								}}
							>
								Visitar
							</Button>
						</Stack>
					</Box>
				</Box>

				{/* Informações Detalhadas */}
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
							variant='body2'
							color='text.secondary'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<AppIcon
								name='content.text'
								size={16}
							/>
							Título:
						</Typography>
						<Typography
							variant='body1'
							sx={{ fontWeight: 500 }}
						>
							{linkData.title || 'Sem título definido'}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<AppIcon
								intent='url'
								size={16}
							/>
							Domínio de destino:
						</Typography>
						<Typography
							variant='body1'
							sx={{ fontWeight: 500 }}
						>
							{linkData.domain}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<AppIcon
								name='time.calendar'
								size={16}
							/>
							Criado em:
						</Typography>
						<Typography
							variant='body1'
							sx={{ fontWeight: 500 }}
						>
							{new Date(linkData.created_at).toLocaleDateString('pt-BR', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<AppIcon
								intent='info'
								size={16}
							/>
							Status:
						</Typography>
						<Chip
							label={linkData.is_active ? 'Ativo' : 'Inativo'}
							color={linkData.is_active ? 'success' : 'error'}
							size='small'
							variant='outlined'
						/>
					</Grid>

					{/* URL Original */}
					<Grid
						item
						xs={12}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<AppIcon
								name='navigation.back'
								size={16}
							/>
							URL original:
						</Typography>
						<Box
							sx={{
								p: 2,
								bgcolor: 'background.paper',
								borderRadius: 1,
								border: '1px solid',
								borderColor: 'divider',
								wordBreak: 'break-all',
								'&:hover': {
									bgcolor: 'action.hover'
								}
							}}
						>
							<Typography
								variant='body2'
								sx={{
									fontFamily: 'monospace',
									color: 'text.primary',
									fontWeight: 500
								}}
							>
								{linkData.original_url}
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* Ações Principais */}
				<Divider sx={{ my: 2 }} />
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent='center'
				>
					<Button
						variant='contained'
						startIcon={<CopyIcon />}
						onClick={handleCopyLink}
						size='large'
						sx={{
							background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
								transform: 'translateY(-2px)',
								boxShadow: 4
							},
							transition: 'all 0.3s ease',
							fontWeight: 600,
							py: 1.5
						}}
					>
						Copiar Link
					</Button>
					<Button
						variant='outlined'
						startIcon={<AddIcon />}
						onClick={handleCreateLink}
						size='large'
						sx={{
							borderColor: theme.palette.success.main,
							color: theme.palette.success.main,
							'&:hover': {
								borderColor: theme.palette.success.dark,
								backgroundColor: alpha(theme.palette.success.main, 0.1),
								transform: 'translateY(-2px)',
								boxShadow: 2
							},
							transition: 'all 0.3s ease',
							fontWeight: 600,
							py: 1.5
						}}
					>
						Criar Outro Link
					</Button>
					<Button
						variant='text'
						startIcon={<LaunchIcon />}
						onClick={handleVisitLink}
						size='large'
						sx={{
							color: theme.palette.text.secondary,
							'&:hover': {
								backgroundColor: alpha(theme.palette.primary.main, 0.1),
								color: theme.palette.primary.main,
								transform: 'translateY(-1px)'
							},
							transition: 'all 0.3s ease',
							fontWeight: 600,
							py: 1.5
						}}
					>
						Visitar Destino
					</Button>
				</Stack>
			</CardContent>
		</EnhancedPaper>
	);
}
