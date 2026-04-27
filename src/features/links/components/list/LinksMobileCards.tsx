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

import { Link2, Eye, Clock } from 'lucide-react';
import { ICON_SM, ICON_MD } from '@/lib/theme/iconDefaults';
import { Box, Card, CardContent, Typography, Chip, Stack, Avatar, useTheme } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkActionsInline } from './LinkActionsInline';
import { LinkActionsMenu } from './LinkActionsMenu';

import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

import { getLinkStatus, STATUS_MAP } from '../../utils/linkStatus';

// Types
import type { BatchMetaResponse, LinkMeta, LinkResponse as Link } from '@/types';

import { LinkHealthBadge } from './LinkHealthBadge';
import { LinkSparkline } from './LinkSparkline';

interface LinksMobileCardsProps {
	data: Link[];
	loading?: boolean;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	meta?: BatchMetaResponse;
}

interface LinkMobileCardProps {
	link: Link;
	onDelete?: (id: string) => void;
	onEdit?: (link: Link) => void;
	meta?: LinkMeta;
}

/**
 * Card individual para mobile
 */
const LinkMobileCard = memo(({ link, onDelete, onEdit, meta }: LinkMobileCardProps) => {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
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
				borderRadius: `${radiusTokens.lg}px`,
				border: `1px solid ${theme.palette.divider}`,
				boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
				transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
				'&:hover': {
					boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm
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
						<Link2 {...ICON_MD} />
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
						borderRadius: `${radiusTokens.md}px`,
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

				{/* Sparkline mini */}
				{!!(meta?.sparkline?.length) && (
					<Box sx={{ mb: 1.5 }}>
						<LinkSparkline
							data={meta.sparkline}
							trend={meta.trend?.percent_change}
							height={24}
							width='100%'
						/>
					</Box>
				)}

				{/* Tendência + health */}
				{meta?.trend ? <Stack
						direction='row'
						spacing={1}
						alignItems='center'
						sx={{ mb: 1.5 }}
					>
						<Typography
							variant='caption'
							sx={{
								color: meta.trend.percent_change >= 0 ? 'success.main' : 'error.main',
								fontWeight: 600,
							}}
						>
							{meta.trend.percent_change >= 0 ? '+' : ''}
							{meta.trend.percent_change.toFixed(1)}%
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							•
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							{meta.trend.last_click_at
								? formatDistanceToNow(new Date(meta.trend.last_click_at), {
										addSuffix: true,
										locale: ptBR,
									})
								: 'Nunca'}
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							•
						</Typography>
						<LinkHealthBadge health={meta.health} />
					</Stack> : null}

				{/* Métricas e status */}
				<Stack
					direction='row'
					spacing={2}
					sx={{ mb: 2 }}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<Eye {...ICON_SM} style={{ opacity: 0.6 }} />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
						>
							{link.clicks || 0} cliques
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<Clock {...ICON_SM} style={{ opacity: 0.6 }} />
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
								if (
									window.confirm(
										'Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.'
									)
								) {
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
export const LinksMobileCards = memo(({ data, loading, onDelete, onEdit, meta }: LinksMobileCardsProps) => {
	if (loading) {
		return (
			<Box sx={{ p: 2 }}>
				{[...Array(3)].map((_, index) => (
					<Card
						key={index}
						sx={{ mb: 2, borderRadius: `${radiusTokens.lg}px` }}
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
									<Box
										sx={{
											height: 20,
											bgcolor: 'grey.200',
											borderRadius: `${radiusTokens.sm}px`,
											mb: 1
										}}
									/>
									<Box
										sx={{
											height: 16,
											bgcolor: 'grey.100',
											borderRadius: `${radiusTokens.sm}px`,
											width: '70%'
										}}
									/>
								</Box>
							</Box>
							<Box
								sx={{ height: 40, bgcolor: 'grey.100', borderRadius: `${radiusTokens.md}px`, mb: 2 }}
							/>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Box
									sx={{
										height: 24,
										bgcolor: 'grey.200',
										borderRadius: `${radiusTokens.full}px`,
										width: 60
									}}
								/>
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
				<Link2 size={64} strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: 16 }} />
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
					meta={meta?.[String(link.id)]}
					onDelete={onDelete}
					onEdit={onEdit}
				/>
			))}
		</Box>
	);
});

LinksMobileCards.displayName = 'LinksMobileCards';

export default LinksMobileCards;
