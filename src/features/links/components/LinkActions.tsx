'use client';
import { Box, Button, Paper, useTheme, ButtonGroup, Divider } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, List, Pencil, ClipboardCopy, QrCode, Trash2 } from 'lucide-react';
import { ICON_MD } from '@/lib/theme/iconDefaults';

import { motionTokens, radiusTokens } from '@/lib/theme/designSystem';
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

export function LinkActions({
	linkId,
	shortUrl,
	onDeleteSuccess,
	actions = {},
	currentPage = 'other'
}: LinkAnalyticsActionsProps) {
	const { showEdit = true, showCopy = true, showQR = true, showDelete = true, showAnalytics = true } = actions;

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
		const confirmed = window.confirm('Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.');

		if (!confirmed) {
			return;
		}

		try {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 500));

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
		fontWeight: 600,
		'&:hover': {
			borderColor: theme.palette.primary.main,
			backgroundColor: theme.palette.action.hover,
			color: theme.palette.primary.main
		},
		'&.MuiButton-containedError:hover': {
			backgroundColor: theme.palette.error.dark
		},
		transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}, border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`
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
				backgroundColor: theme.palette.background.paper,
				borderRadius: `${radiusTokens.lg}px`,
				border: `1px solid ${theme.palette.divider}`,
				flexWrap: 'wrap'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: 2
				}}
			>
				<ButtonGroup
					variant='outlined'
					size='small'
				>
					<Button
						startIcon={<List {...ICON_MD} />}
						onClick={handleGoToList}
						disabled={currentPage === 'other'}
						sx={buttonStyles}
					>
						Listagem
					</Button>

					{showAnalytics ? (
						<Button
							startIcon={<BarChart3 {...ICON_MD} />}
							onClick={handleGoToAnalytics}
							disabled={currentPage === 'analytics'}
							sx={buttonStyles}
						>
							Analytics
						</Button>
					) : null}
				</ButtonGroup>
				<Divider
					orientation='vertical'
					flexItem
					sx={{ mx: 0.5 }}
				/>
				<ButtonGroup
					variant='outlined'
					size='small'
				>
					{showEdit ? (
						<Button
							startIcon={<Pencil {...ICON_MD} />}
							onClick={handleEdit}
							disabled={loading}
							sx={buttonStyles}
						>
							Editar
						</Button>
					) : null}

					{showCopy ? (
						<Button
							startIcon={<ClipboardCopy {...ICON_MD} />}
							onClick={handleCopy}
							disabled={loading || !shortUrl}
							sx={buttonStyles}
						>
							Copiar
						</Button>
					) : null}

					{showQR ? (
						<Button
							startIcon={<QrCode {...ICON_MD} />}
							onClick={handleQR}
							disabled={loading}
							sx={buttonStyles}
						>
							QR Code
						</Button>
					) : null}
				</ButtonGroup>
				<Divider
					orientation='vertical'
					flexItem
					sx={{ mx: 0.5 }}
				/>

				<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
					{showDelete ? (
						<Button
							variant='outlined'
							size='small'
							color='error'
							startIcon={<Trash2 {...ICON_MD} />}
							onClick={handleDelete}
							disabled={loading}
							sx={{
								...buttonStyles,
								borderColor: theme.palette.error.main,
								color: theme.palette.error.main,
								'&:hover': {
									borderColor: theme.palette.error.dark,
									backgroundColor: theme.palette.action.hover,
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

export default LinkActions;
