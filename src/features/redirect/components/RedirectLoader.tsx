import { Box, Typography, CircularProgress, Card, CardContent, Chip } from '@mui/material';
import { Launch as LaunchIcon, Speed as SpeedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RedirectLoaderProps {
	targetUrl: string;
	countdown: number;
	isRedirecting: boolean;
}

/**
 * Componente de loading para redirecionamento
 * Componentizado seguindo padrão do projeto
 */
export function RedirectLoader({ targetUrl, countdown, isRedirecting }: RedirectLoaderProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card
				elevation={8}
				sx={{
					maxWidth: 500,
					mx: 'auto',
					background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)'
				}}
			>
				<CardContent sx={{ p: 4, textAlign: 'center' }}>
					<Box sx={{ mb: 3 }}>
						<CircularProgress
							size={60}
							thickness={4}
							sx={{
								color: '#3b82f6',
								'& .MuiCircularProgress-circle': {
									strokeLinecap: 'round'
								}
							}}
						/>
					</Box>

					<Typography
						variant="h5"
						sx={{
							color: 'white',
							fontWeight: 600,
							mb: 2
						}}
					>
						{isRedirecting ? '🚀 Redirecionando...' : '⏳ Preparando redirecionamento...'}
					</Typography>

					<Typography
						variant="body1"
						sx={{
							color: 'rgba(255, 255, 255, 0.7)',
							mb: 3
						}}
					>
						Você será redirecionado para:
					</Typography>

					<Chip
						icon={<LaunchIcon />}
						label={targetUrl.length > 50 ? `${targetUrl.substring(0, 50)}...` : targetUrl}
						sx={{
							bgcolor: 'rgba(59, 130, 246, 0.2)',
							color: '#60a5fa',
							border: '1px solid rgba(59, 130, 246, 0.3)',
							mb: 3,
							maxWidth: '100%'
						}}
					/>

					{countdown > 0 && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 1,
								mt: 2
							}}
						>
							<SpeedIcon sx={{ color: '#10b981', fontSize: 20 }} />
							<Typography
								variant="body2"
								sx={{
									color: '#10b981',
									fontWeight: 500
								}}
							>
								Redirecionando em {countdown}s
							</Typography>
						</Box>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default RedirectLoader;
