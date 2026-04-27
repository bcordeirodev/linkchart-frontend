import { Link2, FilterX, SearchX } from 'lucide-react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { darkNeutral, lightNeutral } from '@/lib/theme/colors';
import { motionTokens, radiusTokens } from '@/lib/theme/designSystem';

interface LinksEmptyStateProps {
	/** Há filtros ativos? Muda o copy + CTA. */
	hasActiveFilters: boolean;
	/** Limpa filtros (search + status). Obrigatório se hasActiveFilters. */
	onClearFilters?: () => void;
}

/**
 * Empty state da listagem de links.
 * Duas variantes:
 *  - sem links: convida a criar o primeiro
 *  - sem resultados: oferece limpar os filtros
 */
export function LinksEmptyState({ hasActiveFilters, onClearFilters }: LinksEmptyStateProps) {
	const theme = useTheme();
	const navigate = useNavigate();
	const isDark = theme.palette.mode === 'dark';

	const Icon = hasActiveFilters ? SearchX : Link2;
	const title = hasActiveFilters ? 'Nenhum link encontrado' : 'Você ainda não tem links encurtados';
	const description = hasActiveFilters
		? 'Tente ajustar a busca ou remover alguns filtros para ver mais resultados.'
		: 'Crie seu primeiro link curto para começar a acompanhar cliques, geografia e dispositivos em tempo real.';

	return (
		<Box
			sx={{
				mt: 2,
				py: { xs: 6, sm: 8 },
				px: { xs: 3, sm: 5 },
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				backgroundColor: theme.palette.background.paper,
				border: `1px dashed ${theme.palette.divider}`,
				borderRadius: `${radiusTokens.lg}px`,
				transition: `border-color ${motionTokens.duration.base} ${motionTokens.easing.default}`
			}}
		>
			<Box
				sx={{
					width: 56,
					height: 56,
					borderRadius: `${radiusTokens.full}px`,
					backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.surface,
					border: `1px solid ${theme.palette.divider}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 2,
					color: 'text.secondary'
				}}
			>
				<Icon
					size={28}
					strokeWidth={1.5}
				/>
			</Box>

			<Typography
				variant='h6'
				sx={{ fontWeight: 600, mb: 0.5, letterSpacing: '-0.01em' }}
			>
				{title}
			</Typography>
			<Typography
				variant='body2'
				color='text.secondary'
				sx={{ maxWidth: 420, mb: 3, lineHeight: 1.55 }}
			>
				{description}
			</Typography>

			{hasActiveFilters ? (
				<Button
					variant='outlined'
					startIcon={
						<FilterX
							size={18}
							strokeWidth={1.5}
						/>
					}
					onClick={onClearFilters}
				>
					Limpar filtros
				</Button>
			) : (
				<Button
					variant='contained'
					startIcon={
						<Link2
							size={18}
							strokeWidth={1.5}
						/>
					}
					onClick={() => navigate('/link/create')}
				>
					Criar primeiro link
				</Button>
			)}
		</Box>
	);
}

export default LinksEmptyState;
