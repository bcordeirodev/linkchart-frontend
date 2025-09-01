import { Box, Typography, Paper, useTheme, Stack, Chip } from '@mui/material';
import { TrendingUp, Link as LinkIcon, Visibility } from '@mui/icons-material';

interface LinkData {
	id: number;
	title?: string | null;
	slug: string;
	original_url: string;
	shorted_url?: string;
	clicks: number;
	is_active: boolean;
}

interface TopLinksProps {
	links: LinkData[];
	maxItems?: number;
	title?: string;
}

/**
 * Componente que exibe os links com mais cliques
 * Design baseado no print fornecido - moderno e limpo
 */
export function TopLinks({ links = [], maxItems = 5, title = '🏆 Top Links' }: TopLinksProps) {
	const _theme = useTheme();

	// Ordenar links por número de cliques (decrescente) e pegar apenas os top
	const topLinks = links
		.filter((link) => link.is_active)
		.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
		.slice(0, maxItems);

	if (topLinks.length === 0) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 3,
					background: 'rgba(30, 41, 59, 0.8)',
					border: '1px solid rgba(59, 130, 246, 0.2)',
					borderRadius: 3,
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<LinkIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.5)', mb: 2 }} />
					<Typography
						variant="h6"
						sx={{ color: 'rgba(255,255,255,0.8)' }}
					>
						Nenhum link ativo encontrado
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: 'rgba(255,255,255,0.6)' }}
					>
						Crie seus primeiros links para vê-los aqui!
					</Typography>
				</Box>
			</Paper>
		);
	}

	// Calcular total de cliques
	const totalClicks = topLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);

	return (
		<Paper
			elevation={0}
			sx={{
				background: 'rgba(30, 41, 59, 0.8)',
				backdropFilter: 'blur(20px)',
				border: '1px solid rgba(59, 130, 246, 0.2)',
				borderRadius: 3,
				height: '100%',
				overflow: 'hidden',
				position: 'relative',
				// Barra superior azul como no print
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '3px',
					background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
				}
			}}
		>
			{/* Header */}
			<Box sx={{ p: 3, pb: 2, pt: 4 }}>
				<Typography
					variant="h6"
					fontWeight={700}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						color: '#3b82f6',
						fontSize: '1.1rem',
						mb: 1
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 28,
							height: 28,
							borderRadius: 2,
							background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
							color: 'white'
						}}
					>
						<TrendingUp sx={{ fontSize: 16 }} />
					</Box>
					{title}
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: 'rgba(255,255,255,0.7)',
						fontWeight: 400,
						fontSize: '0.85rem'
					}}
				>
					Links com melhor performance nos últimos 30 dias
				</Typography>
			</Box>

			{/* Lista de Links - Design do Print */}
			<Stack
				spacing={1.5}
				sx={{ px: 3, pb: 2 }}
			>
				{topLinks.map((link, index) => {
					// Cores dos rankings como no print
					const getRankingColor = (index: number) => {
						switch (index) {
							case 0:
								return '#f59e0b'; // Ouro
							case 1:
								return '#3b82f6'; // Azul
							case 2:
								return '#10b981'; // Verde
							case 3:
								return '#8b5cf6'; // Roxo
							default:
								return '#6b7280'; // Cinza
						}
					};

					return (
						<Box
							key={link.id}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								p: 2,
								borderRadius: 2,
								background: 'rgba(51, 65, 85, 0.6)',
								border: '1px solid rgba(71, 85, 105, 0.3)',
								transition: 'all 0.2s ease',
								'&:hover': {
									background: 'rgba(51, 65, 85, 0.8)',
									borderColor: 'rgba(59, 130, 246, 0.4)',
									transform: 'translateY(-1px)'
								}
							}}
						>
							{/* Lado Esquerdo - Ranking e Info */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
								{/* Chip de Ranking */}
								<Chip
									label={`#${index + 1}`}
									size="small"
									sx={{
										minWidth: 32,
										height: 24,
										fontSize: '0.75rem',
										fontWeight: 700,
										background: getRankingColor(index),
										color: 'white',
										border: 'none',
										'& .MuiChip-label': {
											color: 'white',
											px: 1
										}
									}}
								/>

								{/* Ícone de Link */}
								<LinkIcon
									sx={{
										fontSize: 18,
										color: 'rgba(255,255,255,0.6)',
										flexShrink: 0
									}}
								/>

								{/* Info do Link */}
								<Box sx={{ minWidth: 0, flex: 1 }}>
									<Typography
										variant="body2"
										fontWeight={600}
										sx={{
											color: 'white',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											fontSize: '0.9rem'
										}}
									>
										{link.title || link.slug}
									</Typography>
									<Typography
										variant="caption"
										sx={{
											color: 'rgba(255,255,255,0.5)',
											fontSize: '0.75rem',
											display: 'block',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										/{link.slug}
									</Typography>
								</Box>
							</Box>

							{/* Lado Direito - Cliques */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 0.5,
									flexShrink: 0,
									ml: 2
								}}
							>
								<Visibility
									sx={{
										fontSize: 16,
										color: '#3b82f6'
									}}
								/>
								<Typography
									variant="body2"
									fontWeight={700}
									sx={{
										color: '#3b82f6',
										fontSize: '0.9rem',
										minWidth: 'fit-content'
									}}
								>
									{(link.clicks || 0).toLocaleString()}
								</Typography>
								<Typography
									variant="caption"
									sx={{
										color: 'rgba(255,255,255,0.5)',
										fontSize: '0.7rem',
										ml: 0.5
									}}
								>
									cliques
								</Typography>
							</Box>
						</Box>
					);
				})}
			</Stack>

			{/* Footer com total - Como no print */}
			{topLinks.length > 0 && (
				<Box
					sx={{
						p: 3,
						pt: 2,
						borderTop: '1px solid rgba(71, 85, 105, 0.3)'
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Typography
							variant="caption"
							sx={{
								color: 'rgba(255,255,255,0.6)',
								fontSize: '0.75rem'
							}}
						>
							Total de cliques nos top {topLinks.length}:
						</Typography>
						<Typography
							variant="body2"
							fontWeight={700}
							sx={{
								color: '#3b82f6',
								fontSize: '0.9rem'
							}}
						>
							{totalClicks.toLocaleString()}
						</Typography>
					</Box>
				</Box>
			)}
		</Paper>
	);
}

export default TopLinks;
