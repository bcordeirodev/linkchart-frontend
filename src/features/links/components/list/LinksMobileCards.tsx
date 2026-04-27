/**
 * LINKS MOBILE CARDS
 * Componente otimizado para visualização de links em mobile
 *
 * @features
 * - Cards otimizados para mobile
 * - Status correto (ativo, inativo, agendado, expirado)
 * - Confirmação antes de deletar
 * - Ações inline (copiar, analytics) e menu (editar, QR, deletar)
 * - Performance otimizada com memo
 */

import { Link as LinkIcon, Visibility, Schedule } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Chip, Stack, Avatar, useTheme } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkActionsInline } from './LinkActionsInline';
import { LinkActionsMenu } from './LinkActionsMenu';

import { getLinkStatus, STATUS_MAP } from '../../utils/linkStatus';

// Types
import type { LinkResponse as Link } from '@/types/core/links';

interface LinksMobileCardsProps {
	data: Link[];
	loading?: boolean;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
}

interface LinkMobileCardProps {
	link: Link;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
}

/**
 * Card individual para mobile
 */
const LinkMobileCard = memo(({ link, onDelete, onEdit }: LinkMobileCardProps) => {
	const theme = useTheme();
	const navigate = useNavigate();

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

	const linkStatus = getLinkStatus(link);
	const { label: statusLabel } = STATUS_MAP[linkStatus];

	// Truncar URL longa
	const truncateUrl = (url: string, maxLength = 40) => {
		if (url.length <= maxLength) {
			return url;
		}

		return `${url.substring(0, maxLength)}...`;
	};

	return (
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
						label={statusLabel}
						size='small'
						color={linkStatus === 'active' ? 'success' : 'default'}
						sx={{ fontSize: '0.75rem' }}
					/>

					<Stack
						direction='row'
						spacing={0.5}
						alignItems='center'
					>
						<LinkActionsInline
							shortUrl={link.short_url || shortUrl}
							onAnalytics={() => navigate(`/link/analytic/${link.id}`)}
						/>
						<LinkActionsMenu
							onEdit={() => {
								if (onEdit) {
									onEdit(link);
								} else {
									navigate(`/link/edit/${link.id}`);
								}
							}}
							onQR={() => navigate(`/link/qr/${link.id}`)}
							onDelete={() => {
								if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
									if (onDelete) {
										onDelete(String(link.id));
									}
								}
							}}
						/>
					</Stack>
				</Box>
			</CardContent>
		</Card>
	);
});

LinkMobileCard.displayName = 'LinkMobileCard';

/**
 * Container principal dos cards mobile
 */
export const LinksMobileCards = memo(({ data, loading, onDelete, onEdit }: LinksMobileCardsProps) => {
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
				/>
			))}
		</Box>
	);
});

LinksMobileCards.displayName = 'LinksMobileCards';

export default LinksMobileCards;
