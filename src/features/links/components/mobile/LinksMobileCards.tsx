/**
 * 📱 LINKS MOBILE CARDS - FASE 3
 * Componente otimizado para visualização de links em mobile
 *
 * @features
 * - Cards otimizados para mobile
 * - Swipe actions (copiar, editar, deletar)
 * - Performance otimizada
 * - Acessibilidade completa
 */

import {
	ContentCopy,
	Edit,
	Delete,
	MoreVert,
	Link as LinkIcon,
	Visibility,
	Schedule,
	TrendingUp,
	Share
} from '@mui/icons-material';
import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	Chip,
	Stack,
	Avatar,
	Tooltip,
	SwipeableDrawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	useTheme
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import type { LinkResponse as Link } from '@/types/core/links';

interface LinksMobileCardsProps {
	data: Link[];
	loading?: boolean;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	onCopy?: (url: string) => void;
}

interface LinkMobileCardProps {
	link: Link;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	onCopy?: (url: string) => void;
}

/**
 * Card individual para mobile
 */
const LinkMobileCard = memo(({ link, onDelete, onEdit, onCopy }: LinkMobileCardProps) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [drawerOpen, setDrawerOpen] = useState(false);

	// Formatação de dados
	const shortUrl = `${window.location.origin}/${link.slug || link.custom_slug}`;

	// Validação e formatação segura da data
	const getFormattedDate = () => {
		try {
			if (!link.created_at) {
				return 'Data não disponível';
			}

			const date = new Date(link.created_at);

			// Verifica se a data é válida
			if (isNaN(date.getTime())) {
				return 'Data inválida';
			}

			return formatDistanceToNow(date, {
				addSuffix: true,
				locale: ptBR
			});
		} catch (error) {
			console.error('Erro ao formatar data:', error);
			return 'Data não disponível';
		}
	};

	const createdAt = getFormattedDate();

	// Handlers
	const handleCopy = useCallback(() => {
		if (onCopy) {
			onCopy(shortUrl);
		} else {
			navigator.clipboard.writeText(shortUrl);
		}

		setDrawerOpen(false);
	}, [shortUrl, onCopy]);

	const handleEdit = useCallback(() => {
		if (onEdit) {
			onEdit(link);
		} else {
			navigate(`/links/${link.id}/edit`);
		}

		setDrawerOpen(false);
	}, [link, onEdit, navigate]);

	const handleDelete = useCallback(() => {
		if (onDelete) {
			onDelete(link.id.toString());
		}

		setDrawerOpen(false);
	}, [link.id, onDelete]);

	const handleViewAnalytics = useCallback(() => {
		navigate(`/links/${link.id}/analytics`);
		setDrawerOpen(false);
	}, [link.id, navigate]);

	const handleShare = useCallback(() => {
		if (navigator.share) {
			navigator.share({
				title: link.title || 'Link compartilhado',
				url: shortUrl
			});
		} else {
			handleCopy();
		}

		setDrawerOpen(false);
	}, [link.title, shortUrl, handleCopy]);

	// Truncar URL longa
	const truncateUrl = (url: string, maxLength = 40) => {
		if (url.length <= maxLength) {
			return url;
		}

		return `${url.substring(0, maxLength)}...`;
	};

	return (
		<>
			<Card
				sx={{
					mb: 2,
					borderRadius: 3,
					border: `1px solid ${theme.palette.divider}`,
					boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
					transition: 'all 0.2s ease',
					'&:hover': {
						boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
						transform: 'translateY(-1px)'
					},
					'&:active': {
						transform: 'translateY(0)',
						boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
					}
				}}
			>
				<CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
					{/* Header com título e ações */}
					<Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
						<Avatar
							sx={{
								width: 40,
								height: 40,
								mr: 2,
								bgcolor: link.is_active ? 'primary.main' : 'grey.400',
								fontSize: '1rem'
							}}
						>
							<LinkIcon fontSize='small' />
						</Avatar>

						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography
								variant='h6'
								sx={{
									fontSize: '1.1rem',
									fontWeight: 600,
									color: 'text.primary',
									mb: 0.5,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}
							>
								{link.title || 'Link sem título'}
							</Typography>

							<Typography
								variant='body2'
								sx={{
									color: 'text.secondary',
									fontSize: '0.875rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}
							>
								{truncateUrl(link.original_url)}
							</Typography>
						</Box>

						<IconButton
							size='small'
							onClick={() => setDrawerOpen(true)}
							sx={{ ml: 1, color: 'text.secondary' }}
						>
							<MoreVert />
						</IconButton>
					</Box>

					{/* URL encurtada */}
					<Box
						sx={{
							p: 2,
							bgcolor: theme.palette.background.paper,
							borderRadius: 2,
							border: `1px solid ${theme.palette.divider}`,
							mb: 2
						}}
					>
						<Typography
							variant='body2'
							sx={{
								color: 'primary.main',
								fontWeight: 500,
								fontSize: '0.9rem',
								fontFamily: 'monospace',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap'
							}}
						>
							{shortUrl}
						</Typography>
					</Box>

					{/* Métricas e status */}
					<Stack
						direction='row'
						spacing={2}
						sx={{ mb: 2 }}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
							>
								{link.clicks || 0} cliques
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
							>
								{createdAt}
							</Typography>
						</Box>
					</Stack>

					{/* Status e ações rápidas */}
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Chip
							label={link.is_active ? 'Ativo' : 'Inativo'}
							size='small'
							color={link.is_active ? 'success' : 'default'}
							sx={{ fontSize: '0.75rem' }}
						/>

						<Stack
							direction='row'
							spacing={1}
						>
							<Tooltip title='Copiar link'>
								<IconButton
									size='small'
									onClick={handleCopy}
									sx={{ color: 'text.secondary' }}
								>
									<ContentCopy fontSize='small' />
								</IconButton>
							</Tooltip>

							<Tooltip title='Ver analytics'>
								<IconButton
									size='small'
									onClick={handleViewAnalytics}
									sx={{ color: 'text.secondary' }}
								>
									<TrendingUp fontSize='small' />
								</IconButton>
							</Tooltip>
						</Stack>
					</Box>
				</CardContent>
			</Card>

			{/* Drawer de ações */}
			<SwipeableDrawer
				anchor='bottom'
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				onOpen={() => setDrawerOpen(true)}
				disableSwipeToOpen
				PaperProps={{
					sx: {
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
						maxHeight: '50vh'
					}
				}}
			>
				<Box sx={{ p: 2 }}>
					{/* Handle */}
					<Box
						sx={{
							width: 40,
							height: 4,
							bgcolor: 'divider',
							borderRadius: 2,
							mx: 'auto',
							mb: 2
						}}
					/>

					{/* Título do link */}
					<Typography
						variant='h6'
						sx={{
							textAlign: 'center',
							mb: 2,
							fontSize: '1rem',
							fontWeight: 600,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'
						}}
					>
						{link.title || 'Link sem título'}
					</Typography>

					<Divider sx={{ mb: 1 }} />

					{/* Lista de ações */}
					<List sx={{ py: 0 }}>
						<ListItem
							component='div'
							onClick={handleCopy}
							sx={{ borderRadius: 2, cursor: 'pointer' }}
						>
							<ListItemIcon>
								<ContentCopy color='primary' />
							</ListItemIcon>
							<ListItemText primary='Copiar link' />
						</ListItem>

						<ListItem
							component='div'
							onClick={handleShare}
							sx={{ borderRadius: 2, cursor: 'pointer' }}
						>
							<ListItemIcon>
								<Share color='primary' />
							</ListItemIcon>
							<ListItemText primary='Compartilhar' />
						</ListItem>

						<ListItem
							component='div'
							onClick={handleViewAnalytics}
							sx={{ borderRadius: 2, cursor: 'pointer' }}
						>
							<ListItemIcon>
								<TrendingUp color='primary' />
							</ListItemIcon>
							<ListItemText primary='Ver analytics' />
						</ListItem>

						<Divider sx={{ my: 1 }} />

						<ListItem
							component='div'
							onClick={handleEdit}
							sx={{ borderRadius: 2, cursor: 'pointer' }}
						>
							<ListItemIcon>
								<Edit color='warning' />
							</ListItemIcon>
							<ListItemText primary='Editar link' />
						</ListItem>

						<ListItem
							component='div'
							onClick={handleDelete}
							sx={{ borderRadius: 2, cursor: 'pointer' }}
						>
							<ListItemIcon>
								<Delete color='error' />
							</ListItemIcon>
							<ListItemText primary='Excluir link' />
						</ListItem>
					</List>
				</Box>
			</SwipeableDrawer>
		</>
	);
});

LinkMobileCard.displayName = 'LinkMobileCard';

/**
 * Container principal dos cards mobile
 */
export const LinksMobileCards = memo(({ data, loading, onDelete, onEdit, onCopy }: LinksMobileCardsProps) => {
	if (loading) {
		return (
			<Box sx={{ p: 2 }}>
				{[...Array(3)].map((_, index) => (
					<Card
						key={index}
						sx={{ mb: 2, borderRadius: 3 }}
					>
						<CardContent sx={{ p: 3 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '50%',
										bgcolor: 'grey.200',
										mr: 2
									}}
								/>
								<Box sx={{ flex: 1 }}>
									<Box sx={{ height: 20, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
									<Box sx={{ height: 16, bgcolor: 'grey.100', borderRadius: 1, width: '70%' }} />
								</Box>
							</Box>
							<Box sx={{ height: 40, bgcolor: 'grey.100', borderRadius: 2, mb: 2 }} />
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Box sx={{ height: 24, bgcolor: 'grey.200', borderRadius: 12, width: 60 }} />
								<Box sx={{ display: 'flex', gap: 1 }}>
									<Box sx={{ width: 32, height: 32, bgcolor: 'grey.200', borderRadius: '50%' }} />
									<Box sx={{ width: 32, height: 32, bgcolor: 'grey.200', borderRadius: '50%' }} />
								</Box>
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Box
				sx={{
					textAlign: 'center',
					py: 6,
					px: 3
				}}
			>
				<LinkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
				<Typography
					variant='h6'
					sx={{ color: 'text.secondary', mb: 1 }}
				>
					Nenhum link encontrado
				</Typography>
				<Typography
					variant='body2'
					sx={{ color: 'text.disabled' }}
				>
					Crie seu primeiro link para começar
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, sm: 3 } }}>
			{data.map((link) => (
				<LinkMobileCard
					key={link.id}
					link={link}
					onDelete={onDelete}
					onEdit={onEdit}
					onCopy={onCopy}
				/>
			))}
		</Box>
	);
});

LinksMobileCards.displayName = 'LinksMobileCards';

export default LinksMobileCards;
