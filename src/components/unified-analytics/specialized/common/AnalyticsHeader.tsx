'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Refresh, Download, Share } from '@mui/icons-material';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';

interface AnalyticsHeaderProps {
	onRefresh?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	loading?: boolean;
}

/**
 * Cabeçalho da página de analytics com ações
 * Inclui breadcrumb, título e botões de ação
 */
export function AnalyticsHeader({ onRefresh, onDownload, onShare, loading = false }: AnalyticsHeaderProps) {
	return (
		<Box sx={{ mb: 5 }}>
			{/* <PageBreadcrumb /> */}
			<Box
				sx={{
					background: (theme) =>
						`linear-gradient(135deg, ${theme.palette.warning?.main || '#ed6c02'}14 0%, ${theme.palette.warning?.main || '#ed6c02'}0A 100%)`,
					borderRadius: 3,
					p: 4,
					border: (theme) => `1px solid ${theme.palette.warning?.main || '#ed6c02'}1A`,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Elemento decorativo */}
				<Box
					sx={{
						position: 'absolute',
						top: -25,
						left: -25,
						width: 120,
						height: 120,
						background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.warning?.main || '#ed6c02'}1A 0%, ${theme.palette.warning?.main || '#ed6c02'}0D 100%)`,
						borderRadius: '50%',
						opacity: 0.7
					}}
				/>

				<Box sx={{ position: 'relative', zIndex: 1 }}>
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							background: (theme) =>
								`linear-gradient(135deg, ${theme.palette.warning?.main || '#ed6c02'} 0%, ${theme.palette.warning?.light || '#ff9800'} 100%)`,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 1
						}}
					>
						Analytics Dashboard
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							fontWeight: 400,
							opacity: 0.8
						}}
					>
						Análise detalhada do desempenho dos seus links
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
					{onRefresh && (
						<Tooltip title="Atualizar dados">
							<IconButton
								onClick={onRefresh}
								disabled={loading}
								sx={{
									borderRadius: 3,
									background: 'rgba(255, 255, 255, 0.9)',
									backdropFilter: 'blur(10px)',
									border: (theme) => `1px solid ${theme.palette.warning?.main || '#ed6c02'}33`,
									transition: 'all 0.3s ease-in-out',
									'&:hover': {
										background: (theme) => `${theme.palette.warning?.main || '#ed6c02'}1A`,
										transform: 'translateY(-2px)',
										boxShadow: (theme) => `0 4px 15px ${theme.palette.warning?.main || '#ed6c02'}4D`
									}
								}}
							>
								<Refresh sx={{ color: '#ed6c02' }} />
							</IconButton>
						</Tooltip>
					)}

					{onDownload && (
						<Tooltip title="Baixar relatório">
							<IconButton
								onClick={onDownload}
								sx={{
									borderRadius: 3,
									background: 'rgba(255, 255, 255, 0.9)',
									backdropFilter: 'blur(10px)',
									border: (theme) => `1px solid ${theme.palette.warning?.main || '#ed6c02'}33`,
									transition: 'all 0.3s ease-in-out',
									'&:hover': {
										background: (theme) => `${theme.palette.warning?.main || '#ed6c02'}1A`,
										transform: 'translateY(-2px)',
										boxShadow: (theme) => `0 4px 15px ${theme.palette.warning?.main || '#ed6c02'}4D`
									}
								}}
							>
								<Download sx={{ color: '#ed6c02' }} />
							</IconButton>
						</Tooltip>
					)}

					{onShare && (
						<Tooltip title="Compartilhar">
							<IconButton
								onClick={onShare}
								sx={{
									borderRadius: 3,
									background: 'rgba(255, 255, 255, 0.9)',
									backdropFilter: 'blur(10px)',
									border: (theme) => `1px solid ${theme.palette.warning?.main || '#ed6c02'}33`,
									transition: 'all 0.3s ease-in-out',
									'&:hover': {
										background: (theme) => `${theme.palette.warning?.main || '#ed6c02'}1A`,
										transform: 'translateY(-2px)',
										boxShadow: (theme) => `0 4px 15px ${theme.palette.warning?.main || '#ed6c02'}4D`
									}
								}}
							>
								<Share sx={{ color: '#ed6c02' }} />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default AnalyticsHeader;
