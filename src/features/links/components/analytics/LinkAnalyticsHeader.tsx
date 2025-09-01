'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import { ArrowBack, Share, Edit, Analytics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';
import { LinkResponse } from '@/features/links/types/link';

interface LinkAnalyticsHeaderProps {
	linkId: string;
	linkInfo?: LinkResponse | null;
	loading?: boolean;
}

/**
 * 📊 Header específico para analytics de link individual
 * Segue padrões arquiteturais: < 200 linhas, reutiliza componentes base
 */
export function LinkAnalyticsHeader({ linkId, linkInfo, loading = false }: LinkAnalyticsHeaderProps) {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/link');
	};

	const handleEdit = () => {
		navigate(`/link/edit/${linkId}`);
	};

	const handleShare = () => {
		if (linkInfo?.shorted_url) {
			navigator.clipboard.writeText(linkInfo.shorted_url);
		}
	};

	return (
		<Box sx={{ mb: 4 }}>
			{/* Breadcrumb */}
			<Box sx={{ mb: 2 }}>
				<PageBreadcrumb skipHome />
			</Box>

			{/* Header Principal */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 2
				}}
			>
				{/* Informações do Link */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<Analytics sx={{ mr: 1, color: 'primary.main' }} />
						<Typography
							variant="h4"
							component="h1"
							sx={{ fontWeight: 600 }}
						>
							Analytics do Link
						</Typography>
					</Box>

					{linkInfo && (
						<Box sx={{ mb: 2 }}>
							<Typography
								variant="h6"
								color="text.primary"
								sx={{
									mb: 1,
									fontWeight: 500,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical'
								}}
							>
								{linkInfo.title || 'Link sem título'}
							</Typography>

							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									mb: 1,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}
							>
								🔗 {linkInfo.shorted_url}
							</Typography>

							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}
							>
								🎯 {linkInfo.original_url}
							</Typography>
						</Box>
					)}

					{/* Status Chips */}
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
						{linkInfo?.is_active ? (
							<Chip
								label="Ativo"
								color="success"
								size="small"
								variant="outlined"
							/>
						) : (
							<Chip
								label="Inativo"
								color="error"
								size="small"
								variant="outlined"
							/>
						)}

						<Chip
							label={`${linkInfo?.clicks || 0} cliques`}
							color="primary"
							size="small"
							variant="outlined"
						/>

						{linkInfo?.expires_at && (
							<Chip
								label="Com expiração"
								color="warning"
								size="small"
								variant="outlined"
							/>
						)}
					</Box>
				</Box>

				{/* Ações */}
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Button
						variant="outlined"
						startIcon={<ArrowBack />}
						onClick={handleBack}
						size="small"
					>
						Voltar
					</Button>

					{linkInfo && (
						<>
							<Button
								variant="outlined"
								startIcon={<Edit />}
								onClick={handleEdit}
								size="small"
							>
								Editar
							</Button>

							<Button
								variant="contained"
								startIcon={<Share />}
								onClick={handleShare}
								size="small"
							>
								Compartilhar
							</Button>
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default LinkAnalyticsHeader;
