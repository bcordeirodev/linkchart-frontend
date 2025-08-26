'use client';

import { useMemo, useCallback } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Box, Chip, IconButton, Tooltip, Avatar, Typography } from '@mui/material';
import {
	DeleteOutlined,
	EditOutlined,
	ContentCopyOutlined,
	QrCodeOutlined,
	CheckCircleOutlined,
	CancelOutlined,
	AnalyticsOutlined
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

interface UseLinksTableColumnsProps {
	onDelete: (id: number) => Promise<void>;
}

/**
 * Hook para colunas da tabela de links
 * Centraliza a definição das colunas e suas ações
 */
export function useLinksTableColumns({ onDelete }: UseLinksTableColumnsProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();

	// Função para calcular larguras proporcionais que ocupam 100% da tela
	const getColumnSizes = () => {
		if (typeof window !== 'undefined') {
			const width = window.innerWidth;

			// Mobile: apenas colunas essenciais (3 colunas)
			if (width < 640) {
				return {
					title: 350, // 45%
					shorted_url: 280, // 35%
					actions: 150 // 20%
				};
			}

			// Tablet: adiciona cliques (4 colunas)
			if (width < 960) {
				return {
					title: 280, // 35%
					shorted_url: 240, // 30%
					clicks: 120, // 15%
					actions: 160 // 20%
				};
			}

			// Laptop: adiciona status e created_at (6 colunas)
			if (width < 1280) {
				return {
					title: 180, // 22%
					shorted_url: 180, // 22%
					clicks: 90, // 11%
					is_active: 90, // 11%
					created_at: 110, // 14%
					actions: 150 // 20% (aumentado para acomodar 5 botões)
				};
			}

			// Desktop: todas as colunas (7 colunas)
			return {
				title: 220, // ~18%
				shorted_url: 250, // ~21%
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
			shorted_url: 250,
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
		async (id: number) => {
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

	const columns = useMemo<MRT_ColumnDef<ILinkResponse>[]>(
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
								variant="body2"
								sx={{ fontWeight: 600 }}
							>
								{row.original.title || 'Sem título'}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{row.original.slug}
							</Typography>
						</Box>
					</Box>
				)
			},
			{
				accessorKey: 'shorted_url',
				header: 'URL Encurtada',
				size: columnSizes.shorted_url,
				minSize: 200,
				grow: true,
				Cell: ({ cell }) => (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography
							variant="body2"
							sx={{
								fontFamily: 'monospace',
								color: 'primary.main',
								fontWeight: 600
							}}
						>
							{cell.getValue<string>()}
						</Typography>
						<Tooltip title="Copiar link">
							<IconButton
								size="small"
								onClick={() => copyToClipboard(cell.getValue<string>(), 'Link')}
								sx={{
									color: 'primary.main',
									'&:hover': {
										bgcolor: 'primary.light',
										color: 'primary.dark'
									}
								}}
							>
								<ContentCopyOutlined fontSize="small" />
							</IconButton>
						</Tooltip>
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
						variant="body2"
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
						color="primary"
						size="small"
						variant="outlined"
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
						size="small"
					/>
				)
			},
			{
				accessorKey: 'created_at',
				header: 'Criado em',
				size: columnSizes.created_at || 140,
				minSize: 120,
				Cell: ({ cell }) => (
					<Typography variant="body2">
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
					<Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
						<Tooltip title="Ver Analytics">
							<IconButton
								size="small"
								onClick={() => router.push(`/link/${row.original.id}/analytics`)}
								sx={{
									color: 'success.main',
									'&:hover': {
										bgcolor: 'success.light',
										color: 'success.dark',
										transform: 'scale(1.1)'
									}
								}}
							>
								<AnalyticsOutlined fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Editar link">
							<IconButton
								size="small"
								onClick={() => router.push(`/link/${row.original.id}/edit`)}
								sx={{
									color: 'warning.main',
									'&:hover': {
										bgcolor: 'warning.light',
										color: 'warning.dark',
										transform: 'scale(1.1)'
									}
								}}
							>
								<EditOutlined fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Gerar QR Code">
							<IconButton
								size="small"
								onClick={() => router.push(`/link/${row.original.id}/qr`)}
								sx={{
									color: 'secondary.main',
									'&:hover': {
										bgcolor: 'secondary.light',
										color: 'secondary.dark',
										transform: 'scale(1.1)'
									}
								}}
							>
								<QrCodeOutlined fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Excluir link">
							<IconButton
								size="small"
								onClick={() => handleDeleteLink(row.original.id)}
								sx={{
									color: 'error.main',
									'&:hover': {
										bgcolor: 'error.light',
										color: 'error.dark',
										transform: 'scale(1.1)'
									}
								}}
							>
								<DeleteOutlined fontSize="small" />
							</IconButton>
						</Tooltip>
					</Box>
				)
			}
		],
		[router, copyToClipboard, handleDeleteLink, columnSizes]
	);

	return columns;
}

export default useLinksTableColumns;
