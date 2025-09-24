'use client';

import { Box, Typography, Chip, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppIcon } from '@/lib/icons';
import { createTextGradient, useDesignTokens } from '@/lib/theme';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

import type { LinkResponse } from '@/types';

interface LinkAnalyticsHeaderProps {
	linkId: string;
	linkInfo?: LinkResponse | null;
	loading?: boolean;
}

/**
 * 📊 Header específico para analytics de link individual
 * Segue padrões arquiteturais: < 200 linhas, reutiliza componentes base
 */
export function LinkAnalyticsHeader({ linkId, linkInfo, loading: _loading = false }: LinkAnalyticsHeaderProps) {
	const navigate = useNavigate();
	const theme = useTheme();
	const tokens = useDesignTokens();
	const titleGradient = createTextGradient(theme, 'primary');

	const handleBack = () => {
		navigate('/link');
	};

	const handleEdit = () => {
		navigate(`/link/edit/${linkId}`);
	};

	const handleShare = () => {
		if (linkInfo?.short_url) {
			navigator.clipboard.writeText(linkInfo.short_url);
		}
	};

	return (
		<Box sx={{ mb: 4 }}>
			{/* Breadcrumb */}
			<Box sx={{ mb: 3 }}>
				<PageBreadcrumb skipHome />
			</Box>

			{/* Header Principal com Glass Effect */}
			<EnhancedPaper
				variant='glass'
				sx={{ p: 4, mb: 2 }}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 3
					}}
				>
					{/* Informações do Link */}
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 48,
									height: 48,
									borderRadius: 3,
									background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
									border: `1px solid ${theme.palette.primary.main}30`,
									mr: 2
								}}
							>
								<AppIcon
									intent='analytics'
									size={24}
									color={theme.palette.primary.main}
								/>
							</Box>
							<Typography
								variant='h4'
								component='h1'
								sx={{
									fontWeight: 700,
									...titleGradient,
									letterSpacing: '-0.02em'
								}}
							>
								Analytics do Link
							</Typography>
						</Box>

						{linkInfo ? (
							<Box sx={{ mb: 3 }}>
								<Typography
									variant='h6'
									color='text.primary'
									sx={{
										mb: 2,
										fontWeight: 600,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										lineHeight: 1.3
									}}
								>
									{linkInfo.title || 'Link sem título'}
								</Typography>

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box
											sx={{
												width: 6,
												height: 6,
												borderRadius: '50%',
												backgroundColor: 'success.main'
											}}
										/>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												fontFamily: 'monospace',
												fontSize: '0.875rem'
											}}
										>
											{linkInfo.short_url}
										</Typography>
									</Box>

									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box
											sx={{
												width: 6,
												height: 6,
												borderRadius: '50%',
												backgroundColor: 'primary.main'
											}}
										/>
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												fontSize: '0.875rem'
											}}
										>
											{linkInfo.original_url}
										</Typography>
									</Box>
								</Box>
							</Box>
						) : null}

						{/* Status Chips Melhorados */}
						<Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
							{linkInfo?.is_active ? (
								<Chip
									label='✅ Ativo'
									color='success'
									size='medium'
									variant='filled'
									sx={{
										fontWeight: 600,
										borderRadius: 2,
										'& .MuiChip-label': { px: 1.5 }
									}}
								/>
							) : (
								<Chip
									label='❌ Inativo'
									color='error'
									size='medium'
									variant='filled'
									sx={{
										fontWeight: 600,
										borderRadius: 2,
										'& .MuiChip-label': { px: 1.5 }
									}}
								/>
							)}

							<Chip
								label={`📊 ${linkInfo?.clicks || 0} cliques`}
								color='primary'
								size='medium'
								variant='filled'
								sx={{
									fontWeight: 600,
									borderRadius: 2,
									'& .MuiChip-label': { px: 1.5 }
								}}
							/>

							{linkInfo?.expires_at ? (
								<Chip
									label='⏰ Com expiração'
									color='warning'
									size='medium'
									variant='filled'
									sx={{
										fontWeight: 600,
										borderRadius: 2,
										'& .MuiChip-label': { px: 1.5 }
									}}
								/>
							) : null}
						</Box>
					</Box>

					{/* Ações Melhoradas */}
					<Box sx={{ display: 'flex', gap: tokens.spacing.md, flexWrap: 'wrap', alignItems: 'flex-start' }}>
						<Button
							variant='outlined'
							startIcon={<AppIcon intent='back' />}
							onClick={handleBack}
							sx={{ textTransform: 'none' }}
						>
							Voltar
						</Button>

						{linkInfo ? (
							<>
								<Button
									variant='outlined'
									color='warning'
									startIcon={<AppIcon intent='edit' />}
									onClick={handleEdit}
									sx={{ textTransform: 'none' }}
								>
									Editar
								</Button>

								<Button
									variant='contained'
									color='primary'
									startIcon={<AppIcon intent='share' />}
									onClick={handleShare}
									sx={{ textTransform: 'none' }}
								>
									Compartilhar
								</Button>
							</>
						) : null}
					</Box>
				</Box>
			</EnhancedPaper>
		</Box>
	);
}

export default LinkAnalyticsHeader;
