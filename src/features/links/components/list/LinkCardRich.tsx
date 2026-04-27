import { Launch } from '@mui/icons-material';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import useClipboard from '@/hooks/useClipboard';
import type { LinkMeta, LinkResponse } from '@/types';

import { LinkActionsMenu } from './LinkActionsMenu';
import { LinkHealthBadge } from './LinkHealthBadge';
import { LinkPreviewThumb } from './LinkPreviewThumb';
import { LinkSparkline } from './LinkSparkline';
import { LinkTrendBadge } from './LinkTrendBadge';

interface LinkCardRichProps {
	link: LinkResponse;
	meta?: LinkMeta;
	onDelete: (id: string) => Promise<void>;
}

export function LinkCardRich({ link, meta, onDelete }: LinkCardRichProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'Link copiado!', variant: 'success' })),
	});

	const handleDelete = useCallback(async () => {
		if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
			try {
				await onDelete(String(link.id));
			} catch {
				dispatch(showMessage({ message: 'Erro ao excluir o link.', variant: 'error' }));
			}
		}
	}, [link.id, onDelete, dispatch]);

	const status = getLinkStatus(link);
	const { label: statusLabel, color: statusColor } = STATUS_MAP[status];

	const lastClickAt = meta?.trend?.last_click_at;
	const lastClickLabel = lastClickAt
		? formatDistanceToNow(new Date(lastClickAt), { addSuffix: true, locale: ptBR })
		: 'Nunca';

	return (
		<EnhancedPaper
			sx={{
				borderRadius: '12px',
				border: '1px solid',
				borderColor: 'divider',
				overflow: 'hidden',
				transition: 'box-shadow 0.2s',
				'&:hover': { boxShadow: 4 },
			}}
		>
			{/* Linha 1 — Header */}
			<Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
				<LinkPreviewThumb
					preview={meta?.preview}
					size={24}
				/>
				<Typography
					variant='body1'
					sx={{ fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
				>
					{link.title || 'Link sem título'}
				</Typography>

				<Tooltip title={copied ? 'Copiado!' : 'Copiar URL'}>
					<Box
						onClick={() => copy(link.short_url)}
						sx={{
							px: 1.5,
							py: 0.5,
							bgcolor: 'rgba(25, 118, 210, 0.08)',
							borderRadius: '20px',
							border: '1px solid',
							borderColor: 'primary.light',
							fontFamily: 'monospace',
							fontSize: '0.75rem',
							color: 'primary.main',
							fontWeight: 600,
							cursor: 'pointer',
							maxWidth: 220,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							flexShrink: 0,
							'&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' },
						}}
					>
						{link.short_url}
					</Box>
				</Tooltip>

				<Stack
					direction='row'
					spacing={0.5}
					alignItems='center'
					sx={{ flexShrink: 0 }}
				>
					<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
					<Typography variant='caption'>{statusLabel}</Typography>
				</Stack>

				<Box onClick={(e) => e.stopPropagation()}>
					<LinkActionsMenu
						onEdit={() => navigate(`/link/edit/${link.id}`)}
						onQR={() => navigate(`/link/qr/${link.id}`)}
						onDelete={handleDelete}
					/>
				</Box>
			</Box>

			<Divider />

			{/* Linha 2 — URL original + thumb OG */}
			<Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Launch sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
					title={link.original_url}
				>
					{link.original_url}
				</Typography>
				{meta?.preview?.og_image_url ? <Box
						component='img'
						src={meta.preview.og_image_url}
						alt={meta.preview.og_title ?? ''}
						sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/> : null}
			</Box>

			<Divider />

			{/* Linha 3 — Métricas */}
			<Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
				{meta?.sparkline?.length ? (
					<Box sx={{ flexShrink: 0 }}>
						<LinkSparkline
							data={meta.sparkline}
							trend={meta.trend?.percent_change}
						/>
					</Box>
				) : (
					<Box sx={{ width: 120, height: 32, bgcolor: 'action.hover', borderRadius: 1 }} />
				)}

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<LinkTrendBadge trend={meta?.trend} />

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<Stack spacing={0}>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						Último clique
					</Typography>
					<Typography
						variant='caption'
						sx={{ fontWeight: 600 }}
					>
						{lastClickLabel}
					</Typography>
				</Stack>

				<Box sx={{ height: 24, bgcolor: 'divider', width: '1px', flexShrink: 0 }} />

				<LinkHealthBadge health={meta?.health} />
			</Box>
		</EnhancedPaper>
	);
}
