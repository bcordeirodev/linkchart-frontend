import { Box, Typography, CardContent, Grid, Button, Chip, Divider, Stack, IconButton, Tooltip } from '@mui/material';
import { Link as LinkIcon, Launch as LaunchIcon, ContentCopy as CopyIcon, Add as AddIcon } from '@mui/icons-material';
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

	return (
		<EnhancedPaper
			variant="glass"
			sx={{ mb: 4 }}
		>
			<CardContent>
				{/* Header com ações */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 3
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
						<Typography variant="h6">Informações do Link</Typography>
						{linkData.is_public && (
							<Chip
								label="Público"
								color="primary"
								size="small"
								sx={{ ml: 2 }}
							/>
						)}
					</Box>

					{/* Ações rápidas */}
					<Stack
						direction="row"
						spacing={1}
					>
						<Tooltip title="Copiar Link">
							<IconButton
								onClick={handleCopyLink}
								color="primary"
								size="small"
							>
								<CopyIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Criar Outro Link">
							<IconButton
								onClick={handleCreateLink}
								color="secondary"
								size="small"
							>
								<AddIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Box>

				{/* URL Curta - Destaque Principal */}
				<Box
					sx={{
						mb: 3,
						p: 2,
						bgcolor: 'primary.50',
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'primary.200'
					}}
				>
					<Typography
						variant="body2"
						color="text.secondary"
						gutterBottom
					>
						🔗 Seu link encurtado:
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
							variant="h6"
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
							direction="row"
							spacing={1}
							sx={{ flexShrink: 0 }}
						>
							<Button
								variant="contained"
								size="small"
								startIcon={<CopyIcon />}
								onClick={handleCopyLink}
							>
								Copiar
							</Button>
							<Button
								variant="outlined"
								size="small"
								startIcon={<LaunchIcon />}
								onClick={handleVisitLink}
							>
								Visitar
							</Button>
						</Stack>
					</Box>
				</Box>

				{/* Informações Detalhadas */}
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							📝 Título:
						</Typography>
						<Typography
							variant="body1"
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
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							🌐 Domínio de destino:
						</Typography>
						<Typography
							variant="body1"
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
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							📅 Criado em:
						</Typography>
						<Typography
							variant="body1"
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
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							⚡ Status:
						</Typography>
						<Chip
							label={linkData.is_active ? 'Ativo' : 'Inativo'}
							color={linkData.is_active ? 'success' : 'error'}
							size="small"
							variant="outlined"
						/>
					</Grid>

					{/* URL Original */}
					<Grid
						item
						xs={12}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							🎯 URL original:
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
								variant="body2"
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
				<Divider sx={{ my: 3 }} />
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent="center"
				>
					<Button
						variant="contained"
						startIcon={<CopyIcon />}
						onClick={handleCopyLink}
						size="large"
					>
						Copiar Link
					</Button>
					<Button
						variant="outlined"
						startIcon={<AddIcon />}
						onClick={handleCreateLink}
						size="large"
					>
						Criar Outro Link
					</Button>
					<Button
						variant="text"
						startIcon={<LaunchIcon />}
						onClick={handleVisitLink}
						size="large"
					>
						Visitar Destino
					</Button>
				</Stack>
			</CardContent>
		</EnhancedPaper>
	);
}
