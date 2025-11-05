import { Box, Button, Paper, useTheme, ButtonGroup, Divider } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	HiChartBar,
	HiListBullet,
	HiPencilSquare,
	HiClipboardDocument,
	HiQrCode,
	HiTrash
} from 'react-icons/hi2';

import useClipboard from '@/shared/hooks/useClipboard';

interface LinkAnalyticsActionsProps {
	linkId: string;
	shortUrl?: string;
	onDeleteSuccess?: () => void;
	actions?: {
		showEdit?: boolean;
		showCopy?: boolean;
		showQR?: boolean;
		showDelete?: boolean;
		showAnalytics?: boolean;
	};
	currentPage?: 'analytics' | 'edit' | 'qr' | 'other';
}

export function LinkAnalyticsActions({
	linkId,
	shortUrl,
	onDeleteSuccess,
	actions = {},
	currentPage = 'other'
}: LinkAnalyticsActionsProps) {
	const {
		showEdit = true,
		showCopy = true,
		showQR = true,
		showDelete = true,
		showAnalytics = true
	} = actions;

	const navigate = useNavigate();
	const theme = useTheme();
	const { copy } = useClipboard();
	const [loading, setLoading] = useState(false);

	const handleGoToList = useCallback(() => {
		navigate('/link');
	}, [navigate]);

	const handleGoToAnalytics = useCallback(() => {
		navigate(`/link/analytic/${linkId}`);
	}, [navigate, linkId]);

	const handleEdit = useCallback(() => {
		navigate(`/link/edit/${linkId}`);
	}, [navigate, linkId]);

	const handleCopy = useCallback(() => {
		if (shortUrl) {
			copy(`${window.location.origin}/${shortUrl}`);
		}
	}, [shortUrl, copy]);

	const handleQR = useCallback(() => {
		navigate(`/link/qr/${linkId}`);
	}, [navigate, linkId]);

	const handleDelete = useCallback(async () => {
		const confirmed = window.confirm(
			'Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.'
		);

		if (!confirmed) {
			return;
		}

		try {
			setLoading(true);
			await new Promise(resolve => setTimeout(resolve, 500));

			if (onDeleteSuccess) {
				onDeleteSuccess();
			} else {
				navigate('/link');
			}
		} catch (_error) {
			alert('Erro ao excluir link. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}, [linkId, navigate, onDeleteSuccess]);

	const buttonStyles = {
		borderColor: theme.palette.divider,
		color: theme.palette.text.secondary,
		textTransform: 'none' as const,
		'&:hover': {
			borderColor: theme.palette.primary.main,
			backgroundColor: 'rgba(25, 118, 210, 0.08)',
			color: theme.palette.primary.main
		},
		'&.MuiButton-containedError:hover': {
			backgroundColor: theme.palette.error.dark
		},
		transition: 'all 0.2s ease'
	};

	return (
		<Paper
			elevation={0}
			sx={{
				p: 2,
				mb: 3,
				display: 'flex',
				alignItems: 'center',
				width: `100%`,
				justifyContent: 'space-between',
				gap: 2,
				backgroundColor: theme.palette.mode === 'dark'
					? 'rgba(255, 255, 255, 0.05)'
					: 'rgba(0, 0, 0, 0.02)',
				borderRadius: 2,
				border: `1px solid ${theme.palette.mode === 'dark'
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.1)'
					}`,
				flexWrap: 'wrap'
			}}
		>
			<Box sx={{
				display: 'flex',
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: 2
			}}>
				<ButtonGroup variant="outlined" size="small">
					<Button
						startIcon={<HiListBullet size={18} />}
						onClick={handleGoToList}
						disabled={currentPage === 'other'}
						sx={buttonStyles}
					>
						Listagem
					</Button>

					{showAnalytics ? (
						<Button
							startIcon={<HiChartBar size={18} />}
							onClick={handleGoToAnalytics}
							disabled={currentPage === 'analytics'}
							sx={buttonStyles}
						>
							Analytics
						</Button>
					) : null}
				</ButtonGroup>
				<Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
				<ButtonGroup variant="outlined" size="small">
					{showEdit ? (
						<Button
							startIcon={<HiPencilSquare size={18} />}
							onClick={handleEdit}
							disabled={loading}
							sx={buttonStyles}
						>
							Editar
						</Button>
					) : null}

					{showCopy ? (
						<Button
							startIcon={<HiClipboardDocument size={18} />}
							onClick={handleCopy}
							disabled={loading || !shortUrl}
							sx={buttonStyles}
						>
							Copiar
						</Button>
					) : null}

					{showQR ? (
						<Button
							startIcon={<HiQrCode size={18} />}
							onClick={handleQR}
							disabled={loading}
							sx={buttonStyles}
						>
							QR Code
						</Button>
					) : null}
				</ButtonGroup>
				<Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

				<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
					{showDelete ? (
						<Button
								variant="outlined"
								size="small"
								color="error"
								startIcon={<HiTrash size={18} />}
								onClick={handleDelete}
								disabled={loading}
								sx={{
									...buttonStyles,
									borderColor: theme.palette.error.main,
									color: theme.palette.error.main,
									'&:hover': {
										borderColor: theme.palette.error.dark,
										backgroundColor: 'rgba(211, 47, 47, 0.08)',
										color: theme.palette.error.dark
									}
								}}
							>
								Excluir
							</Button>
					) : null}
				</Box>
			</Box>
		</Paper>
	);
}

export default LinkAnalyticsActions;

