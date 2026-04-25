// src/features/links/components/list/useLinksTableColumns.tsx
import { Box, Stack, Typography } from '@mui/material';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';

import { LinkActionsInline } from './LinkActionsInline';
import { LinkActionsMenu } from './LinkActionsMenu';

import type { LinkResponse } from '@/types';
import type { MRT_ColumnDef } from 'material-react-table';

interface UseLinksTableColumnsProps {
	onDelete: (id: string) => Promise<void>;
}

export function useLinksTableColumns({ onDelete }: UseLinksTableColumnsProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleDelete = useCallback(
		async (id: string) => {
			if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
				try {
					await onDelete(id);
				} catch {
					dispatch(showMessage({ message: 'Erro ao excluir o link.', variant: 'error' }));
				}
			}
		},
		[onDelete, dispatch]
	);

	const columns = useMemo<MRT_ColumnDef<LinkResponse>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Link',
				size: 220,
				minSize: 160,
				grow: true,
				Cell: ({ row }) => (
					<Box>
						<Typography
							variant='body2'
							sx={{ fontWeight: 600 }}
						>
							{row.original.title || 'Sem título'}
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ fontFamily: 'monospace' }}
						>
							{row.original.slug || row.original.custom_slug}
						</Typography>
					</Box>
				),
			},
			{
				accessorKey: 'short_url',
				header: 'URL Encurtada',
				size: 220,
				minSize: 160,
				grow: true,
				Cell: ({ cell }) => (
					<Box
						sx={{
							display: 'inline-block',
							px: 1,
							py: 0.5,
							bgcolor: 'rgba(25, 118, 210, 0.08)',
							borderRadius: 1,
							fontFamily: 'monospace',
							fontSize: '0.8125rem',
							color: 'primary.main',
							fontWeight: 600,
							maxWidth: 200,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
						title={cell.getValue<string>()}
					>
						{cell.getValue<string>()}
					</Box>
				),
			},
			{
				accessorKey: 'clicks',
				header: 'Clicks',
				size: 90,
				minSize: 70,
				Cell: ({ cell }) => (
					<Typography
						variant='subtitle2'
						sx={{ fontWeight: 700 }}
					>
						{cell.getValue<number>() ?? 0}
					</Typography>
				),
			},
			{
				accessorKey: 'is_active',
				header: 'Status',
				size: 120,
				minSize: 100,
				Cell: ({ row }) => {
					const status = getLinkStatus(row.original);
					const { color, label } = STATUS_MAP[status];
					return (
						<Stack
							direction='row'
							spacing={0.75}
							alignItems='center'
						>
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor: color,
									flexShrink: 0,
								}}
							/>
							<Typography variant='caption'>{label}</Typography>
						</Stack>
					);
				},
			},
			{
				id: 'actions',
				header: 'Ações',
				size: 130,
				minSize: 110,
				enableSorting: false,
				Cell: ({ row }) => {
					const link = row.original;
					const id = String(link.id);
					return (
						<Stack
							direction='row'
							spacing={0.25}
							alignItems='center'
							onClick={(e) => e.stopPropagation()}
						>
							<LinkActionsInline
								shortUrl={link.short_url}
								onAnalytics={() => navigate(`/link/analytic/${id}`)}
							/>
							<LinkActionsMenu
								onEdit={() => navigate(`/link/edit/${id}`)}
								onQR={() => navigate(`/link/qr/${id}`)}
								onDelete={() => handleDelete(id)}
							/>
						</Stack>
					);
				},
			},
		],
		[navigate, handleDelete]
	);

	return columns;
}

export default useLinksTableColumns;
