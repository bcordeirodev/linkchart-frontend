'use client';

import { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { LinkForm } from '@/components/forms/LinkForm';
import { CreateLinkResponse } from '@/services/link.service';

/**
 * Página de criação de link refatorada
 * Usa o componente LinkForm unificado com visual melhorado
 */
function LinkCreateRefactored() {
	const [createdLink, setCreatedLink] = useState<CreateLinkResponse | null>(null);

	const handleSuccess = (data: CreateLinkResponse) => {
		setCreatedLink(data);
	};

	return (
		<Box sx={{ p: 3 }}>
			{/* Header da página com gradiente */}
			<Box
				sx={{
					background: (theme) =>
						`linear-gradient(135deg, ${theme.palette.secondary.main}14 0%, ${theme.palette.secondary.main}0A 100%)`,
					borderRadius: 3,
					p: 4,
					mb: 4,
					border: (theme) => `1px solid ${theme.palette.secondary.main}1A`,
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Elemento decorativo */}
				<Box
					sx={{
						position: 'absolute',
						top: -25,
						right: -25,
						width: 120,
						height: 120,
						background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.secondary.main}1A 0%, ${theme.palette.secondary.main}0D 100%)`,
						borderRadius: '50%',
						opacity: 0.7
					}}
				/>

				<Box sx={{ position: 'relative', zIndex: 1 }}>
					<Typography
						variant="h3"
						component="h1"
						sx={{
							fontWeight: 700,
							background: (theme) =>
								`linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 1
						}}
					>
						🔗 Criar Novo Link
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							fontWeight: 400,
							opacity: 0.8
						}}
					>
						Transforme URLs longas em links curtos e personalizados
					</Typography>
				</Box>
			</Box>

			<LinkForm
				mode="create"
				onSuccess={handleSuccess}
				title="custom" // Evita título duplicado
			/>

			{/* Preview do Link Criado com visual melhorado */}
			{createdLink && (
				<Box sx={{ mt: 4 }}>
					<Alert
						severity="success"
						sx={{
							borderRadius: 3,
							border: '1px solid rgba(46, 125, 50, 0.3)',
							background:
								'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0.04) 100%)',
							'& .MuiAlert-icon': {
								fontSize: '2rem'
							}
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 2,
								fontWeight: 600,
								color: 'success.dark'
							}}
						>
							🎉 Link criado com sucesso!
						</Typography>

						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: 'rgba(255, 255, 255, 0.6)',
								border: '1px solid rgba(46, 125, 50, 0.2)'
							}}
						>
							<Typography
								variant="body1"
								sx={{ mb: 1, fontWeight: 500 }}
							>
								<strong>🔗 URL Encurtada:</strong>
							</Typography>
							<Typography
								variant="body2"
								sx={{
									fontFamily: 'monospace',
									background: 'rgba(46, 125, 50, 0.1)',
									p: 1,
									borderRadius: 1,
									mb: 2
								}}
							>
								{createdLink.data.short_url}
							</Typography>

							<Typography
								variant="body1"
								sx={{ mb: 1, fontWeight: 500 }}
							>
								<strong>🏷️ Slug:</strong>
							</Typography>
							<Typography
								variant="body2"
								sx={{
									fontFamily: 'monospace',
									background: 'rgba(46, 125, 50, 0.1)',
									p: 1,
									borderRadius: 1
								}}
							>
								{createdLink.data.slug}
							</Typography>
						</Box>
					</Alert>
				</Box>
			)}
		</Box>
	);
}

export default LinkCreateRefactored;
