'use client';

import { Paper, Typography, Box, Button, alpha, useTheme } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { CopyButton } from './CopyButton';
import { ShareActions } from './ShareActions';
import { glowGreen } from '@/utils/animations';

interface IShortUrl {
	slug: string;
	short_url: string;
	original_url: string;
	expires_at: string | null;
}

interface ShortUrlResultProps {
	shortUrl: IShortUrl;
	onCreateAnother?: () => void;
}

/**
 * Componente de resultado de URL encurtada
 * Exibe o link criado com ações de cópia e compartilhamento
 */
export function ShortUrlResult({ shortUrl, onCreateAnother }: ShortUrlResultProps) {
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				borderRadius: 4,
				background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
				border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
				animation: `${glowGreen} 3s ease-in-out infinite`,
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
					{shortUrl.short_url}
				</Typography>

				{/* Action Buttons */}
				<Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
					<CopyButton text={shortUrl.short_url} />
					<ShareActions url={shortUrl.short_url} />
				</Box>
			</Paper>

			{/* Additional Actions */}
			{onCreateAnother && (
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
			)}
		</Paper>
	);
}

export default ShortUrlResult;
