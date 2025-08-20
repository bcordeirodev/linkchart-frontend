'use client';

import React, { useState } from 'react';
import {
	Card,
	CardContent,
	Typography,
	Button,
	Box,
	Paper,
	alpha,
	useTheme,
	Fade,
	IconButton,
	Tooltip
} from '@mui/material';
import { ContentCopy, CheckCircle, Launch, QrCode, Share, Analytics } from '@mui/icons-material';
import { keyframes } from '@mui/system';

interface Shorted {
	short_url: string;
	original_url?: string;
}

type Props = {
	shorted?: Shorted | null;
	onCreateAnother?: () => void;
	onSignUp?: () => void;
	isLoggedIn?: boolean;
};

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.6); }
`;

const ShortUrlCard: React.FC<Props> = ({ shorted, onCreateAnother, onSignUp, isLoggedIn = false }) => {
	const theme = useTheme();
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (!shorted) return;

		navigator.clipboard.writeText(shorted.short_url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleShare = async () => {
		if (!shorted) return;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Link Encurtado - LinkChart',
					text: 'Confira este link encurtado:',
					url: shorted.short_url
				});
			} catch (error) {
				// Fallback para copy
				handleCopy();
			}
		} else {
			handleCopy();
		}
	};

	if (!shorted) return null;

	return (
		<Fade
			in
			timeout={600}
		>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 4,
					background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
					border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
					animation: `${glow} 3s ease-in-out infinite`,
					textAlign: 'center'
				}}
			>
				{/* Success Header */}
				<Box sx={{ mb: 3 }}>
					<CheckCircle
						sx={{
							fontSize: 48,
							color: 'success.main',
							mb: 2
						}}
					/>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 700,
							color: 'success.main',
							mb: 1
						}}
					>
						🎉 Link criado com sucesso!
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Seu link está pronto para ser compartilhado
					</Typography>
				</Box>

				{/* URL Display */}
				<Paper
					sx={{
						p: 3,
						mb: 3,
						background: alpha(theme.palette.background.paper, 0.8),
						borderRadius: 3,
						border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
					}}
				>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mb: 1, display: 'block', fontWeight: 600 }}
					>
						SEU LINK ENCURTADO
					</Typography>
					<Typography
						variant="h6"
						sx={{
							fontFamily: 'monospace',
							color: 'primary.main',
							fontWeight: 600,
							wordBreak: 'break-all',
							mb: 2,
							p: 1,
							bgcolor: alpha(theme.palette.primary.main, 0.05),
							borderRadius: 2
						}}
					>
						{shorted.short_url}
					</Typography>

					{/* Action Buttons */}
					<Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
						<Button
							variant="contained"
							startIcon={copied ? <CheckCircle /> : <ContentCopy />}
							onClick={handleCopy}
							disabled={copied}
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								background: copied ? 'success.main' : 'primary.main'
							}}
						>
							{copied ? 'Copiado!' : 'Copiar'}
						</Button>

						<Tooltip title="Abrir link">
							<IconButton
								onClick={() => window.open(shorted.short_url, '_blank')}
								sx={{
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									'&:hover': {
										bgcolor: alpha(theme.palette.primary.main, 0.2)
									}
								}}
							>
								<Launch />
							</IconButton>
						</Tooltip>

						<Tooltip title="Compartilhar">
							<IconButton
								onClick={handleShare}
								sx={{
									bgcolor: alpha(theme.palette.secondary.main, 0.1),
									'&:hover': {
										bgcolor: alpha(theme.palette.secondary.main, 0.2)
									}
								}}
							>
								<Share />
							</IconButton>
						</Tooltip>
					</Box>
				</Paper>

				{/* Additional Actions */}
				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
					<Button
						variant="outlined"
						onClick={onCreateAnother}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 600
						}}
					>
						Criar Outro Link
					</Button>
				</Box>

				{/* Upgrade CTA for non-logged users */}
				{!isLoggedIn && (
					<Card
						sx={{
							background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
							border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
							borderRadius: 3
						}}
					>
						<CardContent sx={{ p: 3 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
								<QrCode sx={{ mr: 1, color: 'primary.main' }} />
								<Analytics sx={{ mr: 1, color: 'secondary.main' }} />
								<Typography
									variant="h6"
									sx={{ fontWeight: 600 }}
								>
									Quer mais recursos?
								</Typography>
							</Box>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 2 }}
							>
								• QR Codes automáticos
								<br />
								• Analytics detalhados
								<br />
								• Links personalizados
								<br />
								• Controle de expiração
								<br />• E muito mais!
							</Typography>
							<Button
								variant="contained"
								onClick={onSignUp}
								sx={{
									borderRadius: 2,
									textTransform: 'none',
									fontWeight: 600,
									background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
									'&:hover': {
										background: 'linear-gradient(135deg, #0960C0 0%, #0090D1 100%)'
									}
								}}
							>
								✨ Criar Conta Grátis
							</Button>
						</CardContent>
					</Card>
				)}
			</Paper>
		</Fade>
	);
};

export default ShortUrlCard;
