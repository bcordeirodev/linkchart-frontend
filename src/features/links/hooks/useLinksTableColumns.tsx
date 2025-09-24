import { CheckCircleOutlined, CancelOutlined } from '@mui/icons-material';
import { Box, Chip, Avatar, Typography } from '@mui/material';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { LinkTableActions } from '@/shared/ui/patterns';

import type { LinkResponse } from '@/types';
import type { MRT_ColumnDef } from 'material-react-table';

interface UseLinksTableColumnsProps {
	onDelete: (id: string) => Promise<void>;
}

/**
 * Hook para colunas da tabela de links
 * Centraliza a definição das colunas e suas ações
 */
export function useLinksTableColumns({ onDelete }: UseLinksTableColumnsProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// Função para calcular larguras proporcionais que ocupam 100% da tela
	const getColumnSizes = () => {
		if (typeof window !== 'undefined') {
			const width = window.innerWidth;

			// Mobile: apenas colunas essenciais (3 colunas)
			if (width < 640) {
				return {
					title: 350, // 45%
					short_url: 280, // 35%
					actions: 150 // 20%
				};
			}

			// Tablet: adiciona cliques (4 colunas)
			if (width < 960) {
				return {
					title: 280, // 35%
					short_url: 240, // 30%
					clicks: 120, // 15%
					actions: 160 // 20%
				};
			}

			// Laptop: adiciona status e created_at (6 colunas)
			if (width < 1280) {
				return {
					title: 180, // 22%
					short_url: 180, // 22%
					clicks: 90, // 11%
					is_active: 90, // 11%
					created_at: 110, // 14%
					actions: 150 // 20% (aumentado para acomodar 5 botões)
				};
			}

			// Desktop: todas as colunas (7 colunas)
			return {
				title: 220, // ~18%
				short_url: 250, // ~21%
				original_url: 280, // ~23%
				clicks: 90, // ~7%
				is_active: 90, // ~7%
				created_at: 130, // ~11%
				actions: 140 // ~13% (aumentado para 5 botões)
			};
		}

		// Fallback para SSR - Desktop
		return {
			title: 220,
			short_url: 250,
			original_url: 280,
			clicks: 90,
			is_active: 90,
			created_at: 130,
			actions: 140
		};
	};

	const columnSizes = getColumnSizes();

	const copyToClipboard = useCallback(
		(text: string, label: string) => {
			navigator.clipboard.writeText(text);
			dispatch(
				showMessage({
					message: `${label} copiado para a área de transferência!`,
					variant: 'success'
				})
			);
		},
		[dispatch]
	);

	const handleDeleteLink = useCallback(
		async (id: string) => {
			if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
				try {
					await onDelete(id);
				} catch (_error) {
					// Erro já tratado no hook
				}
			}
		},
		[onDelete]
	);

	const columns = useMemo<MRT_ColumnDef<LinkResponse>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Link',
				size: columnSizes.title,
				minSize: 180,
				grow: true,
				Cell: ({ row }) => (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Avatar
							sx={{
								width: 32,
								height: 32,
								bgcolor: row.original.is_active ? 'success.light' : 'error.light'
							}}
						>
							{row.original.is_active ? (
								<CheckCircleOutlined sx={{ fontSize: 18, color: 'success.main' }} />
							) : (
								<CancelOutlined sx={{ fontSize: 18, color: 'error.main' }} />
							)}
						</Avatar>
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
							>
								{row.original.slug || row.original.custom_slug}
							</Typography>
						</Box>
					</Box>
				)
			},
			{
				accessorKey: 'short_url',
				header: 'URL Encurtada',
				size: columnSizes.short_url,
				minSize: 200,
				grow: true,
				Cell: ({ cell }) => (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography
							variant='body2'
							sx={{
								fontFamily: 'monospace',
								color: 'primary.main',
								fontWeight: 600
							}}
						>
							{cell.getValue<string>()}
						</Typography>
						{/* Botão removido - usar TableActions na coluna de ações */}
					</Box>
				)
			},
			{
				accessorKey: 'original_url',
				header: 'URL Original',
				size: columnSizes.original_url || 300,
				minSize: 220,
				grow: true,
				Cell: ({ cell }) => (
					<Typography
						variant='body2'
						sx={{
							maxWidth: 280,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'
						}}
						title={cell.getValue<string>()}
					>
						{cell.getValue<string>()}
					</Typography>
				)
			},
			{
				accessorKey: 'clicks',
				header: 'Cliques',
				size: columnSizes.clicks || 100,
				minSize: 80,
				Cell: ({ cell }) => (
					<Chip
						label={cell.getValue<number>() || 0}
						color='primary'
						size='small'
						variant='outlined'
					/>
				)
			},
			{
				accessorKey: 'is_active',
				header: 'Status',
				size: columnSizes.is_active || 100,
				minSize: 80,
				Cell: ({ cell }) => (
					<Chip
						label={cell.getValue<boolean>() ? 'Ativo' : 'Inativo'}
						color={cell.getValue<boolean>() ? 'success' : 'error'}
						size='small'
					/>
				)
			},
			{
				accessorKey: 'created_at',
				header: 'Criado em',
				size: columnSizes.created_at || 140,
				minSize: 120,
				Cell: ({ cell }) => (
					<Typography variant='body2'>
						{new Date(cell.getValue<string>()).toLocaleDateString('pt-BR')}
					</Typography>
				)
			},
			{
				id: 'actions',
				header: 'Ações',
				size: columnSizes.actions || 160,
				minSize: 180,
				enableSorting: false,
				Cell: ({ row }) => (
					<LinkTableActions
						onAnalytics={() => navigate(`/link/analytic/${row.original.id}`)}
						onEdit={() => navigate(`/link/edit/${row.original.id}`)}
						onCopy={() => copyToClipboard(row.original.short_url, 'Link copiado!')}
						onQR={() => navigate(`/link/qr/${row.original.id}`)}
						onDelete={() => handleDeleteLink(String(row.original.id))}
					/>
				)
			}
		],
		[copyToClipboard, handleDeleteLink, columnSizes, navigate]
	);

	return columns;
}

export default useLinksTableColumns;
